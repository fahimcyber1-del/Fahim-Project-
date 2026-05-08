import React from 'react';
import { QualityGoalRecord } from './types';
import { Target, TrendingUp, AlertTriangle, CheckCircle2, ChevronRight, Activity } from 'lucide-react';

interface QualityGoalDashboardProps {
  records: QualityGoalRecord[];
}

export function QualityGoalDashboard({ records }: QualityGoalDashboardProps) {
  const achievedCount = records.filter(r => r.status === 'Achieved').length;
  const atRiskCount = records.filter(r => r.status === 'At Risk' || r.status === 'Off Track').length;
  const onTrackCount = records.filter(r => r.status === 'On Track').length;
  const totalCount = records.length;

  return (
    <div className="space-y-6 flex flex-col h-full overflow-y-auto pr-2 pb-12">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 flex-shrink-0">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Total Goals</p>
            <h3 className="text-2xl font-black text-slate-800">{totalCount}</h3>
          </div>
          <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center">
            <Target className="w-6 h-6 text-slate-600" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Achieved</p>
            <h3 className="text-2xl font-black text-blue-600">{achievedCount}</h3>
          </div>
          <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6 text-blue-600" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">On Track</p>
            <h3 className="text-2xl font-black text-emerald-600">{onTrackCount}</h3>
          </div>
          <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-emerald-600" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Needs Attention</p>
            <h3 className="text-2xl font-black text-rose-600">{atRiskCount}</h3>
          </div>
          <div className="w-12 h-12 bg-rose-50 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-rose-600" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:p-6 flex-1 min-h-[400px]">
        <div className="bg-white p-4 sm:p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col h-full overflow-hidden">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest mb-4 flex items-center border-b border-slate-100 pb-3">
            <Activity className="w-4 h-4 mr-2 text-indigo-600" /> Goal Progress Overview
          </h3>
          <div className="flex-1 overflow-y-auto space-y-4 pr-2">
             {records.map(record => {
               // Calculate a rough progress percentage based on target and current values
               // This is a simplified calculation and might need to be adjusted based on whether
               // the goal is to increase (e.g. satisfaction) or decrease (e.g. defects) a metric
               let progressPct = record.progress || 0;
               if (record.progress === undefined) {
                 if (record.currentValue === 0 && record.targetValue === 0) {
                   progressPct = 100;
                 } else if (record.targetValue < record.currentValue) {
                   const start = record.currentValue * 1.5; 
                   progressPct = Math.max(0, Math.min(100, ((start - record.currentValue) / (start - record.targetValue)) * 100));
                   if (record.currentValue <= record.targetValue) progressPct = 100;
                 } else {
                   progressPct = Math.min(100, (record.currentValue / record.targetValue) * 100);
                 }
               }
               
               return (
                 <div key={record.id} className="p-4 border border-slate-100 rounded-lg hover:bg-slate-50 transition-colors">
                   <div className="flex items-center justify-between mb-2">
                     <div className="flex items-center gap-2">
                       <span className={`w-2 h-2 rounded-full ${
                         record.status === 'Achieved' ? 'bg-blue-500' :
                         record.status === 'On Track' ? 'bg-emerald-500' :
                         record.status === 'At Risk' ? 'bg-amber-500' : 'bg-rose-500'
                       }`}></span>
                       <h4 className="font-bold text-slate-800 text-sm truncate max-w-[250px]">{record.title}</h4>
                     </div>
                     <span className="text-xs font-bold text-slate-500">{record.currentValue}{record.unit} / {record.targetValue}{record.unit}</span>
                   </div>
                   <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                     <div 
                       className={`h-full rounded-full ${record.status === 'Achieved' ? 'bg-blue-500' : record.status === 'On Track' ? 'bg-emerald-500' : 'bg-amber-500'}`}
                       style={{ width: `${progressPct}%` }}
                     ></div>
                   </div>
                 </div>
               );
             })}
             {records.length === 0 && (
               <p className="text-sm text-slate-500 italic text-center py-8">No goals recorded.</p>
             )}
          </div>
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col h-full overflow-hidden">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest mb-4 flex items-center border-b border-slate-100 pb-3">
            <AlertTriangle className="w-4 h-4 mr-2 text-rose-600" /> Needs Attention
          </h3>
          <div className="flex-1 overflow-y-auto space-y-3 pr-2">
            {records.filter(r => r.status === 'At Risk' || r.status === 'Off Track').length > 0 ? (
              records.filter(r => r.status === 'At Risk' || r.status === 'Off Track').map(record => (
                <div key={record.id} className="p-3 border border-rose-100 rounded-lg bg-rose-50 flex flex-col gap-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{record.title}</h4>
                      <p className="text-xs font-medium text-slate-600 mt-0.5">{record.category} • Due: {record.endDate}</p>
                    </div>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase truncate ${
                      record.status === 'Off Track' ? 'bg-rose-200 text-rose-800' : 'bg-amber-200 text-amber-800'
                    }`}>
                      {record.status}
                    </span>
                  </div>
                  <div className="text-xs text-slate-700 bg-white bg-opacity-50 p-2 rounded border border-rose-100 line-clamp-2">
                    {record.description}
                  </div>
                </div>
              ))
            ) : (
              <div className="h-full flex items-center justify-center p-4 sm:p-6 lg:p-8">
                <div className="text-center">
                  <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                  <p className="text-sm text-slate-600 font-medium">All active goals are on track.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
