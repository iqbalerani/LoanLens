
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 glass-dark border-b border-white/5 px-8 py-4 mb-8 w-full">
      <div className="w-full flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-[0_0_20px_rgba(79,70,229,0.4)] glow-indigo">
            <i className="fa-solid fa-magnifying-glass-chart text-xl"></i>
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-white tracking-tight leading-none">LoanLens</h1>
            <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mt-1">Lending Intelligence</p>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-6">
          <span className="text-sm text-white/30 font-medium italic">"Upload. Analyze. Decide."</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
