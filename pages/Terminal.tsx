
import React, { useState, useRef, useEffect } from 'react';
import { suggestCommands } from '../services/geminiService';

const Terminal: React.FC = () => {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<{ cmd: string; output: string }[]>([
    { cmd: 'system --ver', output: 'NexusCore CLI [Version 2.4.0.12]\n(c) 2024 Nexus Solutions. All rights reserved.\nReady for commands...' }
  ]);
  const [suggestions, setSuggestions] = useState<{ command: string; description: string }[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    let output = '';
    const cmd = input.toLowerCase().trim();

    if (cmd === 'clear') {
      setHistory([]);
      setInput('');
      return;
    } else if (cmd === 'help') {
      output = 'Available commands: nodes, alert, task, clear, help, sys_info';
    } else if (cmd === 'nodes') {
      output = 'FETCHING ACTIVE NODES...\nNX-001: ONLINE\nNX-002: ONLINE\nNX-003: BUSY\nNX-005: ONLINE';
    } else {
      output = `Command not recognized: "${cmd}". Type "help" for a list of available commands.`;
    }

    setHistory(prev => [...prev, { cmd: input, output }]);
    setInput('');
  };

  const fetchAiSuggestions = async () => {
    setLoadingSuggestions(true);
    const results = await suggestCommands("Remote device is experiencing slow response times and high CPU usage.");
    setSuggestions(results);
    setLoadingSuggestions(false);
  };

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col gap-6">
      <header>
        <h1 className="text-3xl font-bold text-white">Command Hub</h1>
        <p className="text-gray-400">Direct interface to fleet orchestration.</p>
      </header>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6 min-h-0">
        <div className="lg:col-span-3 glass rounded-2xl flex flex-col overflow-hidden border-2 border-blue-500/20 shadow-2xl shadow-blue-500/5">
          <div className="bg-gray-900 px-4 py-2 border-b border-gray-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="ml-4 text-xs font-medium text-gray-500 mono">root@nexus-core: ~</span>
            </div>
            <i className="fas fa-lock text-gray-600 text-xs"></i>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6 mono text-sm space-y-4 bg-black/80">
            {history.map((item, i) => (
              <div key={i} className="space-y-1">
                <div className="flex gap-2 text-green-400">
                  <span>➜</span>
                  <span className="text-blue-400">~</span>
                  <span className="text-white font-bold">{item.cmd}</span>
                </div>
                <div className="text-gray-400 whitespace-pre-wrap pl-6 mb-4">{item.output}</div>
              </div>
            ))}
            <div ref={terminalEndRef} />
          </div>

          <form onSubmit={handleCommand} className="p-4 bg-gray-900 border-t border-gray-800 flex items-center gap-3">
            <span className="text-green-400 font-bold mono">➜</span>
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type command..."
              className="flex-1 bg-transparent border-none outline-none text-white mono placeholder-gray-600"
              autoFocus
            />
          </form>
        </div>

        <div className="glass rounded-2xl p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <i className="fas fa-lightbulb text-yellow-400"></i> AI Suggestions
            </h2>
            <button 
              onClick={fetchAiSuggestions}
              disabled={loadingSuggestions}
              className="text-gray-500 hover:text-white transition-colors"
            >
              {loadingSuggestions ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-rotate"></i>}
            </button>
          </div>

          <div className="space-y-4">
            {suggestions.length > 0 ? (
              suggestions.map((s, idx) => (
                <div 
                  key={idx} 
                  className="p-4 bg-gray-900 rounded-xl border border-gray-800 hover:border-blue-500/50 cursor-pointer transition-all group"
                  onClick={() => setInput(s.command)}
                >
                  <code className="text-blue-400 text-xs block mb-1 group-hover:text-blue-300">{s.command}</code>
                  <p className="text-[11px] text-gray-500 leading-relaxed">{s.description}</p>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-xs text-gray-600 italic">Fetch AI suggestions to see intelligent command chains for common issues.</p>
              </div>
            )}
          </div>

          <div className="pt-6 border-t border-gray-800">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Quick Shortcuts</h3>
            <div className="flex flex-wrap gap-2">
              {['--health', '--reboot', '--logs', '--update'].map(tag => (
                <button 
                  key={tag}
                  onClick={() => setInput(tag)}
                  className="px-2 py-1 bg-gray-800 hover:bg-gray-700 text-gray-400 text-[10px] rounded border border-gray-700"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terminal;
