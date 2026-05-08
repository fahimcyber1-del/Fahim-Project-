import React from 'react';
import { IncomingQCRecord } from './types';
import { ArrowLeft, CheckCircle, AlertTriangle, Clock, Download, FileSpreadsheet } from 'lucide-react';

interface Props {
  record: IncomingQCRecord;
  onNavigate: (view: 'list') => void;
}

export function IncomingQCDetail({ record, onNavigate }: Props) {
  return (
    <div className="h-full bg-slate-50 border border-slate-200 rounded-xl overflow-hidden shadow-sm flex flex-col">
      <div className="flex-none p-4 lg:p-6 border-b border-slate-200 bg-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => onNavigate('list')}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">Record {record.id}</h2>
            <p className="text-slate-500 text-sm font-medium">Detailed view of incoming inspection</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-3 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg text-sm font-bold shadow-sm hover:bg-slate-100 flex items-center gap-2">
            <Download className="w-4 h-4" /> Export PDF
          </button>
          <button className="px-3 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg text-sm font-bold shadow-sm hover:bg-slate-100 flex items-center gap-2">
            <FileSpreadsheet className="w-4 h-4" /> Export Excel
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 lg:p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="bg-white p-4 sm:p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                record.status === 'Passed' ? 'bg-emerald-100 text-emerald-600' :
                record.status === 'Failed' ? 'bg-rose-100 text-rose-600' :
                record.status === 'Partial Pass' ? 'bg-amber-100 text-amber-600' :
                record.status === 'On Hold' ? 'bg-blue-100 text-blue-600' :
                'bg-slate-100 text-slate-600'
              }`}>
                {record.status === 'Passed' && <CheckCircle className="w-6 h-6" />}
                {record.status === 'Failed' && <AlertTriangle className="w-6 h-6" />}
                {(record.status === 'Pending' || record.status === 'On Hold') && <Clock className="w-6 h-6" />}
                {record.status === 'Partial Pass' && <CheckCircle className="w-6 h-6" />}
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-500 uppercase">Inspection Status</h3>
                <p className={`text-xl font-black ${
                  record.status === 'Passed' ? 'text-emerald-600' :
                  record.status === 'Failed' ? 'text-rose-600' :
                  record.status === 'Partial Pass' ? 'text-amber-600' :
                  record.status === 'On Hold' ? 'text-blue-600' :
                  'text-slate-600'
                }`}>{record.status}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-slate-500 uppercase">Category</p>
              <p className="text-xl font-black text-slate-900">{record.category}</p>
            </div>
          </div>

          <div className="bg-white p-4 sm:p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest mb-4 border-b border-slate-100 pb-2">General Details</h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:p-6">
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Date</p>
                <p className="text-sm font-bold text-slate-900">{record.date}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Supplier</p>
                <p className="text-sm font-bold text-slate-900">{record.supplier}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">PO Number</p>
                <p className="text-sm font-bold text-slate-900">{record.poNumber || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Inspector</p>
                <p className="text-sm font-bold text-slate-900">{record.inspectorName}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Style</p>
                <p className="text-sm font-bold text-slate-900">{record.style || 'N/A'}</p>
              </div>
              {record.defectType && (
                <div className="col-span-2 lg:col-span-3">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Defect Type</p>
                  <p className="text-sm font-bold text-rose-600 bg-rose-50 border border-rose-100 rounded px-2 py-1 inline-block">{record.defectType}</p>
                </div>
              )}
            </div>
          </div>

          {record.category === 'Fabric' && record.fabricDetails && (
            <div className="bg-white p-4 sm:p-6 rounded-xl border border-slate-200 shadow-sm">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest mb-4 border-b border-slate-100 pb-2">Fabric Tests Results</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">4 Point Inspection</p>
                  <p className="text-sm font-bold text-slate-900">{record.fabricDetails.fourPointInspection || 'N/A'}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Shrinkage Test</p>
                  <p className="text-sm font-bold text-slate-900">{record.fabricDetails.shrinkageTest || 'N/A'}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Shadeband Check</p>
                  <p className="text-sm font-bold text-slate-900">{record.fabricDetails.shadebandCheck || 'N/A'}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">CSV Check</p>
                  <p className="text-sm font-bold text-slate-900">{record.fabricDetails.csvCheck || 'N/A'}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Moisture Check</p>
                  <p className="text-sm font-bold text-slate-900">{record.fabricDetails.moistureCheck || 'N/A'}</p>
                </div>
              </div>
            </div>
          )}

          {record.category === 'Accessories' && record.accessoriesDetails && (
            <div className="bg-white p-4 sm:p-6 rounded-xl border border-slate-200 shadow-sm">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest mb-4 border-b border-slate-100 pb-2">Accessories QC Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Item Name</p>
                  <p className="text-sm font-bold text-slate-900">{record.accessoriesDetails.itemName || 'N/A'}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">For Style</p>
                  <p className="text-sm font-bold text-slate-900">{record.accessoriesDetails.style || 'N/A'}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Total Quantity</p>
                  <p className="text-sm font-bold text-slate-900">{record.accessoriesDetails.quantity || '0'}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Inspected Quantity</p>
                  <p className="text-sm font-bold text-slate-900">{record.accessoriesDetails.inspectedQuantity || '0'}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Percentage Options</p>
                  <p className="text-sm font-bold text-slate-900">{record.accessoriesDetails.percentageOptions || 'N/A'}</p>
                </div>
              </div>
            </div>
          )}

          {record.notes && (
            <div className="bg-white p-4 sm:p-6 rounded-xl border border-slate-200 shadow-sm">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest mb-4 border-b border-slate-100 pb-2">Notes</h3>
              <p className="text-sm text-slate-700 whitespace-pre-wrap">{record.notes}</p>
            </div>
          )}

          {record.attachments && record.attachments.length > 0 && (
            <div className="bg-white p-4 sm:p-6 rounded-xl border border-slate-200 shadow-sm">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest mb-4 border-b border-slate-100 pb-2">Attachments</h3>
              <div className="space-y-4">
                {record.attachments.map(att => (
                  <div key={att.id} className="flex items-center justify-between p-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-slate-100 rounded-md border border-slate-200 flex items-center justify-center overflow-hidden shrink-0">
                        {att.type.startsWith('image/') ? (
                          <img src={att.url} alt={att.name} className="w-full h-full object-cover" />
                        ) : (
                          <FileSpreadsheet className="w-6 h-6 text-slate-400" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-800">{att.name}</p>
                        <p className="text-xs text-slate-500 uppercase tracking-wider">{att.type}</p>
                      </div>
                    </div>
                    <a href={att.url} download={att.name} className="text-sm flex items-center gap-2 font-bold text-indigo-600 hover:text-indigo-800 py-2 px-3 border border-indigo-100 hover:bg-indigo-50 rounded-lg transition-colors">
                      <Download className="w-4 h-4" /> Download
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
