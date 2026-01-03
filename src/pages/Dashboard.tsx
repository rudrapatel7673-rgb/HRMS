import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Link } from 'react-router-dom';
import {
  User,
  Clock,
  Calendar,
  DollarSign,
  Users,
  CheckCircle,
  TrendingUp,
  ArrowRight,
  LogIn,
  LogOut,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.4 },
  }),
};

export const Dashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [checkInTime, setCheckInTime] = useState<string | null>(null);
  const [stats, setStats] = useState({
    totalEmployees: 0,
    presentToday: 0,
    pendingLeaves: 0,
    newRequests: 0
  });

  useEffect(() => {
    if (user) {
      fetchStatus();
      if (user.role === 'admin') {
        fetchAdminStats();
      }
    }
  }, [user]);

  const fetchStatus = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const { data, error } = await supabase
        .from('attendance')
        .select('*')
        .eq('user_id', user?.id)
        .eq('date', today)
        .maybeSingle();

      if (error) throw error;
      if (data) {
        setIsCheckedIn(!!data.check_in && !data.check_out);
        setCheckInTime(data.check_in);
      }
    } catch (error) {
      console.error('Error fetching dashboard status:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAdminStats = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];

      // Total Employees
      const { count: empCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      // Present Today
      const { count: presentCount } = await supabase
        .from('attendance')
        .select('*', { count: 'exact', head: true })
        .eq('date', today);

      // Pending Leaves
      const { count: pendingCount } = await supabase
        .from('leave_requests')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');

      setStats({
        totalEmployees: empCount || 0,
        presentToday: presentCount || 0,
        pendingLeaves: pendingCount || 0,
        newRequests: pendingCount || 0 // For now mapping new to pending
      });
    } catch (error) {
      console.error('Error fetching admin stats:', error);
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

      setIsCheckedIn(true);
      setCheckInTime(timeStr);
      toast({
        title: 'Checked in!',
        description: `You checked in at ${now.toLocaleTimeString()}`,
      });
    } catch (error: any) {
      toast({
        title: 'Error',
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
      const { error } = await supabase
        .from('attendance')
        .update({
          check_out: timeStr,
          status: 'present'
        })
        .eq('user_id', user?.id)
        .eq('date', today);

      if (error) throw error;

      setIsCheckedIn(false);
      toast({
        title: 'Checked out!',
        description: `You checked out at ${now.toLocaleTimeString()}`,
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  const employeeCards = [
    {
      icon: User,
      title: 'My Profile',
      description: 'View and edit your information',
      link: '/profile',
      color: 'from-violet-500 to-purple-600',
    },
    {
      icon: Clock,
      title: 'Attendance',
      description: 'Track your daily attendance',
      link: '/attendance',
      color: 'from-cyan-500 to-teal-600',
    },
    {
      icon: Calendar,
      title: 'Leave Requests',
      description: 'Apply for time off',
      link: '/leave',
      color: 'from-amber-500 to-orange-600',
    },
    {
      icon: DollarSign,
      title: 'Payroll',
      description: 'View salary details',
      link: '/payroll',
      color: 'from-emerald-500 to-green-600',
    },
  ];

  const adminCards = [
    {
      icon: Users,
      title: 'Employees',
      description: 'Manage all employees',
      link: '/employees',
      color: 'from-violet-500 to-purple-600',
      stat: '24 active',
    },
    {
      icon: Clock,
      title: 'Attendance',
      description: 'View attendance records',
      link: '/attendance',
      color: 'from-cyan-500 to-teal-600',
      stat: '92% today',
    },
    {
      icon: CheckCircle,
      title: 'Approvals',
      description: 'Pending leave requests',
      link: '/approvals',
      color: 'from-amber-500 to-orange-600',
      stat: '5 pending',
    },
    {
      icon: DollarSign,
      title: 'Payroll',
      description: 'Manage salaries',
      link: '/payroll',
      color: 'from-emerald-500 to-green-600',
      stat: '$125,000',
    },
  ];

  const cards = user?.role === 'admin' ? adminCards : employeeCards;

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-3xl font-bold"
            >
              Welcome back, {(user?.name === 'User' ? user?.email.split('@')[0] : user?.name) || 'User'}! 👋
            </motion.h1>
            <p className="text-muted-foreground mt-1">{currentDate}</p>
          </div>

          {/* Quick Check In/Out */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-card rounded-2xl p-4 flex items-center gap-4"
          >
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Status</p>
              <p className={`font-semibold ${isCheckedIn ? 'text-success' : 'text-muted-foreground'}`}>
                {isCheckedIn ? 'Working' : 'Not checked in'}
              </p>
              {checkInTime && isCheckedIn && (
                <p className="text-xs text-muted-foreground">
                  Since {checkInTime.substring(0, 5)}
                </p>
              )}
            </div>
            <Button
              onClick={isCheckedIn ? handleCheckOut : handleCheckIn}
              variant={isCheckedIn ? 'outline' : 'gradient'}
              className="gap-2"
              disabled={loading}
            >
              {isCheckedIn ? (
                <>
                  <LogOut className="w-4 h-4" />
                  Check Out
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  Check In
                </>
              )}
            </Button>
          </motion.div>
        </div>

        {/* Quick Access Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card, index) => (
            <motion.div
              key={card.title}
              custom={index}
              initial="hidden"
              animate="visible"
              variants={cardVariants}
            >
              <Link to={card.link}>
                <div className="glass-card rounded-2xl p-6 hover-lift group cursor-pointer h-full">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-r ${card.color} flex items-center justify-center mb-4 group-hover:shadow-lg transition-shadow`}>
                    <card.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="font-semibold text-lg mb-1">{card.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{card.description}</p>
                  {'stat' in card && (
                    <p className="text-sm font-medium text-primary">
                      {card.title === 'Employees' ? `${stats.totalEmployees} active` :
                        card.title === 'Attendance' ? `${stats.totalEmployees ? Math.round((stats.presentToday / stats.totalEmployees) * 100) : 0}% today` :
                          card.title === 'Approvals' ? `${stats.pendingLeaves} pending` :
                            (card as { stat: string }).stat}
                    </p>
                  )}
                  <div className="flex items-center text-primary text-sm font-medium mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    View <ArrowRight className="w-4 h-4 ml-1" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Stats Row */}
        {user?.role === 'admin' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-card rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Quick Overview</h2>
              <TrendingUp className="w-5 h-5 text-success" />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div>
                <p className="text-3xl font-bold gradient-text">{stats.totalEmployees}</p>
                <p className="text-sm text-muted-foreground">Total Employees</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-success">{stats.presentToday}</p>
                <p className="text-sm text-muted-foreground">Present Today</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-warning">{stats.pendingLeaves}</p>
                <p className="text-sm text-muted-foreground">Pending Leaves</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-primary">{stats.newRequests}</p>
                <p className="text-sm text-muted-foreground">New Requests</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-card rounded-2xl p-6"
        >
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {[
              { action: 'Checked in', time: '9:00 AM', date: 'Today' },
              { action: 'Leave request approved', time: '2:30 PM', date: 'Yesterday' },
              { action: 'Profile updated', time: '11:00 AM', date: 'Dec 30' },
            ].map((activity, index) => (
              <div
                key={index}
                className="flex items-center justify-between py-3 border-b border-border last:border-0"
              >
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <span>{activity.action}</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {activity.time} · {activity.date}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </DashboardLayout >
  );
};
