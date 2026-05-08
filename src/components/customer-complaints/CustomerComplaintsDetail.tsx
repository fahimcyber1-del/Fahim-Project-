import React from 'react';
import { CustomerComplaintRecord } from './types';
import { ArrowLeft, Edit3, User, Calendar, MapPin, Search, CheckCircle2, Factory } from 'lucide-react';
import { FileViewer } from '../inspection/FileViewer';

interface CustomerComplaintsDetailProps {
  record: CustomerComplaintRecord;
  onBack: () => void;
  onEdit: () => void;
}

export function CustomerComplaintsDetail({ record, onBack, onEdit }: CustomerComplaintsDetailProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open': return 'bg-rose-100 text-rose-800 border-rose-200';
      case 'In Progress': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Resolved': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Closed': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'Critical': return <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-rose-600 text-white truncate">CRITICAL</span>;
      case 'High': return <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800 truncate">HIGH</span>;
      case 'Medium': return <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 truncate">MEDIUM</span>;
      case 'Low': return <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 truncate">LOW</span>;
      default: return null;
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
              <h1 className="text-2xl font-black text-slate-900">{record.id}</h1>
              <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${getStatusColor(record.status)}`}>
                {record.status}
              </span>
              {getSeverityBadge(record.severity)}
            </div>
            <p className="text-sm font-medium text-slate-500">{record.customerName} | Received on {record.dateReceived}</p>
          </div>
        </div>
        <button onClick={onEdit} className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm font-bold text-sm transition-colors">
          <Edit3 className="w-4 h-4" /> Edit Complaint
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:p-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4 sm:p-6">
             <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest mb-4 border-b border-slate-100 pb-2 flex items-center gap-2">
               <User className="w-4 h-4 text-blue-600" /> Reference Information
             </h3>
             <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:p-6">
               <div className="flex items-start gap-3">
                 <div>
                   <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">Order Ref</p>
                   <p className="text-sm font-semibold text-slate-800">{record.orderRef}</p>
                 </div>
               </div>
               {record.styleNo && (
                 <div className="flex items-start gap-3">
                   <div>
                     <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">Style / Item</p>
                     <p className="text-sm font-semibold text-slate-800">{record.styleNo}</p>
                   </div>
                 </div>
               )}
               <div className="flex items-start gap-3">
                 <div>
                   <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">Category</p>
                   <p className="text-sm font-semibold text-slate-800">{record.category}</p>
                 </div>
               </div>
             </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4 sm:p-6">
             <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest mb-4 border-b border-slate-100 pb-2">Description</h3>
             <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">{record.description}</p>
          </div>

          {(record.rootCause || record.correctiveAction) && (
            <div className="bg-rose-50 border border-rose-100 rounded-xl shadow-sm p-4 sm:p-6">
               <h3 className="text-sm font-bold text-rose-800 uppercase tracking-widest mb-4 border-b border-rose-200 pb-2 flex items-center gap-2">
                 <Search className="w-4 h-4 text-rose-600" /> Investigation & Action
               </h3>
               <div className="space-y-4">
                 {record.rootCause && (
                   <div>
                     <p className="text-xs font-bold text-rose-700 mb-1">Root Cause Analysis</p>
                     <p className="text-sm text-rose-900 bg-white bg-opacity-60 p-3 rounded-lg border border-rose-100 whitespace-pre-wrap leading-relaxed">{record.rootCause}</p>
                   </div>
                 )}
                 {record.correctiveAction && (
                   <div>
                     <p className="text-xs font-bold text-rose-700 mb-1">Corrective & Preventive Action (CAPA)</p>
                     <p className="text-sm text-rose-900 bg-white bg-opacity-60 p-3 rounded-lg border border-rose-100 whitespace-pre-wrap leading-relaxed">{record.correctiveAction}</p>
                   </div>
                 )}
               </div>
            </div>
          )}

          {record.attachments && record.attachments.length > 0 && (
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4 sm:p-6">
              <FileViewer attachments={record.attachments} />
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4 sm:p-6">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest mb-4 border-b border-slate-100 pb-2">Resolution Tracking</h3>
            <div className="space-y-5">
              <div>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Assigned To</p>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-slate-800">{record.assignedTo || 'Unassigned'}</span>
                </div>
              </div>
              {record.dateResolved && (
                <div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Date Resolved</p>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-800">{record.dateResolved}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
