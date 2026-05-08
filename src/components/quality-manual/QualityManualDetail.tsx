import React from 'react';
import { QualityManualRecord } from './types';
import { ArrowLeft, Edit3, BookOpen, User, Calendar, Tag, Paperclip, Download, History, Target } from 'lucide-react';

interface QualityManualDetailProps {
  record: QualityManualRecord;
  onBack: () => void;
  onEdit: () => void;
}

export function QualityManualDetail({ record, onBack, onEdit }: QualityManualDetailProps) {
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
            <p className="text-sm font-medium text-slate-500">ID: {record.id} • Version: {record.version}</p>
          </div>
        </div>
        <button onClick={onEdit} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-sm font-bold text-sm transition-colors">
          <Edit3 className="w-4 h-4" /> Edit Section
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:p-6">
         <div className="lg:col-span-2 space-y-6">
            
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-5">
               <div className="flex items-center gap-2 mb-3">
                 <Target className="w-5 h-5 text-indigo-600" />
                 <h3 className="font-bold text-slate-800 uppercase tracking-widest text-sm">Purpose</h3>
               </div>
               <p className="text-sm text-slate-700 leading-relaxed">{record.purpose}</p>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
               <div className="border-b border-slate-100 px-6 py-4 flex items-center justify-between bg-slate-50">
                 <div className="flex items-center gap-2">
                   <BookOpen className="w-5 h-5 text-indigo-600" />
                   <h3 className="font-bold text-slate-800 uppercase tracking-widest text-sm">Content Highlights</h3>
                 </div>
               </div>
               <div className="p-4 sm:p-6">
                  {record.content ? (
                    <p className="text-sm text-slate-900 leading-relaxed whitespace-pre-wrap pl-4 border-l-2 border-indigo-400 py-1">
                      {record.content}
                    </p>
                  ) : (
                    <p className="text-sm text-slate-500 italic text-center py-4">No content provided.</p>
                  )}
               </div>
            </div>
            
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4 sm:p-6">
               <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest mb-4 border-b border-slate-100 pb-2">Roles & Approvals</h3>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:p-6">
                 <div>
                   <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Author</p>
                   <div className="flex items-center gap-2">
                     <User className="w-4 h-4 text-slate-400" />
                     <p className="text-sm font-bold text-slate-900">{record.author}</p>
                   </div>
                 </div>
                 <div>
                   <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Reviewer</p>
                   {record.reviewer ? (
                     <div className="flex items-center gap-2">
                       <User className="w-4 h-4 text-slate-400" />
                       <p className="text-sm font-bold text-slate-900">{record.reviewer}</p>
                     </div>
                   ) : <p className="text-sm text-slate-400 italic">Not set</p>}
                 </div>
                 <div>
                   <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Approver</p>
                   {record.approver ? (
                     <div className="flex items-center gap-2">
                       <User className="w-4 h-4 text-slate-400" />
                       <p className="text-sm font-bold text-slate-900">{record.approver}</p>
                     </div>
                   ) : <p className="text-sm text-slate-400 italic">Not set</p>}
                 </div>
               </div>
            </div>

         </div>

         <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4 sm:p-6">
               <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest mb-4 border-b border-slate-100 pb-2">Record Info</h3>
               
               <div className="space-y-4">
                 <div className="flex items-start gap-3">
                   <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                     <Tag className="w-4 h-4 text-indigo-600" />
                   </div>
                   <div>
                     <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">Chapter</p>
                     <p className="text-sm font-bold text-slate-900">{record.chapter}</p>
                   </div>
                 </div>

                 <div className="flex items-start gap-3">
                   <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                     <Calendar className="w-4 h-4 text-slate-600" />
                   </div>
                   <div>
                     <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">Dates</p>
                     <p className="text-xs text-slate-700"><span className="font-medium">Created:</span> {record.dateCreated}</p>
                     <p className="text-xs text-slate-700"><span className="font-medium">Modified:</span> {record.dateLastModified}</p>
                     {record.datePublished && <p className="text-xs text-slate-700"><span className="font-medium">Published:</span> {record.datePublished}</p>}
                   </div>
                 </div>
               </div>
            </div>

            {record.versionHistory && record.versionHistory.length > 0 && (
              <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                <div className="border-b border-slate-100 px-6 py-4 flex items-center gap-2 bg-slate-50">
                  <History className="w-5 h-5 text-indigo-600" />
                  <h3 className="font-bold text-slate-800 uppercase tracking-widest text-sm">Version History</h3>
                </div>
                <div className="p-4">
                  <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
                    {record.versionHistory.map((v, i) => (
                      <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                         <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-slate-100 text-slate-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                            <span className="text-[10px] font-bold">v{v.version}</span>
                         </div>
                         <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-3 rounded border border-slate-200 shadow-sm">
                            <div className="flex items-center justify-between mb-1">
                               <p className="font-bold text-slate-800 text-xs">{v.dateModified}</p>
                            </div>
                            <p className="text-xs text-slate-600 mb-1">{v.changes}</p>
                            <p className="text-[10px] text-slate-400 font-medium">By {v.modifiedBy}</p>
                         </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

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
