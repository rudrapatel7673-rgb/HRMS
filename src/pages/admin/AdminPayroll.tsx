import { useState } from 'react';
import { Search, Download, FileText, DollarSign, Edit2, Save } from 'lucide-react';
import AdminLayout from '@/components/layout/AdminLayout';

const payrollData = [
  { id: 'EMP-001', name: 'John Doe', department: 'Engineering', grossSalary: 8500, deductions: 1275, netSalary: 7225, status: 'Processed' },
  { id: 'EMP-002', name: 'Sarah Johnson', department: 'Design', grossSalary: 7500, deductions: 1125, netSalary: 6375, status: 'Processed' },
  { id: 'EMP-003', name: 'Mike Chen', department: 'Engineering', grossSalary: 7000, deductions: 1050, netSalary: 5950, status: 'Pending' },
  { id: 'EMP-004', name: 'Emily Davis', department: 'Marketing', grossSalary: 8000, deductions: 1200, netSalary: 6800, status: 'Pending' },
  { id: 'EMP-005', name: 'Robert Wilson', department: 'HR', grossSalary: 6500, deductions: 975, netSalary: 5525, status: 'Processed' },
];

const AdminPayroll = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('January');
  const [selectedYear, setSelectedYear] = useState('2026');

  const filteredData = payrollData.filter(emp =>
    emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPayroll = payrollData.reduce((sum, emp) => sum + emp.netSalary, 0);
  const processedCount = payrollData.filter(e => e.status === 'Processed').length;
  const pendingCount = payrollData.filter(e => e.status === 'Pending').length;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  return (
    <AdminLayout>
      <div className="space-y-6 fade-in">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="dashboard-card">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Payroll</p>
                <p className="text-2xl font-bold text-foreground">{formatCurrency(totalPayroll)}</p>
              </div>
            </div>
          </div>
          <div className="dashboard-card">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
                <FileText className="w-6 h-6 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Processed</p>
                <p className="text-2xl font-bold text-foreground">{processedCount} employees</p>
              </div>
            </div>
          </div>
          <div className="dashboard-card">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center">
                <FileText className="w-6 h-6 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold text-foreground">{pendingCount} employees</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="dashboard-card">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search employees..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-input pl-12"
              />
            </div>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="form-input lg:w-40"
            >
              {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map(month => (
                <option key={month} value={month}>{month}</option>
              ))}
            </select>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="form-input lg:w-32"
            >
              <option value="2026">2026</option>
              <option value="2025">2025</option>
            </select>
            <button className="btn-primary">
              Process Payroll
            </button>
          </div>
        </div>

        {/* Payroll Table */}
        <div className="dashboard-card overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="table-header">Employee</th>
                  <th className="table-header">Department</th>
                  <th className="table-header text-right">Gross Salary</th>
                  <th className="table-header text-right">Deductions</th>
                  <th className="table-header text-right">Net Salary</th>
                  <th className="table-header">Status</th>
                  <th className="table-header">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredData.map((employee) => (
                  <tr key={employee.id} className="hover:bg-muted/50 transition-colors">
                    <td className="table-cell">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold">
                          {employee.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{employee.name}</p>
                          <p className="text-sm text-muted-foreground">{employee.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="table-cell">{employee.department}</td>
                    <td className="table-cell text-right font-medium">{formatCurrency(employee.grossSalary)}</td>
                    <td className="table-cell text-right text-destructive">-{formatCurrency(employee.deductions)}</td>
                    <td className="table-cell text-right font-bold text-success">{formatCurrency(employee.netSalary)}</td>
                    <td className="table-cell">
                      <span className={employee.status === 'Processed' ? 'status-approved' : 'status-pending'}>
                        {employee.status}
                      </span>
                    </td>
                    <td className="table-cell">
                      <div className="flex gap-2">
                        <button className="p-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button className="p-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors">
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
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

export default AdminPayroll;
