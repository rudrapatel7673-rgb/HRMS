import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion'; // eslint-disable-line no-unused-vars
import { User, Mail, Lock, ArrowRight, Loader, Briefcase, Sparkles } from 'lucide-react';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    employee_id: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!formData.name || !formData.email || !formData.employee_id || !formData.password || !formData.confirmPassword) {
      setError('All fields are required');
      setIsSubmitting(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsSubmitting(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Security policy: Password min 6 chars');
      setIsSubmitting(false);
      return;
    }

    try {
      const result = await signup({
        full_name: formData.name,
        email: formData.email,
        employee_id: formData.employee_id,
        password: formData.password
      });

      if (result.success) {
        navigate('/');
      } else {
        setError(result.error);
      }
    } catch {
      setError('Authentication service error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden bg-[#0A0A0B]">
      {/* Premium Background Illustration */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-tr from-purple-900/30 via-slate-900 to-black"></div>
        <img
          src="../../assets/auth_bg.png"
          alt="background"
          className="w-full h-full object-cover opacity-60 mix-blend-color-dodge rotate-180"
        />
        <div className="absolute inset-0 backdrop-blur-[2px]"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="z-10 w-full max-w-lg"
      >
        <div className="glass-card !bg-white/5 !backdrop-blur-2xl border border-white/10 shadow-2xl p-8 md:p-10 rounded-[2.5rem]">
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.1 }}
              className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl mx-auto mb-6 flex items-center justify-center text-white shadow-[0_0_30px_rgba(168,85,247,0.4)]"
            >
              <Sparkles size={40} />
            </motion.div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2">Create Global Account</h1>
            <p className="text-gray-400 font-medium">Start your professional journey with Dayflow</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="bg-red-500/10 text-red-400 p-4 rounded-2xl text-sm flex items-center gap-3 border border-red-500/20"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></div>
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-300 ml-1">Full Identity</label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-purple-400 transition-colors" size={18} />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full bg-white/5 border border-white/10 text-white rounded-2xl py-3.5 pl-11 pr-4 outline-none focus:border-purple-500/50 focus:bg-white/10 transition-all placeholder:text-gray-600"
                    placeholder="E.g. Alan Turing"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-300 ml-1">Business ID</label>
                <div className="relative group">
                  <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-purple-400 transition-colors" size={18} />
                  <input
                    type="text"
                    name="employee_id"
                    value={formData.employee_id}
                    onChange={handleChange}
                    className="w-full bg-white/5 border border-white/10 text-white rounded-2xl py-3.5 pl-11 pr-4 outline-none focus:border-purple-500/50 focus:bg-white/10 transition-all placeholder:text-gray-600"
                    placeholder="EMP-XXXX"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-300 ml-1">Work Email</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-purple-400 transition-colors" size={18} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-white/5 border border-white/10 text-white rounded-2xl py-3.5 pl-11 pr-4 outline-none focus:border-purple-500/50 focus:bg-white/10 transition-all placeholder:text-gray-600"
                  placeholder="name@dayflow.com"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-300 ml-1">Password</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-purple-400 transition-colors" size={18} />
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full bg-white/5 border border-white/10 text-white rounded-2xl py-3.5 pl-11 pr-4 outline-none focus:border-purple-500/50 focus:bg-white/10 transition-all placeholder:text-gray-600"
                    placeholder="••••••"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-300 ml-1">Confirm</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-purple-400 transition-colors" size={18} />
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full bg-white/5 border border-white/10 text-white rounded-2xl py-3.5 pl-11 pr-4 outline-none focus:border-purple-500/50 focus:bg-white/10 transition-all placeholder:text-gray-600"
                    placeholder="••••••"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 bg-[length:200%_auto] hover:bg-right text-white font-bold py-4 rounded-2xl shadow-[0_10px_20px_rgba(168,85,247,0.3)] flex items-center justify-center gap-2 transition-all duration-500 group mt-6 disabled:opacity-70"
            >
              {isSubmitting ? <Loader className="animate-spin" /> : 'Establish Identity'}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-400 text-sm font-medium">
              Already integrated?{' '}
              <Link to="/login" className="text-white font-bold hover:text-purple-400 transition-colors border-b border-purple-500/30 pb-0.5">
                Authentication Portal
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Signup;
