
import React, { useState } from 'react';
import { MOCK_DEVICES } from '../constants';

const Location: React.FC = () => {
  const [selectedId, setSelectedId] = useState(MOCK_DEVICES[0].id);
  const current = MOCK_DEVICES.find(d => d.id === selectedId) || MOCK_DEVICES[0];

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col gap-6">
      <header>
        <h1 className="text-3xl font-bold text-white">Geo-Track</h1>
        <p className="text-gray-400">Real-time GPS telemetry and geographical fencing.</p>
      </header>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6 min-h-0">
        <div className="lg:col-span-3 glass rounded-3xl overflow-hidden relative border border-white/5 shadow-2xl">
          {/* Stylized Grid Map Mockup */}
          <div className="absolute inset-0 bg-[#0a0c10] overflow-hidden">
            <div className="absolute inset-0 opacity-10" 
                 style={{ backgroundImage: 'radial-gradient(#3b82f6 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
            
            {/* Map Placeholder Content */}
            <div className="absolute inset-0 flex items-center justify-center">
               <div className="relative w-full h-full">
                  {/* Dynamic Device Pins */}
                  {MOCK_DEVICES.filter(d => d.status !== 'offline').map((d, i) => (
                    <div 
                      key={d.id}
                      onClick={() => setSelectedId(d.id)}
                      className={`absolute cursor-pointer transition-all duration-500 ${selectedId === d.id ? 'z-20 scale-125' : 'z-10'}`}
                      style={{ top: `${20 + i * 15}%`, left: `${30 + i * 12}%` }}
                    >
                      <div className={`p-1 rounded-full ${selectedId === d.id ? 'bg-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.6)]' : 'bg-gray-700'} border-2 border-white/20`}>
                        <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-900 flex items-center justify-center">
                           <i className={`fas ${d.os.includes('Android') ? 'fa-mobile-screen' : 'fa-laptop'} text-xs text-white`}></i>
                        </div>
                      </div>
                      <div className="mt-2 bg-black/80 backdrop-blur-md px-2 py-1 rounded-lg border border-white/10 whitespace-nowrap">
                        <p className="text-[10px] font-bold text-white">{d.name}</p>
                      </div>
                    </div>
                  ))}
               </div>
            </div>
          </div>

          <div className="absolute top-6 right-6 space-y-2">
            <button className="w-10 h-10 glass rounded-xl flex items-center justify-center text-white hover:bg-blue-600 transition-colors">
              <i className="fas fa-plus"></i>
            </button>
            <button className="w-10 h-10 glass rounded-xl flex items-center justify-center text-white hover:bg-blue-600 transition-colors">
              <i className="fas fa-minus"></i>
            </button>
            <button className="w-10 h-10 glass rounded-xl flex items-center justify-center text-white hover:bg-blue-600 transition-colors">
              <i className="fas fa-crosshairs"></i>
            </button>
          </div>

          <div className="absolute bottom-6 left-6 p-4 glass rounded-2xl border border-blue-500/20 max-w-xs">
            <p className="text-xs font-bold text-blue-400 mb-1">CURRENT SELECTION</p>
            <h3 className="text-white font-bold">{current.location.address}</h3>
            <p className="text-[10px] text-gray-500 mono mt-1">LAT: {current.location.lat} | LNG: {current.location.lng}</p>
          </div>
        </div>

        <div className="glass rounded-3xl overflow-hidden flex flex-col">
          <div className="p-4 border-b border-gray-800">
            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Device List</h2>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {MOCK_DEVICES.map(device => (
              <div 
                key={device.id}
                onClick={() => setSelectedId(device.id)}
                className={`p-3 rounded-2xl cursor-pointer transition-all border ${
                  selectedId === device.id ? 'bg-blue-600/10 border-blue-500/30' : 'bg-transparent border-white/5 hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${device.status === 'online' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <div className="flex-1">
                    <p className="text-xs font-bold text-white">{device.name}</p>
                    <p className="text-[10px] text-gray-500">{device.location.address.split(',')[0]}</p>
                  </div>
                  <i className="fas fa-chevron-right text-[10px] text-gray-700"></i>
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 bg-gray-900/50 border-t border-gray-800">
            <button className="w-full py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg text-xs font-bold transition-colors">
              Export History (KML)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Location;
