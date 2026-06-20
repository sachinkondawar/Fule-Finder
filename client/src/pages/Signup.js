import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, Key, Mail, ShieldAlert } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../services/api';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await api.post('/auth/register', { email, password, role });
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="min-h-[75vh] flex flex-col items-center justify-center p-4">
      <div className="bg-white/70 backdrop-blur-xl p-10 rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-white max-w-md w-full relative overflow-hidden">
        
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-400/20 to-cyan-400/20 blur-3xl rounded-full" />
        
        <div className="relative z-10">
          <div className="flex justify-center mb-8">
            <div className="bg-gradient-to-br from-indigo-500 to-blue-500 p-4 rounded-3xl shadow-xl shadow-blue-500/30">
              <UserPlus size={32} className="text-white" />
            </div>
          </div>
          
          <h2 className="text-3xl font-black text-center text-gray-900 tracking-tight mb-2">Create Account</h2>
          <p className="text-center text-gray-500 font-medium mb-8">Join the Fuel Finder network to manage stations.</p>

          {error && <div className="bg-rose-50 text-rose-700 p-3 rounded-xl text-sm font-bold text-center mb-6">{error}</div>}

          <form onSubmit={handleSignup} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5 ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-3.5 text-gray-400" size={20} />
                <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-gray-50/50 rounded-2xl border-2 border-gray-100 pl-11 pr-4 py-3.5 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all font-medium text-gray-900" placeholder="admin@fuelfinder.com" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5 ml-1">Password</label>
              <div className="relative">
                <Key className="absolute left-4 top-3.5 text-gray-400" size={20} />
                <input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-gray-50/50 rounded-2xl border-2 border-gray-100 pl-11 pr-4 py-3.5 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all font-medium text-gray-900" placeholder="Create a strong password" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5 ml-1 flex items-center gap-1.5">
                <ShieldAlert size={14} className="text-indigo-500" /> Account Role
              </label>
              <select value={role} onChange={(e) => setRole(e.target.value)} className="w-full bg-gray-50/50 rounded-2xl border-2 border-gray-100 px-4 py-3.5 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all font-medium text-gray-900 cursor-pointer appearance-none">
                <option value="user">Standard User</option>
                <option value="admin">Administrator (Station Manager)</option>
              </select>
            </div>

            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black py-4 px-4 rounded-2xl transition-all shadow-xl shadow-indigo-600/30 text-lg mt-8 flex justify-center items-center gap-2">
              <UserPlus size={20} /> Register Securely
            </motion.button>
          </form>

          <p className="text-center text-sm font-medium text-gray-500 mt-8">
            Already have an account? <Link to="/login" className="text-indigo-600 hover:text-indigo-800 font-bold transition-colors">Log in here</Link>
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default Signup;
