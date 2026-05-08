import React from 'react';
import { KpiRecord } from './types';
import { ArrowLeft, Target, Activity, Clock, User, Building, BookOpen } from 'lucide-react';

interface KpiDetailProps {
  record: KpiRecord;
  onBack: () => void;
  onEdit: () => void;
}

export function KpiDetail({ record, onBack, onEdit }: KpiDetailProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'On Track': return 'bg-emerald-100 text-emerald-800';
      case 'At Risk': return 'bg-amber-100 text-amber-800';
      case 'Off Track': return 'bg-rose-100 text-rose-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  return (
    <div className="max-w-5xl mx-auto w-full pb-12">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 bg-slate-100 text-slate-500 hover:bg-slate-200 rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-black text-slate-900">{record.title}</h1>
              <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${getStatusColor(record.status)}`}>
                {record.status}
              </span>
            </div>
            <p className="text-sm font-medium text-slate-500">ID: {record.id} • Last Updated: {record.lastUpdated}</p>
          </div>
        </div>
        <button onClick={onEdit} className="px-5 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg text-sm font-bold hover:bg-slate-50 shadow-sm transition-colors">
          Edit KPI
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:p-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4 sm:p-6 flex flex-col sm:flex-row gap-6 sm:items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Current Performance</p>
              <div className="flex items-baseline gap-2">
                <h2 className="text-4xl font-black text-blue-700">{record.currentValue}</h2>
                <span className="text-lg font-bold text-slate-500">{record.unit}</span>
              </div>
            </div>
            <div className="h-12 w-px bg-slate-200 hidden sm:block"></div>
            <div className="space-y-1 text-right sm:text-left">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Target Objective</p>
              <div className="flex items-baseline gap-2 sm:justify-start justify-end">
                <h2 className="text-3xl font-bold text-slate-800">{record.target}</h2>
                <span className="text-base font-bold text-slate-500">{record.unit}</span>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4 sm:p-6">
            <h3 className="text-base font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-600" /> Historical Trend
            </h3>
            <div className="h-48 flex items-end gap-2 pb-6 border-b border-slate-100">
               {/* Extremely simple bar chart visualization placeholder */}
               {record.history && record.history.length > 0 ? (
                 record.history.map((h, i) => {
                   const maxVal = Math.max(...record.history.map(x => x.value), record.target) * 1.2;
                   const heightPct = Math.min(100, (h.value / (maxVal || 1)) * 100);
                   const targetPct = Math.min(100, (record.target / (maxVal || 1)) * 100);
                   
                   return (
                     <div key={i} className="flex-1 flex flex-col items-center justify-end h-full relative group">
                       <div className="absolute w-full border-t border-dashed border-red-300 opacity-50 z-0 pointer-events-none" style={{ bottom: `${targetPct}%` }}></div>
                       
                       <div className="w-full max-w-[40px] bg-blue-500 rounded-t-sm relative z-10 transition-all group-hover:bg-blue-600" style={{ height: `${heightPct}%` }}>
                          <div className="opacity-0 group-hover:opacity-100 absolute -top-4 sm:p-6 lg:p-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] font-bold px-2 py-1 rounded whitespace-nowrap transition-opacity">
                            {h.value} {record.unit}
                          </div>
                       </div>
                       <span className="text-[10px] font-semibold text-slate-500 mt-2 rotate-45 origin-left md:rotate-0">{h.date}</span>
                     </div>
                   );
                 })
               ) : (
                 <div className="w-full h-full flex items-center justify-center text-slate-400 text-sm font-medium">No history data available</div>
               )}
            </div>
            {record.history && record.history.length > 0 && (
              <p className="text-xs text-slate-400 font-medium italic mt-4">* Red dashed line represents target relative to history scale.</p>
            )}
          </div>
          
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4 sm:p-6">
            <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-600" /> Description & Method
            </h3>
            <p className="text-sm font-medium text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-lg border border-slate-100">
              {record.description || 'No description provided.'}
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4 sm:p-6">
            <h3 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-widest">Metadata</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100">
                <Target className="w-5 h-5 text-slate-400 mt-0.5" />
                <div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">Category</p>
                  <p className="text-sm font-semibold text-slate-800">{record.category}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100">
                <Building className="w-5 h-5 text-slate-400 mt-0.5" />
                <div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">Department</p>
                  <p className="text-sm font-semibold text-slate-800">{record.department}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100">
                <Clock className="w-5 h-5 text-slate-400 mt-0.5" />
                <div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">Frequency</p>
                  <p className="text-sm font-semibold text-slate-800">{record.frequency}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100">
                <User className="w-5 h-5 text-slate-400 mt-0.5" />
                <div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">Owner</p>
                  <p className="text-sm font-semibold text-slate-800">{record.owner}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
