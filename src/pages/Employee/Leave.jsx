import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion'; // eslint-disable-line no-unused-vars
import { CalendarDays, Send, Clock, CheckCircle, XCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';

const Leave = () => {
  const { user } = useAuth();
  const [leaveType, setLeaveType] = useState('Sick');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const fetchLeaves = useCallback(async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from('leave_requests')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (!error) setLeaves(data);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    if (user) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchLeaves();
    }
  }, [user, fetchLeaves]);

  const handleSubmit = async (e) => {
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

    const { error } = await supabase
      .from('leave_requests')
      .insert([{
        user_id: user.id,
        leave_type: leaveType,
        start_date: startDate,
        end_date: endDate,
        reason: reason,
        status: 'Pending'
      }]);

    if (!error) {
      setStartDate('');
      setEndDate('');
      setReason('');
      fetchLeaves();
      setMessage('Leave request submitted successfully!');
    } else {
      setMessage('Error: ' + error.message);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Approved': return 'text-green-600 bg-green-50 border-green-100';
      case 'Rejected': return 'text-red-600 bg-red-50 border-red-100';
      default: return 'text-amber-600 bg-amber-50 border-amber-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Approved': return <CheckCircle size={16} />;
      case 'Rejected': return <XCircle size={16} />;
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
            <div className={`p-3 text-sm rounded-lg border ${message.includes('success') ? 'bg-green-50 text-green-600 border-green-100' : 'bg-red-50 text-red-500 border-red-100'}`}>
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
              <option value="Sick">Sick Leave</option>
              <option value="Paid">Paid Leave</option>
              <option value="Unpaid">Unpaid Leave</option>
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
          {loading ? (
            <p className="text-center text-gray-500">Loading...</p>
          ) : leaves.length === 0 ? (
            <p className="text-center text-gray-500">No leave requests found.</p>
          ) : (
            leaves.map((leave) => (
              <div
                key={leave.leave_id}
                className="p-4 rounded-xl border border-gray-100 hover:border-gray-200 bg-white/50 transition-colors"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-gray-800">{leave.leave_type}</h3>
                  <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusColor(leave.status)}`}>
                    {getStatusIcon(leave.status)}
                    <span className="capitalize">{leave.status}</span>
                  </div>
                </div>
                <p className="text-sm text-gray-500">
                  {new Date(leave.start_date).toLocaleDateString()} - {new Date(leave.end_date).toLocaleDateString()}
                </p>
                {leave.admin_comment && (
                  <p className="text-xs text-gray-400 mt-2 italic">Comment: {leave.admin_comment}</p>
                )}
              </div>
            ))
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Leave;
