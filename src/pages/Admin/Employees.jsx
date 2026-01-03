import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion'; // eslint-disable-line no-unused-vars
import { User, MoreVertical, Mail, Phone, Briefcase } from 'lucide-react';
import { supabase } from '../../lib/supabase';

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmployees = async () => {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .order('full_name', { ascending: true });

      if (data) setEmployees(data);
      setLoading(false);
    };

    fetchEmployees();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Employee Directory</h1>
        <button className="btn btn-primary">Add Employee</button>
      </div>

      {loading ? (
        <p className="text-center py-12 text-gray-500">Loading Directory...</p>
      ) : employees.length === 0 ? (
        <div className="glass-card text-center py-12">
          <p className="text-gray-500 text-lg font-medium">No employees found in the directory.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {employees.map((emp, index) => (
            <motion.div
              key={emp.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass-card group"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center text-indigo-700 font-bold text-lg">
                  {emp.full_name?.charAt(0)}
                </div>
                <button className="text-gray-400 hover:text-gray-600">
                  <MoreVertical size={20} />
                </button>
              </div>

              <h3 className="font-bold text-gray-800">{emp.full_name}</h3>
              <p className="text-indigo-600 text-sm font-medium mb-1">{emp.role}</p>
              <p className="text-xs text-gray-400 mb-4 font-mono">{emp.employee_id}</p>

              <div className="space-y-2 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <Mail size={16} /> {emp.email}
                </div>
                <div className="flex items-center gap-2">
                  <Briefcase size={16} /> Joined: {new Date(emp.created_at).toLocaleDateString()}
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                <span className="px-2 py-1 rounded-full text-xs font-semibold bg-green-50 text-green-600">
                  Active
                </span>
                <button className="text-sm font-semibold text-indigo-600 hover:underline">
                  View Profile
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Employees;
