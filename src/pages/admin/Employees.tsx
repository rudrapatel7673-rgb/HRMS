import { useState } from 'react';
import { Search, Plus, MoreVertical, Mail, Phone, Building } from 'lucide-react';
import AdminLayout from '@/components/layout/AdminLayout';

const employeesData = [
  { id: 'EMP-001', name: 'John Doe', email: 'john.doe@company.com', phone: '+1 555-0101', department: 'Engineering', designation: 'Senior Developer', status: 'Active' },
  { id: 'EMP-002', name: 'Sarah Johnson', email: 'sarah.j@company.com', phone: '+1 555-0102', department: 'Design', designation: 'UI/UX Designer', status: 'Active' },
  { id: 'EMP-003', name: 'Mike Chen', email: 'mike.chen@company.com', phone: '+1 555-0103', department: 'Engineering', designation: 'Full Stack Developer', status: 'On Leave' },
  { id: 'EMP-004', name: 'Emily Davis', email: 'emily.d@company.com', phone: '+1 555-0104', department: 'Marketing', designation: 'Marketing Manager', status: 'Active' },
  { id: 'EMP-005', name: 'Robert Wilson', email: 'robert.w@company.com', phone: '+1 555-0105', department: 'HR', designation: 'HR Specialist', status: 'Active' },
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

  return (
    <AdminLayout>
      <div className="space-y-6 fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Employee Management</h2>
            <p className="text-muted-foreground">Manage your team members and their information</p>
          </div>
          <button className="btn-primary">
            <Plus className="w-4 h-4 mr-2" />
            Add Employee
          </button>
        </div>

        {/* Filters */}
        <div className="dashboard-card">
          <div className="flex flex-col sm:flex-row gap-4">
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
              value={filterDepartment}
              onChange={(e) => setFilterDepartment(e.target.value)}
              className="form-input sm:w-48"
            >
              <option value="">All Departments</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Employee List */}
        <div className="dashboard-card overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="table-header">Employee</th>
                  <th className="table-header">Contact</th>
                  <th className="table-header">Department</th>
                  <th className="table-header">Designation</th>
                  <th className="table-header">Status</th>
                  <th className="table-header">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredEmployees.map((employee) => (
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
                    <td className="table-cell">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="w-4 h-4 text-muted-foreground" />
                          {employee.email}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Phone className="w-4 h-4" />
                          {employee.phone}
                        </div>
                      </div>
                    </td>
                    <td className="table-cell">
                      <div className="flex items-center gap-2">
                        <Building className="w-4 h-4 text-muted-foreground" />
                        {employee.department}
                      </div>
                    </td>
                    <td className="table-cell">{employee.designation}</td>
                    <td className="table-cell">
                      <span className={employee.status === 'Active' ? 'status-approved' : 'status-pending'}>
                        {employee.status}
                      </span>
                    </td>
                    <td className="table-cell">
                      <button className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                        <MoreVertical className="w-5 h-5" />
                      </button>
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

export default Employees;
