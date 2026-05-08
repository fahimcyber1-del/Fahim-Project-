import React from 'react';
import { CustomerComplaintRecord } from './types';
import { Frown, AlertOctagon, CheckCircle2, Clock, Activity, Target } from 'lucide-react';

interface CustomerComplaintsDashboardProps {
  records: CustomerComplaintRecord[];
}

export function CustomerComplaintsDashboard({ records }: CustomerComplaintsDashboardProps) {
  const openCount = records.filter(r => r.status === 'Open' || r.status === 'In Progress').length;
  const criticalCount = records.filter(r => r.severity === 'Critical').length;
  const resolvedCount = records.filter(r => r.status === 'Resolved' || r.status === 'Closed').length;

  const categories = records.reduce((acc, curr) => {
    acc[curr.category] = (acc[curr.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6 flex flex-col h-full overflow-y-auto pr-2 pb-12">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 flex-shrink-0">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Total Complaints</p>
            <h3 className="text-2xl font-black text-slate-800">{records.length}</h3>
          </div>
          <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center">
            <Frown className="w-6 h-6 text-slate-600" />
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
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Resolved</p>
            <h3 className="text-2xl font-black text-emerald-600">{resolvedCount}</h3>
          </div>
          <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6 text-emerald-600" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:p-6 flex-1 min-h-[400px]">
        <div className="bg-white p-4 sm:p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col h-full">
           <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest mb-6 flex items-center border-b border-slate-100 pb-3">
             <Target className="w-4 h-4 mr-2 text-blue-600" /> Complaints by Category
           </h3>
           <div className="flex-1 overflow-y-auto space-y-4">
              {Object.entries(categories).map(([category, count]) => {
                 const pct = (count / (records.length || 1)) * 100;
                 return (
                   <div key={category}>
                     <div className="flex justify-between items-end mb-1">
                       <span className="text-xs font-bold text-slate-700">{category}</span>
                       <span className="text-xs font-bold text-slate-500">{count}</span>
                     </div>
                     <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                       <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${pct}%` }}></div>
                     </div>
                   </div>
                 );
              })}
           </div>
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col h-full">
           <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest mb-6 flex items-center border-b border-slate-100 pb-3">
             <Activity className="w-4 h-4 mr-2 text-rose-600" /> Recent Critical & High Complaints
           </h3>
           <div className="flex-1 overflow-y-auto space-y-3">
             {records.filter(r => r.severity === 'High' || r.severity === 'Critical').length > 0 ? (
               records
                 .filter(r => r.severity === 'High' || r.severity === 'Critical')
                 .slice(0, 5)
                 .map(record => (
                 <div key={record.id} className="p-3 rounded-lg border bg-rose-50 border-rose-100 flex justify-between items-center">
                   <div>
                     <p className="text-sm font-bold text-slate-900">{record.customerName}</p>
                     <p className="text-xs font-semibold text-slate-600 mt-0.5">{record.category} • {record.id}</p>
                   </div>
                   <div className="text-right flex flex-col gap-1 items-end">
                     <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase 
                        ${record.severity === 'Critical' ? 'bg-rose-600 text-white' : 'bg-rose-100 text-rose-800'}`}>
                       {record.severity} Severity
                     </span>
                     <span className="text-[10px] text-slate-500 font-medium">{record.status}</span>
                   </div>
                 </div>
               ))
             ) : (
               <div className="h-full flex items-center justify-center">
                 <p className="text-sm text-slate-500 font-medium italic">No critical or high severity complaints.</p>
               </div>
             )}
           </div>
        </div>
      </div>
    </div>
  );
}
