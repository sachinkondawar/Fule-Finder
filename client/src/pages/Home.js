import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, Store, ChevronRight, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

const Home = () => {
  const [location, setLocation] = useState(null);
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [radius, setRadius] = useState(99999);
  const [filters, setFilters] = useState({ petrol: false, diesel: false, cng: false, openOnly: false });

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Geolocation not supported.');
      setLoading(false); return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => { setError('Please allow location access.'); setLoading(false); }
    );
  }, []);

  useEffect(() => {
    if (location) {
      api.get('/nearby', { params: { lat: location.lat, lng: location.lng, radius } })
        .then(res => { setStations(res.data); setLoading(false); })
        .catch(() => { setError('Failed to fetch stations.'); setLoading(false); });
    }
  }, [location, radius]);

  const filtered = stations.filter(s => {
    if (filters.petrol && !s.petrol) return false;
    if (filters.diesel && !s.diesel) return false;
    if (filters.cng && !s.cng) return false;
    if (filters.openOnly && !s.isOpen) return false;
    
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (!s.name.toLowerCase().includes(q) && !s.address.toLowerCase().includes(q)) {
        return false;
      }
    }
    return true;
  });

  const toggleFilter = (k) => setFilters(p => ({ ...p, [k]: !p[k] }));

  const FilterBtn = ({ active, label, icon: Icon, color, onClick }) => (
    <motion.button 
      whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={onClick}
      className={`px-5 py-2.5 rounded-2xl text-sm font-bold flex items-center gap-2 transition-all duration-300 border-2 ${
        active ? `${color.bg} ${color.text} ${color.border} shadow-lg ${color.shadow}` : 'bg-white text-gray-500 border-gray-100 hover:border-gray-300 hover:bg-gray-50'
      }`}
    >
      {Icon && <Icon size={16} className={active ? '' : 'text-gray-400'} />} {label}
    </motion.button>
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 max-w-6xl mx-auto">
      
      {/* HEADER SECTION */}
      <div className="bg-white/60 backdrop-blur-3xl p-8 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-white/60 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-gradient-to-br from-blue-400/20 to-indigo-400/20 blur-3xl" />
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="w-full md:w-auto">
            <motion.h1 initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-indigo-900 tracking-tight">
              Fuel Locator
            </motion.h1>
            <p className="text-gray-500 mt-2 flex items-center gap-2 text-lg font-medium">
              <Navigation size={18} className="text-indigo-500" />
              {location ? <span className="text-indigo-700">{filtered.length} stations found near you.</span> : 'Acquiring GPS Signal...'}
            </p>
          </div>

          <div className="w-full md:w-auto flex flex-col gap-4">
            
            {/* Live Search Bar */}
            <div className="relative w-full md:w-80">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search station name or city..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-white border-2 border-gray-100 rounded-2xl focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-medium text-gray-900 shadow-sm"
              />
            </div>

            {/* Radius Filter */}
            <div className="relative w-full md:w-48">
              <select
                value={radius}
                onChange={(e) => setRadius(Number(e.target.value))}
                className="w-full px-4 py-3 bg-white border-2 border-gray-100 rounded-2xl focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 font-bold text-indigo-700 shadow-sm appearance-none cursor-pointer"
              >
                <option value={5}>Within 5 km</option>
                <option value={10}>Within 10 km</option>
                <option value={20}>Within 20 km</option>
                <option value={50}>Within 50 km</option>
                <option value={100}>Within 100 km</option>
                <option value={500}>Within 500 km</option>
                <option value={99999}>Any Distance</option>
              </select>
              <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                <ChevronRight className="h-4 w-4 text-indigo-500 rotate-90" />
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <FilterBtn active={filters.petrol} label="Petrol" color={{bg:'bg-yellow-100', text:'text-yellow-800', border:'border-yellow-300', shadow:'shadow-yellow-500/20'}} onClick={() => toggleFilter('petrol')} />
              <FilterBtn active={filters.diesel} label="Diesel" color={{bg:'bg-gray-800', text:'text-white', border:'border-gray-800', shadow:'shadow-gray-900/20'}} onClick={() => toggleFilter('diesel')} />
              <FilterBtn active={filters.cng} label="CNG" color={{bg:'bg-blue-100', text:'text-blue-800', border:'border-blue-300', shadow:'shadow-blue-500/20'}} onClick={() => toggleFilter('cng')} />
              <FilterBtn active={filters.openOnly} icon={Store} label="Open Now" color={{bg:'bg-emerald-100', text:'text-emerald-800', border:'border-emerald-300', shadow:'shadow-emerald-500/20'}} onClick={() => toggleFilter('openOnly')} />
            </div>
          </div>
        </div>
      </div>

      {error && (
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-red-50/80 backdrop-blur-md border border-red-200 text-red-700 p-6 rounded-[2rem] flex justify-center items-center gap-3 font-semibold shadow-xl shadow-red-500/10">
          <MapPin size={24} className="animate-bounce" /> {error}
        </motion.div>
      )}

      {/* SKELETONS */}
      {loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white/40 p-6 rounded-[2rem] border border-white/60 animate-pulse h-56 shadow-sm" />
          ))}
        </div>
      )}

      {/* EMPTY STATE */}
      {!loading && !error && filtered.length === 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-20 bg-white/40 backdrop-blur-md rounded-[2rem] border-2 border-dashed border-gray-200 shadow-sm">
          <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
             <Search size={32} className="text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">No stations found</h2>
          <p className="text-gray-500">Try adjusting your search terms or fuel filters.</p>
        </motion.div>
      )}

      {/* STATIONS GRID */}
      <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
        <AnimatePresence>
          {filtered.map(station => (
            <motion.div 
              key={station._id} variants={itemVariants} exit={{ opacity: 0, scale: 0.9 }}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
              className="group bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(79,70,229,0.12)] border border-gray-100 flex flex-col justify-between overflow-hidden transition-all duration-300"
            >
              <div className="p-8 space-y-6">
                
                <div className="flex justify-between items-start gap-4">
                  <h3 className="text-xl font-black text-gray-900 leading-tight group-hover:text-indigo-600 transition-colors">
                    {station.name}
                  </h3>
                  {station.isOpen ? (
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] uppercase font-black px-3 py-1.5 rounded-full tracking-wider shrink-0 shadow-sm shadow-emerald-500/20">Active</span>
                  ) : (
                    <span className="bg-rose-100 text-rose-800 text-[10px] uppercase font-black px-3 py-1.5 rounded-full tracking-wider shrink-0">Closed</span>
                  )}
                </div>
                
                <p className="text-gray-500 text-sm font-medium flex items-start gap-2.5">
                  <span className="mt-0.5 p-1.5 bg-gray-50 rounded-lg text-gray-400 flex-shrink-0">
                     <MapPin size={14} />
                  </span>
                  <span className="leading-relaxed">{station.address}</span>
                </p>

                <div className="flex gap-2 flex-wrap">
                  {station.petrol && <span className="text-xs font-bold px-3 py-1 bg-yellow-100/80 text-yellow-800 rounded-xl border border-yellow-200/50">Petrol</span>}
                  {station.diesel && <span className="text-xs font-bold px-3 py-1 bg-gray-100 text-gray-800 rounded-xl border border-gray-200">Diesel</span>}
                  {station.cng && <span className="text-xs font-bold px-3 py-1 bg-blue-100/80 text-blue-800 rounded-xl border border-blue-200/50">CNG</span>}
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-indigo-50/50 to-blue-50/50 px-8 py-5 border-t border-indigo-50/50 flex items-center justify-between group-hover:bg-indigo-50 transition-colors">
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-0.5">Distance</span>
                  <span className="text-3xl font-black text-indigo-900 tracking-tight">
                    {typeof station.distance === 'number' ? station.distance.toFixed(1) : '?'} <span className="text-lg font-bold text-indigo-400 tracking-normal">km</span>
                  </span>
                </div>
                <motion.a 
                  whileHover={{ scale: 1.1, rotate: -10 }}
                  whileTap={{ scale: 0.9 }}
                  href={`https://www.google.com/maps/dir/?api=1&destination=${station.lat},${station.lng}`}
                  target="_blank" rel="noreferrer"
                  className="bg-white p-3.5 rounded-2xl shadow-lg shadow-indigo-500/20 text-indigo-600 hover:text-white hover:bg-indigo-600 transition-colors"
                >
                  <ChevronRight strokeWidth={3} size={20} />
                </motion.a>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

export default Home;