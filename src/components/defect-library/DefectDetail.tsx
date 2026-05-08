import React, { useState } from 'react';
import { DefectItem } from './types';
import { Download, Edit3, CheckCircle, XCircle, ArrowLeft, Link2, ShieldCheck, Search, Activity, FileText, Image as ImageIcon, X } from 'lucide-react';

interface DefectDetailProps {
  record: DefectItem;
  onEdit: (id: string) => void;
  onBack: () => void;
}

export function DefectDetail({ record, onEdit, onBack }: DefectDetailProps) {
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);

  const downloadImage = (url: string, name: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-6xl mx-auto flex flex-col h-full space-y-6 pb-12">
      {fullscreenImage && (
        <div className="fixed inset-0 z-50 bg-black/90 flex flex-col items-center justify-center p-4">
          <div className="absolute top-4 right-4 flex gap-4">
            <button 
              onClick={() => downloadImage(fullscreenImage, 'defect-image')}
              className="text-white hover:text-blue-400 bg-white/10 p-2 rounded-full transition"
              title="Download Image"
            >
              <Download className="w-6 h-6" />
            </button>
            <button onClick={() => setFullscreenImage(null)} className="text-white hover:text-red-400 bg-white/10 p-2 rounded-full transition">
              <X className="w-6 h-6" />
            </button>
          </div>
          <img src={fullscreenImage} alt="Expanded view" className="max-w-full max-h-[90vh] object-contain rounded" />
        </div>
      )}

      <button onClick={onBack} className="flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors w-fit font-semibold text-sm">
        <ArrowLeft className="w-4 h-4" /> Back to Library
      </button>

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-slate-200 gap-4">
        <div className="flex items-center gap-4 sm:p-6">
          <div className={`w-16 h-16 rounded-xl flex items-center justify-center shrink-0 ${
            record.severity === 'Critical' ? 'bg-rose-100 text-rose-600' :
            record.severity === 'Major' ? 'bg-amber-100 text-amber-600' :
            'bg-slate-100 text-slate-600'
          }`}>
             {record.severity === 'Critical' ? <XCircle className="w-8 h-8" /> : <AlertTriangleIcon severity={record.severity} />}
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-3 mb-1">
              <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                record.severity === 'Critical' ? 'bg-rose-100 text-rose-700' :
                record.severity === 'Major' ? 'bg-amber-100 text-amber-700' : 
                'bg-slate-100 text-slate-700'
              }`}>
                {record.severity} DEFECT
              </span>
              <span className="text-sm font-bold text-slate-500 uppercase tracking-widest">CODE: {record.code}</span>
            </div>
            <h2 className="text-3xl font-black text-blue-900 tracking-tight">{record.name}</h2>
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <button className="flex items-center gap-2 px-4 py-2 border border-slate-300 text-slate-700 bg-white hover:bg-slate-50 font-semibold rounded-lg text-sm shadow-sm transition-colors">
            <Download className="w-4 h-4" /> Export PDF
          </button>
          <button onClick={() => onEdit(record.id)} className="flex items-center gap-2 px-6 py-2 bg-blue-700 text-white font-bold rounded-lg shadow-sm hover:bg-blue-800 transition-colors">
            <Edit3 className="w-4 h-4" /> Edit Record
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:p-6">
        {/* Left Column */}
        <div className="xl:col-span-2 space-y-6">
          {/* Visual Standards */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4 sm:p-6 overflow-hidden">
            <h3 className="text-xl font-bold text-blue-900 mb-6 flex items-center gap-2">
              <Search className="w-5 h-5 text-blue-600" /> Visual Inspection Standard
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:p-6">
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2 text-emerald-700 font-bold uppercase tracking-wider text-xs mb-1">
                   <CheckCircle className="w-4 h-4" /> Pass Reference
                </div>
                {record.passReferenceImages && record.passReferenceImages.length > 0 ? (
                  <div className="grid grid-cols-2 gap-3">
                    {record.passReferenceImages.map((img, i) => (
                      <div 
                        key={i} 
                        className="relative rounded-xl overflow-hidden border-2 border-emerald-100 aspect-video bg-slate-50 group cursor-pointer"
                        onClick={() => setFullscreenImage(img)}
                      >
                        <img src={img} alt="Pass" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <ImageIcon className="w-6 h-6 text-white" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="w-full h-32 rounded-xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 font-medium text-sm">
                    <ImageIcon className="w-6 h-6 mb-2 opacity-50" />
                    No Images Uploaded
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2 text-rose-700 font-bold uppercase tracking-wider text-xs mb-1">
                   <XCircle className="w-4 h-4" /> Fail Criteria
                </div>
                {record.failCriteriaImages && record.failCriteriaImages.length > 0 ? (
                  <div className="grid grid-cols-2 gap-3">
                    {record.failCriteriaImages.map((img, i) => (
                      <div 
                        key={i} 
                        className="relative rounded-xl overflow-hidden border-2 border-rose-100 aspect-video bg-slate-50 group cursor-pointer"
                        onClick={() => setFullscreenImage(img)}
                      >
                        <img src={img} alt="Fail" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <ImageIcon className="w-6 h-6 text-white" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="w-full h-32 rounded-xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 font-medium text-sm">
                    <ImageIcon className="w-6 h-6 mb-2 opacity-50" />
                    No Images Uploaded
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Root Cause Analysis */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4 sm:p-6">
            <h3 className="text-xl font-bold text-blue-900 mb-6 flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-600" /> Root Cause Analysis
            </h3>
            <div className="space-y-4">
              {record.rootCauseAnalysis && record.rootCauseAnalysis.length > 0 ? (
                record.rootCauseAnalysis.map((rca, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="shrink-0 w-8 h-8 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-sm">
                      {rca.step}
                    </div>
                    <div className="flex-1 bg-slate-50 border border-slate-100 rounded-lg p-3">
                      <p className="text-slate-700 font-medium text-sm">{rca.description}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-slate-500 font-medium italic text-sm">No root cause analysis steps documented.</p>
              )}
            </div>
          </div>

          {/* Resolution Protocol */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4 sm:p-6">
            <h3 className="text-xl font-bold text-blue-900 mb-6 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-blue-600" /> Resolution Protocol
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:p-6">
              <div>
                 <h4 className="text-sm font-bold text-slate-800 uppercase tracking-widest mb-3">Corrective Action</h4>
                 <div className="bg-rose-50 border border-rose-100 p-4 rounded-xl min-h-[100px]">
                   <p className="text-slate-700 font-medium text-sm">{record.correctiveAction || 'None specified.'}</p>
                 </div>
              </div>
              <div>
                 <h4 className="text-sm font-bold text-slate-800 uppercase tracking-widest mb-3">Preventive Action</h4>
                 <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl min-h-[100px]">
                   <p className="text-slate-700 font-medium text-sm">{record.preventiveAction || 'None specified.'}</p>
                 </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4 sm:p-6">
             <h3 className="text-xl font-bold text-blue-900 mb-6 gap-2">Configuration</h3>
             
             <div className="space-y-4">
               <div>
                 <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Status</p>
                 <div className="flex items-center gap-2">
                   <div className={`w-2.5 h-2.5 rounded-full ${record.status === 'Active' ? 'bg-emerald-500' : record.status === 'Draft' ? 'bg-slate-400' : 'bg-red-500'}`} />
                   <span className="text-slate-800 font-bold">{record.status}</span>
                 </div>
               </div>

               <div>
                 <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Category & Departments</p>
                 <div className="flex flex-wrap gap-2">
                    <span className="px-2.5 py-1 rounded bg-blue-50 text-blue-700 text-xs font-bold border border-blue-100">{record.category}</span>
                    {record.impactedDepartments?.map(d => (
                       <span key={d} className="px-2.5 py-1 rounded bg-slate-100 text-slate-600 text-xs font-bold border border-slate-200">{d}</span>
                    ))}
                 </div>
               </div>
               
               <div>
                 <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Quality Standard (Ref)</p>
                 <span className="text-slate-800 font-bold">{record.qualityStandardRef || 'Not assigned'}</span>
               </div>
               
               {record.sopLink && (
                 <div>
                   <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">SOP Link</p>
                   <a href={record.sopLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 font-bold flex items-center gap-1 hover:underline text-sm truncate">
                     <Link2 className="w-4 h-4" /> View Documentation
                   </a>
                 </div>
               )}

               <div>
                 <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Revision Number</p>
                 <span className="text-slate-800 font-semibold">{record.revisionNumber || 'v1.0'}</span>
               </div>
             </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4 sm:p-6">
            <h3 className="text-xl font-bold text-blue-900 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" /> Acceptance Criteria
            </h3>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 min-h-[120px]">
              <p className="text-slate-700 font-medium text-sm leading-relaxed">{record.acceptanceCriteria || 'No acceptance criteria documented.'}</p>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4 sm:p-6">
            <div className="space-y-3 font-medium text-sm text-slate-600">
               <div className="flex justify-between items-center py-2 border-b border-slate-100">
                 <span className="text-slate-500">Record ID</span>
                 <span className="text-slate-800 font-semibold">{record.id}</span>
               </div>
               <div className="flex justify-between items-center py-2 border-b border-slate-100">
                 <span className="text-slate-500">Last Updated By</span>
                 <span className="text-slate-800 font-semibold">{record.lastUpdatedBy}</span>
               </div>
               <div className="flex justify-between items-center py-2">
                 <span className="text-slate-500">Last Updated Date</span>
                 <span className="text-slate-800 font-semibold">{record.lastUpdatedDate}</span>
               </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

function AlertTriangleIcon({ severity }: { severity: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
      <path d="M12 9v4"/>
      <path d="M12 17h.01"/>
    </svg>
  );
}
