import { supabase } from '@/lib/supabase';
import { Profile, Attendance, LeaveRequest, Payroll } from '@/types';

// Profile Services
export const profileApi = {
  async getProfile(userId: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    if (error) throw error;
    return data as Profile;
  },

  async updateProfile(userId: string, updates: Partial<Profile>) {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();
    if (error) throw error;
    return data as Profile;
  }
};

// Attendance Services
export const attendanceApi = {
  async getTodayRecord(userId: string) {
    const today = new Date().toISOString().split('T')[0];
    const { data, error } = await supabase
      .from('attendance')
      .select('*')
      .eq('user_id', userId)
      .eq('date', today)
      .maybeSingle(); // Use maybeSingle as record might not exist yet
    if (error) throw error;
    return data as Attendance | null;
  },

  async checkIn(userId: string) {
    const today = new Date().toISOString().split('T')[0];
    const now = new Date().toLocaleTimeString('en-US', { hour12: false });

    const { data, error } = await supabase
      .from('attendance')
      .insert([
        {
          user_id: userId,
          date: today,
          check_in: now,
          status: 'present'
        }
      ])
      .select()
      .single();

    if (error) throw error;
    return data as Attendance;
  },

  async checkOut(recordId: string) {
    const now = new Date().toLocaleTimeString('en-US', { hour12: false });

    // First get the record to calculate hours
    const { data: record, error: fetchError } = await supabase
      .from('attendance')
      .select('check_in')
      .eq('id', recordId)
      .single();

    if (fetchError) throw fetchError;

    if (!record.check_in) throw new Error("Cannot check out without check in");

    // Simple hour calculation
    const start = new Date(`2000-01-01T${record.check_in}`);
    const end = new Date(`2000-01-01T${now}`);
    const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);

    const { data, error } = await supabase
      .from('attendance')
      .update({
        check_out: now,
        hours: parseFloat(hours.toFixed(2))
      })
      .eq('id', recordId)
      .select()
      .single();

    if (error) throw error;
    return data as Attendance;
  },

  async getHistory(userId: string) {
    const { data, error } = await supabase
      .from('attendance')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false });
    if (error) throw error;
    return data as Attendance[];
  }
};

// Leave Services
export const leaveApi = {
  async getRequests(userId: string) {
    const { data, error } = await supabase
      .from('leave_requests')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data as LeaveRequest[];
  },

  async createRequest(userId: string, request: Partial<LeaveRequest>) {
    const { data, error } = await supabase
      .from('leave_requests')
      .insert([{ ...request, user_id: userId, status: 'pending' }])
      .select()
      .single();
    if (error) throw error;
    return data as LeaveRequest;
  }
};

// Payroll Services
export const payrollApi = {
  async getHistory(userId: string) {
    const { data, error } = await supabase
      .from('payroll')
      .select('*')
      .eq('user_id', userId)
      .order('year', { ascending: false })
      .order('month', { ascending: false });
    if (error) throw error;
    return data as Payroll[];
  }
};
