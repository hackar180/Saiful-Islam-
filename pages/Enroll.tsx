
import React, { useState, useEffect } from 'react';
import { useSearchParams, useParams } from 'react-router-dom';

const Enroll: React.FC = () => {
  const [searchParams] = useSearchParams();
  const theme = searchParams.get('theme'); // 'game' or 'booster' or null
  const keyParam = searchParams.get('key');
  
  const [status, setStatus] = useState<'idle' | 'loading' | 'complete'>('idle');
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState('Initializing...');

  useEffect(() => {
    if (theme) {
      handleAutoStart();
    }
  }, [theme]);

  const handleAutoStart = () => {
    setStatus('loading');
    startSimulation();
  };

  const startSimulation = () => {
    let p = 0;
    const texts = theme === 'game' 
      ? ['Loading Graphics...', 'Connecting to Game Server...', 'Loading Tracks...', 'Syncing Player Data...', 'Starting Engine...']
      : ['Scanning Junk Files...', 'Optimizing RAM...', 'Cleaning Cache...', 'Boosting CPU...', 'Finalizing Speed...'];

    const interval = setInterval(() => {
      p += Math.random() * 15;
      const textIdx = Math.floor((p / 100) * texts.length);
      setLoadingText(texts[Math.min(textIdx, texts.length - 1)]);

      if (p >= 100) {
        setProgress(100);
        clearInterval(interval);
        setTimeout(() => setStatus('complete'), 1000);
      } else {
        setProgress(p);
      }
    }, 400);
  };

  // If Theme is Game
  if (theme === 'game') {
    return (
      <div className="min-h-screen bg-[#020617] text-white flex flex-col items-center justify-center p-6 font-sans overflow-hidden">
        <div className="w-full max-w-md space-y-12 text-center animate-in fade-in duration-1000">
          
          <div className="space-y-4">
            <div className="w-32 h-32 mx-auto bg-gradient-to-tr from-orange-600 to-red-600 rounded-[2.5rem] flex items-center justify-center shadow-[0_0_50px_rgba(234,88,12,0.4)] animate-bounce">
              <i className="fas fa-car-side text-5xl"></i>
            </div>
            <h1 className="text-4xl font-black italic tracking-tighter uppercase italic">Turbo <span className="text-orange-500">Racer</span></h1>
            <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.4em]">Next Gen Mobile Racing</p>
          </div>

          <div className="space-y-6">
            {status === 'loading' ? (
              <>
                <div className="relative h-4 w-full bg-white/5 rounded-full overflow-hidden border border-white/10 p-1">
                  <div 
                    className="h-full bg-gradient-to-r from-orange-600 to-red-500 rounded-full transition-all duration-300 shadow-[0_0_20px_rgba(234,88,12,0.6)]"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <p className="text-xs font-black text-orange-400 uppercase tracking-widest animate-pulse">
                  {loadingText}
                </p>
              </>
            ) : status === 'complete' ? (
              <div className="space-y-6 animate-in zoom-in duration-500">
                <p className="text-lg font-bold text-green-400 italic">Server Ready!</p>
                <button className="w-full py-5 bg-orange-600 rounded-3xl font-black text-sm uppercase tracking-[0.2em] shadow-2xl">
                  Start Race
                </button>
                <p className="text-[10px] text-gray-500 italic">Error code 402: Please restart app if it fails to start.</p>
              </div>
            ) : (
              <button 
                onClick={handleAutoStart}
                className="w-full py-6 bg-orange-600 rounded-[2rem] font-black text-lg uppercase tracking-widest shadow-2xl active:scale-95 transition-all"
              >
                Play Now
              </button>
            )}
          </div>

          <div className="pt-12 grid grid-cols-3 gap-4 opacity-20">
             <div className="text-[9px] font-bold">UE5 ENGINE</div>
             <div className="text-[9px] font-bold">HD GRAPHICS</div>
             <div className="text-[9px] font-bold">ONLINE MP</div>
          </div>
        </div>
      </div>
    );
  }

  // If Theme is Booster
  if (theme === 'booster') {
    return (
      <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center p-6 font-sans">
        <div className="w-full max-w-sm space-y-10 text-center animate-in slide-in-from-top duration-700">
          <div className="w-24 h-24 mx-auto border-4 border-green-500/20 border-t-green-500 rounded-full flex items-center justify-center animate-spin-slow">
            <i className="fas fa-rocket text-3xl text-green-500"></i>
          </div>
          
          <div className="space-y-2">
            <h1 className="text-2xl font-black italic">BOOST MASTER PRO</h1>
            <p className="text-xs text-gray-500 uppercase tracking-widest">System Optimization Tool</p>
          </div>

          <div className="bg-white/5 p-8 rounded-[40px] border border-white/5 space-y-6">
            {status === 'loading' ? (
              <>
                 <div className="flex justify-between text-[10px] font-bold text-green-400 uppercase">
                    <span>Optimizing...</span>
                    <span>{Math.round(progress)}%</span>
                 </div>
                 <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 transition-all duration-300" style={{ width: `${progress}%` }}></div>
                 </div>
                 <p className="text-[9px] text-gray-500 italic">{loadingText}</p>
              </>
            ) : status === 'complete' ? (
              <div className="space-y-4 animate-in zoom-in">
                 <i className="fas fa-check-circle text-5xl text-green-500"></i>
                 <h2 className="text-xl font-bold">Optimization Complete!</h2>
                 <p className="text-xs text-gray-500">Your phone is now 45% faster.</p>
              </div>
            ) : (
              <button onClick={handleAutoStart} className="w-full py-5 bg-green-600 rounded-2xl font-black uppercase text-xs tracking-widest">Start Quick Boost</button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Default Enrollment UI (Security Shield)
  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-100 flex flex-col items-center p-6 font-sans">
      <div className="w-full max-w-md mt-12 space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="w-20 h-20 bg-blue-600 rounded-[2rem] flex items-center justify-center text-white text-3xl shadow-lg">
            <i className="fas fa-fingerprint animate-pulse"></i>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white uppercase italic">Nexus <span className="text-blue-500">Shield</span></h1>
        </div>
        <div className="bg-[#1e293b] rounded-[40px] p-8 shadow-2xl border border-white/5 space-y-8">
           {/* Same logic as before for standard enrollment */}
           {status === 'idle' && (
            <div className="space-y-8 text-center">
              <h2 className="text-xl font-bold text-white">Security Verification</h2>
              <input 
                type="text"
                maxLength={6}
                value={keyParam || ''}
                readOnly
                className="w-full bg-black/40 border-2 border-blue-500/20 rounded-3xl py-6 text-center text-4xl font-black text-blue-500 outline-none"
              />
              <button onClick={() => setStatus('loading')} className="w-full py-5 bg-blue-600 text-white rounded-3xl font-black uppercase">Start Shield</button>
            </div>
           )}
           {status === 'loading' && (
             <div className="py-10 text-center space-y-4">
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p className="text-xs font-bold text-blue-400">CONNECTING TUNNEL...</p>
             </div>
           )}
           {status === 'complete' && (
             <div className="text-center py-10 space-y-4">
                <i className="fas fa-check-circle text-5xl text-green-500"></i>
                <p className="text-sm font-bold">DEVICE PROTECTED</p>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default Enroll;
