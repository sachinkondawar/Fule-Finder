import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Store, Save, Activity, MapPin, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';

const Admin = () => {
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [radius, setRadius] = useState(99999);
  const [adminLoc, setAdminLoc] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '', address: '', lat: '', lng: '', petrol: false, diesel: false, cng: false, isOpen: true
  });

  useEffect(() => {
    if (navigator.geolocation && !adminLoc) {
      navigator.geolocation.getCurrentPosition(
        pos => setAdminLoc({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => setRadius('all') // User denied GPS, fallback to global database
      );
    }
  }, [adminLoc]);

  const fetchStations = React.useCallback(() => {
    setLoading(true);
    if (radius === 'all') {
      api.get('/stations')
        .then(res => { setStations(res.data); setLoading(false); })
        .catch(() => setLoading(false));
    } else {
      if (!adminLoc) return; // Wait silently for GPS
      api.get('/nearby', { params: { lat: adminLoc.lat, lng: adminLoc.lng, radius } })
        .then(res => { setStations(res.data); setLoading(false); })
        .catch(() => setLoading(false));
    }
  }, [radius, adminLoc]);

  useEffect(() => { fetchStations(); }, [fetchStations]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleAddStation = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...formData, lat: parseFloat(formData.lat), lng: parseFloat(formData.lng) };
      await api.post('/stations', payload);
      setFormData({ name: '', address: '', lat: '', lng: '', petrol: false, diesel: false, cng: false, isOpen: true });
      fetchStations();
    } catch (err) { alert('Error adding station'); }
  };

  const toggleField = async (id, field, currentValue) => {
    try { await api.put(`/stations/${id}`, { [field]: !currentValue }); fetchStations(); } 
    catch (err) { alert(`Error updating ${field}`); }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this station forever?')) {
      try { await api.delete(`/stations/${id}`); fetchStations(); } 
      catch (err) { alert('Error deleting'); }
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 max-w-7xl mx-auto">
      
      {/* HEADER PAGE */}
      <div className="bg-gradient-to-r from-gray-900 via-indigo-900 to-gray-900 p-8 rounded-[2rem] shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-black text-white flex items-center gap-3">
              <Store className="text-indigo-400" size={32} /> Administrator Hub
            </h1>
            <p className="text-indigo-200 mt-2 font-medium text-lg">Manage network availability & station databanks</p>
          </div>
          <div className="flex flex-wrap gap-4 items-center">
            
            <div className="relative w-48">
              <select
                value={radius}
                onChange={(e) => setRadius(e.target.value === 'all' ? 'all' : Number(e.target.value))}
                className="w-full pl-4 pr-10 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl focus:outline-none focus:border-indigo-400 font-bold text-white shadow-sm appearance-none cursor-pointer"
              >
                <option className="text-gray-900" value={99999}>Any Distance</option>
                <option className="text-gray-900" value={5}>Within 5 km</option>
                <option className="text-gray-900" value={10}>Within 10 km</option>
                <option className="text-gray-900" value={20}>Within 20 km</option>
                <option className="text-gray-900" value={50}>Within 50 km</option>
                <option className="text-gray-900" value={100}>Within 100 km</option>
              </select>
              <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                <ChevronDown className="h-4 w-4 text-white" />
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/20 flex items-center gap-3">
              <Activity className="text-emerald-400 animate-pulse" />
              <span className="text-white font-bold">{stations.length} Active Stations</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* ADD STATION FORM */}
        <div className="xl:col-span-1">
          <motion.div initial={{ x: -20 }} animate={{ x: 0 }} className="bg-white p-8 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100 sticky top-28">
            <h2 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2">
              <Plus size={24} className="text-indigo-600 bg-indigo-50 p-1 rounded-lg" /> Register Station
            </h2>
            
            <form onSubmit={handleAddStation} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5 ml-1">Station Name</label>
                <input required name="name" value={formData.name} onChange={handleInputChange} type="text" className="w-full bg-gray-50 rounded-2xl border-2 border-gray-100 px-4 py-3 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all font-medium text-gray-900" placeholder="e.g. Shell Grand Ave" />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5 ml-1">Physical Address</label>
                <input required name="address" value={formData.address} onChange={handleInputChange} type="text" className="w-full bg-gray-50 rounded-2xl border-2 border-gray-100 px-4 py-3 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all font-medium text-gray-900" placeholder="123 Main St..." />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5 ml-1">Latitude</label>
                  <input required name="lat" value={formData.lat} onChange={handleInputChange} type="number" step="any" className="w-full bg-gray-50 rounded-2xl border-2 border-gray-100 px-4 py-3 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all font-mono text-sm" placeholder="20.59" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5 ml-1">Longitude</label>
                  <input required name="lng" value={formData.lng} onChange={handleInputChange} type="number" step="any" className="w-full bg-gray-50 rounded-2xl border-2 border-gray-100 px-4 py-3 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all font-mono text-sm" placeholder="78.96" />
                </div>
              </div>

              <motion.button 
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                type="button" 
                onClick={() => {
                  if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(
                      (pos) => setFormData(p => ({ ...p, lat: pos.coords.latitude, lng: pos.coords.longitude })), 
                      () => alert("Could not fetch location")
                    );
                  }
                }}
                className="w-full bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 text-indigo-700 font-bold py-3 pt-3.5 px-4 rounded-2xl transition-all border border-indigo-200/50 flex justify-center items-center gap-2 shadow-sm"
              >
                <MapPin size={18} /> Auto-detect Coordinates
              </motion.button>

              <div className="pt-2">
                <label className="block text-sm font-bold text-gray-700 mb-3 ml-1">Available Fuel Arrays</label>
                <div className="flex gap-3">
                  <label className={`flex-1 flex flex-col items-center justify-center gap-2 p-3 rounded-2xl cursor-pointer border-2 transition-all ${formData.petrol ? 'bg-yellow-50 border-yellow-400 text-yellow-900 shadow-md shadow-yellow-500/10' : 'bg-gray-50 border-gray-100 text-gray-400 hover:bg-gray-100'}`}>
                    <input type="checkbox" name="petrol" checked={formData.petrol} onChange={handleInputChange} className="hidden" />
                    <span className="text-xs font-black uppercase tracking-wider">Petrol</span>
                  </label>
                  <label className={`flex-1 flex flex-col items-center justify-center gap-2 p-3 rounded-2xl cursor-pointer border-2 transition-all ${formData.diesel ? 'bg-gray-800 border-gray-900 text-white shadow-md shadow-gray-900/20' : 'bg-gray-50 border-gray-100 text-gray-400 hover:bg-gray-100'}`}>
                    <input type="checkbox" name="diesel" checked={formData.diesel} onChange={handleInputChange} className="hidden" />
                    <span className="text-xs font-black uppercase tracking-wider">Diesel</span>
                  </label>
                  <label className={`flex-1 flex flex-col items-center justify-center gap-2 p-3 rounded-2xl cursor-pointer border-2 transition-all ${formData.cng ? 'bg-blue-50 border-blue-400 text-blue-900 shadow-md shadow-blue-500/10' : 'bg-gray-50 border-gray-100 text-gray-400 hover:bg-gray-100'}`}>
                    <input type="checkbox" name="cng" checked={formData.cng} onChange={handleInputChange} className="hidden" />
                    <span className="text-xs font-black uppercase tracking-wider">CNG</span>
                  </label>
                </div>
              </div>

              <motion.button 
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                type="submit" 
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-4 px-4 rounded-2xl transition-all flex justify-center items-center gap-2 shadow-xl shadow-indigo-600/30 text-lg mt-6"
              >
                <Save size={22} /> Commit to Database
              </motion.button>
            </form>
          </motion.div>
        </div>

        {/* STATION LIST */}
        <div className="xl:col-span-2">
          <div className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100 overflow-hidden">
            <div className="px-8 py-6 border-b border-gray-100 bg-gray-50/50">
              <h2 className="font-black text-gray-900 text-xl">Database Master List</h2>
            </div>
            
            {loading ? (
              <div className="grid p-8 gap-4">
                 {[1,2,3].map(i => <div key={i} className="h-24 bg-gray-100 rounded-2xl animate-pulse" />)}
              </div>
            ) : stations.length === 0 ? (
              <div className="p-20 text-center text-gray-400 font-medium">Database is currently empty.</div>
            ) : (
              <div className="p-4 space-y-4">
                <AnimatePresence>
                  {stations.map(station => (
                    <motion.div 
                      layout
                      initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                      key={station._id} 
                      className="p-6 bg-white border border-gray-100 hover:border-indigo-100 rounded-[1.5rem] shadow-sm hover:shadow-lg hover:shadow-indigo-500/5 transition-all flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className={`w-2.5 h-2.5 rounded-full shadow-sm ${station.isOpen ? 'bg-emerald-500 shadow-emerald-500/50' : 'bg-rose-500 shadow-rose-500/50'}`} />
                          <h3 className="font-black text-gray-900 text-xl">{station.name}</h3>
                        </div>
                        <p className="text-sm font-medium text-gray-500 flex items-center gap-2">
                          <MapPin size={14} className="text-gray-400" /> {station.address}
                        </p>
                        
                        <div className="flex gap-2 mt-4">
                          <motion.button whileTap={{ scale: 0.9 }} onClick={() => toggleField(station._id, 'petrol', station.petrol)} className={`px-4 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all border-2 ${station.petrol ? 'bg-yellow-50 text-yellow-800 border-yellow-200' : 'bg-gray-50 text-gray-400 border-transparent hover:bg-gray-100 hover:text-gray-600'}`}>Petrol</motion.button>
                          <motion.button whileTap={{ scale: 0.9 }} onClick={() => toggleField(station._id, 'diesel', station.diesel)} className={`px-4 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all border-2 ${station.diesel ? 'bg-gray-800 text-white border-gray-900' : 'bg-gray-50 text-gray-400 border-transparent hover:bg-gray-100 hover:text-gray-600'}`}>Diesel</motion.button>
                          <motion.button whileTap={{ scale: 0.9 }} onClick={() => toggleField(station._id, 'cng', station.cng)} className={`px-4 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all border-2 ${station.cng ? 'bg-blue-50 text-blue-800 border-blue-200' : 'bg-gray-50 text-gray-400 border-transparent hover:bg-gray-100 hover:text-gray-600'}`}>CNG</motion.button>
                        </div>
                      </div>

                      <div className="flex sm:flex-col items-center sm:items-end gap-3 w-full sm:w-auto mt-4 sm:mt-0 pt-4 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                        <motion.button 
                          whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                          onClick={() => toggleField(station._id, 'isOpen', station.isOpen)}
                          className={`w-full sm:w-auto px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-sm ${
                            station.isOpen 
                              ? 'bg-emerald-50 text-emerald-700 hover:bg-rose-50 hover:text-rose-700' 
                              : 'bg-rose-50 text-rose-700 hover:bg-emerald-50 hover:text-emerald-700'
                          }`}
                        >
                          {station.isOpen ? 'Set Closed' : 'Set Open'}
                        </motion.button>

                        <button 
                          onClick={() => handleDelete(station._id)}
                          className="p-2.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>

      </div>
    </motion.div>
  );
};

export default Admin;
