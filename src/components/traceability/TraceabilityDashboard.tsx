import React from 'react';
import { TraceabilityRecord } from './types';
import { Map, AlertCircle, CheckCircle, Clock } from 'lucide-react';

interface TraceabilityDashboardProps {
  records: TraceabilityRecord[];
  onViewList: () => void;
}

export function TraceabilityDashboard({ records, onViewList }: TraceabilityDashboardProps) {
  const verifiedCount = records.filter(r => r.status === 'VERIFIED').length;
  const inProgressCount = records.filter(r => r.status === 'IN_PROGRESS').length;
  const failedCount = records.filter(r => r.status === 'FAILED').length;

  const recentRecords = [...records]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  return (
    <div className="flex flex-col gap-4 sm:p-6 max-w-7xl mx-auto w-full">
      <div className="flex justify-end mb-2">
        <button 
          onClick={onViewList}
          className="px-4 py-2 bg-blue-600 text-white text-sm font-bold rounded-md hover:bg-blue-700 transition-colors shadow-sm"
        >
          View All Records
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Traces</h3>
            <div className="w-8 h-8 rounded bg-slate-100 flex items-center justify-center">
              <Map className="w-4 h-4 text-slate-600" />
            </div>
          </div>
          <p className="text-3xl font-black text-slate-800">{records.length}</p>
        </div>

        <div className="bg-white border border-emerald-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Verified</h3>
            <div className="w-8 h-8 rounded bg-emerald-100 flex items-center justify-center">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
            </div>
          </div>
          <p className="text-3xl font-black text-emerald-700">{verifiedCount}</p>
        </div>

        <div className="bg-white border border-blue-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold text-blue-600 uppercase tracking-wider">In Progress</h3>
            <div className="w-8 h-8 rounded bg-blue-100 flex items-center justify-center">
              <Clock className="w-4 h-4 text-blue-600" />
            </div>
          </div>
          <p className="text-3xl font-black text-blue-700">{inProgressCount}</p>
        </div>

        <div className="bg-white border border-rose-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold text-rose-600 uppercase tracking-wider">Failed</h3>
            <div className="w-8 h-8 rounded bg-rose-100 flex items-center justify-center">
              <AlertCircle className="w-4 h-4 text-rose-600" />
            </div>
          </div>
          <p className="text-3xl font-black text-rose-700">{failedCount}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:p-6">
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col">
          <div className="p-4 border-b border-slate-100">
            <h3 className="text-lg font-bold text-slate-800">Recent Traceability Records</h3>
          </div>
          <div className="p-4 flex-1 space-y-4">
            {recentRecords.length > 0 ? (
              recentRecords.map(record => (
                <div key={record.id} className="flex gap-4 p-3 rounded-lg hover:bg-slate-50 transition-colors border border-slate-100">
                  <div className={`p-2 rounded-lg h-fit ${
                    record.status === 'VERIFIED' ? 'bg-emerald-100 text-emerald-700' : 
                    record.status === 'FAILED' ? 'bg-rose-100 text-rose-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    <Map className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h4 className="text-sm font-bold text-slate-800">{record.productBatchNo}</h4>
                      <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                        record.status === 'VERIFIED' ? 'bg-emerald-100 text-emerald-700' : 
                        record.status === 'FAILED' ? 'bg-rose-100 text-rose-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {record.status.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 font-medium mt-1">{record.type} • {record.supplierName || 'Internal'}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-500">No recent records found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
