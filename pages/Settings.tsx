
import React, { useState, useEffect } from 'react';

const Settings: React.FC = () => {
  const [telegramToken, setTelegramToken] = useState('7661259658:AAH_XyRnVbL6Squha70cO_zFVmdH11WBm8I');
  const [chatId, setChatId] = useState('6541663008');
  const [publicUrl, setPublicUrl] = useState(localStorage.getItem('nexus_public_url') || '');
  const [showToken, setShowToken] = useState(false);

  const botCommand = `/start_tracking --token=${telegramToken.substring(0, 8)}... --id=${chatId}`;

  const handleSave = () => {
    localStorage.setItem('nexus_public_url', publicUrl);
    alert('Settings synchronized successfully!');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20 px-2 md:px-0">
      <header className="space-y-2">
        <h1 className="text-3xl font-black text-white italic tracking-tight">SYSTEM <span className="text-blue-500">CONFIG</span></h1>
        <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.2em]">Credential & Protocol Management</p>
      </header>

      {/* NEW: Public Gateway Section */}
      <section className="glass rounded-[32px] border border-orange-500/20 overflow-hidden bg-gradient-to-br from-orange-600/5 to-transparent">
        <div className="p-8 border-b border-white/5 flex items-center gap-4">
           <div className="w-12 h-12 bg-orange-600/10 rounded-2xl flex items-center justify-center text-orange-500">
              <i className="fas fa-globe text-2xl"></i>
           </div>
           <div>
              <h2 className="text-lg font-bold text-white italic">Public Gateway (Fix 404 Error)</h2>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">অন্য ফোনে লিঙ্ক কাজ করার জন্য এখানে আপনার পাবলিক URL দিন।</p>
           </div>
        </div>
        <div className="p-8 space-y-4">
           <div className="space-y-3">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">Target Public Address</label>
              <input 
                type="text"
                placeholder="https://your-public-link.com"
                value={publicUrl}
                onChange={(e) => setPublicUrl(e.target.value)}
                className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-4 px-6 text-orange-300 outline-none focus:border-orange-500/50 mono text-xs transition-all"
              />
              <p className="text-[9px] text-gray-500 italic px-2 leading-relaxed">
                * যদি আপনি Ngrok বা Cloudflare Tunnel ব্যবহার করেন, তবে সেই লিঙ্কটি এখানে দিন। খালি রাখলে বর্তমান ব্রাউজারের লিঙ্কটিই ব্যবহার হবে।
              </p>
           </div>
        </div>
      </section>

      <section className="glass rounded-[32px] border border-white/5 overflow-hidden">
        <div className="p-8 border-b border-white/5 bg-blue-600/5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-400">
              <i className="fab fa-telegram-plane text-2xl"></i>
            </div>
            <div>
              <h2 className="text-lg font-bold text-white italic">Telegram Notification Relay</h2>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Active API Connection</p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 rounded-full border border-green-500/20">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-[9px] font-black text-green-500 uppercase">Live</span>
          </div>
        </div>

        <div className="p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">Bot API Token</label>
              <div className="relative">
                <input 
                  type={showToken ? "text" : "password"}
                  value={telegramToken}
                  onChange={(e) => setTelegramToken(e.target.value)}
                  className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-4 px-6 text-blue-300 outline-none focus:border-blue-500/50 mono text-xs transition-all"
                />
                <button 
                  onClick={() => setShowToken(!showToken)}
                  className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-600 hover:text-white transition-colors"
                >
                  <i className={`fas ${showToken ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                </button>
              </div>
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">Admin Chat ID</label>
              <input 
                type="text"
                value={chatId}
                onChange={(e) => setChatId(e.target.value)}
                className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-4 px-6 text-white outline-none focus:border-blue-500/50 mono text-xs transition-all"
              />
            </div>
          </div>

          <div className="p-6 bg-black/40 border border-blue-500/20 rounded-2xl space-y-4">
             <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Bot Command Generator</span>
                <span className="text-[10px] text-gray-500 uppercase font-bold">Use in Telegram</span>
             </div>
             <div className="p-4 bg-gray-950 rounded-xl border border-white/5 font-mono text-[10px] text-blue-300 break-all select-all flex justify-between items-center group">
                <code>{botCommand}</code>
                <i className="fas fa-copy text-gray-700 group-hover:text-blue-500 cursor-pointer ml-4" onClick={() => navigator.clipboard.writeText(botCommand)}></i>
             </div>
          </div>
        </div>
      </section>

      <div className="flex justify-end gap-4">
        <button onClick={handleSave} className="w-full md:w-auto px-10 py-4 bg-blue-600 hover:bg-blue-500 text-white font-black text-[10px] uppercase tracking-widest rounded-2xl shadow-2xl shadow-blue-600/30 transition-all">
          Apply & Sync Settings
        </button>
      </div>
    </div>
  );
};

export default Settings;
