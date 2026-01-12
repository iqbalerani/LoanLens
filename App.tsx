
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import FileUpload from './components/FileUpload';
import LoanForm from './components/LoanForm';
import AnalysisReport from './components/AnalysisReport';
import DecisionFlow from './components/DecisionFlow';
import DecisionLetter from './components/DecisionLetter';
import RiskRadar from './components/RiskRadar';
import Settings from './components/Settings';
import { analyzeLoanDocument } from './services/geminiService';
import { AssessmentReport, LoanDetails, LenderConfig, Recommendation } from './types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [fileData, setFileData] = useState<{ base64: string; mimeType: string; fileName: string } | null>(null);
  const [loanDetails, setLoanDetails] = useState<LoanDetails>({
    purpose: 'Furniture',
    amount: 5000,
    period: '12 months'
  });
  const [lenderConfig, setLenderConfig] = useState<LenderConfig>({
    maxDtiRatio: 35,
    minConfidence: 85,
    strictEmploymentCheck: true,
    organizationName: 'LoanLens Capital',
    branchName: 'Dubai Central',
    authorizedSignatory: 'Elias Thorne'
  });
  
  const [history, setHistory] = useState<AssessmentReport[]>([]);
  const [activeReportId, setActiveReportId] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const activeReport = history.find(r => r.id === activeReportId) || null;

  const handleFileSelect = (base64: string, mimeType: string, fileName: string) => {
    setFileData({ base64, mimeType, fileName });
    setError(null);
  };

  const handleAnalyze = async () => {
    if (!fileData) {
      setError("Document missing.");
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      const result = await analyzeLoanDocument(fileData.base64, fileData.mimeType, loanDetails, lenderConfig);
      setHistory(prev => [result, ...prev]);
      setActiveReportId(result.id);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const stats = {
    total: history.length,
    approved: history.filter(h => h.recommendation === Recommendation.APPROVE).length,
    exposure: history.reduce((acc, h) => h.recommendation === Recommendation.APPROVE ? acc + h.amountRequested : acc, 0),
    avgConfidence: history.length ? Math.round(history.reduce((a, b) => {
      const score = b.confidenceScore > 1 ? b.confidenceScore : b.confidenceScore * 100;
      return a + score;
    }, 0) / history.length) : 0
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setError(null);
  };

  return (
    <div className="min-h-screen pb-20 selection:bg-blue-500 selection:text-white flex flex-col">
      <Header />
      
      <div className="flex flex-col lg:flex-row relative flex-grow">
        <Sidebar activeTab={activeTab} onTabChange={handleTabChange} />
        
        {/* Main Workspace Offset for Sidebar */}
        <div className="flex-grow lg:pl-36 px-6">
          <main className="max-w-[1800px] mx-auto space-y-8">
            
            {activeTab === 'dashboard' && (
              <div className="animate-in fade-in slide-in-from-bottom-5 duration-700 space-y-8">
                {/* Stats Row */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="glass-card p-7 rounded-[2rem] flex items-center gap-5 border border-white/5 shadow-2xl transition-transform hover:scale-[1.02]">
                    <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-400 border border-blue-500/20">
                      <i className="fa-solid fa-layer-group text-xl"></i>
                    </div>
                    <div>
                      <div className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">Total Portfolio</div>
                      <div className="text-3xl font-black text-white">{stats.total}</div>
                    </div>
                  </div>
                  <div className="glass-card p-7 rounded-[2rem] flex items-center gap-5 border border-white/5 shadow-2xl transition-transform hover:scale-[1.02]">
                    <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-400 border border-emerald-500/20">
                      <i className="fa-solid fa-circle-check text-xl"></i>
                    </div>
                    <div>
                      <div className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">Approval Index</div>
                      <div className="text-3xl font-black text-white">{stats.total ? Math.round((stats.approved / stats.total) * 100) : 0}%</div>
                    </div>
                  </div>
                  <div className="glass-card p-7 rounded-[2rem] flex items-center gap-5 border border-white/5 shadow-2xl transition-transform hover:scale-[1.02]">
                    <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-[0_0_20px_rgba(59,130,246,0.3)] glow-blue">
                      <i className="fa-solid fa-money-bill-trend-up text-xl"></i>
                    </div>
                    <div>
                      <div className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">Gross Exposure</div>
                      <div className="text-3xl font-black text-white">${stats.exposure.toLocaleString()}</div>
                    </div>
                  </div>
                  <div className="glass-card p-7 rounded-[2rem] flex items-center gap-5 border border-white/5 shadow-2xl transition-transform hover:scale-[1.02]">
                    <div className="w-14 h-14 bg-blue-400/10 rounded-2xl flex items-center justify-center text-blue-300 border border-blue-400/20">
                      <i className="fa-solid fa-chart-line text-xl"></i>
                    </div>
                    <div>
                      <div className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">Avg Confidence</div>
                      <div className="text-3xl font-black text-white">{stats.avgConfidence}%</div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
                  {/* Rules Engine & History Sidebar */}
                  <div className="xl:col-span-3 space-y-8">
                    <div className="glass-card p-10 rounded-[2.5rem] space-y-10 border border-white/5">
                      <h3 className="text-xs font-black uppercase tracking-[0.4em] text-white/40 flex items-center gap-4">
                        <i className="fa-solid fa-sliders text-blue-400"></i> Local Rules Overrides
                      </h3>
                      
                      <div className="space-y-12">
                        <div className="group">
                          <div className="flex justify-between items-center mb-6">
                            <span className="text-[11px] font-black text-white/40 uppercase tracking-[0.15em]">Max DTI Threshold</span>
                            <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-lg text-xs font-black border border-blue-500/30">
                              {lenderConfig.maxDtiRatio}%
                            </span>
                          </div>
                          <div className="relative h-6 flex items-center">
                            <input 
                              type="range" min="10" max="60" 
                              value={lenderConfig.maxDtiRatio} 
                              onChange={e => setLenderConfig({...lenderConfig, maxDtiRatio: parseInt(e.target.value)})}
                              className="custom-range w-full"
                              style={{ '--progress': `${((lenderConfig.maxDtiRatio - 10) / (60 - 10)) * 100}%` } as React.CSSProperties}
                            />
                          </div>
                        </div>

                        <div className="group">
                          <div className="flex justify-between items-center mb-6">
                            <span className="text-[11px] font-black text-white/40 uppercase tracking-[0.15em]">AI Min Confidence</span>
                            <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-lg text-xs font-black border border-blue-500/30">
                              {lenderConfig.minConfidence}%
                            </span>
                          </div>
                          <div className="relative h-6 flex items-center">
                            <input 
                              type="range" min="50" max="95" 
                              value={lenderConfig.minConfidence} 
                              onChange={e => setLenderConfig({...lenderConfig, minConfidence: parseInt(e.target.value)})}
                              className="custom-range w-full"
                              style={{ '--progress': `${((lenderConfig.minConfidence - 50) / (95 - 50)) * 100}%` } as React.CSSProperties}
                            />
                          </div>
                        </div>
                        
                        <div className="pt-4">
                          <button 
                            onClick={() => setActiveTab('settings')}
                            className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] text-white/40 hover:text-white hover:bg-white/10 transition-all"
                          >
                            Manage All System Rules
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="glass-card p-10 rounded-[2.5rem] space-y-8 max-h-[600px] overflow-hidden flex flex-col border border-white/5">
                      <h3 className="text-xs font-black uppercase tracking-[0.4em] text-white/40 flex items-center gap-4">
                        <i className="fa-solid fa-clock-rotate-left text-blue-400"></i> Case Dossier
                      </h3>
                      <div className="space-y-4 overflow-y-auto pr-3 custom-scrollbar flex-grow">
                        {history.map(item => (
                          <button 
                            key={item.id}
                            onClick={() => setActiveReportId(item.id)}
                            className={`w-full text-left p-5 rounded-[1.8rem] transition-all border group relative overflow-hidden ${
                              activeReportId === item.id 
                                ? 'bg-blue-600 border-blue-500 shadow-2xl' 
                                : 'bg-white/[0.02] border-white/5 hover:bg-white/[0.05]'
                            }`}
                          >
                            <div className={`text-[10px] font-black uppercase tracking-widest mb-1 ${activeReportId === item.id ? 'text-blue-200' : 'text-white/20'}`}>
                              {new Date(item.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            </div>
                            <div className={`font-bold text-sm truncate ${activeReportId === item.id ? 'text-white' : 'text-white/80'}`}>{item.clientName}</div>
                            <div className="flex justify-between items-center mt-2">
                               <span className={`text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-tighter ${
                                 item.recommendation === Recommendation.APPROVE ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                               }`}>
                                 {item.recommendation}
                               </span>
                               <span className={`text-[10px] font-black ${activeReportId === item.id ? 'text-white/60' : 'text-white/20'}`}>${item.amountRequested.toLocaleString()}</span>
                            </div>
                          </button>
                        ))}
                        {history.length === 0 && <div className="text-center py-10 text-white/10 font-bold italic text-sm">Waiting for ingestion...</div>}
                      </div>
                    </div>
                  </div>

                  {/* Main Ingestion & Report Space */}
                  <div className="xl:col-span-9 space-y-8">
                    {!activeReportId && !isAnalyzing ? (
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 animate-in fade-in duration-700">
                        <div className="md:col-span-5 glass-card p-10 rounded-[3rem] border border-white/5 shadow-2xl">
                           <FileUpload 
                            onFileSelect={handleFileSelect} 
                            selectedFileName={fileData?.fileName || null} 
                          />
                        </div>
                        <div className="md:col-span-7 glass-card p-12 rounded-[3rem] border border-white/5 shadow-2xl flex flex-col justify-between">
                          <LoanForm 
                            details={loanDetails} 
                            onChange={setLoanDetails} 
                          />
                          <button 
                            onClick={handleAnalyze}
                            disabled={isAnalyzing || !fileData}
                            className={`w-full py-7 rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] flex items-center justify-center gap-5 transition-all mt-10 shadow-2xl ${
                              isAnalyzing || !fileData 
                                ? 'bg-white/5 text-white/10 cursor-not-allowed border border-white/5' 
                                : 'bg-blue-600 text-white hover:bg-blue-500 shadow-blue-600/20 border border-blue-400/30'
                            }`}
                          >
                            <i className="fa-solid fa-bolt-lightning text-lg"></i>
                            <span>Execute Underwriting Intelligence</span>
                          </button>
                        </div>
                      </div>
                    ) : null}

                    {isAnalyzing ? (
                      <div className="glass-card h-full min-h-[700px] flex flex-col items-center justify-center rounded-[4rem] p-12 relative overflow-hidden border border-white/5">
                        <div className="absolute top-0 left-0 w-full h-1 bg-white/5">
                            <div className="h-full bg-blue-500 w-1/3 animate-[loading-bar_1.5s_infinite_ease-in-out]"></div>
                        </div>
                        <div className="w-40 h-40 relative mb-12 flex items-center justify-center">
                          <div className="absolute inset-0 rounded-full border-[2px] border-blue-500/10 scale-125 animate-ping"></div>
                          <div className="absolute inset-0 rounded-full border-[10px] border-blue-500/5"></div>
                          <div className="absolute inset-0 rounded-full border-[10px] border-blue-500 border-t-transparent animate-spin"></div>
                          <i className="fa-solid fa-microchip text-blue-400 text-5xl animate-pulse"></i>
                        </div>
                        <h3 className="text-4xl font-black text-white mb-4 tracking-tighter">AI Underwriter Active</h3>
                        <p className="text-white/30 max-w-sm text-center font-medium leading-relaxed text-lg tracking-tight">
                          Applying predictive heuristics and DTI thresholds...
                        </p>
                      </div>
                    ) : activeReport ? (
                      <div className="animate-in slide-in-from-bottom-10 duration-700">
                        <div className="flex justify-end mb-8 gap-4">
                           <button 
                            onClick={() => setActiveTab('explainer')}
                            className="flex items-center gap-3 px-8 py-4 bg-indigo-600/20 border border-indigo-400/30 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400 hover:bg-indigo-600 hover:text-white transition-all shadow-xl"
                           >
                             <i className="fa-solid fa-network-wired"></i> Explain Journey
                           </button>
                           <button 
                            onClick={() => setActiveTab('radar')}
                            className="flex items-center gap-3 px-8 py-4 bg-amber-600/20 border border-amber-400/30 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] text-amber-400 hover:bg-amber-600 hover:text-white transition-all shadow-xl"
                           >
                             <i className="fa-solid fa-compass"></i> Risk Radar
                           </button>
                           <button 
                            onClick={() => setActiveTab('letter')}
                            className="flex items-center gap-3 px-8 py-4 bg-blue-600 border border-blue-400/30 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] text-white hover:bg-blue-500 transition-all shadow-xl"
                           >
                             <i className="fa-solid fa-envelope-open-text"></i> Generate Letter
                           </button>
                           <button 
                            onClick={() => setActiveReportId(null)}
                            className="flex items-center gap-3 px-8 py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] text-white/60 hover:bg-white/10 hover:text-white transition-all shadow-xl"
                           >
                             <i className="fa-solid fa-plus-circle text-blue-400"></i> New Assessment
                           </button>
                        </div>
                        <AnalysisReport report={activeReport} />
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'explainer' && (
              <div className="animate-in fade-in zoom-in duration-500">
                <div className="mb-8 flex items-center justify-between">
                  <div>
                    <h2 className="text-4xl font-black text-white tracking-tighter">Decision Intelligence</h2>
                    <p className="text-white/30 text-xs font-black uppercase tracking-[0.5em] mt-2 italic">Neural Network Inference Audit Trail</p>
                  </div>
                  <button 
                    onClick={() => setActiveTab('dashboard')}
                    className="px-8 py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] text-white/60 hover:bg-white/10 transition-all"
                  >
                    <i className="fa-solid fa-arrow-left mr-3"></i> Back to Dashboard
                  </button>
                </div>
                <DecisionFlow report={activeReport} />
              </div>
            )}

            {activeTab === 'radar' && (
              <div className="animate-in fade-in zoom-in duration-500">
                <RiskRadar report={activeReport} />
              </div>
            )}

            {activeTab === 'letter' && (
              <div className="animate-in fade-in slide-in-from-right-10 duration-500">
                <DecisionLetter report={activeReport} config={lenderConfig} />
              </div>
            )}

            {activeTab === 'settings' && (
              <Settings config={lenderConfig} onConfigChange={setLenderConfig} />
            )}
            
            {error && (
              <div className="bg-rose-500/10 border border-rose-500/20 p-8 rounded-[2.5rem] text-rose-400 flex items-center gap-6 shadow-2xl animate-in shake duration-500">
                <i className="fa-solid fa-circle-exclamation text-3xl"></i>
                <div className="font-bold uppercase tracking-widest text-xs">{error}</div>
              </div>
            )}
          </main>
        </div>
      </div>

      <style>{`
        @keyframes loading-bar {
          0% { transform: translateX(-100%); width: 10%; }
          50% { width: 50%; }
          100% { transform: translateX(300%); width: 10%; }
        }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default App;
