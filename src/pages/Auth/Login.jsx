import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion'; // eslint-disable-line no-unused-vars
import { Mail, Lock, ArrowRight, Loader, ShieldCheck } from 'lucide-react';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      setIsSubmitting(false);
      return;
    }

    try {
      const result = await login(formData.email, formData.password);
      if (result.success) {
        navigate('/');
      } else {
        setError(result.error);
      }
    } catch {
      setError('An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden bg-[#0A0A0B]">
      {/* Premium Background Illustration */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/30 via-slate-900 to-black"></div>
        <img
          src="../../assets/auth_bg.png"
          alt="background"
          className="w-full h-full object-cover opacity-60 mix-blend-overlay"
        />
        <div className="absolute inset-0 backdrop-blur-[2px]"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="z-10 w-full max-w-md"
      >
        <div className="glass-card !bg-white/5 !backdrop-blur-2xl border border-white/10 shadow-2xl p-8 md:p-10 rounded-[2.5rem]">
          <div className="text-center mb-10">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.2 }}
              className="w-20 h-20 bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 rounded-2xl mx-auto mb-6 flex items-center justify-center text-white shadow-[0_0_30px_rgba(99,102,241,0.5)]"
            >
              <ShieldCheck size={40} />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl font-extrabold tracking-tight text-white mb-2"
            >
              Welcome Back
            </motion.h1>
            <p className="text-gray-400 font-medium">Elevate your workforce management</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-red-500/10 text-red-400 p-4 rounded-2xl text-sm flex items-center gap-3 border border-red-500/20"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></div>
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-300 ml-1">Corporate Email</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-indigo-400 transition-colors" size={20} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-white/5 border border-white/10 text-white rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-indigo-500/50 focus:bg-white/10 transition-all duration-300 placeholder:text-gray-600"
                  placeholder="employee@dayflow.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-300 ml-1">Secure Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-indigo-400 transition-colors" size={20} />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full bg-white/5 border border-white/10 text-white rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-indigo-500/50 focus:bg-white/10 transition-all duration-300 placeholder:text-gray-600"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 bg-[length:200%_auto] hover:bg-right text-white font-bold py-4 rounded-2xl shadow-[0_10px_20px_rgba(99,102,241,0.3)] flex items-center justify-center gap-2 transition-all duration-500 group disabled:opacity-70"
            >
              {isSubmitting ? <Loader className="animate-spin" /> : (
                <>
                  Enter Dashboard
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-10 text-center">
            <p className="text-gray-400 text-sm">
              New member of the team?{' '}
              <Link to="/signup" className="text-white font-bold hover:text-indigo-400 transition-colors border-b border-indigo-500/30 pb-0.5">
                Join Dayflow
              </Link>
            </p>
          </div>
        </div>

        {/* Footer info */}
        <p className="text-center mt-8 text-gray-600 text-xs font-medium uppercase tracking-widest">
          &copy; 2026 Dayflow HRMS &bull; Enterprise Edition
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
