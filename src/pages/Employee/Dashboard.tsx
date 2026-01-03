import { Link } from 'react-router-dom';
import { User, Calendar, FileText, DollarSign, Clock, CheckCircle } from 'lucide-react';
import EmployeeLayout from '@/components/layout/EmployeeLayout';

const dashboardCards = [
  {
    title: 'My Profile',
    description: 'View and update your personal information',
    icon: User,
    path: '/employee/profile',
    color: 'bg-primary/10 text-primary',
  },
  {
    title: 'Attendance',
    description: 'Check in/out and view attendance history',
    icon: Calendar,
    path: '/employee/attendance',
    color: 'bg-info/10 text-info',
  },
  {
    title: 'Apply Leave',
    description: 'Submit and track your leave requests',
    icon: FileText,
    path: '/employee/leave',
    color: 'bg-warning/10 text-warning',
  },
  {
    title: 'Salary',
    description: 'View payslips and salary details',
    icon: DollarSign,
    path: '/employee/payroll',
    color: 'bg-success/10 text-success',
  },
];

const EmployeeDashboard = () => {
  return (
    <EmployeeLayout>
      <div className="space-y-8 fade-in">
        {/* Welcome Section */}
        <div className="bg-card rounded-2xl border border-border p-6 lg:p-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl lg:text-3xl font-bold text-foreground">
                Welcome back, John! 👋
              </h2>
              <p className="text-muted-foreground mt-1">
                Here's what's happening with your work today.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-success/10 text-success rounded-full">
                <CheckCircle className="w-4 h-4" />
                <span className="text-sm font-medium">Checked In</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-muted rounded-full">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">09:15 AM</span>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {dashboardCards.map((card, index) => (
            <Link
              key={card.path}
              to={card.path}
              className="stat-card group"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className={`w-14 h-14 rounded-xl ${card.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <card.icon className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-1">{card.title}</h3>
              <p className="text-sm text-muted-foreground">{card.description}</p>
            </Link>
          ))}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Leave Balance */}
          <div className="dashboard-card">
            <h3 className="section-title mb-4">Leave Balance</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Annual Leave</span>
                <span className="font-semibold text-foreground">12 days</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full w-3/4 bg-primary rounded-full" />
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Sick Leave</span>
                <span className="font-semibold text-foreground">5 days</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full w-1/2 bg-info rounded-full" />
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="dashboard-card">
            <h3 className="section-title mb-4">Recent Activity</h3>
            <div className="space-y-4">
              {[
                { action: 'Leave Approved', time: '2 hours ago', status: 'success' },
                { action: 'Checked In', time: 'Today, 9:15 AM', status: 'info' },
                { action: 'Salary Credited', time: 'Dec 28, 2025', status: 'success' },
              ].map((activity, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${
                    activity.status === 'success' ? 'bg-success' : 'bg-info'
                  }`} />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Announcements */}
          <div className="dashboard-card">
            <h3 className="section-title mb-4">Announcements</h3>
            <div className="space-y-4">
              <div className="p-3 bg-accent rounded-lg">
                <p className="text-sm font-medium text-accent-foreground">Office Closure Notice</p>
                <p className="text-xs text-muted-foreground mt-1">Office will be closed on Jan 1st for New Year.</p>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-sm font-medium text-foreground">Team Meeting</p>
                <p className="text-xs text-muted-foreground mt-1">Weekly standup at 10 AM tomorrow.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </EmployeeLayout>
  );
};

export default EmployeeDashboard;
