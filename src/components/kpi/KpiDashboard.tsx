import React from 'react';
import { KpiRecord } from './types';
import { Target, AlertTriangle, CheckCircle, Flame, BarChart3 } from 'lucide-react';

interface KpiDashboardProps {
  records: KpiRecord[];
}

export function KpiDashboard({ records }: KpiDashboardProps) {
  const onTrackCount = records.filter(r => r.status === 'On Track').length;
  const atRiskCount = records.filter(r => r.status === 'At Risk').length;
  const offTrackCount = records.filter(r => r.status === 'Off Track').length;

  return (
    <div className="space-y-6 flex flex-col h-full overflow-y-auto pr-2 pb-12">
       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 flex-shrink-0">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Total KPIs</p>
            <h3 className="text-2xl font-black text-slate-800">{records.length}</h3>
          </div>
          <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center">
            <Target className="w-6 h-6 text-blue-600" />
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">On Track</p>
            <h3 className="text-2xl font-black text-emerald-600">{onTrackCount}</h3>
          </div>
          <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center">
            <CheckCircle className="w-6 h-6 text-emerald-600" />
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">At Risk</p>
            <h3 className="text-2xl font-black text-amber-600">{atRiskCount}</h3>
          </div>
          <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-amber-600" />
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Off Track</p>
            <h3 className="text-2xl font-black text-rose-600">{offTrackCount}</h3>
          </div>
          <div className="w-12 h-12 bg-rose-50 rounded-full flex items-center justify-center">
            <Flame className="w-6 h-6 text-rose-600" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:p-6 flex-1 min-h-[400px]">
        <div className="bg-white p-4 sm:p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col h-full">
           <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest mb-6 flex items-center border-b border-slate-100 pb-3">
             <BarChart3 className="w-4 h-4 mr-2 text-blue-600" /> KPI by Category
           </h3>
           <div className="flex-1 overflow-y-auto">
             <div className="space-y-4">
                {Object.entries(
                  records.reduce((acc, curr) => {
                    acc[curr.category] = (acc[curr.category] || 0) + 1;
                    return acc;
                  }, {} as Record<string, number>)
                ).map(([category, count]) => {
                   const pct = (count / (records.length || 1)) * 100;
                   return (
                     <div key={category}>
                       <div className="flex justify-between items-end mb-1">
                         <span className="text-xs font-bold text-slate-700">{category}</span>
                         <span className="text-xs font-bold text-slate-500">{count} KPIs</span>
                       </div>
                       <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                         <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${pct}%` }}></div>
                       </div>
                     </div>
                   );
                })}
             </div>
           </div>
        </div>
        <div className="bg-white p-4 sm:p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col h-full">
           <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest mb-6 flex items-center border-b border-slate-100 pb-3">
             <Flame className="w-4 h-4 mr-2 text-rose-600" /> Critical Attention Needed
           </h3>
           <div className="flex-1 overflow-y-auto">
             <div className="space-y-3">
               {records.filter(r => r.status === 'Off Track' || r.status === 'At Risk').length > 0 ? (
                 records
                   .filter(r => r.status === 'Off Track' || r.status === 'At Risk')
                   .sort((a,b) => a.status === 'Off Track' ? -1 : 1)
                   .slice(0, 5)
                   .map(record => (
                   <div key={record.id} className={`p-3 rounded-lg border flex justify-between items-center ${record.status === 'Off Track' ? 'bg-rose-50 border-rose-100' : 'bg-amber-50 border-amber-100'}`}>
                     <div>
                       <p className="text-sm font-bold text-slate-900">{record.title}</p>
                       <p className="text-xs font-semibold text-slate-600 mt-0.5">{record.department}</p>
                     </div>
                     <div className="text-right">
                       <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase ${record.status === 'Off Track' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'}`}>
                         {record.status}
                       </span>
                     </div>
                   </div>
                 ))
               ) : (
                 <div className="h-full flex items-center justify-center">
                   <p className="text-sm text-slate-500 font-medium italic">No critical KPIs require attention right now.</p>
                 </div>
               )}
             </div>
           </div>
        </div>
      </div>
    </div>
  );
}
