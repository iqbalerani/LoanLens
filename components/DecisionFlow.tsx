
import React, { useMemo } from 'react';
import ReactFlow, { 
  Background, 
  Controls, 
  MarkerType,
  Node,
  Edge
} from 'reactflow';
import { AssessmentReport, Recommendation, RiskLevel } from '../types';

interface DecisionFlowProps {
  report: AssessmentReport | null;
}

const DecisionFlow: React.FC<DecisionFlowProps> = ({ report }) => {
  const nodes: Node[] = useMemo(() => {
    if (!report) {
      return [
        {
          id: '1',
          position: { x: 250, y: 100 },
          data: { label: 'Waiting for Assessment Data...' },
          style: { width: 300, textAlign: 'center' as const }
        }
      ];
    }

    const isApproved = report.recommendation === Recommendation.APPROVE;
    const fraudCount = report.fraudFlags.length;
    const dti = Math.round(report.affordability.paymentToAvailableRatio);

    return [
      {
        id: 'start',
        type: 'input',
        data: { 
          label: (
            <div className="flex flex-col gap-2">
              <span className="text-[10px] uppercase tracking-widest text-blue-400 font-black">Input Layer</span>
              <span className="text-sm font-bold">Document Ingested</span>
              <span className="text-[10px] text-white/40">{report.clientName}</span>
            </div>
          ) 
        },
        position: { x: 400, y: 50 },
        className: 'glass-card border-blue-500/30'
      },
      {
        id: 'verify',
        data: { 
          label: (
            <div className="flex flex-col gap-2">
              <span className="text-[10px] uppercase tracking-widest text-emerald-400 font-black">Verification Node</span>
              <span className="text-sm font-bold">Extraction Health</span>
              <span className="text-xs font-black text-emerald-400">{report.verificationScore}% Score</span>
            </div>
          ) 
        },
        position: { x: 400, y: 180 },
        className: 'glass-card'
      },
      {
        id: 'fraud',
        data: { 
          label: (
            <div className="flex flex-col gap-2">
              <span className="text-[10px] uppercase tracking-widest text-rose-400 font-black">Integrity Scanner</span>
              <span className="text-sm font-bold">Anomaly Detection</span>
              <span className={`text-xs font-black ${fraudCount > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                {fraudCount} Alerts Found
              </span>
            </div>
          ) 
        },
        position: { x: 200, y: 320 },
        className: 'glass-card'
      },
      {
        id: 'afford',
        data: { 
          label: (
            <div className="flex flex-col gap-2">
              <span className="text-[10px] uppercase tracking-widest text-amber-400 font-black">Affordability Logic</span>
              <span className="text-sm font-bold">DTI Ratio Analysis</span>
              <span className="text-xs font-black text-amber-400">{dti}% of Disposable</span>
            </div>
          ) 
        },
        position: { x: 600, y: 320 },
        className: 'glass-card'
      },
      {
        id: 'risk',
        data: { 
          label: (
            <div className="flex flex-col gap-2">
              <span className="text-[10px] uppercase tracking-widest text-blue-400 font-black">Risk Aggregator</span>
              <span className="text-sm font-bold">Heuristic Classification</span>
              <span className="text-xs font-black text-white/80">{report.riskLevel} Tier</span>
            </div>
          ) 
        },
        position: { x: 400, y: 460 },
        className: 'glass-card'
      },
      {
        id: 'end',
        type: 'output',
        data: { 
          label: (
            <div className="flex flex-col gap-2">
              <span className="text-[10px] uppercase tracking-widest text-white/40 font-black">Final Decision</span>
              <span className={`text-2xl font-black ${isApproved ? 'text-emerald-400' : 'text-rose-400'}`}>
                {report.recommendation}
              </span>
              <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Confidence: {Math.round(report.confidenceScore > 1 ? report.confidenceScore : report.confidenceScore * 100)}%</span>
            </div>
          ) 
        },
        position: { x: 350, y: 600 },
        style: { width: 250 },
        className: `border-2 ${isApproved ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-rose-500/50 bg-rose-500/5'}`
      }
    ];
  }, [report]);

  const edges: Edge[] = useMemo(() => {
    if (!report) return [];

    const defaultStyle = { stroke: 'rgba(255, 255, 255, 0.2)', strokeWidth: 2 };
    const successStyle = { stroke: '#10b981', strokeWidth: 3, animated: true };
    const dangerStyle = { stroke: '#f43f5e', strokeWidth: 3, animated: true };

    const isHighFraud = report.fraudFlags.length > 0;
    const isGoodAffordability = report.affordability.paymentToAvailableRatio < 30;

    return [
      { id: 'e1-2', source: 'start', target: 'verify', markerEnd: { type: MarkerType.ArrowClosed }, style: defaultStyle },
      { id: 'e2-3', source: 'verify', target: 'fraud', markerEnd: { type: MarkerType.ArrowClosed }, style: isHighFraud ? dangerStyle : successStyle },
      { id: 'e2-4', source: 'verify', target: 'afford', markerEnd: { type: MarkerType.ArrowClosed }, style: isGoodAffordability ? successStyle : defaultStyle },
      { id: 'e3-5', source: 'fraud', target: 'risk', markerEnd: { type: MarkerType.ArrowClosed }, style: defaultStyle },
      { id: 'e4-5', source: 'afford', target: 'risk', markerEnd: { type: MarkerType.ArrowClosed }, style: defaultStyle },
      { id: 'e5-6', source: 'risk', target: 'end', markerEnd: { type: MarkerType.ArrowClosed }, style: report.recommendation === Recommendation.APPROVE ? successStyle : dangerStyle },
    ];
  }, [report]);

  return (
    <div className="glass-card h-[750px] rounded-[3.5rem] border border-white/5 shadow-2xl overflow-hidden relative">
      <div className="absolute top-8 left-10 z-10">
        <h3 className="text-xl font-black text-white tracking-tight flex items-center gap-4">
          <i className="fa-solid fa-network-wired text-blue-500"></i> Decision Explainability Flow
        </h3>
        <p className="text-white/30 text-[11px] font-bold uppercase tracking-[0.2em] mt-2">
          Interactive Audit Trail • Gemini 3 Reasoning Logic
        </p>
      </div>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        fitView
        panOnScroll
        selectionOnDrag
        style={{ background: 'transparent' }}
      >
        <Background color="rgba(255,255,255,0.03)" gap={20} />
        <Controls className="!bg-slate-900 !border-white/10 !fill-white" />
      </ReactFlow>
      
      {!report && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0d0f1a]/80 backdrop-blur-xl z-20">
          <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-8 border border-white/10 animate-pulse">
            <i className="fa-solid fa-database text-white/20 text-4xl"></i>
          </div>
          <p className="text-white/40 font-bold uppercase tracking-[0.3em] text-sm">Analyze a document to unlock flow</p>
        </div>
      )}
    </div>
  );
};

export default DecisionFlow;
