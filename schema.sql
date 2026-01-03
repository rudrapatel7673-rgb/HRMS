-- Refined HRMS Database Schema for Supabase (PostgreSQL)
-- This script sets up profiles, attendance, leave, and payroll systems.

-- 1. CLEANUP (Ensures the script can be re-run safely)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user CASCADE;
DROP TABLE IF EXISTS payroll CASCADE;
DROP TABLE IF EXISTS leave_requests CASCADE;
DROP TABLE IF EXISTS attendance CASCADE;
DROP TABLE IF EXISTS employee_profiles CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- 2. PROFILES TABLE
-- Extends the built-in Supabase Auth table
CREATE TABLE profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    employee_id TEXT UNIQUE NOT NULL,
    full_name TEXT,
    email TEXT UNIQUE NOT NULL,
    role TEXT CHECK (role IN ('ADMIN', 'EMPLOYEE')) DEFAULT 'EMPLOYEE',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. ADDITIONAL EMPLOYEE DATA
CREATE TABLE employee_profiles (
    profile_id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    phone TEXT,
    address TEXT,
    department TEXT,
    designation TEXT,
    join_date DATE DEFAULT CURRENT_DATE,
    profile_photo TEXT
);

-- 4. ATTENDANCE SYSTEM
CREATE TABLE attendance (
    attendance_id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    date DATE DEFAULT CURRENT_DATE,
    check_in TIME,
    check_out TIME,
    status TEXT CHECK (status IN ('Present', 'Absent', 'Half-Day', 'Leave')) DEFAULT 'Present'
);

-- 5. LEAVE MANAGEMENT
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

-- 6. PAYROLL SYSTEM
CREATE TABLE payroll (
    payroll_id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    basic_salary DECIMAL(10,2) DEFAULT 0,
    allowances DECIMAL(10,2) DEFAULT 0,
    deductions DECIMAL(10,2) DEFAULT 0,
    net_salary DECIMAL(10,2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. ENABLE REAL-TIME AND SECURITY
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE employee_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE leave_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE payroll ENABLE ROW LEVEL SECURITY;

-- 8. AUTOMATIC PROFILE CREATION TRIGGER
-- This function runs automatically whenever a user signs up.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, employee_id, role)
  VALUES (
    new.id, 
    COALESCE(new.raw_user_meta_data->>'full_name', 'New Employee'), 
    new.email,
    COALESCE(new.raw_user_meta_data->>'employee_id', 'EMP-' || floor(random() * 1000000)::text),
    COALESCE(UPPER(new.raw_user_meta_data->>'role'), 'EMPLOYEE')
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 9. SECURITY POLICIES (RLS)

-- Profiles: Users see their own, Admins see all
CREATE POLICY "Users view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins view all profiles" ON profiles FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'ADMIN')
);

-- Attendance: Users manage own, Admins manage all
CREATE POLICY "Users manage own attendance" ON attendance FOR ALL USING (user_id = auth.uid());
CREATE POLICY "Admins manage all attendance" ON attendance FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'ADMIN')
);

-- Leave: Users manage own, Admins manage all
CREATE POLICY "Users manage own leave" ON leave_requests FOR ALL USING (user_id = auth.uid());
CREATE POLICY "Admins manage all leave" ON leave_requests FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'ADMIN')
);

-- Employee Profiles: Users view own, Admins view all
CREATE POLICY "Users manage own employee_profiles" ON employee_profiles FOR ALL USING (user_id = auth.uid());
CREATE POLICY "Admins manage all employee_profiles" ON employee_profiles FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'ADMIN')
);

-- Payroll: Users view own, Admins manage all
CREATE POLICY "Users view own payroll" ON payroll FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Admins manage all payroll" ON payroll FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'ADMIN')
);
