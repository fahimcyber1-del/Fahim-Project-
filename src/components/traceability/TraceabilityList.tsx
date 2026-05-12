import React, { useState } from 'react';
import { TraceabilityRecord } from './types';
import { Search, Plus, Filter, Eye, Map } from 'lucide-react';

interface TraceabilityListProps {
  records: TraceabilityRecord[];
  onView: (id: string) => void;
  onCreate: () => void;
}

export function TraceabilityList({ records, onView, onCreate }: TraceabilityListProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredRecords = records.filter(r => 
    r.productBatchNo.toLowerCase().includes(searchTerm.toLowerCase()) || 
    r.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (r.supplierName && r.supplierName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="border border-slate-200 bg-white rounded-lg shadow-sm">
      <div className="border-b border-slate-200 px-6 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search batches..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-1.5 border border-slate-300 rounded text-sm focus:outline-none focus:border-blue-500 w-64"
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-1.5 border border-slate-300 text-slate-600 rounded bg-white hover:bg-slate-50">
            <Filter className="w-4 h-4" />
          </button>
          <button 
            onClick={onCreate}
            className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" /> New Record
          </button>
        </div>
      </div>
      
      <div className="overflow-x-auto min-h-[400px]">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-4 py-3 font-semibold text-slate-600">ID</th>
              <th className="px-4 py-3 font-semibold text-slate-600">Batch / PO</th>
              <th className="px-4 py-3 font-semibold text-slate-600">Type</th>
              <th className="px-4 py-3 font-semibold text-slate-600">Supplier/Source</th>
              <th className="px-4 py-3 font-semibold text-slate-600">Date</th>
              <th className="px-4 py-3 font-semibold text-slate-600">Status</th>
              <th className="px-4 py-3 font-semibold text-slate-600 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredRecords.length > 0 ? (
              filteredRecords.map(record => (
                <tr key={record.id} className="hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => onView(record.id)}>
                  <td className="px-4 py-3 font-medium text-blue-600">{record.id}</td>
                  <td className="px-4 py-3 text-slate-800 font-bold">{record.productBatchNo}</td>
                  <td className="px-4 py-3 text-slate-600">{record.type}</td>
                  <td className="px-4 py-3 text-slate-600">{record.supplierName || 'Internal'}</td>
                  <td className="px-4 py-3 text-slate-600">{record.date}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      record.status === 'VERIFIED' ? 'bg-emerald-100 text-emerald-700' :
                      record.status === 'FAILED' ? 'bg-rose-100 text-rose-700' :
                      record.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-700' :
                      'bg-slate-100 text-slate-700'
                    }`}>
                      {record.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={(e) => { e.stopPropagation(); onView(record.id); }} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded" title="View details">
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-slate-500">
                  <div className="flex flex-col items-center">
                     <Map className="w-8 h-8 text-slate-300 mb-3" />
                     No records found.
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
