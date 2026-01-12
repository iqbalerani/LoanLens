
import React from 'react';

interface SidebarProps {
  activeTab?: string;
  onTabChange: (tabId: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab = 'dashboard', onTabChange }) => {
  const navItems = [
    { id: 'dashboard', icon: 'fa-solid fa-house', label: 'Dashboard' },
    { id: 'explainer', icon: 'fa-solid fa-microchip', label: 'AI Explainer' },
    { id: 'radar', icon: 'fa-solid fa-compass', label: 'Risk Radar' },
    { id: 'letter', icon: 'fa-solid fa-envelope-open-text', label: 'Decision Letter' },
    { id: 'settings', icon: 'fa-solid fa-gear', label: 'Settings' },
  ];

  return (
    <aside className="fixed left-6 top-28 bottom-6 w-24 glass-dark rounded-[3rem] border border-white/5 flex flex-col items-center py-10 z-[60] shadow-2xl overflow-hidden hidden lg:flex">
      {/* Brand Icon Pill */}
      <div className="mb-14">
        <div 
          onClick={() => onTabChange('dashboard')}
          className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-[0_0_20px_rgba(59,130,246,0.5)] glow-blue cursor-pointer transform hover:rotate-12 transition-all duration-500"
        >
          <i className="fa-solid fa-bolt-lightning text-xl"></i>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="flex-grow flex flex-col gap-4 w-full px-4">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={`w-full aspect-square rounded-[1.8rem] flex items-center justify-center text-xl transition-all duration-300 relative group ${
              activeTab === item.id 
                ? 'text-blue-400 bg-blue-500/10' 
                : 'text-white/20 hover:text-white/60 hover:bg-white/5'
            }`}
          >
            {/* Thick vertical indicator on the far left edge of the sidebar pill */}
            {activeTab === item.id && (
              <div className="absolute left-[-1rem] w-2 h-10 bg-blue-500 rounded-r-full shadow-[0_0_15px_rgba(59,130,246,1)]"></div>
            )}
            
            {/* Notification dot for specific features */}
            {(item.id === 'explainer' || item.id === 'letter' || item.id === 'radar') && activeTab !== item.id && (
              <div className="absolute top-3 right-3 w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>
            )}

            <i className={`${item.icon} ${activeTab === item.id ? 'drop-shadow-[0_0_8px_rgba(96,165,250,0.6)]' : ''}`}></i>
            
            {/* Hover Tooltip */}
            <div className="absolute left-24 px-4 py-2 bg-slate-900 border border-white/10 text-white text-[10px] font-black uppercase tracking-widest rounded-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-300 -translate-x-4 group-hover:translate-x-0 whitespace-nowrap shadow-2xl z-50">
              {item.label}
            </div>
          </button>
        ))}
      </nav>

      {/* Logout/Bottom Action */}
      <div className="mt-auto px-4 w-full">
        <button className="w-full aspect-square rounded-[1.8rem] flex items-center justify-center text-xl text-white/20 hover:text-rose-400 hover:bg-rose-500/10 transition-all duration-300 group relative">
          <i className="fa-solid fa-right-from-bracket"></i>
          <div className="absolute left-24 px-4 py-2 bg-slate-900 border border-white/10 text-rose-400 text-[10px] font-black uppercase tracking-widest rounded-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-300 -translate-x-4 group-hover:translate-x-0 whitespace-nowrap shadow-2xl z-50">
            Logout
          </div>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
