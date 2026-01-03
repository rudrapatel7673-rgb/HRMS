import React from 'react';
import { motion } from 'framer-motion';
import { User, MoreVertical, Mail, Phone } from 'lucide-react';

const Employees = () => {
  // Mock data
  const employees = [
    { id: 1, name: 'John Doe', role: 'Software Engineer', email: 'john@company.com', status: 'Active' },
    { id: 2, name: 'Jane Smith', role: 'Product Manager', email: 'jane@company.com', status: 'Active' },
    { id: 3, name: 'Mike Johnson', role: 'Designer', email: 'mike@company.com', status: 'On Leave' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Employee Directory</h1>
        <button className="btn btn-primary">Add Employee</button>
      </div>

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
                {emp.name.charAt(0)}
              </div>
              <button className="text-gray-400 hover:text-gray-600">
                <MoreVertical size={20} />
              </button>
            </div>

            <h3 className="font-bold text-gray-800">{emp.name}</h3>
            <p className="text-indigo-600 text-sm font-medium mb-4">{emp.role}</p>

            <div className="space-y-2 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <Mail size={16} /> {emp.email}
              </div>
              <div className="flex items-center gap-2">
                <Phone size={16} /> +1 234 567 890
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${emp.status === 'Active' ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'
                }`}>
                {emp.status}
              </span>
              <button className="text-sm font-semibold text-indigo-600 hover:underline">
                View Profile
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Employees;
