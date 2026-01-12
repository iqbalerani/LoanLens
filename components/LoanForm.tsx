
import React from 'react';
import { LoanDetails } from '../types';

interface LoanFormProps {
  details: LoanDetails;
  onChange: (details: LoanDetails) => void;
}

const LoanForm: React.FC<LoanFormProps> = ({ details, onChange }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    onChange({
      ...details,
      [name]: name === 'amount' ? parseFloat(value) || 0 : value
    });
  };

  const purposes = ["Television", "Furniture", "Education", "Medical Expenses", "Home Improvement", "Business Inventory", "Wedding", "Travel", "Other"];
  const periods = ["3 months", "6 months", "12 months", "18 months", "24 months"];

  return (
    <div className="space-y-12">
      <h3 className="text-3xl font-black text-white tracking-tight flex items-center gap-4">
        <i className="fa-solid fa-layer-group text-indigo-500 text-2xl"></i> Requirement Setup
      </h3>
      
      <div className="space-y-10">
        <div className="group">
          <label className="block text-[11px] font-black text-white/30 uppercase tracking-[0.4em] mb-5 ml-1 group-focus-within:text-indigo-400 transition-colors">Capital Utilization</label>
          <div className="relative">
            <select 
              name="purpose"
              value={details.purpose}
              onChange={handleChange}
              className="w-full bg-white/5 border border-white/10 rounded-[1.8rem] py-6 px-8 text-white font-bold focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500/50 transition-all appearance-none cursor-pointer hover:bg-white/10"
            >
              {purposes.map(p => <option key={p} value={p} className="bg-[#0d0f1a]">{p}</option>)}
            </select>
            <div className="absolute right-8 top-1/2 -translate-y-1/2 pointer-events-none text-indigo-500">
              <i className="fa-solid fa-chevron-down text-sm"></i>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="group">
            <label className="block text-[11px] font-black text-white/30 uppercase tracking-[0.4em] mb-5 ml-1 group-focus-within:text-indigo-400 transition-colors">Principal Amount</label>
            <div className="relative">
              <div className="absolute left-8 top-1/2 -translate-y-1/2 text-indigo-400 font-black text-2xl">$</div>
              <input 
                type="number"
                name="amount"
                value={details.amount || ''}
                onChange={handleChange}
                placeholder="0"
                className="w-full bg-white/5 border border-white/10 rounded-[1.8rem] py-6 pl-14 pr-8 text-white font-black text-2xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500/50 transition-all hover:bg-white/10 placeholder:text-white/10"
              />
            </div>
          </div>

          <div className="group">
            <label className="block text-[11px] font-black text-white/30 uppercase tracking-[0.4em] mb-5 ml-1 group-focus-within:text-indigo-400 transition-colors">Time Horizon</label>
            <div className="relative">
              <select 
                name="period"
                value={details.period}
                onChange={handleChange}
                className="w-full bg-white/5 border border-white/10 rounded-[1.8rem] py-6 px-8 text-white font-bold focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500/50 transition-all appearance-none cursor-pointer hover:bg-white/10"
              >
                {periods.map(p => <option key={p} value={p} className="bg-[#0d0f1a]">{p}</option>)}
              </select>
              <div className="absolute right-8 top-1/2 -translate-y-1/2 pointer-events-none text-indigo-500">
                <i className="fa-solid fa-calendar-check text-sm"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoanForm;
