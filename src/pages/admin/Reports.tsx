import { BarChart3, PieChart, TrendingUp, Download, Calendar } from 'lucide-react';
import AdminLayout from '@/components/Layout/AdminLayout';

const Reports = () => {
  return (
    <AdminLayout>
      <div className="space-y-6 fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Reports & Analytics</h2>
            <p className="text-muted-foreground">View insights and generate reports</p>
          </div>
          <button className="btn-primary">
            <Download className="w-4 h-4 mr-2" />
            Export All
          </button>
        </div>

        {/* Report Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="dashboard-card hover:shadow-lg cursor-pointer">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
              <BarChart3 className="w-6 h-6 text-primary" />
            </div>
            <h3 className="section-title mb-2">Attendance Report</h3>
            <p className="text-sm text-muted-foreground mb-4">Daily, weekly, and monthly attendance summaries</p>
            <button className="text-primary text-sm font-medium hover:underline">
              Generate Report →
            </button>
          </div>

          <div className="dashboard-card hover:shadow-lg cursor-pointer">
            <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center mb-4">
              <PieChart className="w-6 h-6 text-success" />
            </div>
            <h3 className="section-title mb-2">Leave Analysis</h3>
            <p className="text-sm text-muted-foreground mb-4">Leave patterns and utilization reports</p>
            <button className="text-primary text-sm font-medium hover:underline">
              Generate Report →
            </button>
          </div>

          <div className="dashboard-card hover:shadow-lg cursor-pointer">
            <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center mb-4">
              <TrendingUp className="w-6 h-6 text-warning" />
            </div>
            <h3 className="section-title mb-2">Payroll Summary</h3>
            <p className="text-sm text-muted-foreground mb-4">Monthly payroll breakdown and trends</p>
            <button className="text-primary text-sm font-medium hover:underline">
              Generate Report →
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="dashboard-card">
          <h3 className="section-title mb-6">Quick Overview - January 2026</h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <p className="text-3xl font-bold text-foreground">94.5%</p>
              <p className="text-sm text-muted-foreground mt-1">Avg Attendance</p>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <p className="text-3xl font-bold text-foreground">23</p>
              <p className="text-sm text-muted-foreground mt-1">Leave Requests</p>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <p className="text-3xl font-bold text-foreground">$312K</p>
              <p className="text-sm text-muted-foreground mt-1">Total Payroll</p>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <p className="text-3xl font-bold text-foreground">248</p>
              <p className="text-sm text-muted-foreground mt-1">Active Employees</p>
            </div>
          </div>
        </div>

        {/* Recent Reports */}
        <div className="dashboard-card">
          <h3 className="section-title mb-6">Recent Reports</h3>
          <div className="space-y-4">
            {[
              { name: 'December 2025 Payroll Report', date: 'Jan 2, 2026', type: 'Payroll' },
              { name: 'Q4 2025 Attendance Summary', date: 'Jan 1, 2026', type: 'Attendance' },
              { name: 'Annual Leave Report 2025', date: 'Dec 31, 2025', type: 'Leave' },
            ].map((report, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <BarChart3 className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{report.name}</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      {report.date}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 bg-muted text-muted-foreground text-sm rounded-full">
                    {report.type}
                  </span>
                  <button className="p-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors">
                    <Download className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Reports;
