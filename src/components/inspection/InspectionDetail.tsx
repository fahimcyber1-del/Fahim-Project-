import React from 'react';
import { InspectionRecord } from './types';
import { ArrowLeft, Edit, FileText, Download } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { FileViewer } from './FileViewer';

interface DetailProps {
  record: InspectionRecord;
  onEdit: (id: string) => void;
  onBack: () => void;
}

export function InspectionDetail({ record, onEdit, onBack }: DetailProps) {
  
  const getStatusBadgeColor = (status: string) => {
    switch(status) {
      case 'Passed': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'Rework': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Rejected': return 'bg-rose-100 text-rose-700 border-rose-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text(`Inspection Report: ${record.id}`, 14, 15);
    
    autoTable(doc, {
      startY: 20,
      head: [['Field', 'Value']],
      body: [
        ['Record ID', record.id],
        ['Category', record.category],
        ['Date', record.date],
        ['PO/Article Number', record.poNumber],
        ['Style Number', record.styleNumber],
        ['CRD Date', record.crdDate],
        ['Buyer', record.buyer],
        ['Color', record.color],
        ['Size', record.size],
        ['Inspected Qty', record.inspectedQuantity],
        ['Order Qty', record.orderQuantity ?? '-'],
        ['Sample Qty', record.sampleQuantity ?? '-'],
        ['Shortage', record.shortage ?? 0],
        ['Excess', record.excess ?? 0],
        ['Inspection Level', record.inspectionLevel ?? '-'],
        ['AQL Level', record.aqlLevel ?? '-'],
        ['Defected Qty', record.criticalDefects + record.majorDefects + record.minorDefects],
        ['Critical Defect Qty', record.criticalDefects],
        ['Major Defect Qty', record.majorDefects],
        ['Minor Defect Qty', record.minorDefects],
        ['Status', record.status],
        ['Workmanship', record.workmanship ?? '-'],
        ['Measurement', record.measurement ?? '-'],
        ['Product Safety', record.productSafety ?? '-'],
        ['Labeling', record.labeling ?? '-'],
        ['Packing', record.packing ?? '-'],
        ['Shipping Mark', record.shippingMark ?? '-'],
        ['BOM Check', record.bomCheck ?? '-'],
        ['Inspector', record.inspector],
        ['Remarks', record.remarks],
      ],
    });
    
    doc.save(`Record_${record.id}.pdf`);
  };

  const exportExcel = () => {
    const data = [{...record}];
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Record');
    XLSX.writeFile(workbook, `Record_${record.id}.xlsx`);
  };

  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Summary
      </button>

      <div className="shadow-sm border border-slate-200 bg-white rounded-lg">
        <div className="border-b border-slate-100 pb-4 p-4 sm:p-6 flex flex-row items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-3">
              {record.id}
              <span className={`px-2.5 py-0.5 rounded text-xs font-bold border ${getStatusBadgeColor(record.status)}`}>
                {record.status}
              </span>
            </h3>
            <p className="text-sm text-slate-500 mt-1">Recorded on {record.date} by {record.inspector}</p>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={exportPDF}
              className="p-2 bg-slate-100 text-slate-600 rounded hover:bg-slate-200 hover:text-slate-900 transition-colors"
              title="Export PDF"
            >
              <FileText className="w-4 h-4" />
            </button>
            <button 
              onClick={exportExcel}
              className="p-2 bg-slate-100 text-slate-600 rounded hover:bg-slate-200 hover:text-slate-900 transition-colors"
              title="Export Excel"
            >
              <Download className="w-4 h-4" />
            </button>
            <button 
              onClick={() => onEdit(record.id)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 border border-blue-200 rounded text-sm font-bold shadow-sm hover:bg-blue-100 transition-colors"
            >
              <Edit className="w-4 h-4" /> Edit Record
            </button>
          </div>
        </div>
        <div className="p-4 sm:p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:p-6 lg:p-8">
            
            {/* Product Info */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-2">Product Information</h3>
                            <div className="grid grid-cols-2 gap-y-4 gap-x-6 bg-slate-50 p-4 rounded border border-slate-100">
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-500">Category</p>
                  <p className="text-sm font-medium text-slate-900">{record.category}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-500">PO/Article Number</p>
                  <p 
                    className="text-sm font-bold text-blue-600 cursor-pointer hover:underline"
                    onClick={() => {
                      window.dispatchEvent(new CustomEvent('app-navigate', { detail: { module: 'orders_and_buyers', poArticleNumber: record.poNumber } }));
                    }}
                    title="View Order Details"
                  >
                    {record.poNumber}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-500">Style Number</p>
                  <p 
                    className="text-sm font-bold text-blue-600 cursor-pointer hover:underline"
                    onClick={() => {
                      window.dispatchEvent(new CustomEvent('app-navigate', { detail: { module: 'orders_and_buyers', styleNumber: record.styleNumber } }));
                    }}
                    title="View Order Details"
                  >
                    {record.styleNumber}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-500">CRD Date</p>
                  <p className="text-sm font-medium text-slate-900">{record.crdDate}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-500">Buyer</p>
                  <p className="text-sm font-medium text-slate-900">{record.buyer}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-500">Color / Size</p>
                  <p className="text-sm font-medium text-slate-900">{record.color} / {record.size}</p>
                </div>
              </div>

              {/* Removed Defects List widget */}
              <div className="bg-rose-50/50 p-4 rounded border border-rose-100 text-sm">
                 <div className="flex justify-between py-1 text-slate-700">
                    <span>Critical Defects</span>
                    <span className="font-bold">{record.criticalDefects}</span>
                 </div>
                 <div className="flex justify-between py-1 text-slate-700">
                    <span>Major Defects</span>
                    <span className="font-bold">{record.majorDefects}</span>
                 </div>
                 <div className="flex justify-between py-1 text-slate-700">
                    <span>Minor Defects</span>
                    <span className="font-bold">{record.minorDefects}</span>
                 </div>
              </div>
              
              {record.remarks && (
                <div className="mt-4">
                   <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-2 mb-3">Remarks</h3>
                   <div className="bg-blue-50/50 p-4 rounded border border-blue-100 text-sm text-slate-700">
                     {record.remarks}
                   </div>
                </div>
              )}

              {record.attachments && record.attachments.length > 0 && (
                <div className="mt-4">
                  <FileViewer attachments={record.attachments} />
                </div>
              )}
            </div>

            {/* Quality Stats & Inspection Details */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-2">Quality Inspection Results</h3>
              
              <div className="flex gap-4 mb-2 bg-slate-50 border border-slate-200 p-3 rounded">
                <div className="flex-1">
                  <p className="text-[10px] uppercase font-bold text-slate-500">AQL Level</p>
                  <p className="text-sm font-medium text-slate-900">{record.aqlLevel || '-'}</p>
                </div>
                <div className="flex-1 border-l border-slate-200 pl-4">
                  <p className="text-[10px] uppercase font-bold text-slate-500">Inspection Level</p>
                  <p className="text-sm font-medium text-slate-900">{record.inspectionLevel || '-'}</p>
                </div>
                <div className="flex-1 border-l border-slate-200 pl-4">
                  <p className="text-[10px] uppercase font-bold text-slate-500">Order Qty</p>
                  <p className="text-sm font-medium text-slate-900">{record.orderQuantity || '-'}</p>
                </div>
                <div className="flex-1 border-l border-slate-200 pl-4">
                  <p className="text-[10px] uppercase font-bold text-slate-500">Sample Qty</p>
                  <p className="text-sm font-medium text-slate-900">{record.sampleQuantity || '-'}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded border border-slate-200">
                  <p className="text-[10px] uppercase font-bold text-slate-500">Inspected Quantity</p>
                  <p className="text-2xl font-black text-slate-900">{record.inspectedQuantity.toLocaleString()}</p>
                </div>
                
                <div className="bg-rose-50 p-4 rounded border border-rose-200">
                  <p className="text-[10px] uppercase font-bold text-rose-700">Critical Defects</p>
                  <p className="text-2xl font-black text-rose-700">{record.criticalDefects.toLocaleString()}</p>
                </div>
                <div className="bg-amber-50 p-4 rounded border border-amber-200">
                   <p className="text-[10px] uppercase font-bold text-amber-700">Major Defects</p>
                   <p className="text-2xl font-black text-amber-700">{record.majorDefects.toLocaleString()}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded border border-slate-200">
                   <p className="text-[10px] uppercase font-bold text-slate-700">Minor Defects</p>
                   <p className="text-2xl font-black text-slate-700">{record.minorDefects.toLocaleString()}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded border border-slate-200">
                   <p className="text-[10px] uppercase font-bold text-slate-700">Shortage Qty</p>
                   <p className="text-2xl font-black text-slate-700">{record.shortage?.toLocaleString() ?? 0}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded border border-slate-200">
                   <p className="text-[10px] uppercase font-bold text-slate-700">Excess Qty</p>
                   <p className="text-2xl font-black text-slate-700">{record.excess?.toLocaleString() ?? 0}</p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-3">Inspection Checkpoints</h3>
                <div className="grid grid-cols-2 gap-y-3 bg-white p-4 rounded border border-slate-200">
                  {[ 
                    { label: 'Workmanship', field: 'workmanship' },
                    { label: 'Measurement', field: 'measurement' },
                    { label: 'Product Safety', field: 'productSafety' },
                    { label: 'Labeling', field: 'labeling' },
                    { label: 'Packing', field: 'packing' },
                    { label: 'Shipping Mark', field: 'shippingMark' },
                    { label: 'BOM Check', field: 'bomCheck' }
                  ].map(check => (
                    <div key={check.field} className="flex justify-between items-center pr-4">
                      <span className="text-xs font-semibold text-slate-600">{check.label}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${(record as any)[check.field] === 'OK' ? 'bg-emerald-100 text-emerald-700' : (record as any)[check.field] === 'NOT OK' ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-700'}`}>
                        {(record as any)[check.field] || 'N/A'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
