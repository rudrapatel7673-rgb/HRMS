import { useState } from 'react';
import { Search, Calendar, Download, Filter } from 'lucide-react';
import AdminLayout from '@/components/Layout/AdminLayout';

const attendanceData = [
  { id: 'EMP-001', name: 'John Doe', date: 'Jan 3, 2026', checkIn: '09:15 AM', checkOut: '06:30 PM', status: 'Present' },
  { id: 'EMP-002', name: 'Sarah Johnson', date: 'Jan 3, 2026', checkIn: '09:08 AM', checkOut: '06:15 PM', status: 'Present' },
  { id: 'EMP-003', name: 'Mike Chen', date: 'Jan 3, 2026', checkIn: '-', checkOut: '-', status: 'Leave' },
  { id: 'EMP-004', name: 'Emily Davis', date: 'Jan 3, 2026', checkIn: '09:45 AM', checkOut: '06:00 PM', status: 'Late' },
  { id: 'EMP-005', name: 'Robert Wilson', date: 'Jan 3, 2026', checkIn: '08:55 AM', checkOut: '05:30 PM', status: 'Present' },
  { id: 'EMP-006', name: 'Lisa Thompson', date: 'Jan 3, 2026', checkIn: '-', checkOut: '-', status: 'Absent' },
];

const AdminAttendance = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const filteredData = attendanceData.filter(record => {
    const matchesSearch = record.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          record.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !filterStatus || record.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Present':
        return 'status-approved';
      case 'Leave':
        return 'status-pending';
      case 'Late':
        return 'bg-warning/10 text-warning';
      case 'Absent':
        return 'status-rejected';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const statusCounts = {
    present: attendanceData.filter(r => r.status === 'Present').length,
    leave: attendanceData.filter(r => r.status === 'Leave').length,
    late: attendanceData.filter(r => r.status === 'Late').length,
    absent: attendanceData.filter(r => r.status === 'Absent').length,
  };

  return (
    <AdminLayout>
      <div className="space-y-6 fade-in">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="dashboard-card text-center">
            <p className="text-2xl font-bold text-success">{statusCounts.present}</p>
            <p className="text-sm text-muted-foreground">Present</p>
          </div>
          <div className="dashboard-card text-center">
            <p className="text-2xl font-bold text-warning">{statusCounts.leave}</p>
            <p className="text-sm text-muted-foreground">On Leave</p>
          </div>
          <div className="dashboard-card text-center">
            <p className="text-2xl font-bold text-info">{statusCounts.late}</p>
            <p className="text-sm text-muted-foreground">Late</p>
          </div>
          <div className="dashboard-card text-center">
            <p className="text-2xl font-bold text-destructive">{statusCounts.absent}</p>
            <p className="text-sm text-muted-foreground">Absent</p>
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
            <div className="relative">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="form-input pl-12"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="form-input lg:w-40"
            >
              <option value="">All Status</option>
              <option value="Present">Present</option>
              <option value="Leave">Leave</option>
              <option value="Late">Late</option>
              <option value="Absent">Absent</option>
            </select>
            <button className="btn-secondary">
              <Download className="w-4 h-4 mr-2" />
              Export
            </button>
          </div>
        </div>

        {/* Attendance Table */}
        <div className="dashboard-card overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="table-header">Employee</th>
                  <th className="table-header">Date</th>
                  <th className="table-header">Check In</th>
                  <th className="table-header">Check Out</th>
                  <th className="table-header">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredData.map((record, index) => (
                  <tr key={index} className="hover:bg-muted/50 transition-colors">
                    <td className="table-cell">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold">
                          {record.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{record.name}</p>
                          <p className="text-sm text-muted-foreground">{record.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="table-cell">{record.date}</td>
                    <td className="table-cell font-medium">{record.checkIn}</td>
                    <td className="table-cell font-medium">{record.checkOut}</td>
                    <td className="table-cell">
                      <span className={getStatusBadge(record.status)}>
                        {record.status}
                      </span>
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

export default AdminAttendance;
