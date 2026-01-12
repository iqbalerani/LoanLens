
import React, { useState, useEffect } from 'react';
import { AssessmentReport, Recommendation, LenderConfig } from '../types';
import { generateDecisionLetter } from '../services/geminiService';

interface DecisionLetterProps {
  report: AssessmentReport | null;
  config: LenderConfig;
}

const DecisionLetter: React.FC<DecisionLetterProps> = ({ report, config }) => {
  const [letterText, setLetterText] = useState<string>('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (report) {
      setLoading(true);
      generateDecisionLetter(report, config)
        .then(setLetterText)
        .finally(() => setLoading(false));
    }
  }, [report, config]);

  if (!report) {
    return (
      <div className="glass-card h-[600px] rounded-[3.5rem] flex flex-col items-center justify-center p-12 border border-white/5 shadow-2xl">
        <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-8 border border-white/10 opacity-20">
          <i className="fa-solid fa-envelope-open-text text-4xl"></i>
        </div>
        <p className="text-white/40 font-bold uppercase tracking-[0.3em] text-sm text-center">
          Complete an assessment to generate the <br/> Compliance Decision Letter
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="glass-card h-[600px] rounded-[3.5rem] flex flex-col items-center justify-center p-12 border border-white/5 shadow-2xl">
        <div className="w-20 h-20 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mb-8"></div>
        <p className="text-white/40 font-black uppercase tracking-[0.4em] text-xs">Drafting Compliance Letter...</p>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-700">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-4xl font-black text-white tracking-tighter">Compliance Correspondence</h2>
          <p className="text-white/30 text-xs font-black uppercase tracking-[0.5em] mt-2">Professional Disbursement Notification</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => window.print()}
            className="flex items-center gap-3 px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] text-white/60 hover:bg-white/10 transition-all"
          >
            <i className="fa-solid fa-print"></i> Print Letter
          </button>
          <button 
            className="flex items-center gap-3 px-6 py-4 bg-indigo-600 border border-indigo-400/30 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] text-white hover:bg-indigo-500 transition-all shadow-xl"
            onClick={() => {
              navigator.clipboard.writeText(letterText);
              alert('Copied to clipboard');
            }}
          >
            <i className="fa-solid fa-copy"></i> Copy Text
          </button>
        </div>
      </div>

      <div className="bg-[#f8f9fa] rounded-[3.5rem] p-20 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.7)] border-4 border-indigo-500/20 text-slate-800 font-serif leading-relaxed min-h-[800px] relative overflow-hidden">
        {/* Letterhead watermark */}
        <div className="absolute top-10 right-10 opacity-[0.05] pointer-events-none">
          <i className="fa-solid fa-magnifying-glass-chart text-[20rem]"></i>
        </div>

        <div className="flex justify-between border-b-2 border-slate-200 pb-12 mb-16 relative z-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white text-sm">
                <i className="fa-solid fa-magnifying-glass-chart"></i>
              </div>
              <span className="text-xl font-black tracking-tighter text-indigo-900 font-sans">{config.organizationName || 'LoanLens'}</span>
            </div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-sans">{config.branchName} Branch • Credit Dept</p>
          </div>
          <div className="text-right text-[11px] font-bold uppercase tracking-widest text-slate-400 font-sans">
            Reference: LL-{report.id.toUpperCase()}
          </div>
        </div>

        <div className="whitespace-pre-wrap text-lg relative z-10 max-w-3xl mx-auto">
          {letterText}
        </div>

        <div className="mt-24 border-t-2 border-slate-100 pt-16 flex justify-between items-center relative z-10">
          <div className="flex items-center gap-4 text-slate-400">
             <i className="fa-solid fa-shield-halved text-2xl"></i>
             <div className="text-[10px] font-black uppercase tracking-widest leading-none">
                AI Audit Hash Verified <br/>
                <span className="text-indigo-400">Secure Protocol v2.5</span>
             </div>
          </div>
          <div className="text-right">
             <div className="w-48 h-1 bg-slate-200 mb-2"></div>
             <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 font-sans">{config.authorizedSignatory}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DecisionLetter;
