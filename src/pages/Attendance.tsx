import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  Clock,
  LogIn,
  LogOut,
  Calendar,
  CheckCircle,
  XCircle,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';

interface AttendanceRecord {
  date: string;
  checkIn: string | null;
  checkOut: string | null;
  status: 'present' | 'absent' | 'late' | 'half-day';
  hours: number;
}

const mockAttendance: AttendanceRecord[] = [
  { date: '2026-01-03', checkIn: '09:00', checkOut: null, status: 'present', hours: 0 },
  { date: '2026-01-02', checkIn: '08:55', checkOut: '18:05', status: 'present', hours: 9.17 },
  { date: '2026-01-01', checkIn: null, checkOut: null, status: 'absent', hours: 0 },
  { date: '2025-12-31', checkIn: '09:30', checkOut: '18:00', status: 'late', hours: 8.5 },
  { date: '2025-12-30', checkIn: '08:45', checkOut: '17:50', status: 'present', hours: 9.08 },
  { date: '2025-12-29', checkIn: '09:00', checkOut: '13:00', status: 'half-day', hours: 4 },
  { date: '2025-12-28', checkIn: '08:50', checkOut: '18:15', status: 'present', hours: 9.42 },
];

const statusConfig = {
  present: { icon: CheckCircle, color: 'text-success', bg: 'bg-success/10', label: 'Present' },
  absent: { icon: XCircle, color: 'text-destructive', bg: 'bg-destructive/10', label: 'Absent' },
  late: { icon: AlertCircle, color: 'text-warning', bg: 'bg-warning/10', label: 'Late' },
  'half-day': { icon: Clock, color: 'text-primary', bg: 'bg-primary/10', label: 'Half Day' },
};

export const Attendance = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [currentWeek, setCurrentWeek] = useState(0);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [todayRecord, setTodayRecord] = useState<AttendanceRecord | null>(null);

  useEffect(() => {
    if (user) {
      fetchAttendance();
    }
  }, [user, currentWeek]);

  const fetchAttendance = async () => {
    try {
      setLoading(true);
      const today = new Date().toISOString().split('T')[0];

      // Fetch today's record
      const { data: todayData, error: todayError } = await supabase
        .from('attendance')
        .select('*')
        .eq('user_id', user?.id)
        .eq('date', today)
        .maybeSingle();

      if (todayError) throw todayError;

      if (todayData) {
        const record: AttendanceRecord = {
          date: todayData.date,
          checkIn: todayData.check_in?.substring(0, 5) || null,
          checkOut: todayData.check_out?.substring(0, 5) || null,
          status: todayData.status as any,
          hours: Number(todayData.hours) || 0
        };
        setTodayRecord(record);
        setIsCheckedIn(!!record.checkIn && !record.checkOut);
      } else {
        setTodayRecord(null);
        setIsCheckedIn(false);
      }

      // Fetch history
      const { data: historyData, error: historyError } = await supabase
        .from('attendance')
        .select('*')
        .eq('user_id', user?.id)
        .order('date', { ascending: false })
        .limit(30);

      if (historyError) throw historyError;

      const formattedHistory = (historyData || []).map(d => ({
        date: d.date,
        checkIn: d.check_in?.substring(0, 5) || null,
        checkOut: d.check_out?.substring(0, 5) || null,
        status: d.status as any,
        hours: Number(d.hours) || 0
      }));

      setAttendance(formattedHistory);
    } catch (error) {
      console.error('Error fetching attendance:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async () => {
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });

    try {
      const { error } = await supabase
        .from('attendance')
        .upsert({
          user_id: user?.id,
          date: today,
          check_in: timeStr,
          status: 'present'
        });

      if (error) throw error;

      await fetchAttendance();
      setIsCheckedIn(true);
      toast({
        title: 'Checked in successfully!',
        description: `You checked in at ${now.toLocaleTimeString()}`,
      });
    } catch (error: any) {
      toast({
        title: 'Error checking in',
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  const handleCheckOut = async () => {
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });

    try {
      // Calculate hours if check_in exists
      let hours = 0;
      if (todayRecord?.checkIn) {
        const checkInTime = todayRecord.checkIn.split(':').map(Number);
        const checkOutTime = timeStr.split(':').map(Number);
        hours = (checkOutTime[0] - checkInTime[0]) + (checkOutTime[1] - checkInTime[1]) / 60;
        hours = Math.max(0, Math.round(hours * 100) / 100);
      }

      const { error } = await supabase
        .from('attendance')
        .update({
          check_out: timeStr,
          hours: hours
        })
        .eq('user_id', user?.id)
        .eq('date', today);

      if (error) throw error;

      await fetchAttendance();
      setIsCheckedIn(false);
      toast({
        title: 'Checked out successfully!',
        description: `You checked out at ${now.toLocaleTimeString()}`,
      });
    } catch (error: any) {
      toast({
        title: 'Error checking out',
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  const getWeekDates = () => {
    const today = new Date();
    today.setDate(today.getDate() - currentWeek * 7);
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      dates.push(date);
    }
    return dates;
  };

  const weekDates = getWeekDates();

  const presentDays = attendance.filter((a) => a.status === 'present' || a.status === 'late').length;
  const totalHours = attendance.reduce((acc, a) => acc + a.hours, 0);

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold">Attendance</h1>
          <p className="text-muted-foreground">Track your daily attendance</p>
        </motion.div>

        {/* Check In/Out Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card rounded-3xl p-8"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <h2 className="text-2xl font-bold mb-2">
                {new Date().toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                })}
              </h2>
              <p className="text-muted-foreground">
                {isCheckedIn ? (
                  <>
                    Checked in at{' '}
                    <span className="text-primary font-medium">{todayRecord?.checkIn}</span>
                  </>
                ) : todayRecord?.checkOut ? (
                  <>
                    Completed your day at{' '}
                    <span className="text-primary font-medium">{todayRecord.checkOut}</span>
                  </>
                ) : (
                  'Ready to start your day?'
                )}
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-4xl font-bold gradient-text">
                  {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
                <p className="text-sm text-muted-foreground">Current Time</p>
              </div>

              <Button
                onClick={isCheckedIn ? handleCheckOut : handleCheckIn}
                variant={isCheckedIn ? 'outline' : 'gradient'}
                size="xl"
                className="gap-3"
                disabled={loading || (!isCheckedIn && !!todayRecord?.checkOut)}
              >
                {isCheckedIn ? (
                  <>
                    <LogOut className="w-5 h-5" />
                    Check Out
                  </>
                ) : (
                  <>
                    <LogIn className="w-5 h-5" />
                    Check In
                  </>
                )}
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Present Days', value: presentDays, icon: CheckCircle, color: 'text-success' },
            { label: 'Total Hours', value: `${totalHours.toFixed(1)}h`, icon: Clock, color: 'text-primary' },
            { label: 'Late Days', value: attendance.filter((a) => a.status === 'late').length, icon: AlertCircle, color: 'text-warning' },
            { label: 'Absent Days', value: attendance.filter((a) => a.status === 'absent').length, icon: XCircle, color: 'text-destructive' },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 + index * 0.05 }}
              className="glass-card rounded-2xl p-4"
            >
              <div className="flex items-center gap-3">
                <stat.icon className={cn('w-5 h-5', stat.color)} />
                <div>
                  <p className={cn('text-2xl font-bold', stat.color)}>{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Weekly View */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card rounded-3xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Weekly Overview
            </h2>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={() => setCurrentWeek(currentWeek + 1)}>
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setCurrentWeek(Math.max(0, currentWeek - 1))}
                disabled={currentWeek === 0}
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            {attendance.slice(0, 7).map((record, index) => {
              const config = statusConfig[record.status];
              const StatusIcon = config.icon;
              const date = new Date(record.date);

              return (
                <motion.div
                  key={record.date}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className={cn(
                    'flex items-center justify-between p-4 rounded-xl border border-border',
                    index === 0 && 'ring-2 ring-primary/20 bg-primary/5'
                  )}
                >
                  <div className="flex items-center gap-4">
                    <div className="text-center min-w-[60px]">
                      <p className="text-xs text-muted-foreground uppercase">
                        {date.toLocaleDateString('en-US', { weekday: 'short' })}
                      </p>
                      <p className="text-lg font-bold">{date.getDate()}</p>
                    </div>
                    <div className={cn('px-3 py-1 rounded-full flex items-center gap-2', config.bg)}>
                      <StatusIcon className={cn('w-4 h-4', config.color)} />
                      <span className={cn('text-sm font-medium', config.color)}>{config.label}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 text-sm">
                    <div className="text-center">
                      <p className="text-muted-foreground">Check In</p>
                      <p className="font-medium">{record.checkIn || '--:--'}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-muted-foreground">Check Out</p>
                      <p className="font-medium">{record.checkOut || '--:--'}</p>
                    </div>
                    <div className="text-center min-w-[60px]">
                      <p className="text-muted-foreground">Hours</p>
                      <p className="font-medium">{record.hours > 0 ? `${record.hours}h` : '--'}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};
