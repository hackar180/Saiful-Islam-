
import React, { useState, useEffect, useCallback } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import StatusCard from '../components/StatusCard';
import { MOCK_LOGS, MOCK_DEVICES } from '../constants';
import { analyzeLogs } from '../services/geminiService';
import { DeviceNode } from '../types';

// Enhanced Audio Engine
const playSound = (action: 'scan' | 'found' | 'delete' | 'success' | 'alarm' | 'shield' | 'breach') => {
  const audioMap = {
    scan: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3', 
    found: 'https://assets.mixkit.co/active_storage/sfx/2358/2358-preview.mp3', 
    delete: 'https://assets.mixkit.co/active_storage/sfx/265/265-preview.mp3', 
    success: 'https://assets.mixkit.co/active_storage/sfx/2013/2013-preview.mp3',
    alarm: 'https://assets.mixkit.co/active_storage/sfx/951/951-preview.mp3', // Emergency Siren
    shield: 'https://assets.mixkit.co/active_storage/sfx/2641/2641-preview.mp3', // Digital Shield
    breach: 'https://assets.mixkit.co/active_storage/sfx/1003/1003-preview.mp3'  // Data Breach
  };
  const audio = new Audio(audioMap[action]);
  audio.volume = 0.4;
  audio.loop = action === 'alarm';
  audio.play().catch(() => {});
  return audio;
};

const Dashboard: React.FC = () => {
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'danger' | 'warning' } | null>(null);
  
  // Intrusion Alert State
  const [showHackerAlert, setShowHackerAlert] = useState(false);
  const [alarmAudio, setAlarmAudio] = useState<HTMLAudioElement | null>(null);
  
  const getBlacklist = useCallback((): string[] => {
    const list = localStorage.getItem('saiful_blacklist');
    return list ? JSON.parse(list) : [];
  }, []);

  const [devices, setDevices] = useState<DeviceNode[]>(() => {
    const blacklisted = getBlacklist();
    return MOCK_DEVICES.filter(d => !blacklisted.includes(d.id));
  });

  const [scanning, setScanning] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [temp, setTemp] = useState(31.4);
  const [tempTrend, setTempTrend] = useState<'up' | 'down'>('up');
  const [newNode, setNewNode] = useState({ name: '', os: 'Android 14' });
  const [isRegistering, setIsRegistering] = useState(false);

  // Periodic Intrusion Detection Logic (Updated to 3-5 Hours)
  useEffect(() => {
    // 3 hours = 10,800,000 ms | 5 hours = 18,000,000 ms
    const minInterval = 10800000; 
    const maxInterval = 18000000;
    
    // Set a random time between 3 and 5 hours
    const randomTime = Math.floor(Math.random() * (maxInterval - minInterval + 1)) + minInterval;

    const intrusionCheck = setInterval(() => {
      if (!showHackerAlert) {
        triggerHackerAlert();
      }
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
      showToast('CRITICAL: REMOTE ACCESS GRANTED TO UNKNOWN SOURCE', 'danger');
      document.body.classList.add('animate-pulse');
      setTimeout(() => document.body.classList.remove('animate-pulse'), 5000);
    } else {
      playSound('shield');
      showToast('INTRUSION BLOCKED: SECURITY PROTOCOLS ACTIVE', 'success');
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      setTemp(prev => {
        const change = (Math.random() * 0.2) - 0.1;
        setTempTrend(change > 0 ? 'up' : 'down');
        return parseFloat((prev + change).toFixed(1));
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const showToast = (message: string, type: 'success' | 'danger' | 'warning') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleNearbyScan = () => {
    setScanning(true);
    playSound('scan');
    setTimeout(() => {
      setScanning(false);
      playSound('success');
      showToast('SCAN COMPLETE: GRID SECURED. NO NEW TARGETS DETECTED.', 'success');
    }, 4500);
  };

  const deleteDevice = (id: string) => {
    if (window.confirm('PERMANENTLY TERMINATE THIS ENDPOINT?')) {
      const blacklist = getBlacklist();
      blacklist.push(id);
      localStorage.setItem('saiful_blacklist', JSON.stringify(blacklist));
      setDevices(prev => prev.filter(d => d.id !== id));
      playSound('delete');
      showToast('DELETION SUCCESSFUL', 'danger');
    }
  };

  const handleAddNode = (e: React.FormEvent) => {
    e.preventDefault();
    setIsRegistering(true);
    setTimeout(() => {
      const node: DeviceNode = {
        id: `NX-${Date.now().toString().slice(-4)}`,
        name: newNode.name || 'Manual-Node',
        status: 'online',
        os: newNode.os,
        battery: 100,
        lastActive: 'Just now',
        ipAddress: '127.0.0.1',
        cpuUsage: 0,
        ramUsage: 0,
        location: { lat: 24.7, lng: 46.6, address: 'Manual Entry' }
      };
      setDevices(prev => [node, ...prev]);
      setIsRegistering(false);
      setIsModalOpen(false);
      setNewNode({ name: '', os: 'Android 14' });
      playSound('success');
      showToast('DEPLOYMENT SUCCESSFUL', 'success');
    }, 1200);
  };

  return (
    <div className={`space-y-4 md:space-y-6 relative pb-10 transition-colors duration-500 ${showHackerAlert ? 'bg-red-900/20' : ''}`}>
      
      {/* Hacker Alert Modal */}
      {showHackerAlert && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 md:p-6 bg-red-950/90 backdrop-blur-2xl">
          <div className="glass w-full max-w-lg rounded-[40px] border-4 border-red-500 overflow-hidden shadow-[0_0_150px_rgba(239,68,68,0.7)] animate-in zoom-in duration-300">
            <div className="p-8 md:p-12 space-y-8 text-center">
              <div className="w-20 h-20 md:w-24 md:h-24 bg-red-600 rounded-full mx-auto flex items-center justify-center text-white text-4xl md:text-5xl animate-bounce">
                <i className="fas fa-triangle-exclamation"></i>
              </div>
              <div className="space-y-4">
                <h2 className="text-2xl md:text-4xl font-black text-white italic uppercase tracking-tighter">Intrusion Alert!</h2>
                <div className="space-y-1">
                  <p className="text-sm md:text-lg font-black text-red-100 uppercase tracking-widest leading-tight">
                    হ্যাকার আপনার ফোন হ্যাক করার চেষ্টা করছে!
                  </p>
                  <p className="text-[10px] md:text-xs font-bold text-red-400 uppercase tracking-widest">
                    আপনি কি এই এক্সেস অনুমোদন করতে চান?
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 md:gap-6">
                <button 
                  onClick={() => handleHackerResponse(false)}
                  className="py-4 md:py-5 bg-white text-red-600 rounded-2xl md:rounded-3xl font-black text-xs md:text-sm uppercase tracking-widest shadow-xl hover:scale-105 transition-all"
                >
                  NO (BLOCK)
                </button>
                <button 
                  onClick={() => handleHackerResponse(true)}
                  className="py-4 md:py-5 bg-red-600 text-white rounded-2xl md:rounded-3xl font-black text-xs md:text-sm uppercase tracking-widest shadow-xl hover:scale-105 transition-all border-2 border-white/20"
                >
                  YES (ALLOW)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Dynamic Notification Toast */}
      {toast && (
        <div className="fixed top-6 md:top-10 left-1/2 -translate-x-1/2 z-[200] w-[90%] md:w-auto animate-in slide-in-from-top fade-in duration-300">
          <div className={`${
            toast.type === 'success' ? 'bg-blue-600 border-blue-400 shadow-blue-500/50' : 
            toast.type === 'danger' ? 'bg-red-600 border-red-400 shadow-red-500/50' : 
            'bg-orange-600 border-orange-400 shadow-orange-500/50'
          } text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center justify-center gap-4 border-2 backdrop-blur-md`}>
            <i className={`fas ${toast.type === 'success' ? 'fa-circle-check' : toast.type === 'danger' ? 'fa-radiation' : 'fa-triangle-exclamation'} text-lg md:text-xl`}></i>
            <span className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em] text-center">{toast.message}</span>
          </div>
        </div>
      )}

      {/* High-Tech Telemetry Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
        <div className="glass px-5 py-4 rounded-[24px] md:rounded-[32px] flex items-center gap-4 border border-white/5 bg-gradient-to-r from-blue-600/10 to-transparent">
           <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-600/10 rounded-xl md:rounded-2xl flex items-center justify-center text-blue-400 border border-blue-500/20">
              <i className="fas fa-clock text-lg md:text-xl"></i>
           </div>
           <div>
              <p className="text-[8px] md:text-[9px] text-gray-400 font-black uppercase tracking-[0.3em]">System Uptime</p>
              <p className="text-lg md:text-xl font-black text-white italic mono tracking-tighter leading-none mt-1">
                {currentTime.toLocaleTimeString([], { hour12: true })}
              </p>
           </div>
        </div>
        <div className="glass px-5 py-4 rounded-[24px] md:rounded-[32px] flex items-center gap-4 border border-white/5 bg-gradient-to-r from-indigo-600/10 to-transparent">
           <div className="w-10 h-10 md:w-12 md:h-12 bg-indigo-600/10 rounded-xl md:rounded-2xl flex items-center justify-center text-indigo-400 border border-indigo-500/20">
              <i className="fas fa-calendar-alt text-lg md:text-xl"></i>
           </div>
           <div>
              <p className="text-[8px] md:text-[9px] text-gray-400 font-black uppercase tracking-[0.3em]">Operation Date</p>
              <p className="text-[11px] md:text-xs font-black text-white uppercase italic tracking-widest mt-1">
                {currentTime.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
              </p>
           </div>
        </div>
        <div className="glass px-5 py-4 rounded-[24px] md:rounded-[32px] flex items-center gap-4 border border-white/5 bg-gradient-to-r from-orange-600/10 to-transparent relative overflow-hidden">
           <div className="w-10 h-10 md:w-12 md:h-12 bg-orange-600/10 rounded-xl md:rounded-2xl flex items-center justify-center text-orange-400 border border-orange-500/20">
              <i className="fas fa-microchip text-lg md:text-xl"></i>
           </div>
           <div>
              <p className="text-[8px] md:text-[9px] text-gray-400 font-black uppercase tracking-[0.3em]">Core Temp</p>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-lg md:text-xl font-black text-white italic mono">{temp}°C</p>
                <span className={`text-[8px] font-black ${tempTrend === 'up' ? 'text-red-500' : 'text-blue-500'} flex items-center gap-1`}>
                  <i className={`fas fa-caret-${tempTrend}`}></i>
                  {tempTrend === 'up' ? 'HIGH' : 'STABLE'}
                </span>
              </div>
           </div>
        </div>
      </div>

      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 pt-2">
        <div>
          <h1 className="text-3xl md:text-5xl font-black text-white italic tracking-tighter uppercase leading-none">SAIFUL <span className="text-blue-500">ISLAM</span></h1>
          <p className="text-gray-400 text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] mt-2">Fleet Management & Remote Orchestration</p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 md:gap-4">
          <button 
            onClick={handleNearbyScan}
            disabled={scanning}
            className={`px-6 md:px-8 py-3.5 md:py-4 ${scanning ? 'bg-orange-600 animate-pulse' : 'bg-gray-800 hover:bg-gray-700'} text-white rounded-2xl text-[10px] md:text-[11px] font-black transition-all border border-gray-700 uppercase tracking-[0.2em] flex items-center justify-center gap-3 shadow-2xl`}
          >
            {scanning ? <i className="fas fa-satellite-dish fa-spin"></i> : <i className="fas fa-radar"></i>}
            {scanning ? 'SCANNING...' : 'NEARBY SCAN'}
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="px-6 md:px-8 py-3.5 md:py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl text-[10px] md:text-[11px] font-black transition-all border border-blue-500/20 uppercase tracking-[0.2em] shadow-[0_0_30px_rgba(59,130,246,0.3)] text-center"
          >
            DEPLOY AGENT
          </button>
        </div>
      </header>

      {/* Main Grid: Data Visualization */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <StatusCard label="Active Nodes" value={devices.length} icon="fa-server" color="blue" />
        <StatusCard label="Tracking" value={devices.filter(d => d.status === 'online').length} icon="fa-location-crosshairs" color="green" />
        <StatusCard label="IDS Alerts" value={showHackerAlert ? "1" : "0"} icon="fa-shield-halved" color={showHackerAlert ? "red" : "blue"} />
        <StatusCard label="Network" value="892 Mbps" icon="fa-bolt" color="purple" />
      </div>

      {/* Target Feed Table */}
      <div className="glass rounded-[30px] md:rounded-[40px] border border-white/5 overflow-hidden shadow-2xl bg-black/30">
        <div className="p-5 md:p-8 border-b border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/[0.01]">
          <div className="flex items-center gap-4">
            <div className={`w-2.5 h-2.5 rounded-full ${showHackerAlert ? 'bg-red-500 animate-pulse' : 'bg-blue-500 animate-ping'}`}></div>
            <h2 className="text-xs md:text-sm font-black text-white uppercase tracking-[0.3em]">Real-Time Endpoint Matrix</h2>
          </div>
          <div className={`px-4 py-1.5 rounded-full border self-start sm:self-auto ${showHackerAlert ? 'bg-red-600/10 border-red-500/20' : 'bg-blue-600/10 border-blue-500/20'}`}>
            <span className={`text-[9px] md:text-[10px] font-black uppercase tracking-widest ${showHackerAlert ? 'text-red-400' : 'text-blue-400'}`}>
              {showHackerAlert ? 'INTRUSION DETECTED' : 'Global Scan Active'}
            </span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[600px]">
            <thead>
              <tr className="text-gray-500 text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] bg-black/40">
                <th className="px-6 md:px-10 py-5 md:py-6">Target Identity</th>
                <th className="px-6 md:px-10 py-5 md:py-6 text-center">Status</th>
                <th className="px-6 md:px-10 py-5 md:py-6">Heartbeat</th>
                <th className="px-6 md:px-10 py-5 md:py-6 text-right">Operation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.03]">
              {devices.length > 0 ? devices.map(device => (
                <tr key={device.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-6 md:px-10 py-5 md:py-7">
                    <div className="flex items-center gap-4 md:gap-5">
                      <div className="w-12 h-12 md:w-14 md:h-14 bg-blue-600/10 rounded-xl md:rounded-2xl flex items-center justify-center text-blue-400 border border-blue-500/20 group-hover:scale-105 transition-transform duration-300 shadow-lg">
                        <i className={`fas ${device.os.includes('Android') ? 'fa-mobile-screen' : 'fa-laptop-code'} text-lg md:text-xl`}></i>
                      </div>
                      <div>
                        <p className="text-sm font-black text-white group-hover:text-blue-400 transition-colors uppercase tracking-wider leading-none">{device.name}</p>
                        <p className="text-[9px] md:text-[10px] text-gray-500 font-mono mt-2 uppercase">{device.ipAddress} • {device.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 md:px-10 py-5 md:py-7">
                    <div className="flex items-center justify-center gap-3">
                      <div className={`w-2.5 h-2.5 rounded-full ${device.status === 'online' ? 'bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.6)]' : 'bg-red-500'}`}></div>
                      <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">{device.status}</span>
                    </div>
                  </td>
                  <td className="px-6 md:px-10 py-5 md:py-7 text-[10px] text-gray-400 font-black uppercase tracking-widest">
                    {device.lastActive}
                  </td>
                  <td className="px-6 md:px-10 py-5 md:py-7 text-right">
                    <button 
                      onClick={() => deleteDevice(device.id)}
                      className="w-10 h-10 md:w-11 md:h-11 rounded-xl md:rounded-2xl bg-red-500/10 text-red-500 hover:bg-red-600 hover:text-white transition-all inline-flex items-center justify-center border border-red-500/20 group-hover:shadow-[0_0_20px_rgba(239,68,68,0.2)]"
                      title="TERMINATE SESSION"
                    >
                      <i className="fas fa-trash-can text-sm"></i>
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={4} className="px-10 py-32 md:py-40 text-center">
                    <div className="flex flex-col items-center gap-6 opacity-30">
                      <i className="fas fa-satellite-dish text-6xl md:text-7xl text-gray-500 animate-pulse"></i>
                      <p className="text-[10px] md:text-xs text-gray-400 uppercase font-black tracking-[0.4em]">Grid Empty: Initiation Scan Required</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Deployment Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/95 backdrop-blur-xl" onClick={() => !isRegistering && setIsModalOpen(false)}></div>
          <div className="glass w-full max-w-md rounded-[40px] overflow-hidden relative shadow-2xl border border-blue-500/20 animate-in zoom-in duration-300">
            <div className="p-8 md:p-12 space-y-10">
              <div className="text-center space-y-4">
                <div className="w-20 h-20 md:w-24 md:h-24 bg-blue-600 rounded-[30px] mx-auto flex items-center justify-center text-white text-3xl md:text-4xl mb-6 shadow-[0_0_40px_rgba(59,130,246,0.4)]">
                  <i className="fas fa-shield-halved animate-pulse"></i>
                </div>
                <h2 className="text-2xl md:text-3xl font-black text-white italic uppercase tracking-tighter leading-none">Infect Endpoint</h2>
                <p className="text-[9px] md:text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em]">Manual Payload Injection</p>
              </div>
              <form onSubmit={handleAddNode} className="space-y-5">
                <input 
                  type="text" 
                  required
                  placeholder="TARGET ALIAS (E.G. S24-ULTRA)"
                  value={newNode.name}
                  onChange={(e) => setNewNode({...newNode, name: e.target.value})}
                  className="w-full bg-white/[0.04] border border-white/10 rounded-2xl md:rounded-3xl px-6 md:px-8 py-5 md:py-6 text-xs text-white font-black outline-none focus:border-blue-500/50 uppercase tracking-widest transition-all"
                />
                <button 
                  type="submit"
                  disabled={isRegistering}
                  className="w-full py-5 md:py-6 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-800 text-white rounded-2xl md:rounded-3xl font-black text-xs md:text-sm uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-4 shadow-2xl"
                >
                  {isRegistering ? <><i className="fas fa-circle-notch fa-spin"></i> SYNCING...</> : <><i className="fas fa-bolt"></i> EXECUTE DEPLOY</>}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
