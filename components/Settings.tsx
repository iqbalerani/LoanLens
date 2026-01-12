
import React from 'react';
import { LenderConfig } from '../types';

interface SettingsProps {
  config: LenderConfig;
  onConfigChange: (config: LenderConfig) => void;
}

const Settings: React.FC<SettingsProps> = ({ config, onConfigChange }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    onConfigChange({
      ...config,
      [name]: type === 'checkbox' ? checked : type === 'number' ? parseInt(value) : value
    });
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-10 duration-700">
      <div className="mb-10">
        <h2 className="text-4xl font-black text-white tracking-tighter">System Configuration</h2>
        <p className="text-white/30 text-xs font-black uppercase tracking-[0.5em] mt-2 italic">Institutional Rules & Branding Parameters</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Underwriting Rules Section */}
        <div className="glass-card rounded-[3.5rem] p-12 border border-white/5 shadow-2xl space-y-10">
          <h3 className="text-sm font-black uppercase tracking-[0.5em] text-white/40 flex items-center gap-4">
            <i className="fa-solid fa-sliders text-blue-400"></i> Underwriting Rules
          </h3>

          <div className="space-y-12">
            <div className="group">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <span className="text-[14px] font-black text-white uppercase tracking-tight">Debt-to-Income Threshold</span>
                  <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest mt-1">Maximum allowed DTI percentage</p>
                </div>
                <span className="px-4 py-2 bg-blue-500/20 text-blue-300 rounded-xl text-lg font-black border border-blue-500/30">
                  {config.maxDtiRatio}%
                </span>
              </div>
              <div className="relative h-6 flex items-center">
                <input 
                  type="range" name="maxDtiRatio" min="10" max="60" 
                  value={config.maxDtiRatio} 
                  onChange={handleChange}
                  className="custom-range w-full"
                  style={{ '--progress': `${((config.maxDtiRatio - 10) / (60 - 10)) * 100}%` } as React.CSSProperties}
                />
              </div>
            </div>

            <div className="group">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <span className="text-[14px] font-black text-white uppercase tracking-tight">AI Confidence Floor</span>
                  <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest mt-1">Minimum score for auto-recommendation</p>
                </div>
                <span className="px-4 py-2 bg-blue-500/20 text-blue-300 rounded-xl text-lg font-black border border-blue-500/30">
                  {config.minConfidence}%
                </span>
              </div>
              <div className="relative h-6 flex items-center">
                <input 
                  type="range" name="minConfidence" min="50" max="95" 
                  value={config.minConfidence} 
                  onChange={handleChange}
                  className="custom-range w-full"
                  style={{ '--progress': `${((config.minConfidence - 50) / (95 - 50)) * 100}%` } as React.CSSProperties}
                />
              </div>
            </div>

            <div className="pt-8 border-t border-white/5 flex items-center justify-between">
              <div>
                <span className="text-[14px] font-black text-white uppercase tracking-tight">Strict Verification Mode</span>
                <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest mt-1">Enhanced employment stability checks</p>
              </div>
              <label className="flex items-center gap-5 cursor-pointer group/toggle">
                <div className="relative flex items-center">
                  <input 
                    type="checkbox" 
                    name="strictEmploymentCheck"
                    checked={config.strictEmploymentCheck}
                    onChange={handleChange}
                    className="peer sr-only"
                  />
                  <div className="w-16 h-8 bg-white/5 border border-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full after:content-[''] after:absolute after:top-[6px] after:start-[6px] after:bg-white/40 after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 peer-checked:after:bg-white peer-checked:border-blue-400"></div>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Branding & Letterhead Section */}
        <div className="glass-card rounded-[3.5rem] p-12 border border-white/5 shadow-2xl space-y-10">
          <h3 className="text-sm font-black uppercase tracking-[0.5em] text-white/40 flex items-center gap-4">
            <i className="fa-solid fa-building text-blue-400"></i> Corporate Branding
          </h3>

          <div className="space-y-8">
            <div className="group">
              <label className="block text-[11px] font-black text-white/30 uppercase tracking-[0.4em] mb-4 ml-1">Organization Identity</label>
              <input 
                type="text" 
                name="organizationName"
                value={config.organizationName}
                onChange={handleChange}
                placeholder="e.g. LoanLens Capital"
                className="w-full bg-white/5 border border-white/10 rounded-[1.5rem] py-5 px-8 text-white font-bold focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all hover:bg-white/10"
              />
            </div>

            <div className="group">
              <label className="block text-[11px] font-black text-white/30 uppercase tracking-[0.4em] mb-4 ml-1">Regional Branch</label>
              <input 
                type="text" 
                name="branchName"
                value={config.branchName}
                onChange={handleChange}
                placeholder="e.g. Dubai Central"
                className="w-full bg-white/5 border border-white/10 rounded-[1.5rem] py-5 px-8 text-white font-bold focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all hover:bg-white/10"
              />
            </div>

            <div className="group">
              <label className="block text-[11px] font-black text-white/30 uppercase tracking-[0.4em] mb-4 ml-1">Authorized Signatory</label>
              <div className="relative">
                <input 
                  type="text" 
                  name="authorizedSignatory"
                  value={config.authorizedSignatory}
                  onChange={handleChange}
                  placeholder="Manager Full Name"
                  className="w-full bg-white/5 border border-white/10 rounded-[1.5rem] py-5 px-8 text-white font-bold focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all hover:bg-white/10"
                />
                <i className="fa-solid fa-signature absolute right-8 top-1/2 -translate-y-1/2 text-white/10 text-xl"></i>
              </div>
            </div>
          </div>

          <div className="p-8 bg-blue-500/5 rounded-[2.5rem] border border-blue-500/10 flex items-center gap-6">
             <div className="w-12 h-12 bg-blue-500/20 rounded-2xl flex items-center justify-center text-blue-400">
               <i className="fa-solid fa-circle-info text-lg"></i>
             </div>
             <p className="text-[11px] font-bold text-white/40 leading-relaxed uppercase tracking-widest">
               Changes to identity parameters will immediately reflect on new decision letters generated for existing reports.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
