-- Refined HRMS Database Schema for Supabase (PostgreSQL)
-- Based on user's Dayflow HRMS plan

-- IMPORTANT: Clean up existing tables to avoid column name conflicts
DROP TABLE IF EXISTS payroll CASCADE;
DROP TABLE IF EXISTS leave_requests CASCADE;
DROP TABLE IF EXISTS attendance CASCADE;
DROP TABLE IF EXISTS employee_profiles CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- 1. Profiles Table (Extends Supabase Auth)
CREATE TABLE profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    employee_id TEXT UNIQUE NOT NULL,
    full_name TEXT,
    email TEXT UNIQUE NOT NULL,
    role TEXT CHECK (role IN ('ADMIN', 'EMPLOYEE')) DEFAULT 'EMPLOYEE',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Employee Additional Profiles
CREATE TABLE employee_profiles (
    profile_id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    phone TEXT,
    address TEXT,
    department TEXT,
    designation TEXT,
    join_date DATE,
    profile_photo TEXT
);

-- 3. Attendance Table
CREATE TABLE attendance (
    attendance_id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    date DATE DEFAULT CURRENT_DATE,
    check_in TIME,
    check_out TIME,
    status TEXT CHECK (status IN ('Present', 'Absent', 'Half-Day', 'Leave')) DEFAULT 'Present'
);

-- 4. Leave Requests Table
CREATE TABLE leave_requests (
    leave_id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    leave_type TEXT CHECK (leave_type IN ('Paid', 'Sick', 'Unpaid')),
    start_date DATE,
    end_date DATE,
    reason TEXT,
    status TEXT CHECK (status IN ('Pending', 'Approved', 'Rejected')) DEFAULT 'Pending',
    admin_comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Payroll Table
CREATE TABLE payroll (
    payroll_id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    basic_salary DECIMAL(10,2),
    allowances DECIMAL(10,2),
    deductions DECIMAL(10,2),
    net_salary DECIMAL(10,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS Enablement
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE employee_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE leave_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE payroll ENABLE ROW LEVEL SECURITY;

-- 6. Trigger for Automatic Profile Creation
-- This function runs when a new user signs up in Supabase Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, employee_id, role)
  VALUES (
    new.id, 
    new.raw_user_meta_data->>'full_name', 
    new.email,
    COALESCE(new.raw_user_meta_data->>'employee_id', 'EMP-' || extract(epoch from now())::text),
    'EMPLOYEE'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger execution
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Updated Policies for Profiles
CREATE POLICY "Users view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "System/Admin insert profiles" ON profiles FOR INSERT WITH CHECK (true); -- Trigger handles this, but needed for manual insert if used

CREATE POLICY "Admins view all profiles" ON profiles FOR SELECT USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'ADMIN'
);

-- Policies for other tables
CREATE POLICY "Users manage own attendance" ON attendance FOR ALL USING (user_id = auth.uid());
CREATE POLICY "Users manage own leave" ON leave_requests FOR ALL USING (user_id = auth.uid());
CREATE POLICY "Users manage own profiles_ext" ON employee_profiles FOR ALL USING (user_id = auth.uid());
CREATE POLICY "Users view own payroll" ON payroll FOR SELECT USING (user_id = auth.uid());
