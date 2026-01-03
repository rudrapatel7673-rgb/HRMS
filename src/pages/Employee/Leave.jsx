import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CalendarDays, Send, Clock, CheckCircle, XCircle } from 'lucide-react';

const Leave = () => {
  const [leaveType, setLeaveType] = useState('sick');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [leaves, setLeaves] = useState([
    { id: 1, type: 'Sick Leave', start: '2024-03-10', end: '2024-03-11', status: 'approved' },
    { id: 2, type: 'Casual Leave', start: '2024-02-15', end: '2024-02-16', status: 'rejected' },
  ]);
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage('');

    if (!startDate || !endDate || !reason) {
      setMessage('Please fill in all fields');
      return;
    }

    if (new Date(startDate) > new Date(endDate)) {
      setMessage('End date cannot be before start date');
      return;
    }

    const newLeave = {
      id: Date.now(),
      type: leaveType === 'sick' ? 'Sick Leave' : 'Casual Leave',
      start: startDate,
      end: endDate,
      status: 'pending'
    };

    setLeaves([newLeave, ...leaves]);
    setStartDate('');
    setEndDate('');
    setReason('');
    // Show success msg (can be toast in real app)
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'text-green-600 bg-green-50 border-green-100';
      case 'rejected': return 'text-red-600 bg-red-50 border-red-100';
      default: return 'text-amber-600 bg-amber-50 border-amber-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved': return <CheckCircle size={16} />;
      case 'rejected': return <XCircle size={16} />;
      default: return <Clock size={16} />;
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="glass-card"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
            <CalendarDays size={24} />
          </div>
          <h2 className="text-xl font-bold text-gray-800">Apply for Leave</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {message && (
            <div className="p-3 bg-red-50 text-red-500 text-sm rounded-lg border border-red-100">
              {message}
            </div>
          )}

          <div className="space-y-1">
            <label className="label">Leave Type</label>
            <select
              value={leaveType}
              onChange={(e) => setLeaveType(e.target.value)}
              className="input-field"
            >
              <option value="sick">Sick Leave</option>
              <option value="casual">Casual Leave</option>
              <option value="unpaid">Unpaid Leave</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="label">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="input-field"
              />
            </div>
            <div className="space-y-1">
              <label className="label">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="input-field"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="label">Reason</label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="input-field h-32 resize-none"
              placeholder="Please elaborate on your reason..."
            ></textarea>
          </div>

          <button className="btn btn-primary w-full justify-center">
            Submit Request <Send size={18} />
          </button>
        </form>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card"
      >
        <h2 className="text-xl font-bold text-gray-800 mb-6">Leave History</h2>
        <div className="space-y-3">
          {leaves.map((leave) => (
            <div
              key={leave.id}
              className="p-4 rounded-xl border border-gray-100 hover:border-gray-200 bg-white/50 transition-colors"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-gray-800">{leave.type}</h3>
                <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusColor(leave.status)}`}>
                  {getStatusIcon(leave.status)}
                  <span className="capitalize">{leave.status}</span>
                </div>
              </div>
              <p className="text-sm text-gray-500">
                {new Date(leave.start).toLocaleDateString()} - {new Date(leave.end).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Leave;
