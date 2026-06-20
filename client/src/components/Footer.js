import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Navigation, Compass, Github, Twitter, Facebook, Mail } from 'lucide-react';
import { motion } from 'framer-motion';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-b from-gray-900 to-indigo-950 pt-20 pb-10 border-t border-indigo-900/50 mt-auto relative overflow-hidden">
      {/* Decorative Blur Backgrounds */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/10 blur-3xl rounded-full mix-blend-screen pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 blur-3xl rounded-full mix-blend-screen pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
          
          {/* Brand Section */}
          <div className="space-y-6">
             <Link to="/" className="flex items-center gap-3 group inline-flex">
                <div className="bg-gradient-to-br from-indigo-500 to-cyan-500 p-2.5 rounded-2xl shadow-lg shadow-indigo-500/20">
                  <MapPin className="text-white" size={24} strokeWidth={2.5} />
                </div>
                <span className="text-2xl font-black text-white tracking-tight">
                  FuelFinder<span className="text-cyan-400">.</span>
                </span>
              </Link>
              <p className="text-indigo-200/80 leading-relaxed font-medium">
                The most advanced spatial mapping engine for tracking fuel databanks and regional availability globally.
              </p>
              <div className="flex gap-4">
                 <motion.a whileHover={{ y: -3, scale: 1.1 }} href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-indigo-300 hover:text-white hover:bg-indigo-500 hover:border-indigo-400 shadow-sm transition-all">
                    <Github size={18} />
                 </motion.a>
                 <motion.a whileHover={{ y: -3, scale: 1.1 }} href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-indigo-300 hover:text-white hover:bg-blue-500 hover:border-blue-400 shadow-sm transition-all">
                    <Twitter size={18} />
                 </motion.a>
                 <motion.a whileHover={{ y: -3, scale: 1.1 }} href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-indigo-300 hover:text-white hover:bg-blue-600 hover:border-blue-500 shadow-sm transition-all">
                    <Facebook size={18} />
                 </motion.a>
              </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold tracking-wider uppercase text-sm mb-6 flex items-center gap-2">
              <Navigation size={16} className="text-indigo-400" /> Navigation
            </h3>
            <ul className="space-y-4">
              <li><Link to="/" className="text-indigo-200/80 hover:text-white font-medium transition-colors flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-indigo-500" /> Nearby Stations</Link></li>
              <li><Link to="/map" className="text-indigo-200/80 hover:text-white font-medium transition-colors flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-indigo-500" /> Global Map UI</Link></li>
              <li><Link to="/login" className="text-indigo-200/80 hover:text-white font-medium transition-colors flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-indigo-500" /> Administrator Login</Link></li>
            </ul>
          </div>

          {/* Ecosystem */}
          <div>
            <h3 className="text-white font-bold tracking-wider uppercase text-sm mb-6 flex items-center gap-2">
              <Compass size={16} className="text-indigo-400" /> Ecosystem
            </h3>
            <ul className="space-y-4">
              <li><a href="#" className="text-indigo-200/80 hover:text-white font-medium transition-colors flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-purple-500" /> Mobile Application</a></li>
              <li><a href="#" className="text-indigo-200/80 hover:text-white font-medium transition-colors flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-purple-500" /> Partner API Access</a></li>
              <li><a href="#" className="text-indigo-200/80 hover:text-white font-medium transition-colors flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-purple-500" /> Station Operators Portal</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-white font-bold tracking-wider uppercase text-sm mb-6 flex items-center gap-2">
              <Mail size={16} className="text-indigo-400" /> Contact Support
            </h3>
            <p className="text-indigo-200/80 font-medium text-sm leading-relaxed mb-4">
              Need technical assistance or want to list your station databank?
            </p>
            <div className="relative">
              <input type="email" placeholder="support@fuelfinder.com" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pb-3.5 text-white placeholder-indigo-300/50 focus:outline-none focus:border-indigo-400 focus:bg-white/10 transition-all font-medium text-sm" />
              <button className="absolute right-2 top-1.5 bottom-1.5 bg-indigo-500 hover:bg-indigo-400 text-white font-bold px-4 rounded-lg text-sm transition-colors shadow-sm">
                Connect
              </button>
            </div>
          </div>

        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-indigo-300/60 text-sm font-medium">
            &copy; {currentYear} FuelFinder Technologies. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm font-medium text-indigo-300/60">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Security</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
