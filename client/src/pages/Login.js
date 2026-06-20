import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LogIn, Key, Mail } from 'lucide-react';
import { motion } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/login', { email, password });
      login(res.data.token, res.data.role, res.data.email);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="min-h-[70vh] flex flex-col items-center justify-center p-4">
      <div className="bg-white/70 backdrop-blur-xl p-10 rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-white max-w-md w-full relative overflow-hidden">
        
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-400/20 to-purple-400/20 blur-3xl rounded-full" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-blue-400/20 to-cyan-400/20 blur-3xl rounded-full" />
        
        <div className="relative z-10">
          <div className="flex justify-center mb-8">
            <div className="bg-indigo-600 p-4 rounded-3xl shadow-xl shadow-indigo-600/30">
              <Key size={32} className="text-white" />
            </div>
          </div>
          
          <h2 className="text-3xl font-black text-center text-gray-900 tracking-tight mb-2">Welcome Back</h2>
          <p className="text-center text-gray-500 font-medium mb-8">Enter your credentials to access the station databank.</p>

          {error && <div className="bg-rose-50 text-rose-700 p-3 rounded-xl text-sm font-bold text-center mb-6">{error}</div>}

          <form onSubmit={handleLogin} className="space-y-5">
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
                <input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-gray-50/50 rounded-2xl border-2 border-gray-100 pl-11 pr-4 py-3.5 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all font-medium text-gray-900" placeholder="••••••••" />
              </div>
            </div>

            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-4 px-4 rounded-2xl transition-all shadow-xl shadow-indigo-600/30 text-lg mt-8 flex justify-center items-center gap-2">
              <LogIn size={20} /> Authenticate
            </motion.button>
          </form>

          <p className="text-center text-sm font-medium text-gray-500 mt-8">
            Don't have an account? <Link to="/signup" className="text-indigo-600 hover:text-indigo-800 font-bold transition-colors">Sign up here</Link>
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default Login;
