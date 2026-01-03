import { Users, Calendar, FileText, DollarSign, TrendingUp, Clock, AlertCircle } from 'lucide-react';
import AdminLayout from '@/components/Layout/AdminLayout';

const stats = [
  { label: 'Total Employees', value: '248', change: '+12%', icon: Users, color: 'bg-primary/10 text-primary' },
  { label: 'Present Today', value: '215', change: '87%', icon: Calendar, color: 'bg-success/10 text-success' },
  { label: 'Pending Leaves', value: '8', change: '', icon: FileText, color: 'bg-warning/10 text-warning' },
  { label: 'Payroll Due', value: '$125K', change: 'Jan 5', icon: DollarSign, color: 'bg-info/10 text-info' },
];

const recentLeaveRequests = [
  { name: 'Sarah Johnson', type: 'Annual Leave', duration: 'Jan 5 - Jan 8', status: 'Pending' },
  { name: 'Mike Chen', type: 'Sick Leave', duration: 'Jan 3', status: 'Pending' },
  { name: 'Emily Davis', type: 'Personal Leave', duration: 'Jan 6 - Jan 7', status: 'Pending' },
];

const attendanceOverview = [
  { label: 'Present', value: 215, percentage: 87, color: 'bg-success' },
  { label: 'On Leave', value: 18, percentage: 7, color: 'bg-warning' },
  { label: 'Absent', value: 15, percentage: 6, color: 'bg-destructive' },
];

const AdminDashboard = () => {
  return (
    <AdminLayout>
      <div className="space-y-8 fade-in">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div 
              key={stat.label} 
              className="dashboard-card"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-3xl font-bold text-foreground mt-1">{stat.value}</p>
                  {stat.change && (
                    <div className="flex items-center gap-1 mt-2">
                      <TrendingUp className="w-4 h-4 text-success" />
                      <span className="text-sm text-success">{stat.change}</span>
                    </div>
                  )}
                </div>
                <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center`}>
                  <stat.icon className="w-6 h-6" />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pending Leave Requests */}
          <div className="dashboard-card">
            <div className="flex items-center justify-between mb-6">
              <h3 className="section-title">Pending Leave Requests</h3>
              <span className="px-3 py-1 bg-warning/10 text-warning text-sm font-medium rounded-full">
                {recentLeaveRequests.length} Pending
              </span>
            </div>
            <div className="space-y-4">
              {recentLeaveRequests.map((request, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold">
                      {request.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{request.name}</p>
                      <p className="text-sm text-muted-foreground">{request.type} • {request.duration}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="px-3 py-1.5 bg-success text-success-foreground text-sm font-medium rounded-lg hover:opacity-90 transition-opacity">
                      Approve
                    </button>
                    <button className="px-3 py-1.5 bg-destructive text-destructive-foreground text-sm font-medium rounded-lg hover:opacity-90 transition-opacity">
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Attendance Overview */}
          <div className="dashboard-card">
            <h3 className="section-title mb-6">Today's Attendance</h3>
            <div className="space-y-6">
              {attendanceOverview.map((item) => (
                <div key={item.label} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">{item.label}</span>
                    <span className="text-sm font-medium text-foreground">{item.value} ({item.percentage}%)</span>
                  </div>
                  <div className="h-3 bg-muted rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${item.color} rounded-full transition-all duration-500`}
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-6 border-t border-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">Average Check-in Time</span>
                </div>
                <span className="font-medium text-foreground">9:12 AM</span>
              </div>
            </div>
          </div>
        </div>

        {/* Notifications & Alerts */}
        <div className="dashboard-card">
          <h3 className="section-title mb-6">Notifications & Alerts</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="flex items-start gap-4 p-4 bg-warning/5 border border-warning/20 rounded-lg">
              <AlertCircle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-foreground">Payroll Processing Due</p>
                <p className="text-sm text-muted-foreground mt-1">January payroll needs to be processed by Jan 5th.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 bg-info/5 border border-info/20 rounded-lg">
              <AlertCircle className="w-5 h-5 text-info flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-foreground">New Employee Onboarding</p>
                <p className="text-sm text-muted-foreground mt-1">3 new employees joining next week.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 bg-destructive/5 border border-destructive/20 rounded-lg">
              <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-foreground">Attendance Anomaly</p>
                <p className="text-sm text-muted-foreground mt-1">5 employees with consecutive absences.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
