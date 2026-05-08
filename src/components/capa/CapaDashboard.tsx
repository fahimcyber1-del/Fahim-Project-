import React from 'react';
import { CapaRecord } from './types';
import { AlertOctagon, Wrench, CheckCircle2, Clock, Activity, FileWarning } from 'lucide-react';

interface CapaDashboardProps {
  records: CapaRecord[];
}

export function CapaDashboard({ records }: CapaDashboardProps) {
  const openCount = records.filter(r => ['Open', 'In Investigation', 'Action Planned', 'In Progress', 'Under Review'].includes(r.status)).length;
  const criticalCount = records.filter(r => r.severity === 'Critical').length;
  const closedCount = records.filter(r => r.status === 'Closed').length;

  const sources = records.reduce((acc, curr) => {
    acc[curr.source] = (acc[curr.source] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6 flex flex-col h-full overflow-y-auto pr-2 pb-12">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 flex-shrink-0">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Total CAPAs</p>
            <h3 className="text-2xl font-black text-slate-800">{records.length}</h3>
          </div>
          <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center">
            <Wrench className="w-6 h-6 text-slate-600" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Active / Open</p>
            <h3 className="text-2xl font-black text-amber-600">{openCount}</h3>
          </div>
          <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center">
            <Clock className="w-6 h-6 text-amber-600" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Critical Severity</p>
            <h3 className="text-2xl font-black text-rose-600">{criticalCount}</h3>
          </div>
          <div className="w-12 h-12 bg-rose-50 rounded-full flex items-center justify-center">
            <AlertOctagon className="w-6 h-6 text-rose-600" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Closed</p>
            <h3 className="text-2xl font-black text-emerald-600">{closedCount}</h3>
          </div>
          <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6 text-emerald-600" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:p-6 flex-1 min-h-[400px]">
        <div className="bg-white p-4 sm:p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col h-full">
           <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest mb-6 flex items-center border-b border-slate-100 pb-3">
             <FileWarning className="w-4 h-4 mr-2 text-indigo-600" /> CAPA by Source
           </h3>
           <div className="flex-1 overflow-y-auto space-y-4">
              {Object.entries(sources).map(([source, count]) => {
                 const pct = (count / (records.length || 1)) * 100;
                 return (
                   <div key={source}>
                     <div className="flex justify-between items-end mb-1">
                       <span className="text-xs font-bold text-slate-700">{source}</span>
                       <span className="text-xs font-bold text-slate-500">{count}</span>
                     </div>
                     <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                       <div className="bg-indigo-500 h-2 rounded-full" style={{ width: `${pct}%` }}></div>
                     </div>
                   </div>
                 );
              })}
           </div>
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col h-full">
           <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest mb-6 flex items-center border-b border-slate-100 pb-3">
             <Activity className="w-4 h-4 mr-2 text-rose-600" /> Recent High/Critical Active CAPAs
           </h3>
           <div className="flex-1 overflow-y-auto space-y-3">
             {records.filter(r => (r.severity === 'High' || r.severity === 'Critical') && r.status !== 'Closed').length > 0 ? (
               records
                 .filter(r => (r.severity === 'High' || r.severity === 'Critical') && r.status !== 'Closed')
                 .slice(0, 5)
                 .map(record => (
                 <div key={record.id} className="p-3 rounded-lg border bg-rose-50 border-rose-100 flex justify-between items-center">
                   <div>
                     <p className="text-sm font-bold text-slate-900 truncate max-w-[200px]" title={record.title}>{record.title}</p>
                     <p className="text-xs font-semibold text-slate-600 mt-0.5">{record.id} • {record.source}</p>
                   </div>
                   <div className="text-right flex flex-col gap-1 items-end">
                     <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase 
                        ${record.severity === 'Critical' ? 'bg-rose-600 text-white' : 'bg-rose-100 text-rose-800'}`}>
                       {record.severity}
                     </span>
                     <span className="text-[10px] text-slate-500 font-medium">{record.status}</span>
                   </div>
                 </div>
               ))
             ) : (
               <div className="h-full flex items-center justify-center">
                 <p className="text-sm text-slate-500 font-medium italic">No critical or high severity active CAPAs.</p>
               </div>
             )}
           </div>
        </div>
      </div>
    </div>
  );
}
