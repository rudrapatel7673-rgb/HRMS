import { useState } from 'react';
import { Search, Check, X, MessageSquare, Filter } from 'lucide-react';
import AdminLayout from '@/components/layout/AdminLayout';

const leaveRequests = [
  { id: 1, name: 'Sarah Johnson', empId: 'EMP-002', type: 'Annual Leave', startDate: 'Jan 5, 2026', endDate: 'Jan 8, 2026', reason: 'Family vacation to Hawaii', status: 'Pending' },
  { id: 2, name: 'Mike Chen', empId: 'EMP-003', type: 'Sick Leave', startDate: 'Jan 3, 2026', endDate: 'Jan 3, 2026', reason: 'Medical appointment for regular checkup', status: 'Pending' },
  { id: 3, name: 'Emily Davis', empId: 'EMP-004', type: 'Personal Leave', startDate: 'Jan 6, 2026', endDate: 'Jan 7, 2026', reason: 'Moving to new apartment', status: 'Pending' },
  { id: 4, name: 'John Doe', empId: 'EMP-001', type: 'Annual Leave', startDate: 'Dec 24, 2025', endDate: 'Dec 26, 2025', reason: 'Christmas holiday', status: 'Approved' },
  { id: 5, name: 'Robert Wilson', empId: 'EMP-005', type: 'Sick Leave', startDate: 'Dec 20, 2025', endDate: 'Dec 20, 2025', reason: 'Not feeling well', status: 'Approved' },
];

const AdminLeave = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [requests, setRequests] = useState(leaveRequests);

  const filteredRequests = requests.filter(req => {
    const matchesSearch = req.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          req.empId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !filterStatus || req.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleApprove = (id: number) => {
    setRequests(requests.map(req => 
      req.id === id ? { ...req, status: 'Approved' } : req
    ));
  };

  const handleReject = (id: number) => {
    setRequests(requests.map(req => 
      req.id === id ? { ...req, status: 'Rejected' } : req
    ));
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

  const pendingCount = requests.filter(r => r.status === 'Pending').length;

  return (
    <AdminLayout>
      <div className="space-y-6 fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Leave Approvals</h2>
            <p className="text-muted-foreground">Review and manage leave requests</p>
          </div>
          <div className="px-4 py-2 bg-warning/10 text-warning rounded-full font-medium">
            {pendingCount} Pending Requests
          </div>
        </div>

        {/* Filters */}
        <div className="dashboard-card">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by name or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-input pl-12"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="form-input sm:w-40"
            >
              <option value="">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* Leave Requests Table */}
        <div className="dashboard-card overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="table-header">Employee</th>
                  <th className="table-header">Leave Type</th>
                  <th className="table-header">Duration</th>
                  <th className="table-header">Reason</th>
                  <th className="table-header">Status</th>
                  <th className="table-header">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredRequests.map((request) => (
                  <tr key={request.id} className="hover:bg-muted/50 transition-colors">
                    <td className="table-cell">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold">
                          {request.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{request.name}</p>
                          <p className="text-sm text-muted-foreground">{request.empId}</p>
                        </div>
                      </div>
                    </td>
                    <td className="table-cell font-medium">{request.type}</td>
                    <td className="table-cell">
                      <div>
                        <p className="text-foreground">{request.startDate}</p>
                        {request.startDate !== request.endDate && (
                          <p className="text-sm text-muted-foreground">to {request.endDate}</p>
                        )}
                      </div>
                    </td>
                    <td className="table-cell max-w-xs">
                      <p className="text-muted-foreground truncate">{request.reason}</p>
                    </td>
                    <td className="table-cell">
                      <span className={getStatusBadge(request.status)}>
                        {request.status}
                      </span>
                    </td>
                    <td className="table-cell">
                      {request.status === 'Pending' ? (
                        <div className="flex gap-2">
                          <button 
                            onClick={() => handleApprove(request.id)}
                            className="p-2 rounded-lg bg-success/10 text-success hover:bg-success/20 transition-colors"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleReject(request.id)}
                            className="p-2 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                          <button className="p-2 rounded-lg bg-muted text-muted-foreground hover:bg-muted/80 transition-colors">
                            <MessageSquare className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <span className="text-sm text-muted-foreground">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminLeave;
