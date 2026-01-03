import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion'; // eslint-disable-line no-unused-vars
import { Check, X, Calendar, Clock } from 'lucide-react';
import { supabase } from '../../lib/supabase';

const Approvals = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    const { data } = await supabase
      .from('leave_requests')
      .select('*, profiles(full_name, employee_id)')
      .eq('status', 'Pending')
      .order('created_at', { ascending: true });

    if (data) setRequests(data);
    setLoading(false);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchRequests();
  }, []);

  const handleAction = async (id, status) => {
    const { error } = await supabase
      .from('leave_requests')
      .update({ status: status })
      .eq('leave_id', id);

    if (!error) {
      fetchRequests();
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Pending Approvals</h1>

      {loading ? (
        <p className="text-center py-12">Loading...</p>
      ) : requests.length === 0 ? (
        <div className="glass-card text-center py-12">
          <div className="w-16 h-16 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check size={32} />
          </div>
          <h3 className="text-lg font-bold text-gray-700">All Caught Up!</h3>
          <p className="text-gray-500">No pending leave requests.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map((req, index) => (
            <motion.div
              key={req.leave_id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass-card flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-600">
                  {req.profiles?.full_name?.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-gray-800">{req.profiles?.full_name}</h3>
                  <p className="text-xs text-gray-400">ID: {req.profiles?.employee_id}</p>
                  <p className="text-sm text-indigo-600 font-medium">{req.leave_type}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
                    <span className="flex items-center gap-1"><Calendar size={14} /> {req.start_date} to {req.end_date}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-2 bg-gray-50 p-2 rounded-lg">"{req.reason}"</p>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto">
                <button
                  onClick={() => handleAction(req.leave_id, 'Rejected')}
                  className="flex-1 md:flex-none btn border border-red-200 text-red-600 hover:bg-red-50"
                >
                  <X size={18} /> Reject
                </button>
                <button
                  onClick={() => handleAction(req.leave_id, 'Approved')}
                  className="flex-1 md:flex-none btn bg-green-500 text-white hover:bg-green-600 shadow-md"
                >
                  <Check size={18} /> Approve
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Approvals;
