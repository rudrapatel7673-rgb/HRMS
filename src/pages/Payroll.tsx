import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import {
  DollarSign,
  Download,
  Calendar,
  TrendingUp,
  Minus,
  Plus,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { payrollApi } from '@/services/api';
import { Payroll as PayrollType } from '@/types';

export const Payroll = () => {
  const { user } = useAuth();
  const [payrollHistory, setPayrollHistory] = useState<PayrollType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPayroll = async () => {
      if (!user) return;
      try {
        const data = await payrollApi.getHistory(user.id);
        setPayrollHistory(data);
      } catch (error) {
        console.error('Failed to fetch payroll:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPayroll();
  }, [user]);

  const currentPayroll = payrollHistory.length > 0 ? payrollHistory[0] : null;

  // Calculate Year Summary (for the current year of the latest record, or current real year)
  const currentYear = currentPayroll?.year || new Date().getFullYear();
  const yearRecords = payrollHistory.filter(r => r.year === currentYear);

  const yearSummary = {
    totalEarned: yearRecords.reduce((acc, r) => acc + (r.basic_salary || 0), 0),
    totalAllowances: yearRecords.reduce((acc, r) => acc + (r.allowances || 0), 0),
    totalDeductions: yearRecords.reduce((acc, r) => acc + (r.deductions || 0), 0),
    totalNet: yearRecords.reduce((acc, r) => acc + (r.net_salary || 0), 0),
  };

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
          <h1 className="text-3xl font-bold">Payroll</h1>
          <p className="text-muted-foreground">View your salary details and history</p>
        </motion.div>

        {!currentPayroll ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-3xl p-12 text-center"
          >
            <div className="flex justify-center mb-4">
              <DollarSign className="w-12 h-12 text-muted-foreground opacity-50" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No Payroll Records Found</h3>
            <p className="text-muted-foreground">Your salary details will appear here once generated.</p>
          </motion.div>
        ) : (
          <>
            {/* Current Month Summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="gradient-primary rounded-3xl p-8 text-primary-foreground relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0wIDBoNDBWNDBIMHoiLz48Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIyIiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9Ii4xIi8+PC9nPjwvc3ZnPg==')] opacity-30" />

              <div className="relative">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div>
                    <p className="text-primary-foreground/80 mb-1">
                      {currentPayroll.month} {currentPayroll.year}
                    </p>
                    <h2 className="text-4xl md:text-5xl font-bold mb-2">
                      ${currentPayroll.net_salary.toLocaleString()}
                    </h2>
                    <p className="text-primary-foreground/70">Net Salary</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className={cn(
                      'px-4 py-2 rounded-full text-sm font-medium',
                      currentPayroll.status === 'paid'
                        ? 'bg-success/20 text-success'
                        : 'bg-background/20 text-primary-foreground'
                    )}>
                      {currentPayroll.status === 'paid' ? 'Paid' : 'Pending'}
                    </div>
                    <Button
                      size="lg"
                      className="bg-background text-foreground hover:bg-background/90 gap-2"
                    >
                      <Download className="w-4 h-4" />
                      Download Slip
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Salary Breakdown */}
            <div className="grid md:grid-cols-3 gap-6">
              {/* Basic Salary */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="glass-card rounded-2xl p-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Basic Salary</p>
                    <p className="text-2xl font-bold">${currentPayroll.basic_salary.toLocaleString()}</p>
                  </div>
                </div>
              </motion.div>

              {/* Allowances */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="glass-card rounded-2xl p-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
                    <Plus className="w-6 h-6 text-success" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Allowances</p>
                    <p className="text-2xl font-bold text-success">+${currentPayroll.allowances.toLocaleString()}</p>
                  </div>
                </div>
              </motion.div>

              {/* Deductions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="glass-card rounded-2xl p-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-destructive/10 flex items-center justify-center">
                    <Minus className="w-6 h-6 text-destructive" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Deductions</p>
                    <p className="text-2xl font-bold text-destructive">-${currentPayroll.deductions.toLocaleString()}</p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Payment History */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="glass-card rounded-3xl p-6"
            >
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Payment History
              </h2>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Period</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Basic</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Allowances</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Deductions</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Net Salary</th>
                      <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payrollHistory.map((record, index) => (
                      <motion.tr
                        key={`${record.month}-${record.year}`}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * index }}
                        className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
                      >
                        <td className="py-4 px-4 font-medium">
                          {record.month} {record.year}
                        </td>
                        <td className="py-4 px-4 text-right">${record.basic_salary.toLocaleString()}</td>
                        <td className="py-4 px-4 text-right text-success">+${record.allowances.toLocaleString()}</td>
                        <td className="py-4 px-4 text-right text-destructive">-${record.deductions.toLocaleString()}</td>
                        <td className="py-4 px-4 text-right font-bold">${record.net_salary.toLocaleString()}</td>
                        <td className="py-4 px-4 text-center">
                          <span className={cn(
                            'px-3 py-1 rounded-full text-xs font-medium',
                            record.status === 'paid'
                              ? 'bg-success/10 text-success'
                              : 'bg-warning/10 text-warning'
                          )}>
                            {record.status === 'paid' ? 'Paid' : 'Pending'}
                          </span>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>

            {/* Year Summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="glass-card rounded-2xl p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <TrendingUp className="w-5 h-5 text-primary" />
                <h3 className="font-semibold">{currentYear} Year Summary</h3>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div>
                  <p className="text-sm text-muted-foreground">Total Basic</p>
                  <p className="text-2xl font-bold gradient-text">${yearSummary.totalEarned.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Allowances</p>
                  <p className="text-2xl font-bold text-success">${yearSummary.totalAllowances.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Deductions</p>
                  <p className="text-2xl font-bold text-destructive">${yearSummary.totalDeductions.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Net Income</p>
                  <p className="text-2xl font-bold">${yearSummary.totalNet.toLocaleString()}</p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
};
