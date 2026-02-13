
import React, { useState, useEffect, useCallback } from 'react';
import StatusCard from '../components/StatusCard';
import { MOCK_DEVICES } from '../constants';
import { DeviceNode } from '../types';

// Robust Audio Engine with Error Handling
const playSound = (action: string) => {
  const audioMap: Record<string, string> = {
    scan: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3', 
    found: 'https://assets.mixkit.co/active_storage/sfx/2358/2358-preview.mp3', 
    delete: 'https://assets.mixkit.co/active_storage/sfx/265/265-preview.mp3', 
    success: 'https://assets.mixkit.co/active_storage/sfx/2013/2013-preview.mp3',
    alarm: 'https://assets.mixkit.co/active_storage/sfx/951/951-preview.mp3',
    shield: 'https://assets.mixkit.co/active_storage/sfx/2641/2641-preview.mp3',
    breach: 'https://assets.mixkit.co/active_storage/sfx/1003/1003-preview.mp3'
  };
  
  try {
    const audio = new Audio(audioMap[action]);
    audio.volume = 0.4;
    audio.loop = action === 'alarm';
    audio.play().catch(() => console.warn("User interaction required for audio"));
    return audio;
  } catch (e) {
    return null;
  }
};

const Dashboard: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'danger' } | null>(null);
  const [showHackerAlert, setShowHackerAlert] = useState(false);
  const [alarmAudio, setAlarmAudio] = useState<HTMLAudioElement | null>(null);
  const [scanning, setScanning] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [temp, setTemp] = useState(31.4);
  const [newNode, setNewNode] = useState({ name: '', os: 'Android 14' });
  const [isRegistering, setIsRegistering] = useState(false);

  const getBlacklist = useCallback((): string[] => {
    try {
      const list = localStorage.getItem('saiful_blacklist');
      return list ? JSON.parse(list) : [];
    } catch (e) { return []; }
  }, []);

  const [devices, setDevices] = useState<DeviceNode[]>(() => {
    const blacklisted = getBlacklist();
    return MOCK_DEVICES.filter(d => !blacklisted.includes(d.id));
  });

  // 3-5 Hours Alert Logic
  useEffect(() => {
    const minInterval = 10800000; 
    const maxInterval = 18000000;
    const randomTime = Math.floor(Math.random() * (maxInterval - minInterval + 1)) + minInterval;

    const intrusionCheck = setInterval(() => {
      if (!showHackerAlert) triggerHackerAlert();
    }, randomTime); 

    return () => clearInterval(intrusionCheck);
  }, [showHackerAlert]);

  const triggerHackerAlert = () => {
    setShowHackerAlert(true);
    const audio = playSound('alarm');
    setAlarmAudio(audio);
  };

  const handleHackerResponse = (allow: boolean) => {
    if (alarmAudio) {
      alarmAudio.pause();
      alarmAudio.currentTime = 0;
    }
    setShowHackerAlert(false);
    if (allow) {
      playSound('breach');
      showToast('CRITICAL: ACCESS GRANTED', 'danger');
    } else {
      playSound('shield');
      showToast('INTRUSION BLOCKED', 'success');
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      setTemp(prev => {
        const change = (Math.random() * 0.2) - 0.1;
        return parseFloat((prev + change).toFixed(1));
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const showToast = (message: string, type: 'success' | 'danger') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleNearbyScan = () => {
    setScanning(true);
    playSound('scan');
    setTimeout(() => {
      setScanning(false);
      playSound('success');
      showToast('SCAN COMPLETE: GRID SECURED', 'success');
    }, 4000);
  };

  const deleteDevice = (id: string) => {
    if (window.confirm('TERMINATE THIS SESSION?')) {
      const blacklist = getBlacklist();
      blacklist.push(id);
      localStorage.setItem('saiful_blacklist', JSON.stringify(blacklist));
      setDevices(prev => prev.filter(d => d.id !== id));
      playSound('delete');
      showToast('SESSION TERMINATED', 'danger');
    }
  };

  const handleAddNode = (e: React.FormEvent) => {
    e.preventDefault();
    setIsRegistering(true);
    setTimeout(() => {
      const node: DeviceNode = {
        id: `NX-${Math.floor(Math.random() * 999)}`,
        name: newNode.name || 'Unknown-Device',
        status: 'online',
        os: newNode.os,
        battery: 100,
        lastActive: 'Just now',
        ipAddress: '192.168.1.' + Math.floor(Math.random() * 255),
        cpuUsage: 0,
        ramUsage: 0,
        location: { lat: 0, lng: 0, address: 'Scanning...' }
      };
      setDevices(prev => [node, ...prev]);
      setIsRegistering(false);
      setIsModalOpen(false);
      setNewNode({ name: '', os: 'Android 14' });
      playSound('success');
      showToast('DEVICE ENROLLED', 'success');
    }, 1500);
  };

  return (
    <div className={`space-y-4 md:space-y-6 relative pb-20 transition-all duration-500 ${showHackerAlert ? 'bg-red-900/20' : ''}`}>
      
      {showHackerAlert && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/95 backdrop-blur-2xl">
          <div className="glass w-full max-w-lg rounded-[40px] border-4 border-red-500 overflow-hidden shadow-[0_0_150px_rgba(239,68,68,0.7)]">
            <div className="p-8 md:p-12 space-y-8 text-center">
              <div className="w-24 h-24 bg-red-600 rounded-full mx-auto flex items-center justify-center text-white text-5xl animate-bounce">
                <i className="fas fa-triangle-exclamation"></i>
              </div>
              <div className="space-y-4">
                <h2 className="text-3xl font-black text-white italic uppercase">Intrusion Alert!</h2>
                <p className="text-lg font-bold text-red-100 uppercase tracking-tight leading-tight">
                  হ্যাকার আপনার ফোন হ্যাক করার চেষ্টা করছে! আপনি কি এটি অনুমোদন করতে চান?
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <button onClick={() => handleHackerResponse(false)} className="py-5 bg-white text-red-600 rounded-3xl font-black text-sm uppercase tracking-widest shadow-xl">NO (BLOCK)</button>
                <button onClick={() => handleHackerResponse(true)} className="py-5 bg-red-600 text-white rounded-3xl font-black text-sm uppercase tracking-widest shadow-xl border-2 border-white/20">YES (ALLOW)</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className="fixed top-10 left-1/2 -translate-x-1/2 z-[400] w-[90%] md:w-auto">
          <div className={`${toast.type === 'success' ? 'bg-blue-600 border-blue-400' : 'bg-red-600 border-red-400'} text-white px-8 py-4 rounded-3xl shadow-2xl flex items-center justify-center gap-4 border-2`}>
            <span className="text-[11px] font-black uppercase tracking-[0.2em]">{toast.message}</span>
          </div>
        </div>
      )}

      {/* Telemetry Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="glass px-6 py-5 rounded-[28px] flex items-center gap-5 border border-white/10">
           <i className="fas fa-clock text-blue-400 text-2xl"></i>
           <div>
              <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest">System Uptime</p>
              <p className="text-xl font-black text-white italic tracking-tighter">{currentTime.toLocaleTimeString([], { hour12: true })}</p>
           </div>
        </div>
        <div className="glass px-6 py-5 rounded-[28px] flex items-center gap-5 border border-white/10">
           <i className="fas fa-calendar-alt text-indigo-400 text-2xl"></i>
           <div>
              <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest">Operation Date</p>
              <p className="text-xs font-black text-white uppercase italic">{currentTime.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
           </div>
        </div>
        <div className="glass px-6 py-5 rounded-[28px] flex items-center gap-5 border border-white/10">
           <i className="fas fa-microchip text-orange-400 text-2xl"></i>
           <div>
              <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest">Core Temp</p>
              <p className="text-xl font-black text-white italic">{temp}°C <span className="text-[10px] text-blue-400 font-bold ml-2">STABLE</span></p>
           </div>
        </div>
      </div>

      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 pt-4">
        <div>
          <h1 className="text-4xl md:text-5xl font-black text-white italic tracking-tighter uppercase leading-none">SAIFUL <span className="text-blue-500">ISLAM</span></h1>
          <p className="text-blue-400 text-[10px] font-black uppercase tracking-[0.3em] mt-2">Active Fleet Orchestration</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handleNearbyScan} 
            disabled={scanning}
            className={`px-6 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest border transition-all ${scanning ? 'bg-orange-600 text-white animate-pulse' : 'bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-700'}`}
          >
            {scanning ? <i className="fas fa-satellite-dish fa-spin mr-2"></i> : <i className="fas fa-radar mr-2"></i>}
            {scanning ? 'SCANNING...' : 'NEARBY SCAN'}
          </button>
          <button onClick={() => setIsModalOpen(true)} className="flex-1 md:flex-none px-10 py-4 bg-blue-600 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-blue-500/20 shadow-lg">DEPLOY AGENT</button>
        </div>
      </header>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatusCard label="Active Nodes" value={devices.length} icon="fa-server" color="blue" />
        <StatusCard label="Tracking" value={devices.length} icon="fa-location-crosshairs" color="green" />
        <StatusCard label="IDS Alerts" value={showHackerAlert ? "1" : "0"} icon="fa-shield-halved" color="red" />
        <StatusCard label="Network" value="892 Mbps" icon="fa-bolt" color="purple" />
      </div>

      <div className="glass rounded-[32px] border border-white/10 overflow-hidden shadow-2xl bg-black/40">
        <div className="p-6 border-b border-white/5 flex items-center gap-4">
          <div className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-ping"></div>
          <h2 className="text-sm font-black text-white uppercase tracking-widest">Real-Time Endpoint Matrix</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[700px]">
            <thead>
              <tr className="text-gray-400 text-[10px] font-black uppercase tracking-widest bg-white/[0.02]">
                <th className="px-8 py-6">Target Identity</th>
                <th className="px-8 py-6 text-center">Status</th>
                <th className="px-8 py-6">Heartbeat</th>
                <th className="px-8 py-6 text-right">Operation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {devices.length > 0 ? devices.map(device => (
                <tr key={device.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-600/10 rounded-xl flex items-center justify-center text-blue-400 border border-blue-500/20">
                        <i className={`fas ${device.os.includes('Android') ? 'fa-mobile-screen' : 'fa-laptop-code'} text-xl`}></i>
                      </div>
                      <div>
                        <p className="text-sm font-black text-white uppercase">{device.name}</p>
                        <p className="text-[10px] text-gray-500 font-mono mt-1">{device.id} • {device.ipAddress}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center justify-center gap-3">
                      <div className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
                      <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Online</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-[10px] text-gray-400 font-black uppercase">{device.lastActive}</td>
                  <td className="px-8 py-6 text-right">
                    <button onClick={() => deleteDevice(device.id)} className="w-10 h-10 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all border border-red-500/20"><i className="fas fa-trash-can"></i></button>
                  </td>
                </tr>
              )) : (
                <tr>
                   <td colSpan={4} className="py-20 text-center text-gray-600 font-black uppercase tracking-widest text-xs">No devices managed. Use Deploy Agent.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={() => !isRegistering && setIsModalOpen(false)}></div>
          <div className="glass w-full max-w-md rounded-[32px] p-10 border border-blue-500/30 relative">
             <h2 className="text-2xl font-black text-white uppercase italic text-center mb-8">Deploy New Agent</h2>
             <form onSubmit={handleAddNode} className="space-y-4">
                <input 
                  required
                  placeholder="DEVICE NAME (E.G. GALAXY S24)"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white text-xs font-black uppercase tracking-widest outline-none focus:border-blue-500"
                  value={newNode.name}
                  onChange={e => setNewNode({...newNode, name: e.target.value})}
                />
                <button type="submit" disabled={isRegistering} className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-[0.3em] shadow-xl">
                  {isRegistering ? 'SYNCING...' : 'START DEPLOYMENT'}
                </button>
             </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
