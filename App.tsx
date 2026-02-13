
import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Nodes from './pages/Nodes';
import Terminal from './pages/Terminal';
import Settings from './pages/Settings';
import Camera from './pages/Camera';
import Location from './pages/Location';
import FileManager from './pages/FileManager';
import SetupGuide from './pages/SetupGuide';
import Enroll from './pages/Enroll';

const App: React.FC = () => {
  const location = useLocation();
  const isEnrollPage = location.pathname.startsWith('/enroll');

  return (
    <div className="flex min-h-screen bg-[#030712]">
      {!isEnrollPage && <Sidebar />}
      <main className={`flex-1 ${!isEnrollPage ? 'md:ml-64 p-4 md:p-8 pb-24 md:pb-8' : ''} min-h-screen transition-all duration-300`}>
        <div className={`${!isEnrollPage ? 'max-w-7xl mx-auto' : ''}`}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/nodes" element={<Nodes />} />
            <Route path="/setup" element={<SetupGuide />} />
            <Route path="/camera" element={<Camera />} />
            <Route path="/location" element={<Location />} />
            <Route path="/files" element={<FileManager />} />
            <Route path="/terminal" element={<Terminal />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/enroll/:id" element={<Enroll />} />
          </Routes>
        </div>
      </main>
    </div>
  );
};

export default App;
