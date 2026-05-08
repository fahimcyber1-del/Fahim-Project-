import React from 'react';
import { CertificateRecord } from './types';
import { ArrowLeft, Award, Calendar, Hash, FileText } from 'lucide-react';

interface CertificateDetailProps {
  record: CertificateRecord;
  onBack: () => void;
}

export function CertificateDetail({ record, onBack }: CertificateDetailProps) {
  return (
    <div className="max-w-4xl mx-auto w-full pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 bg-slate-100 text-slate-500 hover:bg-slate-200 rounded-full">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-black text-slate-900">{record.title}</h1>
            <p className="text-sm font-medium text-slate-500">{record.issuer}</p>
          </div>
        </div>
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
          record.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-800' : 
          record.status === 'EXPIRING_SOON' ? 'bg-amber-100 text-amber-800' :
          record.status === 'PENDING' ? 'bg-blue-100 text-blue-800' :
          'bg-rose-100 text-rose-800'
        }`}>
          {record.status.replace('_', ' ')}
        </span>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
            <div className="flex items-center gap-3">
               <div className="w-10 h-10 bg-white rounded-lg border border-slate-200 flex items-center justify-center text-slate-400">
                  <Award className="w-5 h-5" />
               </div>
               <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Reference Number</p>
                  <p className="text-sm font-mono font-bold text-slate-800">{record.referenceNumber}</p>
               </div>
            </div>
            {record.documentUrl && (
               <a href={record.documentUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-300 text-blue-600 rounded text-xs font-bold hover:bg-slate-50 shadow-sm transition-colors">
                  <FileText className="w-4 h-4"/> View PDF
               </a>
            )}
        </div>
        
        <div className="p-4 sm:p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:p-6 lg:p-8">
             <div className="space-y-6">
                <div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">CERTIFICATE TYPE</p>
                  <p className="text-sm font-bold text-slate-800">{record.type.replace('_', ' ')}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1"><Calendar className="w-3 h-3"/> ISSUE DATE</p>
                  <p className="text-sm font-bold text-slate-800">{record.issueDate}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1"><Calendar className="w-3 h-3"/> EXPIRY DATE</p>
                  <p className={`text-sm font-bold ${record.status === 'EXPIRED' ? 'text-rose-600' : 'text-slate-800'}`}>{record.expiryDate}</p>
                </div>
             </div>

             <div className="space-y-6">
                 {record.lastAuditDate && (
                    <div>
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">LAST AUDIT DATE</p>
                      <p className="text-sm font-medium text-slate-800">{record.lastAuditDate}</p>
                    </div>
                 )}
                <div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">SCOPE</p>
                  <p className="text-sm font-medium text-slate-800 bg-slate-50 p-3 rounded border border-slate-100">{record.scope || 'N/A'}</p>
                </div>
                 {record.remarks && (
                    <div>
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">REMARKS</p>
                      <p className="text-sm text-slate-700">{record.remarks}</p>
                    </div>
                 )}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
