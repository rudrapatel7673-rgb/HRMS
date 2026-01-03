import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion'; // eslint-disable-line no-unused-vars
import { Clock, Calendar, CheckCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';

const Dashboard = () => {
  const { user } = useAuth();
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivity = async () => {
      if (!user) return;
      const { data } = await supabase
        .from('attendance')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false })
        .order('check_in', { ascending: false })
        .limit(5);

      if (data) setRecentActivity(data);
      setLoading(false);
    };

    fetchActivity();
  }, [user]);

  const stats = [
    { label: 'Attendance', value: '92%', icon: Clock, color: 'from-blue-500 to-cyan-400' },
    { label: 'Leave Balance', value: '12 Days', icon: Calendar, color: 'from-purple-500 to-pink-400' },
    { label: 'Tasks', value: '5 Pending', icon: CheckCircle, color: 'from-amber-400 to-orange-500' },
  ];

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card bg-gradient-to-r from-indigo-500 to-purple-600 text-white"
      >
        <h1 className="text-3xl font-bold mb-2">Good Morning, {user?.full_name || 'User'}!</h1>
        <p className="opacity-90">Have a productive day ahead.</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass-card"
          >
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} text-white shadow-md`}>
                <stat.icon size={24} />
              </div>
              <div>
                <p className="text-gray-500 text-sm font-medium">{stat.label}</p>
                <h3 className="text-2xl font-bold text-gray-800">{stat.value}</h3>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="glass-card"
        >
          <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {loading ? (
              <p className="text-gray-500 text-sm">Loading activity...</p>
            ) : recentActivity.length === 0 ? (
              <p className="text-gray-500 text-sm">No recent activity found.</p>
            ) : (
              recentActivity.map((log) => (
                <div key={log.attendance_id} className="flex items-center gap-4 p-3 hover:bg-white/50 rounded-xl transition-colors">
                  <div className={`w-2 h-2 rounded-full ${!log.check_out ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <div>
                    <p className="font-medium text-gray-800">
                      Checked {!log.check_out ? 'in' : 'out'} at {log.check_in || log.check_out}
                    </p>
                    <p className="text-xs text-gray-500">{log.date}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="glass-card"
        >
          <h2 className="text-xl font-bold mb-4">Upcoming Holidays</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-indigo-50 rounded-xl border border-indigo-100">
              <div className="flex items-center gap-3">
                <Calendar className="text-indigo-500" size={20} />
                <span className="font-medium text-gray-800">Republic Day</span>
              </div>
              <span className="text-sm text-indigo-600 font-semibold">26 Jan</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
