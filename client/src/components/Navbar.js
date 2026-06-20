import React, { useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { MapPin, Home, Map as MapIcon, Settings, UserCircle, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { token, role, email, logout } = useContext(AuthContext);
  const isActive = (path) => location.pathname === path;

  const NavItem = ({ to, icon: Icon, label }) => (
    <Link to={to} className="relative group">
      <div className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl transition-all duration-300 font-semibold z-10 relative ${
        isActive(to)
          ? 'text-white'
          : 'text-indigo-200 hover:text-white'
      }`}>
        <Icon size={18} className={isActive(to) ? 'animate-pulse' : ''} />
        <span className="hidden sm:inline">{label}</span>
      </div>
      
      {/* Active Background Bubble */}
      {isActive(to) && (
        <motion.div 
          layoutId="navBubble"
          className="absolute inset-0 bg-white/20 backdrop-blur-md rounded-2xl shadow-[0_0_15px_rgba(255,255,255,0.1)] z-0"
          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
        />
      )}
      
      {/* Hover Background Bubble (only shows if not active) */}
      {!isActive(to) && (
        <div className="absolute inset-0 bg-white/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0 scale-95 group-hover:scale-100" />
      )}
    </Link>
  );

  return (
    <nav className="fixed top-0 w-full bg-gradient-to-r from-indigo-900 via-violet-900 to-indigo-900 backdrop-blur-xl border-b border-white/10 shadow-2xl shadow-indigo-900/20 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          <Link to="/" className="flex items-center gap-3 group">
            <motion.div 
              whileHover={{ rotate: 15, scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="bg-gradient-to-br from-indigo-400 to-cyan-400 p-2.5 rounded-2xl shadow-lg shadow-cyan-500/20"
            >
              <MapPin className="text-white" size={26} strokeWidth={2.5} />
            </motion.div>
            <span className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-100 to-white tracking-tight group-hover:from-cyan-300 group-hover:to-blue-200 transition-all duration-500">
              FuelFinder<span className="text-cyan-400">.</span>
            </span>
          </Link>

          <div className="flex items-center gap-2 bg-black/20 p-1.5 rounded-3xl border border-white/10 shadow-inner">
            {/* Core Nav Links */}
            <NavItem to="/" icon={Home} label="Nearby" />
            <NavItem to="/map" icon={MapIcon} label="Map" />
            
            {/* Conditional Authentication Rendering */}
            {token ? (
              <>
                {role === 'admin' && <NavItem to="/admin" icon={Settings} label="Config" />}
                
                <div className="w-px h-6 bg-gray-200 mx-1"></div>
                
                <button 
                  onClick={() => { logout(); navigate('/login'); }}
                  className="relative group p-2 mx-1"
                  title={`Logged in as ${email}\nClick to Logout`}
                >
                  <LogOut size={18} className="text-gray-400 group-hover:text-rose-500 transition-colors" />
                </button>
              </>
            ) : (
              <>
                <div className="w-px h-6 bg-gray-200 mx-1"></div>
                <Link to="/login" className="flex items-center gap-1.5 px-4 py-1.5 ml-1 mr-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold shadow-md shadow-indigo-600/20 transition-all hover:scale-105 active:scale-95">
                  <UserCircle size={16} /> SignIn
                </Link>
              </>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;
