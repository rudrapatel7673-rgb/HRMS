import { useState } from 'react';
import { Clock, LogIn, LogOut, Calendar } from 'lucide-react';
import EmployeeLayout from '@/components/Layout/EmployeeLayout';

const attendanceHistory = [
  { date: 'Jan 3, 2026', checkIn: '09:15 AM', checkOut: '06:30 PM', status: 'Present' },
  { date: 'Jan 2, 2026', checkIn: '09:08 AM', checkOut: '06:15 PM', status: 'Present' },
  { date: 'Jan 1, 2026', checkIn: '-', checkOut: '-', status: 'Holiday' },
  { date: 'Dec 31, 2025', checkIn: '09:22 AM', checkOut: '06:45 PM', status: 'Present' },
  { date: 'Dec 30, 2025', checkIn: '-', checkOut: '-', status: 'Leave' },
];

const Attendance = () => {
  const [isCheckedIn, setIsCheckedIn] = useState(true);
  const [checkInTime, setCheckInTime] = useState('09:15 AM');
  const [checkOutTime, setCheckOutTime] = useState<string | null>(null);

  const handleCheckIn = () => {
    const now = new Date();
    setCheckInTime(now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }));
    setIsCheckedIn(true);
  };

  const handleCheckOut = () => {
    const now = new Date();
    setCheckOutTime(now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }));
    setIsCheckedIn(false);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Present':
        return 'status-approved';
      case 'Leave':
        return 'status-pending';
      case 'Holiday':
        return 'bg-info/10 text-info';
      case 'Absent':
        return 'status-rejected';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <EmployeeLayout>
      <div className="space-y-6 fade-in">
        {/* Check In/Out Card */}
        <div className="dashboard-card">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            {/* Current Status */}
            <div className="text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start gap-2 mb-2">
                <Calendar className="w-5 h-5 text-muted-foreground" />
                <span className="text-muted-foreground">
                  {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </span>
              </div>
              <h2 className="text-2xl font-bold text-foreground">
                {isCheckedIn ? 'You are checked in' : 'You are checked out'}
              </h2>
              <div className="flex items-center justify-center lg:justify-start gap-4 mt-3">
                <div className="flex items-center gap-2">
                  <LogIn className="w-4 h-4 text-success" />
                  <span className="text-sm text-muted-foreground">In: {checkInTime || '-'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <LogOut className="w-4 h-4 text-destructive" />
                  <span className="text-sm text-muted-foreground">Out: {checkOutTime || '-'}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                onClick={handleCheckIn}
                disabled={isCheckedIn}
                className={`relative px-8 py-4 rounded-xl font-semibold transition-all duration-300 ${
                  isCheckedIn
                    ? 'bg-muted text-muted-foreground cursor-not-allowed'
                    : 'bg-success text-success-foreground hover:scale-105 pulse-animation'
                }`}
              >
                <div className="flex items-center gap-2">
                  <LogIn className="w-5 h-5" />
                  Check In
                </div>
              </button>
              <button
                onClick={handleCheckOut}
                disabled={!isCheckedIn}
                className={`relative px-8 py-4 rounded-xl font-semibold transition-all duration-300 ${
                  !isCheckedIn
                    ? 'bg-muted text-muted-foreground cursor-not-allowed'
                    : 'bg-destructive text-destructive-foreground hover:scale-105'
                }`}
              >
                <div className="flex items-center gap-2">
                  <LogOut className="w-5 h-5" />
                  Check Out
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="dashboard-card text-center">
            <Clock className="w-8 h-8 mx-auto text-primary mb-2" />
            <p className="text-2xl font-bold text-foreground">22</p>
            <p className="text-sm text-muted-foreground">Days Present</p>
          </div>
          <div className="dashboard-card text-center">
            <Clock className="w-8 h-8 mx-auto text-warning mb-2" />
            <p className="text-2xl font-bold text-foreground">2</p>
            <p className="text-sm text-muted-foreground">Days Leave</p>
          </div>
          <div className="dashboard-card text-center">
            <Clock className="w-8 h-8 mx-auto text-info mb-2" />
            <p className="text-2xl font-bold text-foreground">9:12 AM</p>
            <p className="text-sm text-muted-foreground">Avg Check-in</p>
          </div>
        </div>

        {/* Attendance History */}
        <div className="dashboard-card">
          <h3 className="section-title mb-6">Attendance History</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="table-header">Date</th>
                  <th className="table-header">Check In</th>
                  <th className="table-header">Check Out</th>
                  <th className="table-header">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {attendanceHistory.map((record, index) => (
                  <tr key={index} className="hover:bg-muted/50 transition-colors">
                    <td className="table-cell font-medium">{record.date}</td>
                    <td className="table-cell">{record.checkIn}</td>
                    <td className="table-cell">{record.checkOut}</td>
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
    </EmployeeLayout>
  );
};

export default Attendance;
