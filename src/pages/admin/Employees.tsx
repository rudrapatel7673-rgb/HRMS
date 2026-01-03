import { useState } from 'react';
import { Search, Plus, Mail, Phone, Building, ExternalLink, Filter } from 'lucide-react';
import AdminLayout from '@/components/Layout/AdminLayout';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from 'framer-motion';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const employeesData = [
  { id: 'EMP-001', name: 'John Doe', email: 'john.doe@company.com', phone: '+1 555-0101', department: 'Engineering', designation: 'Senior Developer', status: 'Active', color: 'bg-blue-50 text-blue-700' },
  { id: 'EMP-002', name: 'Sarah Johnson', email: 'sarah.j@company.com', phone: '+1 555-0102', department: 'Design', designation: 'UI/UX Designer', status: 'Active', color: 'bg-purple-50 text-purple-700' },
  { id: 'EMP-003', name: 'Mike Chen', email: 'mike.chen@company.com', phone: '+1 555-0103', department: 'Engineering', designation: 'Full Stack Developer', status: 'On Leave', color: 'bg-orange-50 text-orange-700' },
  { id: 'EMP-004', name: 'Emily Davis', email: 'emily.d@company.com', phone: '+1 555-0104', department: 'Marketing', designation: 'Marketing Manager', status: 'Active', color: 'bg-pink-50 text-pink-700' },
  { id: 'EMP-005', name: 'Robert Wilson', email: 'robert.w@company.com', phone: '+1 555-0105', department: 'HR', designation: 'HR Specialist', status: 'Active', color: 'bg-green-50 text-green-700' },
  { id: 'EMP-006', name: 'James Wilson', email: 'james.w@company.com', phone: '+1 555-0106', department: 'Sales', designation: 'Sales Representative', status: 'Active', color: 'bg-cyan-50 text-cyan-700' },
  { id: 'EMP-007', name: 'Patricia Garcia', email: 'patricia.g@company.com', phone: '+1 555-0107', department: 'Finance', designation: 'Accountant', status: 'Active', color: 'bg-yellow-50 text-yellow-700' },
  { id: 'EMP-008', name: 'Michael Brown', email: 'michael.b@company.com', phone: '+1 555-0108', department: 'Engineering', designation: 'DevOps Engineer', status: 'Active', color: 'bg-indigo-50 text-indigo-700' },
];

const Employees = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('');

  const filteredEmployees = employeesData.filter(emp => {
    const matchesSearch = emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = !filterDepartment || emp.department === filterDepartment;
    return matchesSearch && matchesDepartment;
  });

  const departments = [...new Set(employeesData.map(emp => emp.department))];

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('');
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <AdminLayout>
      <div className="space-y-8 p-1">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-foreground bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">Employee Management</h2>
            <p className="text-muted-foreground mt-1">Manage your team members and their information</p>
          </div>
          <Button className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all hover:scale-105">
            <Plus className="w-4 h-4 mr-2" />
            Add Employee
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 items-center bg-white/50 backdrop-blur-md p-4 rounded-xl border border-white/20 shadow-sm">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search employees..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 w-full bg-white/50 border-white/20 focus:bg-white transition-all"
            />
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <Select value={filterDepartment} onValueChange={setFilterDepartment}>
              <SelectTrigger className="w-[180px] bg-white/50 border-white/20 backdrop-blur-sm">
                <SelectValue placeholder="All Departments" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {departments.map((dept) => (
                  <SelectItem key={dept} value={dept}>
                    {dept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Employee Grid */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {filteredEmployees.map((employee) => (
            <motion.div key={employee.id} variants={item}>
              <div className="group relative bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
                {/* Decorative Top Gradient */}
                <div className={`absolute top-0 left-0 w-full h-24 opacity-20 ${employee.color.replace('text', 'bg').replace('50', '500')}`} />

                <div className="relative flex flex-col items-center">
                  <Avatar className="h-20 w-20 border-4 border-white shadow-md mb-4">
                    <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${employee.name}`} alt={employee.name} />
                    <AvatarFallback className={`${employee.color} font-bold text-xl`}>
                      {getInitials(employee.name)}
                    </AvatarFallback>
                  </Avatar>

                  <div className="text-center mb-4">
                    <h3 className="font-bold text-lg text-slate-800">{employee.name}</h3>
                    <p className="text-sm text-slate-500 font-medium">{employee.designation}</p>
                    <Badge variant="secondary" className="mt-2 bg-slate-100 text-slate-600 hover:bg-slate-200">
                      {employee.department}
                    </Badge>
                  </div>

                  <div className="w-full space-y-3 pt-4 border-t border-slate-100">
                    <div className="flex items-center text-sm text-slate-600">
                      <Mail className="w-4 h-4 mr-3 text-slate-400" />
                      <span className="truncate">{employee.email}</span>
                    </div>
                    <div className="flex items-center text-sm text-slate-600">
                      <Phone className="w-4 h-4 mr-3 text-slate-400" />
                      <span>{employee.phone}</span>
                    </div>
                  </div>

                  <div className="w-full flex items-center justify-between mt-6 pt-4 border-t border-slate-100">
                    <Badge
                      variant={employee.status === 'Active' ? 'default' : 'secondary'}
                      className={employee.status === 'Active' ? 'bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 shadow-none' : ''}
                    >
                      {employee.status}
                    </Badge>
                    <Button variant="ghost" size="sm" className="text-slate-400 hover:text-primary">
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </AdminLayout>
  );
};

export default Employees;


