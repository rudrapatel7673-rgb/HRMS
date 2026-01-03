import { useState } from 'react';
import { motion } from 'framer-motion';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import {
  Calendar,
  Plus,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  X,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface LeaveRequest {
  id: string;
  type: 'paid' | 'sick' | 'unpaid';
  startDate: string;
  endDate: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
}

const mockLeaveRequests: LeaveRequest[] = [
  {
    id: '1',
    type: 'paid',
    startDate: '2026-01-15',
    endDate: '2026-01-17',
    reason: 'Family vacation',
    status: 'approved',
    submittedAt: '2025-12-28',
  },
  {
    id: '2',
    type: 'sick',
    startDate: '2025-12-20',
    endDate: '2025-12-20',
    reason: 'Doctor appointment',
    status: 'approved',
    submittedAt: '2025-12-18',
  },
  {
    id: '3',
    type: 'paid',
    startDate: '2026-02-10',
    endDate: '2026-02-14',
    reason: 'Personal time off',
    status: 'pending',
    submittedAt: '2025-12-30',
  },
];

const leaveTypes = [
  { value: 'paid', label: 'Paid Leave', color: 'bg-success/10 text-success border-success/30' },
  { value: 'sick', label: 'Sick Leave', color: 'bg-warning/10 text-warning border-warning/30' },
  { value: 'unpaid', label: 'Unpaid Leave', color: 'bg-muted text-muted-foreground border-border' },
];

const statusConfig = {
  pending: { icon: Clock, color: 'text-warning', bg: 'bg-warning/10', label: 'Pending' },
  approved: { icon: CheckCircle, color: 'text-success', bg: 'bg-success/10', label: 'Approved' },
  rejected: { icon: XCircle, color: 'text-destructive', bg: 'bg-destructive/10', label: 'Rejected' },
};

export const Leave = () => {
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [requests, setRequests] = useState(mockLeaveRequests);
  const [formData, setFormData] = useState({
    type: 'paid' as 'paid' | 'sick' | 'unpaid',
    startDate: '',
    endDate: '',
    reason: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newRequest: LeaveRequest = {
      id: Math.random().toString(36).substr(2, 9),
      ...formData,
      status: 'pending',
      submittedAt: new Date().toISOString().split('T')[0],
    };
    
    setRequests([newRequest, ...requests]);
    setShowForm(false);
    setFormData({ type: 'paid', startDate: '', endDate: '', reason: '' });
    
    toast({
      title: 'Leave request submitted!',
      description: 'Your request is pending approval.',
    });
  };

  const leaveBalance = {
    paid: 15,
    sick: 10,
    unpaid: 'Unlimited',
  };

  const usedLeave = {
    paid: requests.filter((r) => r.type === 'paid' && r.status === 'approved').length * 2,
    sick: requests.filter((r) => r.type === 'sick' && r.status === 'approved').length,
    unpaid: 0,
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center justify-between gap-4"
        >
          <div>
            <h1 className="text-3xl font-bold">Leave Management</h1>
            <p className="text-muted-foreground">Request and track your time off</p>
          </div>
          <Button onClick={() => setShowForm(true)} variant="gradient" className="gap-2">
            <Plus className="w-5 h-5" />
            Request Leave
          </Button>
        </motion.div>

        {/* Leave Balance */}
        <div className="grid md:grid-cols-3 gap-4">
          {leaveTypes.map((type, index) => (
            <motion.div
              key={type.value}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass-card rounded-2xl p-6"
            >
              <div className={cn('inline-block px-3 py-1 rounded-full text-sm font-medium border mb-4', type.color)}>
                {type.label}
              </div>
              <div className="flex items-end gap-2">
                <span className="text-4xl font-bold">
                  {typeof leaveBalance[type.value as keyof typeof leaveBalance] === 'number'
                    ? (leaveBalance[type.value as keyof typeof leaveBalance] as number) - usedLeave[type.value as keyof typeof usedLeave]
                    : '∞'}
                </span>
                <span className="text-muted-foreground mb-1">
                  / {leaveBalance[type.value as keyof typeof leaveBalance]} days
                </span>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Used: {usedLeave[type.value as keyof typeof usedLeave]} days
              </p>
            </motion.div>
          ))}
        </div>

        {/* Leave Request Form Modal */}
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="glass-card rounded-3xl p-8 max-w-md w-full"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Request Leave</h2>
                <Button variant="ghost" size="icon" onClick={() => setShowForm(false)}>
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label>Leave Type</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {leaveTypes.map((type) => (
                      <button
                        key={type.value}
                        type="button"
                        onClick={() => setFormData({ ...formData, type: type.value as any })}
                        className={cn(
                          'p-3 rounded-xl border-2 transition-all text-center',
                          formData.type === type.value
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/50'
                        )}
                      >
                        <span className={cn('text-sm font-medium', formData.type === type.value ? 'text-primary' : 'text-muted-foreground')}>
                          {type.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endDate">End Date</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reason">Reason</Label>
                  <Textarea
                    id="reason"
                    placeholder="Brief description of your leave request..."
                    value={formData.reason}
                    onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                    required
                    rows={3}
                  />
                </div>

                <div className="flex gap-3">
                  <Button type="button" variant="ghost" className="flex-1" onClick={() => setShowForm(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="gradient" className="flex-1">
                    Submit Request
                  </Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}

        {/* Leave Requests List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card rounded-3xl p-6"
        >
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            My Leave Requests
          </h2>

          <div className="space-y-4">
            {requests.map((request, index) => {
              const config = statusConfig[request.status];
              const StatusIcon = config.icon;
              const typeConfig = leaveTypes.find((t) => t.value === request.type);

              return (
                <motion.div
                  key={request.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-xl border border-border gap-4"
                >
                  <div className="flex items-start gap-4">
                    <div className={cn('px-3 py-1 rounded-full text-xs font-medium border', typeConfig?.color)}>
                      {typeConfig?.label}
                    </div>
                    <div>
                      <p className="font-medium">
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
                      </p>
                      <p className="text-sm text-muted-foreground">{request.reason}</p>
                    </div>
                  </div>

                  <div className={cn('flex items-center gap-2 px-3 py-1 rounded-full self-start md:self-auto', config.bg)}>
                    <StatusIcon className={cn('w-4 h-4', config.color)} />
                    <span className={cn('text-sm font-medium', config.color)}>{config.label}</span>
                  </div>
                </motion.div>
              );
            })}

            {requests.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No leave requests yet</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};
