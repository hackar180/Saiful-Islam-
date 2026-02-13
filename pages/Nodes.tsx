
import React, { useState, useEffect } from 'react';
import { MOCK_DEVICES } from '../constants';
import { DeviceNode } from '../types';

const Nodes: React.FC = () => {
  // Persistence Logic: Load deleted IDs from localStorage
  const getDeletedIds = (): string[] => {
    const saved = localStorage.getItem('saiful_deleted_devices');
    return saved ? JSON.parse(saved) : [];
  };

  const [devices, setDevices] = useState<DeviceNode[]>(() => {
    const deletedIds = getDeletedIds();
    return MOCK_DEVICES.filter(d => !deletedIds.includes(d.id));
  });

  const [filter, setFilter] = useState('');
  const [selectedControlDevice, setSelectedControlDevice] = useState<DeviceNode | null>(null);
  
  const filteredDevices = devices.filter(d => 
    d.name.toLowerCase().includes(filter.toLowerCase()) || 
    d.id.toLowerCase().includes(filter.toLowerCase())
  );

  const deleteDevice = (id: string) => {
    if (window.confirm('Are you sure you want to permanently remove this node from management?')) {
      // Add to blacklist
      const deletedIds = getDeletedIds();
      deletedIds.push(id);
      localStorage.setItem('saiful_deleted_devices', JSON.stringify(deletedIds));
      
      // Update state
      setDevices(devices.filter(d => d.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white uppercase italic">SAIFUL <span className="text-blue-500">FLEET</span></h1>
          <p className="text-gray-400">Total {devices.length} managed endpoints detected in system.</p>
        </div>
        <div className="relative w-full md:w-64">
          <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"></i>
          <input 
            type="text"
            placeholder="Search nodes..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full bg-gray-900 border border-gray-800 rounded-xl py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 uppercase"
          />
        </div>
      </header>

      {filteredDevices.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredDevices.map((device) => (
            <NodeCard 
              key={device.id} 
              device={device} 
              onRemoteClick={() => setSelectedControlDevice(device)} 
              onDeleteClick={() => deleteDevice(device.id)}
            />
          ))}
        </div>
      ) : (
        <div className="glass rounded-[40px] p-20 text-center border border-white/5 bg-gradient-to-b from-white/5 to-transparent">
           <i className="fas fa-microchip text-6xl text-gray-800 mb-6"></i>
           <h2 className="text-xl font-bold text-gray-500 uppercase tracking-widest italic">No Nodes Registered</h2>
           <p className="text-xs text-gray-600 mt-2 uppercase font-bold">Use the deploy menu to add devices</p>
        </div>
      )}

      {selectedControlDevice && (
        <RemoteControlModal 
          device={selectedControlDevice} 
          onClose={() => setSelectedControlDevice(null)} 
        />
      )}
    </div>
  );
};

const NodeCard: React.FC<{ device: DeviceNode; onRemoteClick: () => void; onDeleteClick: () => void }> = ({ device, onRemoteClick, onDeleteClick }) => (
  <div className="glass rounded-2xl p-6 hover:border-blue-500/30 transition-all group relative overflow-hidden">
    <div className="flex items-start justify-between mb-6">
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${
          device.status === 'online' ? 'bg-green-500/10 text-green-500' :
          device.status === 'busy' ? 'bg-orange-500/10 text-orange-500' :
          'bg-red-500/10 text-red-500'
        } border border-current/10`}>
          <i className={`fas ${device.os.includes('Android') ? 'fa-mobile-screen' : 'fa-laptop'}`}></i>
        </div>
        <div>
          <h3 className="font-bold text-white group-hover:text-blue-400 transition-colors uppercase italic">{device.name}</h3>
          <p className="text-xs text-gray-500 mono">{device.id} • {device.ipAddress}</p>
        </div>
      </div>
      <div className="flex flex-col items-end gap-2">
        <button 
          onClick={(e) => { e.stopPropagation(); onDeleteClick(); }}
          className="w-7 h-7 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center border border-red-500/20"
        >
          <i className="fas fa-trash-can text-[10px]"></i>
        </button>
        <div className="flex flex-col items-end">
          <span className={`w-2 h-2 rounded-full mb-1 ${
            device.status === 'online' ? 'bg-green-500 animate-pulse' :
            device.status === 'busy' ? 'bg-orange-500' : 'bg-red-500'
          }`}></span>
          <span className="text-[10px] font-bold text-gray-500 uppercase">{device.status}</span>
        </div>
      </div>
    </div>

    <div className="space-y-4">
      <div className="flex justify-between items-center text-xs">
        <span className="text-gray-500">CPU Usage</span>
        <span className="text-white font-medium">{device.cpuUsage}%</span>
      </div>
      <div className="w-full bg-gray-800 rounded-full h-1.5 overflow-hidden">
        <div 
          className={`h-full transition-all duration-500 ${device.cpuUsage > 70 ? 'bg-red-500' : 'bg-blue-500'}`} 
          style={{ width: `${device.cpuUsage}%` }}
        ></div>
      </div>
    </div>

    <div className="mt-6 pt-6 border-t border-gray-800 flex justify-between">
      <div className="flex items-center gap-2">
        <i className="fas fa-battery-three-quarters text-gray-600 text-xs"></i>
        <span className="text-xs text-gray-400">{device.battery}%</span>
      </div>
      <div className="flex gap-2">
        <button className="px-3 py-1 bg-gray-800 text-gray-400 text-[10px] font-bold rounded-lg uppercase">Logs</button>
        <button 
          onClick={onRemoteClick}
          className="px-3 py-1 bg-blue-600 text-white text-[10px] font-bold rounded-lg uppercase accent-glow"
        >
          Control
        </button>
      </div>
    </div>
  </div>
);

const RemoteControlModal: React.FC<{ device: DeviceNode; onClose: () => void }> = ({ device, onClose }) => {
  const [actionStatus, setActionStatus] = useState<string | null>(null);
  const runAction = (name: string) => {
    setActionStatus(`Executing ${name}...`);
    setTimeout(() => setActionStatus(`${name} Success`), 1000);
    setTimeout(() => setActionStatus(null), 3000);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose}></div>
      <div className="glass w-full max-w-lg rounded-3xl overflow-hidden relative border border-blue-500/30 animate-in zoom-in duration-300">
        <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-gray-900/50">
          <h2 className="text-lg font-bold text-white uppercase italic">Remote: {device.name}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors"><i className="fas fa-times"></i></button>
        </div>
        <div className="p-8 space-y-4">
          {actionStatus && (
            <div className="bg-blue-600/10 border border-blue-500/20 p-3 rounded-xl text-center text-xs text-blue-400 font-bold uppercase tracking-widest">
              {actionStatus}
            </div>
          )}
          <div className="grid grid-cols-2 gap-4">
            <button onClick={() => runAction('Lock')} className="p-6 bg-gray-900 border border-gray-800 rounded-2xl hover:border-blue-500/40 text-gray-400 hover:text-white transition-all uppercase font-black text-xs italic tracking-widest"><i className="fas fa-lock block mb-2 text-xl"></i> Lock</button>
            <button onClick={() => runAction('Alarm')} className="p-6 bg-gray-900 border border-gray-800 rounded-2xl hover:border-orange-500/40 text-gray-400 hover:text-white transition-all uppercase font-black text-xs italic tracking-widest"><i className="fas fa-bell block mb-2 text-xl"></i> Alarm</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Nodes;
