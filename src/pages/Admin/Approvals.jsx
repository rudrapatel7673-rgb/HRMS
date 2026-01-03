import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, X, Calendar, Clock } from 'lucide-react';

const Approvals = () => {
  const [requests, setRequests] = useState([
    { id: 1, name: 'Alice Brown', type: 'Sick Leave', start: '2024-03-20', end: '2024-03-22', reason: 'Flu symptoms', status: 'pending' },
    { id: 2, name: 'Bob Wilson', type: 'Casual Leave', start: '2024-04-05', end: '2024-04-06', reason: 'Personal work', status: 'pending' },
  ]);

  const handleAction = (id, action) => {
    setRequests(requests.filter(r => r.id !== id));
    // In a real app, send API request
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Pending Approvals</h1>

      {requests.length === 0 ? (
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
              key={req.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass-card flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-600">
                  {req.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-gray-800">{req.name}</h3>
                  <p className="text-sm text-indigo-600 font-medium">{req.type}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
                    <span className="flex items-center gap-1"><Calendar size={14} /> {req.start} to {req.end}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-2 bg-gray-50 p-2 rounded-lg">"{req.reason}"</p>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto">
                <button
                  onClick={() => handleAction(req.id, 'reject')}
                  className="flex-1 md:flex-none btn border border-red-200 text-red-600 hover:bg-red-50"
                >
                  <X size={18} /> Reject
                </button>
                <button
                  onClick={() => handleAction(req.id, 'approve')}
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
