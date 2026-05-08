import React from 'react';
import { RootCauseRecord, RCAMethod, FiveWhysData, FishboneData, OtherMethodData } from './types';
import { ArrowLeft, Edit3, ShieldAlert, FileText, CheckCircle, BrainCircuit, User, Paperclip, Download } from 'lucide-react';

interface RootCauseDetailProps {
  record: RootCauseRecord;
  onBack: () => void;
  onEdit: () => void;
}

export function RootCauseDetail({ record, onBack, onEdit }: RootCauseDetailProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Closed': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Completed': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'In Progress': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Draft': return 'bg-slate-100 text-slate-800 border-slate-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const handleDownload = (data: string, name: string) => {
    const a = document.createElement('a');
    a.href = data;
    a.download = name;
    a.click();
  };

  const renderMethodDetails = () => {
    if (record.method === '5 Whys') {
      const data = record.analysisData as FiveWhysData;
      return (
        <div className="space-y-4 pt-4 border-t border-slate-100">
           <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">5 Whys Progression</p>
           <div className="space-y-3 pl-4 border-l-2 border-blue-200 relative">
             {[1, 2, 3, 4, 5].map(num => {
               const val = (data as any)[`why${num}`];
               if (!val) return null;
               return (
                 <div key={num} className="relative">
                   <div className="absolute w-2 h-2 rounded-full bg-blue-400 -left-[21px] top-1.5 ring-4 ring-white" />
                   <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">Why {num}?</p>
                   <p className="text-sm font-medium text-slate-800 bg-slate-50 p-2 rounded-lg border border-slate-100">{val}</p>
                 </div>
               );
             })}
           </div>
        </div>
      );
    } else if (record.method === 'Fishbone (Ishikawa)') {
       const data = record.analysisData as FishboneData;
       return (
        <div className="space-y-4 pt-4 border-t border-slate-100">
           <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Fishbone (6M) Breakdown</p>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             {['manpower', 'machine', 'material', 'method', 'measurement', 'environment'].map(cause => {
               const val = (data as any)[cause];
               if (!val) return null;
               return (
                 <div key={cause} className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                   <p className="text-[10px] font-bold text-blue-600 uppercase tracking-wider mb-1">{cause}</p>
                   <p className="text-sm font-medium text-slate-800">{val}</p>
                 </div>
               );
             })}
           </div>
        </div>
      );
    } else {
       const data = record.analysisData as OtherMethodData;
       return (
        <div className="space-y-4 pt-4 border-t border-slate-100">
           <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Method: {data.methodName}</p>
           <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
             <p className="text-sm text-slate-800 whitespace-pre-wrap">{data.analysisDetails}</p>
           </div>
        </div>
      );
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
              <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${getStatusColor(record.status)}`}>
                {record.status}
              </span>
            </div>
            <p className="text-sm font-medium text-slate-500">ID: {record.id} • Initiated: {record.dateInitiated}</p>
          </div>
        </div>
        <button onClick={onEdit} className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm font-bold text-sm transition-colors">
          <Edit3 className="w-4 h-4" /> Edit RCA
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:p-6">
         <div className="lg:col-span-2 space-y-6">
            
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
               <div className="border-b border-slate-100 px-6 py-4 flex items-center justify-between bg-slate-50">
                 <div className="flex items-center gap-2">
                   <BrainCircuit className="w-5 h-5 text-indigo-600" />
                   <h3 className="font-bold text-slate-800 uppercase tracking-widest text-sm">Analysis & Breakdown</h3>
                 </div>
                 <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-white border border-slate-200 text-slate-600 uppercase tracking-wider">
                   {record.method}
                 </span>
               </div>
               <div className="p-4 sm:p-6 space-y-6">
                 <div>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Problem Statement</p>
                    <p className="text-sm font-bold xl:text-base text-slate-900 leading-relaxed whitespace-pre-wrap pl-4 border-l-4 border-rose-400 py-1">
                       {record.analysisData.problemStatement}
                    </p>
                 </div>
                 
                 {renderMethodDetails()}

                 <div className="pt-4 border-t border-slate-100">
                    <p className="text-[10px] font-bold text-rose-600 uppercase tracking-wider mb-3">Conclusive Root Cause</p>
                    <p className="text-sm font-bold text-rose-900 leading-relaxed whitespace-pre-wrap p-4 bg-rose-50 rounded-lg border border-rose-100 shadow-sm">
                       {record.analysisData.rootCause}
                    </p>
                 </div>
               </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
               <div className="border-b border-slate-100 px-6 py-4 flex items-center gap-2 bg-slate-50">
                 <CheckCircle className="w-5 h-5 text-emerald-600" />
                 <h3 className="font-bold text-slate-800 uppercase tracking-widest text-sm">Proposed Actions</h3>
               </div>
               <div className="p-4 sm:p-6">
                  {record.correctiveActionsProposed ? (
                    <p className="text-sm text-slate-800 leading-relaxed whitespace-pre-wrap pl-4 border-l-2 border-emerald-500">
                      {record.correctiveActionsProposed}
                    </p>
                  ) : (
                    <p className="text-sm text-slate-500 italic text-center py-4">No actions proposed yet.</p>
                  )}
               </div>
            </div>

         </div>

         <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4 sm:p-6">
               <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest mb-4 border-b border-slate-100 pb-2">Investigation Info</h3>
               
               <div className="space-y-4">
                 <div className="flex items-start gap-3">
                   <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                     <User className="w-4 h-4 text-indigo-600" />
                   </div>
                   <div>
                     <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">Lead Investigator</p>
                     <p className="text-sm font-bold text-slate-900">{record.leadInvestigator}</p>
                   </div>
                 </div>

                 {record.relatedIssueId && (
                   <div className="flex items-start gap-3">
                     <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                       <ShieldAlert className="w-4 h-4 text-amber-600" />
                     </div>
                     <div>
                       <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">Related Issue</p>
                       <p className="text-sm font-bold text-slate-900">{record.relatedIssueId}</p>
                     </div>
                   </div>
                 )}
               </div>
            </div>

            {record.attachments && record.attachments.length > 0 && (
              <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                <div className="border-b border-slate-100 px-6 py-4 flex items-center gap-2 bg-slate-50">
                  <Paperclip className="w-5 h-5 text-indigo-600" />
                  <h3 className="font-bold text-slate-800 uppercase tracking-widest text-sm">Attachments</h3>
                </div>
                <div className="p-2">
                  <div className="space-y-1">
                    {record.attachments.map((file, i) => (
                      <div key={i} className="flex items-center justify-between p-3 border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors group">
                        <div className="flex items-center gap-3 overflow-hidden">
                          <Paperclip className="w-4 h-4 text-slate-400 flex-shrink-0" />
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-slate-700 truncate">{file.name}</p>
                          </div>
                        </div>
                        {file.data && (
                          <button 
                            onClick={() => handleDownload(file.data!, file.name)}
                            className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all focus:opacity-100"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
         </div>
      </div>
    </div>
  );
}
