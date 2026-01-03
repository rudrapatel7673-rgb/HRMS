import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import { User, Mail, Phone, MapPin, Briefcase } from 'lucide-react';

const Profile = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card relative overflow-hidden"
      >
        <div className="h-32 bg-gradient-to-r from-indigo-500 to-purple-600 absolute top-0 left-0 right-0"></div>
        <div className="relative pt-16 px-4 flex flex-col md:flex-row items-end md:items-center gap-6">
          <div className="w-32 h-32 rounded-full bg-white p-1 shadow-xl">
            <div className="w-full h-full rounded-full bg-gray-200 flex items-center justify-center text-4xl font-bold text-gray-400">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
          </div>
          <div className="mb-4">
            <h1 className="text-3xl font-bold text-gray-800">{user?.name}</h1>
            <p className="text-indigo-600 font-medium">{user?.role} • Engineering Team</p>
          </div>
          <button className="md:ml-auto mb-4 btn btn-primary">
            Edit Profile
          </button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card space-y-6"
        >
          <h2 className="text-xl font-bold border-b border-gray-100 pb-2">Personal Information</h2>

          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600"><Mail size={20} /></div>
              <div>
                <p className="text-sm text-gray-500">Email Address</p>
                <p className="font-medium">{user?.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="p-2 bg-purple-50 rounded-lg text-purple-600"><Phone size={20} /></div>
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="font-medium">+1 (555) 000-0000</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="p-2 bg-pink-50 rounded-lg text-pink-600"><MapPin size={20} /></div>
              <div>
                <p className="text-sm text-gray-500">Location</p>
                <p className="font-medium">San Francisco, CA</p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card space-y-6"
        >
          <h2 className="text-xl font-bold border-b border-gray-100 pb-2">Work Information</h2>

          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-amber-50 rounded-lg text-amber-600"><Briefcase size={20} /></div>
              <div>
                <p className="text-sm text-gray-500">Department</p>
                <p className="font-medium">Product Engineering</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="p-2 bg-green-50 rounded-lg text-green-600"><Clock size={20} /></div>
              <div>
                <p className="text-sm text-gray-500">Join Date</p>
                <p className="font-medium">Jan 12, 2024</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;
