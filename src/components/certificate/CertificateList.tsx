import React, { useState } from 'react';
import { CertificateRecord } from './types';
import { Search, Plus, Filter, Eye, Award } from 'lucide-react';

interface CertificateListProps {
  certificates: CertificateRecord[];
  onView: (id: string) => void;
  onCreate: () => void;
}

export function CertificateList({ certificates, onView, onCreate }: CertificateListProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredRecords = certificates.filter(c => 
    c.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.issuer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="border border-slate-200 bg-white rounded-lg shadow-sm">
      <div className="border-b border-slate-200 px-6 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Certificates</h2>
          <p className="text-sm font-medium text-slate-500 mt-0.5">Manage compliance and quality certificates</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search certificates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-1.5 border border-slate-300 rounded text-sm focus:outline-none focus:border-blue-500 w-64"
            />
          </div>
          <button className="p-1.5 border border-slate-300 text-slate-600 rounded bg-white hover:bg-slate-50">
            <Filter className="w-4 h-4" />
          </button>
          <button 
            onClick={onCreate}
            className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Certificate
          </button>
        </div>
      </div>
      
      <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 min-h-[400px] content-start">
        {filteredRecords.length > 0 ? (
          filteredRecords.map(record => (
            <div key={record.id} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow flex flex-col relative group cursor-pointer" onClick={() => onView(record.id)}>
              <div className="flex items-center justify-between mb-3">
                <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${
                   record.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 
                   record.status === 'EXPIRING_SOON' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                   record.status === 'PENDING' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                   'bg-rose-50 text-rose-700 border-rose-200'
                }`}>
                  {record.status.replace('_', ' ')}
                </span>
              </div>
              <div className="flex-1 space-y-2">
                <div>
                  <h3 className="font-bold text-slate-900 text-lg group-hover:text-blue-600 transition-colors leading-tight">{record.title}</h3>
                  <p className="text-xs font-medium text-slate-500 mt-1">{record.issuer} • {record.type}</p>
                </div>
                <div className="space-y-1.5 mt-4 pt-4 border-t border-slate-100">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Ref. Number</span>
                    <span className="font-medium text-slate-800">{record.referenceNumber}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Issue Date</span>
                    <span className="font-medium text-slate-800">{record.issueDate}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Expiry Date</span>
                    <span className={`font-medium ${record.status === 'EXPIRED' ? 'text-rose-600' : 'text-slate-800'}`}>{record.expiryDate}</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-12 text-center text-slate-500 flex flex-col items-center">
            <Award className="w-8 h-8 text-slate-300 mb-3" />
            No certificates found matching your criteria.
          </div>
        )}
      </div>
    </div>
  );
}
