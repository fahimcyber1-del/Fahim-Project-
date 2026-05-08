import React from 'react';
import { CapaRecord, getStatusProgress, CapaStatus } from './types';
import { ArrowLeft, Edit3, ShieldAlert, CheckCircle, FileWarning, Search, Wrench, Shield, FileSearch, User, Calendar, Paperclip, Download } from 'lucide-react';

interface CapaDetailProps {
  record: CapaRecord;
  onBack: () => void;
  onEdit: () => void;
}

export function CapaDetail({ record, onBack, onEdit }: CapaDetailProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Closed': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Open': return 'bg-rose-100 text-rose-800 border-rose-200';
      case 'In Investigation': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Action Planned': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'In Progress': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'Under Review': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch(severity) {
      case 'Critical': return 'text-rose-700 bg-rose-100 border-rose-200';
      case 'High': return 'text-rose-600 bg-rose-50 border-rose-100';
      case 'Medium': return 'text-amber-700 bg-amber-100 border-amber-200';
      case 'Low': return 'text-slate-700 bg-slate-100 border-slate-200';
      default: return 'text-slate-700 bg-slate-100 border-slate-200';
    }
  };

  const handleDownload = (data: string, name: string) => {
    const a = document.createElement('a');
    a.href = data;
    a.download = name;
    a.click();
  };

  const renderAttachmentsForStep = (step: string) => {
    const attachments = record.attachments?.filter(a => a.step === step);
    if (!attachments || attachments.length === 0) return null;

    return (
      <div className="mt-4 pt-4 border-t border-slate-100">
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Attachments</p>
        <div className="space-y-2">
          {attachments.map((file, i) => (
            <div key={i} className="flex items-center justify-between p-2 border border-slate-200 rounded-lg bg-white shadow-sm hover:border-indigo-300 transition-colors group">
              <div className="flex items-center gap-2 overflow-hidden">
                <Paperclip className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                <span className="text-xs font-bold text-slate-700 truncate">{file.name}</span>
              </div>
              <button 
                onClick={() => handleDownload(file.data, file.name)}
                className="p-1 text-slate-400 hover:text-indigo-600 opacity-0 group-hover:opacity-100 transition-all focus:opacity-100"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    );
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
              <div className="flex flex-col gap-1.5">
                  <span className={`self-start px-2.5 py-1 rounded-full text-xs font-bold border ${getStatusColor(record.status)}`}>
                    {record.status}
                  </span>
                  <div className="w-full max-w-[150px] h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${record.status === 'Closed' ? 'bg-emerald-500' : 'bg-indigo-500'}`} 
                      style={{ width: `${getStatusProgress(record.status as CapaStatus)}%` }} 
                    />
                  </div>
                </div>
              <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${getSeverityColor(record.severity)}`}>
                {record.severity} Priority
              </span>
            </div>
            <p className="text-sm font-medium text-slate-500">ID: {record.id} • Raised: {record.dateRaised}</p>
          </div>
        </div>
        <button onClick={onEdit} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-sm font-bold text-sm transition-colors">
          <Edit3 className="w-4 h-4" /> Edit CAPA
        </button>
      </div>

      {/* Timeline Stepper */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4 sm:p-6 mb-6">
        <div className="flex items-center justify-between">
          {[
            { label: 'Initiated', status: 'Open' },
            { label: 'Investigation', status: 'In Investigation' },
            { label: 'Action Planned', status: 'Action Planned' },
            { label: 'In Progress', status: 'In Progress' },
            { label: 'Review', status: 'Under Review' },
            { label: 'Closed', status: 'Closed' }
          ].map((step, index, array) => {
            const statusOrder = ['Open', 'In Investigation', 'Action Planned', 'In Progress', 'Under Review', 'Closed'];
            const currentIndex = statusOrder.indexOf(record.status);
            const stepIndex = statusOrder.indexOf(step.status);
            
            const isCompleted = stepIndex < currentIndex || (record.status === 'Closed' && stepIndex <= currentIndex);
            const isCurrent = stepIndex === currentIndex && record.status !== 'Closed';
            const isPending = stepIndex > currentIndex;

            return (
              <React.Fragment key={step.status}>
                <div className="flex flex-col items-center relative z-10">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs border-2 ${
                    isCompleted ? 'bg-indigo-600 border-indigo-600 text-white' : 
                    isCurrent ? 'bg-white border-indigo-600 text-indigo-600' : 
                    'bg-slate-50 border-slate-300 text-slate-400'
                  }`}>
                    {isCompleted ? <CheckCircle className="w-5 h-5 text-white" /> : index + 1}
                  </div>
                  <span className={`text-[10px] uppercase tracking-wider font-bold mt-2 ${isCurrent ? 'text-indigo-600' : isCompleted ? 'text-slate-800' : 'text-slate-500'}`}>
                    {step.label}
                  </span>
                </div>
                {index < array.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-2 ${isCompleted ? 'bg-indigo-600' : 'bg-slate-200'}`} />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:p-6">
         <div className="lg:col-span-2 space-y-6">
            
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
               <div className="border-b border-slate-100 px-6 py-4 flex items-center gap-2 bg-slate-50 relative overflow-hidden">
                 <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                    <ShieldAlert className="w-24 h-24 text-rose-500" />
                 </div>
                 <FileWarning className="w-5 h-5 text-rose-600" />
                 <h3 className="font-bold text-slate-800 uppercase tracking-widest text-sm">Problem Details</h3>
               </div>
               <div className="p-4 sm:p-6 space-y-6 relative z-10">
                  <div className="grid grid-cols-2 gap-4 pb-4 border-b border-slate-100">
                    <div>
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Source</p>
                      <p className="text-sm font-medium text-slate-900">{record.source} {record.sourceReference ? `(${record.sourceReference})` : ''}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Problem Statement</p>
                    <p className="text-sm text-slate-800 leading-relaxed whitespace-pre-wrap p-4 bg-slate-50 rounded-lg border border-slate-100">
                      {record.problemDescription}
                    </p>
                  </div>
                  {record.immediateAction && (
                    <div>
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Immediate Correction / Containment</p>
                      <p className="text-sm text-slate-800 leading-relaxed whitespace-pre-wrap p-4 bg-amber-50 rounded-lg border border-amber-100">
                        {record.immediateAction}
                      </p>
                    </div>
                  )}
                  {renderAttachmentsForStep('Problem')}
               </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
               <div className="border-b border-slate-100 px-6 py-4 flex items-center gap-2 bg-slate-50">
                 <Search className="w-5 h-5 text-indigo-600" />
                 <h3 className="font-bold text-slate-800 uppercase tracking-widest text-sm">Investigation & Root Cause</h3>
               </div>
               <div className="p-4 sm:p-6 space-y-4">
                  {record.rootCauseAnalysis ? (
                    <div className="space-y-4">
                      <p className="text-sm text-slate-800 leading-relaxed whitespace-pre-wrap p-4 bg-indigo-50 rounded-lg border border-indigo-100">
                        {record.rootCauseAnalysis}
                      </p>
                    </div>
                  ) : (
                    <p className="text-sm text-slate-500 italic p-4 text-center border border-dashed border-slate-200 rounded-lg">
                      Investigation not yet documented.
                    </p>
                  )}
                  {renderAttachmentsForStep('Root Cause')}
               </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
               <div className="border-b border-slate-100 px-6 py-4 flex items-center justify-between bg-slate-50">
                 <div className="flex items-center gap-2">
                    <Wrench className="w-5 h-5 text-emerald-600" />
                    <h3 className="font-bold text-slate-800 uppercase tracking-widest text-sm">Action Plan</h3>
                 </div>
               </div>
               <div className="p-4 sm:p-6 space-y-6">
                  {record.correctiveAction || record.preventiveAction ? (
                    <>
                      {record.correctiveAction && (
                        <div>
                          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                            <CheckCircle className="w-4 h-4 text-emerald-500" /> Corrective Action
                          </p>
                          <p className="text-sm text-slate-800 leading-relaxed whitespace-pre-wrap pl-5 border-l-2 border-emerald-500">
                            {record.correctiveAction}
                          </p>
                          {renderAttachmentsForStep('Corrective Action')}
                        </div>
                      )}
                      
                      {record.preventiveAction && (
                        <div>
                          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1 mt-4">
                            <Shield className="w-4 h-4 text-emerald-500" /> Preventive Action
                          </p>
                          <p className="text-sm text-slate-800 leading-relaxed whitespace-pre-wrap pl-5 border-l-2 border-emerald-500">
                            {record.preventiveAction}
                          </p>
                          {renderAttachmentsForStep('Preventive Action')}
                        </div>
                      )}
                    </>
                  ) : (
                    <p className="text-sm text-slate-500 italic p-4 text-center border border-dashed border-slate-200 rounded-lg">
                      No corrective or preventive actions defined yet.
                    </p>
                  )}
               </div>
            </div>

         </div>

         <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4 sm:p-6">
               <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest mb-4 border-b border-slate-100 pb-2">Status & Ownership</h3>
               
               <div className="space-y-5">
                 <div className="flex items-start gap-3">
                   <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                     <User className="w-4 h-4 text-indigo-600" />
                   </div>
                   <div>
                     <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">Assigned Owner</p>
                     <p className="text-sm font-bold text-slate-900">{record.assignedTo}</p>
                   </div>
                 </div>

                 <div className="flex items-start gap-3">
                   <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                     <Calendar className="w-4 h-4 text-slate-600" />
                   </div>
                   <div>
                     <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">Target Completion Date</p>
                     <p className="text-sm font-bold text-slate-900">{record.targetDate}</p>
                   </div>
                 </div>

                 {record.closureDate && (
                   <div className="flex items-start gap-3">
                     <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                       <CheckCircle className="w-4 h-4 text-emerald-600" />
                     </div>
                     <div>
                       <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider mb-0.5">Actual Closure Date</p>
                       <p className="text-sm font-bold text-emerald-900">{record.closureDate}</p>
                     </div>
                   </div>
                 )}
               </div>
            </div>

            {record.attachments?.some(a => a.step === 'General') && (
              <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                <div className="border-b border-slate-100 px-6 py-4 flex items-center gap-2 bg-slate-50">
                  <Paperclip className="w-5 h-5 text-indigo-600" />
                  <h3 className="font-bold text-slate-800 uppercase tracking-widest text-sm">General Documents</h3>
                </div>
                <div className="p-2">
                  <div className="space-y-1">
                    {record.attachments.filter(a => a.step === 'General').map((file, i) => (
                      <div key={i} className="flex items-center justify-between p-3 border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors group">
                        <div className="flex items-center gap-3 overflow-hidden">
                          <Paperclip className="w-4 h-4 text-slate-400 flex-shrink-0" />
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-slate-700 truncate">{file.name}</p>
                          </div>
                        </div>
                        <button 
                          onClick={() => handleDownload(file.data, file.name)}
                          className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all focus:opacity-100"
                        >
                          <Download className="w-4 h-4" />
                        </button>
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
