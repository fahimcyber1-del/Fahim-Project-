import React from 'react';
import { RiskRecord, RiskLevel } from './types';
import { ShieldAlert, AlertTriangle, CheckCircle, Activity } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface RiskAssessmentDashboardProps {
  records: RiskRecord[];
}

export function RiskAssessmentDashboard({ records }: RiskAssessmentDashboardProps) {
  const getRiskBreakdown = () => {
    const levels: Record<RiskLevel, number> = { Critical: 0, High: 0, Medium: 0, Low: 0 };
    records.forEach(r => {
      levels[r.riskLevel]++;
    });
    return levels;
  };

  const levels = getRiskBreakdown();
  
  const activeRisks = records.filter(r => r.status === 'Active' || r.status === 'Draft').length;
  const mitigatedRisks = records.filter(r => r.status === 'Mitigated' || r.status === 'Closed').length;

  return (
    <div className="space-y-6">
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 sm:p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-indigo-100 rounded-lg text-indigo-700">
               <ShieldAlert className="w-5 h-5" />
            </div>
            <h3 className="text-slate-600 font-bold text-sm">Total Assessments</h3>
          </div>
          <p className="text-3xl font-black text-slate-900">{records.length}</p>
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-xl border border-rose-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-rose-100 rounded-lg text-rose-700">
               <AlertTriangle className="w-5 h-5" />
            </div>
            <h3 className="text-slate-600 font-bold text-sm">Critical Risks</h3>
          </div>
          <div className="flex items-end gap-2">
            <p className="text-3xl font-black text-rose-700">{levels.Critical}</p>
            <p className="text-sm font-bold text-slate-500 mb-1">active</p>
          </div>
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-xl border border-amber-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-amber-100 rounded-lg text-amber-700">
               <Activity className="w-5 h-5" />
            </div>
            <h3 className="text-slate-600 font-bold text-sm">High Risks</h3>
          </div>
          <p className="text-3xl font-black text-amber-700">{levels.High}</p>
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-xl border border-emerald-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-emerald-100 rounded-lg text-emerald-700">
               <CheckCircle className="w-5 h-5" />
            </div>
            <h3 className="text-slate-600 font-bold text-sm">Mitigated / Closed</h3>
          </div>
          <div className="flex items-end gap-2">
             <p className="text-3xl font-black text-emerald-700">{mitigatedRisks}</p>
             <p className="text-sm font-bold text-slate-500 mb-1">/ {records.length}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:p-6">
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4 sm:p-6">
           <h3 className="text-lg font-black text-slate-900 mb-6">Risk Profile</h3>
           <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg border border-rose-100 bg-rose-50">
                 <span className="font-bold text-rose-800">Critical Risk (Score 15+)</span>
                 <span className="font-black text-xl text-rose-700">{levels.Critical}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg border border-orange-100 bg-orange-50">
                 <span className="font-bold text-orange-800">High Risk (Score 10-14)</span>
                 <span className="font-black text-xl text-orange-700">{levels.High}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg border border-amber-100 bg-amber-50">
                 <span className="font-bold text-amber-800">Medium Risk (Score 5-9)</span>
                 <span className="font-black text-xl text-amber-700">{levels.Medium}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg border border-emerald-100 bg-emerald-50">
                 <span className="font-bold text-emerald-800">Low Risk (Score 1-4)</span>
                 <span className="font-black text-xl text-emerald-700">{levels.Low}</span>
              </div>
           </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4 sm:p-6">
           <h3 className="text-lg font-black text-slate-900 mb-6">Recent Critical & High Risks</h3>
           <div className="space-y-3">
             {records.filter(r => r.riskLevel === 'Critical' || r.riskLevel === 'High')
                .slice(0, 5)
                .map(r => (
               <div key={r.id} className="border border-slate-200 rounded-lg p-3 hover:bg-slate-50 transition-colors cursor-pointer">
                 <div className="flex justify-between items-start mb-1">
                   <p className="font-bold text-sm text-slate-900 line-clamp-1 pr-4">{r.title}</p>
                   <span className={`flex-shrink-0 px-2 py-0.5 rounded text-[10px] font-bold ${r.riskLevel === 'Critical' ? 'bg-rose-100 text-rose-800' : 'bg-orange-100 text-orange-800'}`}>
                     {r.riskLevel}
                   </span>
                 </div>
                 <div className="flex justify-between items-center text-xs text-slate-500">
                    <span>{r.category}</span>
                    <span>Score: {r.riskScore}</span>
                 </div>
               </div>
             ))}
             {records.filter(r => r.riskLevel === 'Critical' || r.riskLevel === 'High').length === 0 && (
                <p className="text-sm font-medium text-slate-500 text-center py-6">No Critical or High risks found.</p>
             )}
           </div>
        </div>
      </div>
    </div>
  );
}
