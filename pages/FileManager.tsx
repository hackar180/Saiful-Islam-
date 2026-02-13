
import React, { useState } from 'react';
import { MOCK_FILES, MOCK_DEVICES } from '../constants';

const FileManager: React.FC = () => {
  const [currentPath, setCurrentPath] = useState(['root', 'sdcard']);
  const [selectedNode, setSelectedNode] = useState(MOCK_DEVICES[0].id);

  return (
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">File Explorer</h1>
          <p className="text-gray-400">Direct file system access for remote endpoints.</p>
        </div>
        <div className="flex gap-3">
          <select 
            value={selectedNode}
            onChange={(e) => setSelectedNode(e.target.value)}
            className="bg-gray-900 border border-gray-800 text-white text-sm rounded-xl px-4 py-2 outline-none"
          >
            {MOCK_DEVICES.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
          </select>
          <button className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-bold transition-all accent-glow">
            <i className="fas fa-upload mr-2"></i> Push File
          </button>
        </div>
      </header>

      <div className="glass rounded-3xl overflow-hidden flex flex-col min-h-[500px]">
        {/* Breadcrumbs */}
        <div className="bg-gray-900/50 px-6 py-4 border-b border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm">
            {currentPath.map((folder, i) => (
              <React.Fragment key={i}>
                <span className={`cursor-pointer ${i === currentPath.length - 1 ? 'text-blue-400 font-bold' : 'text-gray-500 hover:text-white'}`}>
                  {folder}
                </span>
                {i < currentPath.length - 1 && <span className="text-gray-700">/</span>}
              </React.Fragment>
            ))}
          </div>
          <div className="flex items-center gap-4 text-gray-500">
             <i className="fas fa-search cursor-pointer hover:text-white"></i>
             <i className="fas fa-rotate cursor-pointer hover:text-white"></i>
             <i className="fas fa-ellipsis-v cursor-pointer hover:text-white"></i>
          </div>
        </div>

        {/* File List */}
        <div className="flex-1 overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-black/20 text-gray-500 text-[10px] uppercase tracking-widest font-bold">
                <th className="px-6 py-4 w-12"></th>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Size</th>
                <th className="px-6 py-4">Modified</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {MOCK_FILES.map((file, idx) => (
                <tr key={idx} className="hover:bg-white/5 transition-colors group">
                  <td className="px-6 py-4">
                    <i className={`fas ${file.type === 'folder' ? 'fa-folder text-yellow-500' : 'fa-file-lines text-blue-400'} text-lg`}></i>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-white group-hover:text-blue-400 cursor-pointer">{file.name}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 mono">{file.size || '--'}</td>
                  <td className="px-6 py-4 text-sm text-gray-500 mono">{file.modified}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 hover:bg-gray-800 rounded-lg text-gray-400 hover:text-white"><i className="fas fa-download"></i></button>
                      <button className="p-2 hover:bg-gray-800 rounded-lg text-gray-400 hover:text-red-400"><i className="fas fa-trash-can"></i></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass p-4 rounded-2xl flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500">
            <i className="fas fa-images"></i>
          </div>
          <div>
            <p className="text-[10px] text-gray-500 font-bold uppercase">Photos</p>
            <p className="text-sm font-bold text-white">1,245 Items</p>
          </div>
        </div>
        <div className="glass p-4 rounded-2xl flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
            <i className="fas fa-file-pdf"></i>
          </div>
          <div>
            <p className="text-[10px] text-gray-500 font-bold uppercase">Documents</p>
            <p className="text-sm font-bold text-white">432 Items</p>
          </div>
        </div>
        <div className="glass p-4 rounded-2xl flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center text-green-500">
            <i className="fas fa-video"></i>
          </div>
          <div>
            <p className="text-[10px] text-gray-500 font-bold uppercase">Videos</p>
            <p className="text-sm font-bold text-white">89 Items</p>
          </div>
        </div>
        <div className="glass p-4 rounded-2xl flex items-center gap-4 border border-blue-500/20">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white">
            <i className="fas fa-hdd"></i>
          </div>
          <div>
            <p className="text-[10px] text-gray-500 font-bold uppercase">Available Space</p>
            <p className="text-sm font-bold text-white">14.2 GB / 128 GB</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileManager;
