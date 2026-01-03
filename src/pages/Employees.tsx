import { useState } from 'react';
import { motion } from 'framer-motion';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  Search,
  Users,
  Mail,
  Phone,
  Building,
  MoreVertical,
  Eye,
} from 'lucide-react';

interface Employee {
  id: string;
  name: string;
  email: string;
  employeeId: string;
  department: string;
  position: string;
  status: 'active' | 'on-leave' | 'inactive';
  joinDate: string;
  avatar?: string;
}

const mockEmployees: Employee[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@dayflow.com',
    employeeId: 'EMP001',
    department: 'Engineering',
    position: 'Software Developer',
    status: 'active',
    joinDate: '2023-06-15',
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@dayflow.com',
    employeeId: 'EMP002',
    department: 'Design',
    position: 'UI/UX Designer',
    status: 'active',
    joinDate: '2023-08-20',
  },
  {
    id: '3',
    name: 'Mike Johnson',
    email: 'mike@dayflow.com',
    employeeId: 'EMP003',
    department: 'Marketing',
    position: 'Marketing Manager',
    status: 'on-leave',
    joinDate: '2022-11-10',
  },
  {
    id: '4',
    name: 'Emily Brown',
    email: 'emily@dayflow.com',
    employeeId: 'EMP004',
    department: 'Engineering',
    position: 'Senior Developer',
    status: 'active',
    joinDate: '2021-03-25',
  },
  {
    id: '5',
    name: 'Alex Wilson',
    email: 'alex@dayflow.com',
    employeeId: 'EMP005',
    department: 'Sales',
    position: 'Sales Executive',
    status: 'active',
    joinDate: '2024-01-08',
  },
  {
    id: '6',
    name: 'Lisa Anderson',
    email: 'lisa@dayflow.com',
    employeeId: 'EMP006',
    department: 'HR',
    position: 'HR Specialist',
    status: 'inactive',
    joinDate: '2022-05-15',
  },
];

const statusConfig = {
  active: { color: 'bg-success text-success-foreground', label: 'Active' },
  'on-leave': { color: 'bg-warning text-warning-foreground', label: 'On Leave' },
  inactive: { color: 'bg-muted text-muted-foreground', label: 'Inactive' },
};

const departments = ['All', 'Engineering', 'Design', 'Marketing', 'Sales', 'HR'];

export const Employees = () => {
  const [search, setSearch] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');

  const filteredEmployees = mockEmployees.filter((emp) => {
    const matchesSearch =
      emp.name.toLowerCase().includes(search.toLowerCase()) ||
      emp.email.toLowerCase().includes(search.toLowerCase()) ||
      emp.employeeId.toLowerCase().includes(search.toLowerCase());
    const matchesDept = selectedDept === 'All' || emp.department === selectedDept;
    return matchesSearch && matchesDept;
  });

  const stats = {
    total: mockEmployees.length,
    active: mockEmployees.filter((e) => e.status === 'active').length,
    onLeave: mockEmployees.filter((e) => e.status === 'on-leave').length,
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold">Employees</h1>
          <p className="text-muted-foreground">Manage your team members</p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Total Employees', value: stats.total, icon: Users },
            { label: 'Active', value: stats.active, color: 'text-success' },
            { label: 'On Leave', value: stats.onLeave, color: 'text-warning' },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass-card rounded-2xl p-4"
            >
              <p className={cn('text-3xl font-bold', stat.color)}>{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col md:flex-row gap-4"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search employees..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 h-12"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {departments.map((dept) => (
              <Button
                key={dept}
                variant={selectedDept === dept ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedDept(dept)}
              >
                {dept}
              </Button>
            ))}
          </div>
        </motion.div>

        {/* Employee Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEmployees.map((employee, index) => (
            <motion.div
              key={employee.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              className="glass-card rounded-2xl p-6 hover-lift"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl gradient-primary flex items-center justify-center text-xl font-bold text-primary-foreground">
                    {employee.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-semibold">{employee.name}</h3>
                    <p className="text-sm text-muted-foreground">{employee.position}</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="w-4 h-4" />
                  <span>{employee.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Building className="w-4 h-4" />
                  <span>{employee.department}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="font-mono">{employee.employeeId}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-border">
                <span className={cn('px-3 py-1 rounded-full text-xs font-medium', statusConfig[employee.status].color)}>
                  {statusConfig[employee.status].label}
                </span>
                <Button variant="ghost" size="sm" className="gap-2">
                  <Eye className="w-4 h-4" />
                  View
                </Button>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredEmployees.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Users className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <p className="text-muted-foreground">No employees found matching your criteria</p>
          </motion.div>
        )}
      </div>
    </DashboardLayout>
  );
};
