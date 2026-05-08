import React from 'react';
import { CertificateRecord } from './types';
import { Award, AlertTriangle, Calendar, CheckCircle } from 'lucide-react';

interface CertificateDashboardProps {
  certificates: CertificateRecord[];
  onViewList: () => void;
}

export function CertificateDashboard({ certificates, onViewList }: CertificateDashboardProps) {
  const activeCount = certificates.filter(c => c.status === 'ACTIVE').length;
  const expiringSoonCount = certificates.filter(c => c.status === 'EXPIRING_SOON').length;
  const expiredCount = certificates.filter(c => c.status === 'EXPIRED').length;
  
  const upcomingExpirations = [...certificates]
    .filter(c => c.status !== 'EXPIRED' && c.status !== 'PENDING')
    .sort((a, b) => new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime())
    .slice(0, 5);

  return (
    <div className="flex flex-col gap-4 sm:p-6 max-w-7xl mx-auto w-full">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-black text-slate-800">Certificate Dashboard</h2>
          <p className="text-slate-500 font-medium mt-1">Overview of compliance certificates and their statuses.</p>
        </div>
        <button 
          onClick={onViewList}
          className="px-4 py-2 bg-blue-600 text-white text-sm font-bold rounded-md hover:bg-blue-700 transition-colors shadow-sm"
        >
          View All Certificates
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Certificates</h3>
            <div className="w-8 h-8 rounded bg-slate-100 flex items-center justify-center">
              <Award className="w-4 h-4 text-slate-600" />
            </div>
          </div>
          <p className="text-3xl font-black text-slate-800">{certificates.length}</p>
        </div>

        <div className="bg-white border border-emerald-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Active</h3>
            <div className="w-8 h-8 rounded bg-emerald-100 flex items-center justify-center">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
            </div>
          </div>
          <p className="text-3xl font-black text-emerald-700">{activeCount}</p>
        </div>

        <div className="bg-white border border-amber-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold text-amber-600 uppercase tracking-wider">Expiring Soon</h3>
            <div className="w-8 h-8 rounded bg-amber-100 flex items-center justify-center">
              <Calendar className="w-4 h-4 text-amber-600" />
            </div>
          </div>
          <p className="text-3xl font-black text-amber-700">{expiringSoonCount}</p>
        </div>

        <div className="bg-white border border-rose-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold text-rose-600 uppercase tracking-wider">Expired</h3>
            <div className="w-8 h-8 rounded bg-rose-100 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
            </div>
          </div>
          <p className="text-3xl font-black text-rose-700">{expiredCount}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:p-6">
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col">
          <div className="p-4 border-b border-slate-100">
            <h3 className="text-lg font-bold text-slate-800">Upcoming Expirations</h3>
          </div>
          <div className="p-4 flex-1 space-y-4">
            {upcomingExpirations.length > 0 ? (
              upcomingExpirations.map(cert => (
                <div key={cert.id} className="flex gap-4 p-3 rounded-lg hover:bg-slate-50 transition-colors border border-slate-100">
                  <div className={`p-2 rounded-lg h-fit ${cert.status === 'EXPIRING_SOON' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-bold text-slate-800">{cert.title}</h4>
                    <p className="text-xs text-slate-500 font-medium mt-1">Issuer: {cert.issuer}</p>
                    <div className="flex items-center justify-between mt-2">
                       <span className="text-[10px] uppercase font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                         Exp: {cert.expiryDate}
                       </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-500">No active certificates found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
