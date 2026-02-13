
import React, { useState } from 'react';
import { MOCK_DEVICES } from '../constants';

const Camera: React.FC = () => {
  const [selectedNode, setSelectedNode] = useState(MOCK_DEVICES[0].id);
  const [isCapturing, setIsCapturing] = useState(false);
  const [lastSnapshot, setLastSnapshot] = useState<string | null>(null);

  const activeNode = MOCK_DEVICES.find(d => d.id === selectedNode);

  const handleCapture = () => {
    setIsCapturing(true);
    // Simulate remote network delay
    setTimeout(() => {
      setIsCapturing(false);
      setLastSnapshot(`https://picsum.photos/seed/${Math.random()}/800/600`);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Visual Intel</h1>
          <p className="text-gray-400">Remote imaging and surveillance modules.</p>
        </div>
        <select 
          value={selectedNode}
          onChange={(e) => setSelectedNode(e.target.value)}
          className="bg-gray-900 border border-gray-800 text-white text-sm rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500/50"
        >
          {MOCK_DEVICES.filter(d => d.status !== 'offline').map(d => (
            <option key={d.id} value={d.id}>{d.name} ({d.id})</option>
          ))}
        </select>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="glass rounded-3xl overflow-hidden aspect-video relative group bg-black/40 border-2 border-white/5 shadow-2xl">
            {lastSnapshot ? (
              <img src={lastSnapshot} alt="Snapshot" className="w-full h-full object-cover animate-in fade-in duration-500" />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-600">
                <i className="fas fa-camera-slash text-6xl mb-4 opacity-20"></i>
                <p className="text-sm font-medium">No Active Stream Feed</p>
              </div>
            )}
            
            <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 bg-black/60 backdrop-blur-md rounded-full border border-white/10">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
              <span className="text-[10px] font-bold text-white uppercase tracking-widest">Live Node: {activeNode?.id}</span>
            </div>

            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <button 
                onClick={handleCapture}
                disabled={isCapturing}
                className={`w-14 h-14 rounded-full flex items-center justify-center text-xl transition-all shadow-xl ${
                  isCapturing ? 'bg-gray-700 scale-95' : 'bg-white text-black hover:bg-blue-500 hover:text-white active:scale-90'
                }`}
              >
                {isCapturing ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-camera"></i>}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="glass p-4 rounded-2xl flex flex-col items-center justify-center gap-2">
              <i className="fas fa-expand text-blue-400"></i>
              <span className="text-[10px] text-gray-500 uppercase font-bold">Zoom Level</span>
              <span className="text-white text-sm font-bold">1.0x</span>
            </div>
            <div className="glass p-4 rounded-2xl flex flex-col items-center justify-center gap-2">
              <i className="fas fa-lightbulb text-yellow-400"></i>
              <span className="text-[10px] text-gray-500 uppercase font-bold">Flash Control</span>
              <span className="text-white text-sm font-bold">AUTO</span>
            </div>
            <div className="glass p-4 rounded-2xl flex flex-col items-center justify-center gap-2">
              <i className="fas fa-video text-green-400"></i>
              <span className="text-[10px] text-gray-500 uppercase font-bold">Resolution</span>
              <span className="text-white text-sm font-bold">1080p</span>
            </div>
          </div>
        </div>

        <div className="glass rounded-3xl p-6 flex flex-col space-y-6">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <i className="fas fa-images text-blue-400"></i> Snapshot History
          </h2>
          <div className="flex-1 overflow-y-auto space-y-4 pr-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="group relative rounded-xl overflow-hidden border border-white/5 cursor-pointer">
                <img src={`https://picsum.photos/seed/cam${i}/200/120`} className="w-full h-24 object-cover grayscale group-hover:grayscale-0 transition-all" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent p-3 flex flex-col justify-end">
                  <p className="text-[10px] text-white font-bold">Captured 1{i}:24 PM</p>
                  <p className="text-[8px] text-gray-400">NX-00{i} • Camera Front</p>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-sm accent-glow transition-all">
            Download Batch (.zip)
          </button>
        </div>
      </div>
    </div>
  );
};

export default Camera;
