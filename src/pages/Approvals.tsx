import { useState } from 'react';
import { motion } from 'framer-motion';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import {
  CheckCircle,
  XCircle,
  Clock,
  User,
  Calendar,
  MessageSquare,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface LeaveRequest {
  id: string;
  employeeName: string;
  employeeId: string;
  department: string;
  type: 'paid' | 'sick' | 'unpaid';
  startDate: string;
  endDate: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
}

const mockPendingRequests: LeaveRequest[] = [
  {
    id: '1',
    employeeName: 'John Doe',
    employeeId: 'EMP001',
    department: 'Engineering',
    type: 'paid',
    startDate: '2026-01-15',
    endDate: '2026-01-17',
    reason: 'Family vacation to celebrate anniversary',
    status: 'pending',
    submittedAt: '2025-12-28',
  },
  {
    id: '2',
    employeeName: 'Jane Smith',
    employeeId: 'EMP002',
    department: 'Design',
    type: 'sick',
    startDate: '2026-01-08',
    endDate: '2026-01-08',
    reason: 'Doctor appointment for regular checkup',
    status: 'pending',
    submittedAt: '2025-12-30',
  },
  {
    id: '3',
    employeeName: 'Mike Johnson',
    employeeId: 'EMP003',
    department: 'Marketing',
    type: 'unpaid',
    startDate: '2026-01-20',
    endDate: '2026-01-25',
    reason: 'Personal travel abroad',
    status: 'pending',
    submittedAt: '2026-01-02',
  },
];

const leaveTypeConfig = {
  paid: { color: 'bg-success/10 text-success border-success/30', label: 'Paid Leave' },
  sick: { color: 'bg-warning/10 text-warning border-warning/30', label: 'Sick Leave' },
  unpaid: { color: 'bg-muted text-muted-foreground border-border', label: 'Unpaid Leave' },
};

export const Approvals = () => {
  const { toast } = useToast();
  const [requests, setRequests] = useState(mockPendingRequests);
  const [comment, setComment] = useState<{ [key: string]: string }>({});

  const handleApprove = (id: string) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'approved' } : r))
    );
    toast({
      title: 'Leave Approved',
      description: 'The leave request has been approved successfully.',
    });
  };

  const handleReject = (id: string) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'rejected' } : r))
    );
    toast({
      title: 'Leave Rejected',
      description: 'The leave request has been rejected.',
      variant: 'destructive',
    });
  };

  const pendingRequests = requests.filter((r) => r.status === 'pending');
  const processedRequests = requests.filter((r) => r.status !== 'pending');

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold">Leave Approvals</h1>
          <p className="text-muted-foreground">Review and manage leave requests</p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-2xl p-4"
          >
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-warning" />
              <div>
                <p className="text-2xl font-bold text-warning">{pendingRequests.length}</p>
                <p className="text-sm text-muted-foreground">Pending</p>
              </div>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card rounded-2xl p-4"
          >
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-success" />
              <div>
                <p className="text-2xl font-bold text-success">
                  {requests.filter((r) => r.status === 'approved').length}
                </p>
                <p className="text-sm text-muted-foreground">Approved</p>
              </div>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card rounded-2xl p-4"
          >
            <div className="flex items-center gap-3">
              <XCircle className="w-5 h-5 text-destructive" />
              <div>
                <p className="text-2xl font-bold text-destructive">
                  {requests.filter((r) => r.status === 'rejected').length}
                </p>
                <p className="text-sm text-muted-foreground">Rejected</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Pending Requests */}
        {pendingRequests.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-4"
          >
            <h2 className="text-xl font-semibold">Pending Requests</h2>
            {pendingRequests.map((request, index) => {
              const typeConfig = leaveTypeConfig[request.type];
              const days =
                Math.ceil(
                  (new Date(request.endDate).getTime() - new Date(request.startDate).getTime()) /
                    (1000 * 60 * 60 * 24)
                ) + 1;

              return (
                <motion.div
                  key={request.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="glass-card rounded-2xl p-6"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center text-lg font-bold text-primary-foreground">
                          {request.employeeName.charAt(0)}
                        </div>
                        <div>
                          <h3 className="font-semibold">{request.employeeName}</h3>
                          <p className="text-sm text-muted-foreground">
                            {request.employeeId} • {request.department}
                          </p>
                        </div>
                        <div className={cn('px-3 py-1 rounded-full text-xs font-medium border', typeConfig.color)}>
                          {typeConfig.label}
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          <span>
                            {new Date(request.startDate).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                            })}{' '}
                            -{' '}
                            {new Date(request.endDate).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </span>
                          <span className="text-muted-foreground">({days} day{days > 1 ? 's' : ''})</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="w-4 h-4" />
                          <span>Submitted {request.submittedAt}</span>
                        </div>
                      </div>

                      <div className="flex items-start gap-2 text-sm">
                        <MessageSquare className="w-4 h-4 text-muted-foreground mt-0.5" />
                        <p className="text-muted-foreground">{request.reason}</p>
                      </div>

                      <div className="mt-4">
                        <Textarea
                          placeholder="Add a comment (optional)..."
                          value={comment[request.id] || ''}
                          onChange={(e) => setComment({ ...comment, [request.id]: e.target.value })}
                          rows={2}
                        />
                      </div>
                    </div>

                    <div className="flex lg:flex-col gap-3">
                      <Button
                        onClick={() => handleApprove(request.id)}
                        variant="success"
                        className="flex-1 lg:flex-none gap-2"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Approve
                      </Button>
                      <Button
                        onClick={() => handleReject(request.id)}
                        variant="destructive"
                        className="flex-1 lg:flex-none gap-2"
                      >
                        <XCircle className="w-4 h-4" />
                        Reject
                      </Button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {pendingRequests.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass-card rounded-2xl p-12 text-center"
          >
            <CheckCircle className="w-16 h-16 mx-auto mb-4 text-success opacity-50" />
            <h3 className="text-xl font-semibold mb-2">All caught up!</h3>
            <p className="text-muted-foreground">No pending leave requests to review.</p>
          </motion.div>
        )}

        {/* Recent Processed */}
        {processedRequests.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-card rounded-3xl p-6"
          >
            <h2 className="text-xl font-semibold mb-4">Recently Processed</h2>
            <div className="space-y-3">
              {processedRequests.map((request) => (
                <div
                  key={request.id}
                  className="flex items-center justify-between p-4 rounded-xl border border-border"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center text-sm font-bold text-primary-foreground">
                      {request.employeeName.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium">{request.employeeName}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(request.startDate).toLocaleDateString()} -{' '}
                        {new Date(request.endDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <span
                    className={cn(
                      'px-3 py-1 rounded-full text-xs font-medium',
                      request.status === 'approved'
                        ? 'bg-success/10 text-success'
                        : 'bg-destructive/10 text-destructive'
                    )}
                  >
                    {request.status === 'approved' ? 'Approved' : 'Rejected'}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </DashboardLayout>
  );
};
