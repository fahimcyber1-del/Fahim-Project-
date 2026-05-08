import React from 'react';
import { SOPRecord } from './types';
import { ArrowLeft, Edit3, FileText, User, Calendar, Tag, Paperclip, Download, History, Target, Users } from 'lucide-react';

interface SopDetailProps {
  record: SOPRecord;
  onBack: () => void;
  onEdit: () => void;
}

export function SopDetail({ record, onBack, onEdit }: SopDetailProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Published': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Approved': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Under Review': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Archived': return 'bg-rose-100 text-rose-800 border-rose-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const handleDownload = (data: string, name: string) => {
    const a = document.createElement('a');
    a.href = data;
    a.download = name;
    a.click();
  };

  return (
    <div className="max-w-6xl mx-auto w-full pb-12">
      <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-200">
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
            <p className="text-sm font-medium text-slate-500">Document ID: {record.id} • Version: {record.version}</p>
          </div>
        </div>
        <button onClick={onEdit} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-sm font-bold text-sm transition-colors">
          <Edit3 className="w-4 h-4" /> Edit SOP
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:p-6 lg:p-8">
         {/* Main Content Column */}
         <div className="lg:col-span-2 space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:p-6">
               <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4 sm:p-6">
                   <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-100">
                     <Target className="w-5 h-5 text-indigo-600" />
                     <h3 className="font-bold text-slate-800 uppercase tracking-widest text-sm">Purpose</h3>
                   </div>
                   <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{record.purpose}</p>
               </div>
               <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4 sm:p-6">
                   <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-100">
                     <Users className="w-5 h-5 text-indigo-600" />
                     <h3 className="font-bold text-slate-800 uppercase tracking-widest text-sm">Scope</h3>
                   </div>
                   <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{record.scope}</p>
               </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
               <div className="border-b border-slate-100 px-6 py-4 flex items-center justify-between bg-slate-50">
                 <div className="flex items-center gap-2">
                   <FileText className="w-5 h-5 text-indigo-600" />
                   <h3 className="font-bold text-slate-800 uppercase tracking-widest text-sm">Procedure Steps</h3>
                 </div>
               </div>
               <div className="p-4 sm:p-6 bg-white">
                  {record.procedureSteps ? (
                    <div className="prose prose-sm max-w-none text-slate-700 pb-4">
                      {record.procedureSteps.split('\n').map((paragraph, idx) => (
                        <p key={idx} className="mb-2 leading-relaxed">{paragraph}</p>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-slate-500 italic text-center py-8">No procedure steps provided.</p>
                  )}
               </div>
            </div>
         </div>

         {/* Sidebar Column */}
         <div className="space-y-6">
            
            {/* Roles & Info Card */}
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
               <div className="px-5 py-4 border-b border-slate-100 bg-slate-50">
                 <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest">Document Details</h3>
               </div>
               <div className="p-5 space-y-6">
                 
                 {/* Metadata */}
                 <div className="space-y-3">
                   <div className="flex items-start gap-3">
                     <Tag className="w-4 h-4 text-slate-400 mt-0.5" />
                     <div>
                       <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Department</p>
                       <p className="text-sm font-semibold text-slate-900">{record.department}</p>
                     </div>
                   </div>
                   
                   <div className="flex items-start gap-3">
                     <Calendar className="w-4 h-4 text-slate-400 mt-0.5" />
                     <div className="w-full">
                       <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Timeline</p>
                       <div className="space-y-1.5 w-full">
                         <div className="flex justify-between text-xs">
                           <span className="text-slate-500">Created:</span>
                           <span className="font-medium text-slate-900">{record.dateCreated}</span>
                         </div>
                         <div className="flex justify-between text-xs">
                           <span className="text-slate-500">Modified:</span>
                           <span className="font-medium text-slate-900">{record.dateLastModified}</span>
                         </div>
                         {record.datePublished && (
                           <div className="flex justify-between text-xs">
                             <span className="text-slate-500">Published:</span>
                             <span className="font-medium text-slate-900">{record.datePublished}</span>
                           </div>
                         )}
                       </div>
                     </div>
                   </div>
                 </div>

                 {/* Roles */}
                 <div className="pt-4 border-t border-slate-100 space-y-3">
                   <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Roles & Approvals</p>
                   
                   <div className="flex items-center gap-3 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                     <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
                       <User className="w-4 h-4" />
                     </div>
                     <div>
                       <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Author</p>
                       <p className="text-sm font-bold text-slate-900">{record.author}</p>
                     </div>
                   </div>

                   <div className="flex items-center gap-3 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                     <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
                       <User className="w-4 h-4" />
                     </div>
                     <div>
                       <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Reviewer</p>
                       {record.reviewer ? (
                         <p className="text-sm font-bold text-slate-900">{record.reviewer}</p>
                       ) : <p className="text-sm text-slate-400 italic">Not set</p>}
                     </div>
                   </div>

                   <div className="flex items-center gap-3 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                     <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
                       <User className="w-4 h-4" />
                     </div>
                     <div>
                       <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Approver</p>
                       {record.approver ? (
                         <p className="text-sm font-bold text-slate-900">{record.approver}</p>
                       ) : <p className="text-sm text-slate-400 italic">Not set</p>}
                     </div>
                   </div>
                 </div>

               </div>
            </div>

            {/* Attachments */}
            {record.attachments && record.attachments.length > 0 && (
              <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest">Attachments</h3>
                  <span className="text-xs font-bold bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full">{record.attachments.length}</span>
                </div>
                <div className="p-3">
                  <div className="space-y-2">
                    {record.attachments.map((file, i) => (
                      <div key={i} className="flex items-center justify-between p-3 border border-slate-100 rounded-lg hover:border-indigo-200 hover:bg-slate-50 transition-colors group">
                        <div className="flex items-center gap-3 overflow-hidden">
                          <div className="w-8 h-8 rounded bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0">
                            <Paperclip className="w-4 h-4 text-indigo-600" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-bold text-slate-700 truncate">{file.name}</p>
                          </div>
                        </div>
                        {file.data && (
                          <button 
                            onClick={() => handleDownload(file.data!, file.name)}
                            className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-all shrink-0"
                            title="Download"
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

            {/* Audit Trail / Version History */}
            {record.versionHistory && record.versionHistory.length > 0 && (
              <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-slate-100 bg-slate-50 flex items-center gap-2">
                  <History className="w-4 h-4 text-slate-500" />
                  <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest">Audit Trail</h3>
                </div>
                <div className="p-5">
                  <div className="relative border-l-2 border-slate-100 ml-3 space-y-6">
                    {record.versionHistory.map((v, i) => (
                      <div key={i} className="relative pl-6">
                         <div className="absolute top-0 left-[-9px] w-4 h-4 rounded-full border-2 border-white bg-indigo-500 shadow-sm" />
                         <div className="-mt-1.5 flex flex-col gap-1">
                            <div className="flex items-baseline justify-between">
                              <span className="font-bold text-slate-900 text-sm">Version {v.version}</span>
                              <span className="text-[10px] font-bold text-slate-400">{v.dateModified}</span>
                            </div>
                            <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-slate-200 mt-1">
                              {v.changes}
                            </p>
                            <p className="text-[10px] text-slate-500 font-medium mt-1">Edited by <span className="font-bold text-slate-700">{v.modifiedBy}</span></p>
                         </div>
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
