
import React from 'react';
import { AssessmentReport, Recommendation, FactorType, RiskLevel } from '../types';

interface AnalysisReportProps {
  report: AssessmentReport;
}

const AnalysisReport: React.FC<AnalysisReportProps> = ({ report }) => {
  const isApproved = report.recommendation === Recommendation.APPROVE;
  const isDeclined = report.recommendation === Recommendation.DECLINE;

  const getStatusColor = () => {
    if (isApproved) return 'text-emerald-400';
    if (isDeclined) return 'text-rose-400';
    return 'text-amber-400';
  };

  const getStatusBg = () => {
    if (isApproved) return 'bg-emerald-500/20 border-emerald-500/30';
    if (isDeclined) return 'bg-rose-500/20 border-rose-500/30';
    return 'bg-amber-500/20 border-amber-500/30';
  };

  const getHealthColor = () => {
    if (report.verificationScore >= 80) return '#10b981';
    if (report.verificationScore >= 50) return '#f59e0b';
    return '#ef4444';
  };

  const radius = 40;
  const strokeWidth = 8;
  const normalizedRadius = radius - strokeWidth / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (report.verificationScore / 100) * circumference;

  return (
    <div className="space-y-10">
      {/* Decision Banner */}
      <div className="glass-card rounded-[4rem] p-16 relative overflow-hidden shadow-2xl border border-white/5">
        <div className="absolute top-0 right-0 p-16 pointer-events-none opacity-[0.02]">
          <i className="fa-solid fa-shield-check text-[25rem] text-blue-500"></i>
        </div>
        
        <div className="flex flex-col lg:flex-row items-center justify-between gap-16 relative z-10">
          <div className="flex items-center gap-12 flex-1">
            <div className={`w-32 h-32 rounded-[3rem] flex items-center justify-center text-5xl border shadow-2xl transition-all duration-700 ${getStatusBg()}`}>
              {isApproved ? <i className="fa-solid fa-check text-emerald-400"></i> : <i className="fa-solid fa-xmark text-rose-400"></i>}
            </div>
            <div className="flex flex-col">
              <div className="text-[12px] font-black uppercase tracking-[0.5em] text-white/30 mb-4">Underwriter Decision</div>
              <div className={`text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter leading-none ${getStatusColor()}`}>
                {report.recommendation}
              </div>
            </div>
          </div>
          
          <div className="hidden lg:block w-px h-40 bg-white/5"></div>

          <div className="flex items-center gap-8 lg:pl-8">
            <div className="flex flex-col items-center">
              <div className="text-[12px] font-black uppercase tracking-[0.5em] text-white/30 mb-10">Verification Health</div>
              <div className="flex items-center gap-8">
                <div className="relative w-36 h-36 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90 drop-shadow-2xl">
                    <circle cx="72" cy="72" r={normalizedRadius} stroke="rgba(255,255,255,0.05)" strokeWidth={strokeWidth} fill="transparent" />
                    <circle
                      cx="72" cy="72" r={normalizedRadius}
                      stroke={getHealthColor()}
                      strokeWidth={strokeWidth}
                      strokeDasharray={circumference}
                      style={{ strokeDashoffset }}
                      strokeLinecap="round"
                      fill="transparent"
                      className="transition-all duration-1000 ease-out"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-black text-white leading-none tracking-tighter">{report.verificationScore}<span className="text-sm ml-1 text-white/40">%</span></span>
                  </div>
                </div>

                <div className="flex flex-col items-end border-l border-white/5 pl-12 h-20 justify-center">
                   <div className="text-8xl font-black text-white leading-none tracking-tighter">
                     {report.fraudFlags.length}
                   </div>
                   <div className="text-[10px] font-black uppercase text-white/20 tracking-[0.3em] mt-3 whitespace-nowrap">
                     Integrity Alerts
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Client Profile Banner */}
      <div className="glass-card rounded-[3.5rem] p-14 flex flex-col md:flex-row justify-between items-center gap-10 shadow-2xl relative overflow-hidden border border-white/5">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-transparent opacity-20"></div>
        
        <div className="relative z-10 flex flex-col items-center md:items-start text-center md:text-left">
          <div className="text-[12px] font-black uppercase tracking-[0.5em] text-white/20 mb-5">Subject Assessment</div>
          <h2 className="text-6xl font-black text-white tracking-tighter leading-tight">{report.clientName}</h2>
          <div className="flex items-center gap-4 mt-8 px-6 py-3 bg-white/5 rounded-full border border-white/10 backdrop-blur-xl">
             <span className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,1)] animate-pulse"></span>
             <span className="text-[11px] text-white/60 uppercase font-black tracking-[0.4em]">KYC Authenticated & Audited Segment</span>
          </div>
        </div>
        
        <div className="relative z-10 text-center md:text-right flex flex-col items-center md:items-end">
          <div className="text-[12px] font-black uppercase tracking-[0.5em] text-white/10 mb-3">Principal Requirement</div>
          <div className="text-8xl font-black text-white tracking-tighter leading-none">${report.amountRequested.toLocaleString()}</div>
          <div className={`mt-8 px-10 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.5em] shadow-2xl border transition-all ${
             report.riskLevel === RiskLevel.LOW ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 
             report.riskLevel === RiskLevel.MODERATE ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' :
             'bg-rose-500/20 text-rose-400 border-rose-500/30'
          }`}>
            {report.riskLevel} Risk Profile
          </div>
        </div>
      </div>

      {/* Underwriting Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        <div className="xl:col-span-12 glass-card rounded-[3.5rem] p-12 space-y-12 border border-white/5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black uppercase tracking-[0.5em] text-white/40 flex items-center gap-6">
              <i className="fa-solid fa-fingerprint text-blue-500 text-2xl"></i> Underwriting Evidence
            </h3>
            <div className="px-6 py-3 bg-white/5 border border-white/10 rounded-2xl text-[11px] font-black text-white/40 uppercase tracking-widest">
              Generated: {new Date(report.timestamp).toLocaleTimeString()}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
             <div className="p-12 bg-white/[0.02] rounded-[3.5rem] border border-white/5 shadow-inner">
                <div className="text-[11px] font-black text-white/20 uppercase tracking-[0.4em] mb-12 border-b border-white/5 pb-6">Integrity Matrix</div>
                <div className="space-y-8 flex-grow">
                   {report.fraudFlags.length > 0 ? report.fraudFlags.map((flag, i) => (
                     <div key={i} className="flex items-center gap-5 text-rose-400 group">
                        <i className="fa-solid fa-triangle-exclamation text-xl drop-shadow-[0_0_8px_rgba(244,63,94,0.5)]"></i>
                        <span className="text-[13px] font-black uppercase tracking-[0.2em]">{flag.replace(/_/g, ' ')}</span>
                     </div>
                   )) : (
                     <div className="flex items-center gap-5 text-emerald-400">
                        <i className="fa-solid fa-circle-check text-3xl"></i>
                        <span className="text-[13px] font-black uppercase tracking-[0.25em]">Evidence Integrity Confirmed</span>
                     </div>
                   )}
                </div>
             </div>

             <div className="p-12 bg-white/[0.02] rounded-[3.5rem] border border-white/5 shadow-inner">
                <div className="text-[11px] font-black text-white/20 uppercase tracking-[0.4em] mb-12 border-b border-white/5 pb-6">Underwriting Signals</div>
                <div className="space-y-8">
                   {report.riskFactors.slice(0, 5).map((factor, i) => (
                     <div key={i} className="flex items-start gap-5 text-white/60 group">
                        <div className="mt-1 shrink-0 transition-all group-hover:scale-125">
                          {factor.type === FactorType.POSITIVE ? (
                            <i className="fa-solid fa-circle-plus text-emerald-500"></i>
                          ) : factor.type === FactorType.NEGATIVE ? (
                            <i className="fa-solid fa-circle-minus text-rose-500"></i>
                          ) : (
                            <i className="fa-solid fa-circle-info text-blue-400"></i>
                          )}
                        </div>
                        <span className="text-[13px] font-bold leading-relaxed tracking-tight">{factor.text}</span>
                     </div>
                   ))}
                </div>
             </div>
          </div>

          <div className="bg-blue-600 rounded-[3.5rem] p-16 flex flex-col sm:flex-row justify-between items-center shadow-3xl shadow-blue-900/40 group transform transition-all border border-blue-400/20">
            <div className="text-center sm:text-left">
              <div className="text-[12px] font-black uppercase tracking-[0.6em] text-white/50 mb-5">Net Residual Liquidity</div>
              <div className="text-8xl font-black text-white tracking-tighter leading-none">${report.affordability.availableForRepayment.toLocaleString()}</div>
              <div className="text-[11px] font-bold text-white/40 uppercase mt-10 tracking-[0.5em]">
                 Compliance DTI: {Math.round(report.affordability.paymentToAvailableRatio)}% Segment Verified
              </div>
            </div>
            <div className="mt-16 sm:mt-0 w-40 h-40 bg-white/10 rounded-[4rem] flex items-center justify-center text-white backdrop-blur-3xl border border-white/10 group-hover:rotate-12 transition-all duration-700 shadow-2xl">
              <i className="fa-solid fa-vault text-6xl"></i>
            </div>
          </div>
        </div>

        {/* Structure Architect - Commented out as per user request */}
        {/* <div className="xl:col-span-4 glass-card rounded-[3.5rem] p-12 flex flex-col border border-white/5 shadow-2xl">
          <h3 className="text-sm font-black uppercase tracking-[0.5em] text-white/40 mb-14 flex items-center gap-6">
            <i className="fa-solid fa-diagram-project text-blue-500 text-2xl"></i> Structure Architect
          </h3>
          <div className="space-y-6 flex-grow">
            {report.suggestedPaymentPlans.map((plan, idx) => (
              <div key={idx} className="p-10 bg-[#161a2d] text-white rounded-[3rem] flex items-center justify-between hover:bg-blue-600 transition-all duration-700 cursor-pointer group shadow-2xl border border-white/5">
                <div>
                  <div className="font-black text-white text-3xl tracking-tighter mb-2">{plan.term}</div>
                  <div className="text-[11px] text-white/30 font-black uppercase tracking-[0.3em] group-hover:text-white/70">
                    {plan.risk} Model
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-4xl font-black text-white tracking-tighter leading-none">${plan.monthlyAmount.toLocaleString()}</div>
                  <div className="text-[11px] uppercase font-black text-white/10 tracking-[0.3em] mt-4 group-hover:text-white/40">/ MO</div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 p-10 rounded-[3rem] bg-white/[0.02] border border-white/5 text-center shadow-inner">
            <span className="text-[11px] font-black text-white/20 uppercase tracking-[0.5em]">Institutional Micro-Loan Terminal</span>
          </div>
        </div> */}
      </div>

      {/* Underwriter Reasoning Section */}
      <div className="glass-card rounded-[4.5rem] p-20 relative overflow-hidden shadow-2xl border-none">
        <div className="absolute top-0 right-0 p-20 pointer-events-none opacity-[0.03]">
          <i className="fa-solid fa-quote-right text-[25rem] text-blue-900"></i>
        </div>
        
        <div className="relative z-10">
          <h3 className="text-xs font-black uppercase tracking-[0.6em] text-white/40 mb-16 flex items-center gap-8">
            <i className="fa-solid fa-microchip text-blue-500"></i> AI Output Reasoning
          </h3>
          <p className="text-white/80 text-4xl md:text-5xl leading-[1.4] font-semibold italic max-w-7xl tracking-tighter">
            "{report.aiReasoning}"
          </p>
          
          <div className="mt-24 flex flex-col lg:flex-row justify-between items-center border-t border-white/5 pt-20 gap-16">
            <div className="flex items-center gap-12">
               <div className="w-24 h-24 rounded-[3rem] bg-blue-600 flex items-center justify-center text-white shadow-3xl shadow-blue-600/30 transform hover:scale-110 transition-transform">
                 <i className="fa-solid fa-shield-halved text-4xl"></i>
               </div>
               <div>
                  <div className="text-white font-black text-3xl tracking-tighter">Compliance Audit Passed</div>
                  <div className="text-[11px] text-white/30 font-bold uppercase tracking-[0.4em] mt-3">ID: AUDIT-{report.id.toUpperCase()}</div>
               </div>
            </div>
            
            <div className="flex flex-wrap gap-8 justify-center">
              <button className="px-14 py-7 text-white/40 hover:text-white font-black text-[12px] uppercase tracking-[0.4em] transition-all rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 active:scale-95">
                <i className="fa-solid fa-file-export mr-6 text-blue-400"></i> Export Dossier
              </button>
              <button className={`px-20 py-8 rounded-3xl font-black text-[13px] uppercase tracking-[0.5em] transition-all shadow-3xl active:scale-95 border border-white/10 ${
                isApproved ? 'bg-emerald-600 text-white hover:bg-emerald-500 shadow-emerald-600/20' : 
                isDeclined ? 'bg-rose-600 text-white hover:bg-rose-500 shadow-rose-600/20' :
                'bg-blue-600 text-white hover:bg-blue-500 shadow-blue-600/20'
              }`}>
                {isApproved ? 'Authorize Disbursement' : isDeclined ? 'Review Rejection' : 'Finalize Decision'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisReport;
