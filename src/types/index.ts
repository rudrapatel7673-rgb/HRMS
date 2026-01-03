export interface Profile {
  id: string;
  name: string;
  email: string;
  role: 'EMPLOYEE' | 'ADMIN';
  employee_id: string;
  department?: string;
  position?: string;
  avatar_url?: string;
  phone?: string;
  address?: string;
  join_date?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Attendance {
  id: string;
  user_id: string;
  date: string;
  check_in: string | null;
  check_out: string | null;
  status: 'present' | 'absent' | 'late' | 'half-day';
  hours: number;
  created_at?: string;
}

export interface LeaveRequest {
  id: string;
  user_id: string;
  type: 'paid' | 'sick' | 'unpaid' | 'annual' | 'personal';
  start_date: string;
  end_date: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at?: string;
}

export interface Payroll {
  id: string;
  user_id: string;
  month: string;
  year: number;
  basic_salary: number;
  allowances: number;
  deductions: number;
  net_salary: number;
  status: 'paid' | 'pending';
  created_at?: string;
}
