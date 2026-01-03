import { useState } from 'react';
import { Calendar, FileText, Loader2 } from 'lucide-react';
import EmployeeLayout from '@/components/layout/EmployeeLayout';

const leaveHistory = [
  { id: 1, type: 'Annual Leave', startDate: 'Dec 24, 2025', endDate: 'Dec 26, 2025', reason: 'Family vacation', status: 'Approved' },
  { id: 2, type: 'Sick Leave', startDate: 'Nov 15, 2025', endDate: 'Nov 15, 2025', reason: 'Medical appointment', status: 'Approved' },
  { id: 3, type: 'Personal Leave', startDate: 'Oct 10, 2025', endDate: 'Oct 10, 2025', reason: 'Personal errands', status: 'Rejected' },
];

const Leave = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    leaveType: '',
    startDate: '',
    endDate: '',
    reason: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setFormData({ leaveType: '', startDate: '', endDate: '', reason: '' });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Approved':
        return 'status-approved';
      case 'Pending':
        return 'status-pending';
      case 'Rejected':
        return 'status-rejected';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <EmployeeLayout>
      <div className="space-y-6 fade-in">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Apply Leave Form */}
          <div className="lg:col-span-2 dashboard-card">
            <h3 className="section-title mb-6">Apply for Leave</h3>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="text-sm font-medium text-foreground">Leave Type</label>
                <select
                  value={formData.leaveType}
                  onChange={(e) => setFormData({ ...formData, leaveType: e.target.value })}
                  className="form-input mt-1"
                  required
                >
                  <option value="">Select leave type</option>
                  <option value="annual">Annual Leave</option>
                  <option value="sick">Sick Leave</option>
                  <option value="personal">Personal Leave</option>
                  <option value="maternity">Maternity Leave</option>
                  <option value="paternity">Paternity Leave</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground">Start Date</label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="form-input mt-1"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">End Date</label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="form-input mt-1"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground">Reason</label>
                <textarea
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  className="form-input mt-1"
                  rows={4}
                  placeholder="Please provide a reason for your leave request..."
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary w-full sm:w-auto"
              >
                {isSubmitting ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <FileText className="w-4 h-4 mr-2" />
                    Submit Request
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Leave Balance */}
          <div className="dashboard-card">
            <h3 className="section-title mb-6">Leave Balance</h3>
            <div className="space-y-4">
              <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Annual Leave</span>
                  <span className="font-semibold text-primary">12 days</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full w-3/4 bg-primary rounded-full" />
                </div>
                <p className="text-xs text-muted-foreground mt-2">4 days used</p>
              </div>

              <div className="p-4 bg-info/5 rounded-lg border border-info/20">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Sick Leave</span>
                  <span className="font-semibold text-info">5 days</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full w-1/3 bg-info rounded-full" />
                </div>
                <p className="text-xs text-muted-foreground mt-2">1 day used</p>
              </div>

              <div className="p-4 bg-warning/5 rounded-lg border border-warning/20">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Personal Leave</span>
                  <span className="font-semibold text-warning">3 days</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full w-2/3 bg-warning rounded-full" />
                </div>
                <p className="text-xs text-muted-foreground mt-2">1 day used</p>
              </div>
            </div>
          </div>
        </div>

        {/* Leave History */}
        <div className="dashboard-card">
          <h3 className="section-title mb-6">Leave History</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="table-header">Type</th>
                  <th className="table-header">Duration</th>
                  <th className="table-header">Reason</th>
                  <th className="table-header">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {leaveHistory.map((leave) => (
                  <tr key={leave.id} className="hover:bg-muted/50 transition-colors">
                    <td className="table-cell font-medium">{leave.type}</td>
                    <td className="table-cell">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        {leave.startDate} - {leave.endDate}
                      </div>
                    </td>
                    <td className="table-cell text-muted-foreground">{leave.reason}</td>
                    <td className="table-cell">
                      <span className={getStatusBadge(leave.status)}>
                        {leave.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </EmployeeLayout>
  );
};

export default Leave;
