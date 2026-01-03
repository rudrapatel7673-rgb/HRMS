import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { attendanceApi } from '@/services/api';
import { Attendance as AttendanceType } from '@/types';
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
  Loader2,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';

const statusConfig = {
  present: { icon: CheckCircle, color: 'text-success', bg: 'bg-success/10', label: 'Present' },
  absent: { icon: XCircle, color: 'text-destructive', bg: 'bg-destructive/10', label: 'Absent' },
  late: { icon: AlertCircle, color: 'text-warning', bg: 'bg-warning/10', label: 'Late' },
  'half-day': { icon: Clock, color: 'text-primary', bg: 'bg-primary/10', label: 'Half Day' },
};

export const Attendance = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [todayRecord, setTodayRecord] = useState<AttendanceType | null>(null);
  const [attendanceHistory, setAttendanceHistory] = useState<AttendanceType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [currentWeekOffset, setCurrentWeekOffset] = useState(0);

  const fetchData = async () => {
    if (!user) return;
    try {
      const [today, history] = await Promise.all([
        attendanceApi.getTodayRecord(user.id),
        attendanceApi.getHistory(user.id)
      ]);

      setTodayRecord(today);
      setIsCheckedIn(!!today && !today.check_out);
      setAttendanceHistory(history);
    } catch (error) {
      console.error('Failed to fetch attendance:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const handleCheckIn = async () => {
    if (!user) return;
    setIsActionLoading(true);
    try {
      const record = await attendanceApi.checkIn(user.id);
      setTodayRecord(record);
      setIsCheckedIn(true);
      await fetchData(); // Refresh list
      toast({
        title: 'Checked in successfully!',
        description: `You checked in at ${record.check_in}`,
      });
    } catch (error: any) {
      toast({
        title: 'Check-in failed',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleCheckOut = async () => {
    if (!todayRecord) return;
    setIsActionLoading(true);
    try {
      const record = await attendanceApi.checkOut(todayRecord.id);
      setTodayRecord(record);
      setIsCheckedIn(false);
      await fetchData(); // Refresh list
      toast({
        title: 'Checked out successfully!',
        description: `You checked out at ${record.check_out}`,
      });
    } catch (error: any) {
      toast({
        title: 'Check-out failed',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsActionLoading(false);
    }
  };

  const presentDays = attendanceHistory.filter((a) => a.status === 'present' || a.status === 'late').length;
  const totalHours = attendanceHistory.reduce((acc, a) => acc + (a.hours || 0), 0);
  const lateDays = attendanceHistory.filter((a) => a.status === 'late').length;
  const absentDays = attendanceHistory.filter((a) => a.status === 'absent').length;

  const getWeekData = () => {
    // Logic to filter history by current week offset could go here
    // For simplicity showing last 7 records or filtering
    return attendanceHistory.slice(currentWeekOffset * 7, (currentWeekOffset + 1) * 7);
  };

  const weekRecords = getWeekData();

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex h-[50vh] items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

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
                {todayRecord?.check_in ? (
                  <>
                    Checked in at{' '}
<<<<<<< HEAD
  <span className="text-primary font-medium">{todayRecord.check_in}</span>
  {
    todayRecord.check_out && (
      <> • Checked out at <span className="text-primary font-medium">{todayRecord.check_out}</span></>
    )
  }
=======
                    <span className="text-primary font-medium">{todayRecord?.checkIn}</span>
                  </>
                ) : todayRecord?.checkOut ? (
                  <>
                    Completed your day at{' '}
                    <span className="text-primary font-medium">{todayRecord.checkOut}</span>
>>>>>>> 21d4fdfa03e28ae29f4dfd520899e332a1999922
                  </>
                ) : (
  'Ready to start your day?'
)}
              </p >
            </div >

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
<<<<<<< HEAD
      disabled={isActionLoading || (!!todayRecord?.check_out)} // Disable if already checked out for the day
=======
                disabled={loading || (!isCheckedIn && !!todayRecord?.checkOut)}
>>>>>>> 21d4fdfa03e28ae29f4dfd520899e332a1999922
    >
      {isActionLoading ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : isCheckedIn ? (
        <>
          <LogOut className="w-5 h-5" />
          Check Out
        </>
      ) : (
        <>
          <LogIn className="w-5 h-5" />
          {todayRecord?.check_out ? "Day Complete" : "Check In"}
        </>
      )}
    </Button>
  </div>
          </div >
        </motion.div >

  {/* Stats */ }
  < div className = "grid grid-cols-2 md:grid-cols-4 gap-4" >
  {
    [
    { label: 'Present Days', value: presentDays, icon: CheckCircle, color: 'text-success' },
    { label: 'Total Hours', value: `${totalHours.toFixed(1)}h`, icon: Clock, color: 'text-primary' },
    { label: 'Late Days', value: lateDays, icon: AlertCircle, color: 'text-warning' },
    { label: 'Absent Days', value: absentDays, icon: XCircle, color: 'text-destructive' },
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
    ))
  }
        </div >

  {/* Weekly View */ }
  < motion.div
initial = {{ opacity: 0, y: 20 }}
animate = {{ opacity: 1, y: 0 }}
transition = {{ delay: 0.3 }}
className = "glass-card rounded-3xl p-6"
  >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              History Overview
            </h2>
            {/* Pagination controls simplified for now */}
          </div>

          <div className="space-y-3">
            {weekRecords.map((record, index) => {
              const config = statusConfig[record.status] || statusConfig['present'];
              const StatusIcon = config.icon;
              const date = new Date(record.date);

              return (
                <motion.div
                  key={record.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className={cn(
                    'flex items-center justify-between p-4 rounded-xl border border-border',
                    // Highlight today
                    record.date === new Date().toISOString().split('T')[0] && 'ring-2 ring-primary/20 bg-primary/5'
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
                      <p className="font-medium">{record.check_in?.substring(0, 5) || '--:--'}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-muted-foreground">Check Out</p>
                      <p className="font-medium">{record.check_out?.substring(0, 5) || '--:--'}</p>
                    </div>
                    <div className="text-center min-w-[60px]">
                      <p className="text-muted-foreground">Hours</p>
                      <p className="font-medium">{record.hours > 0 ? `${record.hours}h` : '--'}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
            {weekRecords.length === 0 && (
              <div className="text-center py-6 text-muted-foreground">
                No attendance records found.
              </div>
            )}
          </div>
        </motion.div >
      </div >
    </DashboardLayout >
  );
};
