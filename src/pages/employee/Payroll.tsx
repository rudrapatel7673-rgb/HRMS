import { Download, FileText, DollarSign } from 'lucide-react';
import EmployeeLayout from '@/components/Layout/EmployeeLayout';

const salaryHistory = [
  { month: 'December 2025', grossSalary: '$8,500', deductions: '$1,275', netSalary: '$7,225', status: 'Paid' },
  { month: 'November 2025', grossSalary: '$8,500', deductions: '$1,275', netSalary: '$7,225', status: 'Paid' },
  { month: 'October 2025', grossSalary: '$8,500', deductions: '$1,275', netSalary: '$7,225', status: 'Paid' },
  { month: 'September 2025', grossSalary: '$8,000', deductions: '$1,200', netSalary: '$6,800', status: 'Paid' },
];

const currentSalaryBreakdown = {
  basic: '$6,000',
  hra: '$1,500',
  transport: '$500',
  bonus: '$500',
  tax: '$850',
  insurance: '$200',
  pf: '$225',
};

const Payroll = () => {
  return (
    <EmployeeLayout>
      <div className="space-y-6 fade-in">
        {/* Current Month Summary */}
        <div className="dashboard-card bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <p className="text-muted-foreground mb-1">Current Month</p>
              <h2 className="text-3xl font-bold text-foreground">January 2026</h2>
              <p className="text-sm text-muted-foreground mt-1">Salary will be credited on Jan 5, 2026</p>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-center lg:text-right">
                <p className="text-sm text-muted-foreground">Net Salary</p>
                <p className="text-3xl font-bold text-primary">$7,225</p>
              </div>
              <button className="btn-primary">
                <Download className="w-4 h-4 mr-2" />
                Download Slip
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Salary Breakdown */}
          <div className="dashboard-card">
            <h3 className="section-title mb-6">Salary Breakdown</h3>
            
            {/* Earnings */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-success mb-4 flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                Earnings
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-border">
                  <span className="text-muted-foreground">Basic Salary</span>
                  <span className="font-medium text-foreground">{currentSalaryBreakdown.basic}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-border">
                  <span className="text-muted-foreground">HRA</span>
                  <span className="font-medium text-foreground">{currentSalaryBreakdown.hra}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-border">
                  <span className="text-muted-foreground">Transport Allowance</span>
                  <span className="font-medium text-foreground">{currentSalaryBreakdown.transport}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-border">
                  <span className="text-muted-foreground">Performance Bonus</span>
                  <span className="font-medium text-foreground">{currentSalaryBreakdown.bonus}</span>
                </div>
                <div className="flex justify-between items-center py-2 bg-success/5 px-3 rounded-lg">
                  <span className="font-medium text-foreground">Total Earnings</span>
                  <span className="font-bold text-success">$8,500</span>
                </div>
              </div>
            </div>

            {/* Deductions */}
            <div>
              <h4 className="text-sm font-medium text-destructive mb-4 flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                Deductions
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-border">
                  <span className="text-muted-foreground">Income Tax</span>
                  <span className="font-medium text-foreground">-{currentSalaryBreakdown.tax}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-border">
                  <span className="text-muted-foreground">Health Insurance</span>
                  <span className="font-medium text-foreground">-{currentSalaryBreakdown.insurance}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-border">
                  <span className="text-muted-foreground">Provident Fund</span>
                  <span className="font-medium text-foreground">-{currentSalaryBreakdown.pf}</span>
                </div>
                <div className="flex justify-between items-center py-2 bg-destructive/5 px-3 rounded-lg">
                  <span className="font-medium text-foreground">Total Deductions</span>
                  <span className="font-bold text-destructive">-$1,275</span>
                </div>
              </div>
            </div>
          </div>

          {/* Salary History */}
          <div className="dashboard-card">
            <h3 className="section-title mb-6">Salary History</h3>
            <div className="space-y-4">
              {salaryHistory.map((record, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <FileText className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{record.month}</p>
                      <p className="text-sm text-muted-foreground">Net: {record.netSalary}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="status-approved">{record.status}</span>
                    <button className="p-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors">
                      <Download className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </EmployeeLayout>
  );
};

export default Payroll;
