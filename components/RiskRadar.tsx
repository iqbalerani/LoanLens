
import React from 'react';
import { AssessmentReport } from '../types';

interface RiskRadarProps {
  report: AssessmentReport | null;
}

const RiskRadar: React.FC<RiskRadarProps> = ({ report }) => {
  if (!report) {
    return (
      <div className="glass-card h-[600px] rounded-[3.5rem] flex flex-col items-center justify-center p-12 border border-white/5 shadow-2xl">
        <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-8 border border-white/10 opacity-20">
          <i className="fa-solid fa-compass text-4xl"></i>
        </div>
        <p className="text-white/40 font-bold uppercase tracking-[0.3em] text-sm text-center leading-relaxed">
          Complete an assessment to initialize the <br/> Multi-dimensional Risk Radar
        </p>
      </div>
    );
  }

  const metrics = report.radarMetrics;
  
  // Dimensions for SVG
  const size = 600;
  const center = size / 2;
  const radius = size * 0.35;
  
  // Axes: Document Integrity (0 deg), Employer Verification (90 deg), Affordability (180 deg), Income Stability (270 deg)
  const axes = [
    { name: 'Document Integrity', angle: 0, key: 'documentIntegrity' },
    { name: 'Employer Verification', angle: 90, key: 'employerVerification' },
    { name: 'Affordability', angle: 180, key: 'affordability' },
    { name: 'Income Stability', angle: 270, key: 'incomeStability' }
  ];

  const getPoint = (angle: number, value: number) => {
    const rad = (angle - 90) * (Math.PI / 180); // Rotate 90 to start at top
    const r = (value / 100) * radius;
    return {
      x: center + r * Math.cos(rad),
      y: center + r * Math.sin(rad)
    };
  };

  const currentPoints = axes.map(a => getPoint(a.angle, metrics[a.key as keyof typeof metrics])).map(p => `${p.x},${p.y}`).join(' ');
  const minRequiredPoints = axes.map(a => getPoint(a.angle, 70)).map(p => `${p.x},${p.y}`).join(' ');
  const avgApprovedPoints = axes.map(a => getPoint(a.angle, 85)).map(p => `${p.x},${p.y}`).join(' ');

  // Identify weak/strong
  // Added explicit type cast to number to resolve TS arithmetic operation error (line 52)
  const sortedMetrics = Object.entries(metrics).sort((a, b) => (a[1] as number) - (b[1] as number));
  const weakest = axes.find(a => a.key === sortedMetrics[0][0]);
  const strongest = axes.find(a => a.key === sortedMetrics[sortedMetrics.length - 1][0]);

  return (
    <div className="animate-in fade-in zoom-in duration-700">
      <div className="mb-10">
        <h2 className="text-4xl font-black text-white tracking-tighter">📡 Risk Radar</h2>
        <p className="text-white/30 text-xs font-black uppercase tracking-[0.5em] mt-2">Institutional Multi-dimensional Inference Visualization</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-stretch">
        <div className="xl:col-span-8 glass-card rounded-[4rem] p-10 border border-white/5 shadow-2xl relative overflow-hidden flex items-center justify-center min-h-[700px]">
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
            {/* Background Polygons (Web) */}
            {[20, 40, 60, 80, 100].map(val => (
              <polygon
                key={val}
                points={axes.map(a => getPoint(a.angle, val)).map(p => `${p.x},${p.y}`).join(' ')}
                fill="transparent"
                stroke="rgba(255,255,255,0.03)"
                strokeWidth="1"
              />
            ))}
            
            {/* Axis Lines */}
            {axes.map(a => {
              const p = getPoint(a.angle, 100);
              return (
                <line
                  key={a.name}
                  x1={center} y1={center} x2={p.x} y2={p.y}
                  stroke="rgba(255,255,255,0.05)"
                  strokeWidth="1"
                />
              );
            })}

            {/* Average Approved (85%) */}
            <polygon
              points={avgApprovedPoints}
              fill="rgba(59, 130, 246, 0.05)"
              stroke="rgba(59, 130, 246, 0.3)"
              strokeWidth="2"
              strokeDasharray="4 4"
            />

            {/* Minimum Required (70%) */}
            <polygon
              points={minRequiredPoints}
              fill="transparent"
              stroke="rgba(244, 63, 94, 0.2)"
              strokeWidth="1"
              strokeDasharray="2 2"
            />

            {/* Current Application */}
            <polygon
              points={currentPoints}
              fill="rgba(59, 130, 246, 0.2)"
              stroke="rgba(59, 130, 246, 1)"
              strokeWidth="3"
              className="drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]"
            />

            {/* Labels */}
            {axes.map(a => {
              const p = getPoint(a.angle, 115);
              const val = metrics[a.key as keyof typeof metrics];
              return (
                <g key={a.name}>
                  <text
                    x={p.x}
                    y={p.y}
                    fill="rgba(255,255,255,0.4)"
                    fontSize="11"
                    fontWeight="900"
                    textAnchor="middle"
                    className="uppercase tracking-[0.1em]"
                  >
                    {a.name}
                  </text>
                  <text
                    x={p.x}
                    y={p.y + 15}
                    fill={val < 70 ? "#f43f5e" : "#10b981"}
                    fontSize="14"
                    fontWeight="900"
                    textAnchor="middle"
                  >
                    {val}%
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Legend Overlay */}
          <div className="absolute bottom-10 left-10 space-y-3 bg-black/40 backdrop-blur-md p-6 rounded-3xl border border-white/5">
             <div className="flex items-center gap-3">
               <div className="w-8 h-1 bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
               <span className="text-[10px] font-black uppercase tracking-widest text-white/60">Current Application</span>
             </div>
             <div className="flex items-center gap-3">
               <div className="w-8 h-1 border-t-2 border-dashed border-blue-500/30"></div>
               <span className="text-[10px] font-black uppercase tracking-widest text-white/30">Average Approved (85%)</span>
             </div>
             <div className="flex items-center gap-3">
               <div className="w-8 h-1 border-t-2 border-dotted border-rose-500/30"></div>
               <span className="text-[10px] font-black uppercase tracking-widest text-white/30">Minimum Required (70%)</span>
             </div>
          </div>
        </div>

        <div className="xl:col-span-4 space-y-8">
          <div className="glass-card rounded-[3.5rem] p-10 border border-white/5 shadow-2xl flex flex-col justify-between">
            <h3 className="text-xs font-black uppercase tracking-[0.4em] text-white/30 mb-10">Heuristic Diagnostics</h3>
            
            <div className="space-y-12">
               <div className="p-8 bg-rose-500/5 rounded-[2.5rem] border border-rose-500/10">
                 <div className="text-[10px] font-black text-rose-400 uppercase tracking-widest mb-4">Weakest Dimension</div>
                 <div className="text-2xl font-black text-white mb-2">{weakest?.name}</div>
                 <div className="text-4xl font-black text-rose-500">{metrics[weakest?.key as keyof typeof metrics]}%</div>
                 <p className="mt-4 text-xs text-white/40 leading-relaxed font-medium italic">
                   "This dimension falls below the institutional safety threshold of 70%, indicating a critical risk vector."
                 </p>
               </div>

               <div className="p-8 bg-emerald-500/5 rounded-[2.5rem] border border-emerald-500/10">
                 <div className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-4">Strongest Dimension</div>
                 <div className="text-2xl font-black text-white mb-2">{strongest?.name}</div>
                 <div className="text-4xl font-black text-emerald-500">{metrics[strongest?.key as keyof typeof metrics]}%</div>
                 <p className="mt-4 text-xs text-white/40 leading-relaxed font-medium italic">
                   "Superior performance in this category provides partial mitigation against secondary risks."
                 </p>
               </div>
            </div>

            <div className="mt-12 pt-10 border-t border-white/5">
               <div className="text-[10px] font-black uppercase tracking-[0.5em] text-white/10 text-center">Neural Risk Matrix v4.2</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RiskRadar;
