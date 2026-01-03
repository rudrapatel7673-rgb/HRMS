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
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

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
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [checkInTime, setCheckInTime] = useState<Date | null>(null);

  const handleCheckIn = () => {
    setIsCheckedIn(true);
    setCheckInTime(new Date());
    toast({
      title: 'Checked in!',
      description: `You checked in at ${new Date().toLocaleTimeString()}`,
    });
  };

  const handleCheckOut = () => {
    setIsCheckedIn(false);
    toast({
      title: 'Checked out!',
      description: `You checked out at ${new Date().toLocaleTimeString()}`,
    });
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
              Welcome back, {user?.name?.split(' ')[0] || 'User'}! 👋
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
                  Since {checkInTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              )}
            </div>
            <Button
              onClick={isCheckedIn ? handleCheckOut : handleCheckIn}
              variant={isCheckedIn ? 'outline' : 'gradient'}
              className="gap-2"
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
                    <p className="text-sm font-medium text-primary">{(card as { stat: string }).stat}</p>
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
                <p className="text-3xl font-bold gradient-text">24</p>
                <p className="text-sm text-muted-foreground">Total Employees</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-success">22</p>
                <p className="text-sm text-muted-foreground">Present Today</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-warning">5</p>
                <p className="text-sm text-muted-foreground">Pending Leaves</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-primary">3</p>
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
    </DashboardLayout>
  );
};
