import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion'; // eslint-disable-line no-unused-vars
import { Clock, MapPin, AlertCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';

const Attendance = () => {
  const { user } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [status, setStatus] = useState('out'); // 'in' or 'out'
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);

    const fetchLogs = async () => {
      if (!user) return;

      const { data } = await supabase
        .from('attendance')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false })
        .order('check_in', { ascending: false })
        .limit(10);

      if (data) {
        setLogs(data);
        // Determine current status based on the latest log (today)
        const today = new Date().toISOString().split('T')[0];
        const latestLog = data[0];
        if (latestLog && latestLog.date === today && !latestLog.check_out) {
          setStatus('in');
        } else {
          setStatus('out');
        }
      }
      setLoading(false);
    };

    fetchLogs();
    return () => clearInterval(timer);
  }, [user]);

  const handleAction = async () => {
    if (!user) return;

    const fetchLogs = async () => {
      const { data } = await supabase
        .from('attendance')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false })
        .order('check_in', { ascending: false })
        .limit(10);
      if (data) setLogs(data);
    };

    if (status === 'out') {
      // Clock In
      const { error } = await supabase
        .from('attendance')
        .insert([{
          user_id: user.id,
          date: new Date().toISOString().split('T')[0],
          check_in: new Date().toLocaleTimeString('en-GB'),
          status: 'Present'
        }]);

      if (!error) {
        setStatus('in');
        fetchLogs();
      }
    } else {
      // Clock Out
      const latestLog = logs[0];
      if (latestLog) {
        const { error } = await supabase
          .from('attendance')
          .update({ check_out: new Date().toLocaleTimeString('en-GB') })
          .eq('attendance_id', latestLog.attendance_id);

        if (!error) {
          setStatus('out');
          fetchLogs();
        }
      }
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card text-center py-10"
      >
        <div className="mb-6">
          <h2 className="text-gray-500 font-medium uppercase tracking-wider text-sm">Current Time</h2>
          <h1 className="text-5xl font-bold text-gray-800 tabular-nums">
            {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </h1>
          <p className="text-gray-400 mt-2">
            {currentTime.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        <button
          onClick={handleAction}
          disabled={loading}
          className={`
                        w-40 h-40 rounded-full text-xl font-bold shadow-xl transition-all duration-300
                        flex flex-col items-center justify-center gap-2 border-4
                        ${status === 'out'
              ? 'bg-gradient-to-br from-indigo-500 to-blue-600 text-white border-blue-200 hover:scale-105 hover:shadow-blue-500/30'
              : 'bg-white text-red-500 border-red-100 hover:bg-red-50 hover:border-red-200'}
                    `}
        >
          <Clock size={32} />
          {status === 'out' ? 'Check In' : 'Check Out'}
        </button>

        <p className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-500">
          <MapPin size={16} /> Location: Remote / Office
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card"
      >
        <h3 className="font-bold text-lg mb-4">Recent Logs</h3>
        {loading ? (
          <div className="text-center py-8 text-gray-400">Loading...</div>
        ) : logs.length === 0 ? (
          <div className="text-center py-8 text-gray-400 flex flex-col items-center gap-2">
            <AlertCircle size={24} />
            No activity yet
          </div>
        ) : (
          <div className="space-y-3">
            {logs.map(log => (
              <div key={log.attendance_id} className="flex justify-between items-center p-3 bg-white/50 rounded-xl border border-white/50">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${!log.check_out ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <span className="font-medium text-gray-700">
                    {!log.check_out ? 'Clocked In' : 'Clocked Out'}
                  </span>
                  <span className="text-xs text-gray-400">{log.date}</span>
                </div>
                <div className="text-right">
                  <p className="text-gray-500 tabular-nums font-medium text-sm">
                    In: {log.check_in}
                  </p>
                  {log.check_out && (
                    <p className="text-gray-400 tabular-nums font-medium text-xs">
                      Out: {log.check_out}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Attendance;
