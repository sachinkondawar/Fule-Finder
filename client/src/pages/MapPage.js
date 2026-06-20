import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { MapPin, Compass } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../services/api';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const customUserIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const ChangeView = ({ center }) => {
  const map = useMap();
  useEffect(() => { map.setView(center, map.getZoom()); }, [center, map]);
  return null;
};

const MapPage = () => {
  const [location, setLocation] = useState(null);
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => { setLocation({ lat: 20.5937, lng: 78.9629 }); setLoading(false); }
    );
  }, []);

  useEffect(() => {
    if (location) {
      api.get('/nearby', { params: { lat: location.lat, lng: location.lng } })
        .then(res => { setStations(res.data); setLoading(false); })
        .catch(() => setLoading(false));
    }
  }, [location]);

  if (!location || loading) {
    return (
      <div className="h-[80vh] flex flex-col items-center justify-center bg-white/50 backdrop-blur-3xl rounded-[2rem] shadow-sm border border-white">
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }}>
          <Compass size={64} className="text-indigo-500 mb-6 drop-shadow-lg" strokeWidth={1.5} />
        </motion.div>
        <h2 className="text-3xl font-black text-gray-900 tracking-tight">Acquiring Satellites...</h2>
        <p className="text-gray-500 mt-2 font-medium">Pinpointing your global coordinates</p>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6 max-w-7xl mx-auto">
      <div className="bg-white/70 backdrop-blur-xl p-6 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white flex justify-between items-center bg-gradient-to-r from-indigo-50/50 to-white">
        <div>
          <h1 className="text-2xl font-black text-gray-900 flex items-center gap-3 tracking-tight">
            <div className="bg-indigo-600 p-2 rounded-xl text-white shadow-lg shadow-indigo-600/30">
              <MapPin size={22} />
            </div>
            Geographic Overlay
          </h1>
          <p className="text-sm font-semibold text-indigo-600/80 mt-2 tracking-wide uppercase">
            Red Pin = You &bull; Blue Pins = Active Fuel Stations
          </p>
        </div>
      </div>

      <div className="h-[75vh] w-full rounded-[2rem] overflow-hidden shadow-2xl shadow-indigo-900/10 border-4 border-white z-0 relative isolate ring-1 ring-gray-900/5">
        <MapContainer center={[location.lat, location.lng]} zoom={13} scrollWheelZoom={true} className="h-full w-full">
          <ChangeView center={[location.lat, location.lng]} />
          
          {/* Awesome minimal grey basemap */}
          <TileLayer
            attribution='&copy; <a href="https://carto.com/">Carto</a>'
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          />

          <Marker position={[location.lat, location.lng]} icon={customUserIcon}>
            <Popup className="rounded-xl">
              <div className="p-2 space-y-1">
                <div className="font-black text-gray-900 text-base uppercase tracking-wider text-rose-600">Your Location</div>
                <p className="text-xs text-gray-500 font-medium">GPS Triangulated</p>
              </div>
            </Popup>
          </Marker>

          {stations.map(station => (
            <Marker key={station._id} position={[station.lat, station.lng]}>
              <Popup>
                <div className="p-2 min-w-[200px]">
                   <h3 className="font-black text-lg text-gray-900 leading-tight mb-2">{station.name}</h3>
                   <div className="flex items-center gap-2 mb-3">
                     <span className={`text-[9px] uppercase font-black px-2 py-1 rounded tracking-widest ${station.isOpen ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                       {station.isOpen ? 'ACTIVE' : 'OFFLINE'}
                     </span>
                     <span className="text-xs font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                       {typeof station.distance === 'number' ? station.distance.toFixed(1) : '?'} km
                     </span>
                   </div>
                   
                   <p className="text-xs text-gray-500 font-medium leading-relaxed border-t border-gray-100 pt-3">{station.address}</p>
                   
                   <div className="flex gap-1.5 mt-3">
                      {station.petrol && <span className="text-[10px] font-bold bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded shadow-sm">Petrol</span>}
                      {station.diesel && <span className="text-[10px] font-bold bg-gray-800 text-white px-2 py-0.5 rounded shadow-sm">Diesel</span>}
                      {station.cng && <span className="text-[10px] font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded shadow-sm">CNG</span>}
                   </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </motion.div>
  );
};

export default MapPage;
