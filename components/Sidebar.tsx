
import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar: React.FC = () => {
  const navItems = [
    { to: '/', icon: 'fa-chart-pie', label: 'Home' },
    { to: '/nodes', icon: 'fa-microchip', label: 'Nodes' },
    { to: '/setup', icon: 'fa-qrcode', label: 'Deploy' },
    { to: '/camera', icon: 'fa-camera', label: 'Camera' },
    { to: '/location', icon: 'fa-location-dot', label: 'Geo' },
    { to: '/files', icon: 'fa-folder-open', label: 'Files' },
    { to: '/terminal', icon: 'fa-terminal', label: 'CLI' },
    { to: '/settings', icon: 'fa-sliders', label: 'Config' },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 h-screen glass border-r border-gray-800 flex-col fixed left-0 top-0 z-50">
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center accent-glow">
            <i className="fas fa-id-badge text-white text-xl"></i>
          </div>
          <span className="font-bold text-xl tracking-tight text-white uppercase italic">SAIFUL <span className="text-blue-500">ISLAM</span></span>
        </div>

        <nav className="flex-1 mt-2 px-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => 
                `flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive 
                    ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20' 
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`
              }
            >
              <i className={`fas ${item.icon} text-lg w-6 text-center`}></i>
              <span className="font-medium text-sm">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-6 border-t border-gray-800">
          <div className="flex items-center gap-3 p-3 bg-gray-900/50 rounded-xl">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-xs font-bold">
              SI
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white truncate">Saiful_Islam</p>
              <p className="text-[10px] text-gray-500 truncate">System Owner</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 glass border-t border-white/5 z-[100] flex items-center justify-around px-2 pb-safe">
        {navItems.slice(0, 5).map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => 
              `flex flex-col items-center justify-center gap-1 w-12 h-12 rounded-xl transition-all ${
                isActive ? 'text-blue-500' : 'text-gray-500'
              }`
            }
          >
            <i className={`fas ${item.icon} text-lg`}></i>
            <span className="text-[8px] font-black uppercase tracking-tighter">{item.label}</span>
          </NavLink>
        ))}
        <NavLink to="/settings" className={({ isActive }) => `flex flex-col items-center justify-center gap-1 w-12 h-12 ${isActive ? 'text-blue-500' : 'text-gray-500'}`}>
           <i className="fas fa-ellipsis-h text-lg"></i>
           <span className="text-[8px] font-black uppercase tracking-tighter">More</span>
        </NavLink>
      </nav>
    </>
  );
};

export default Sidebar;
