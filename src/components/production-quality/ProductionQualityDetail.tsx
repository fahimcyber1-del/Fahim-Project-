import React from 'react';
import { QualityRecord } from './types';
import { ArrowLeft, Edit, FileText, Download } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

interface DetailProps {
  record: QualityRecord;
  onEdit: (id: string) => void;
  onBack: () => void;
}

export function ProductionQualityDetail({ record, onEdit, onBack }: DetailProps) {
  
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
    doc.text(`Production Quality Report: ${record.id}`, 14, 15);
    
    autoTable(doc, {
      startY: 20,
      head: [['Field', 'Value']],
      body: [
        ['Record ID', record.id],
        ['Date', record.date],
        ['Line', record.line],
        ['Style', record.style],
        ['Buyer', record.buyer],
        ['Color', record.color],
        ['Size', record.size],
        ['Inspected Qty', record.inspectedQuantity],
        ['Passed Qty', record.passedQuantity],
        ['Defected Qty', record.defectedQuantity],
        ['Reworked Qty', record.reworkedQuantity],
        ['Rejected Qty', record.rejectedQuantity],
        ['DHU', record.inspectedQuantity ? ((record.defectedQuantity / record.inspectedQuantity) * 100).toFixed(1) : '0'],
        ['RFT%', record.inspectedQuantity ? ((record.passedQuantity / record.inspectedQuantity) * 100).toFixed(1) + '%' : '0%'],
        ['Status', record.status],
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
                  <p className="text-[10px] uppercase font-bold text-slate-500">Section</p>
                  <p className="text-sm font-medium text-slate-900">{record.section}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-500">Unit</p>
                  <p className="text-sm font-medium text-slate-900">{record.unit}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-500">Shift</p>
                  <p className="text-sm font-medium text-slate-900">{record.shift}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-500">Production Line</p>
                  <p className="text-sm font-medium text-slate-900">{record.line}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-500">Buyer</p>
                  <p className="text-sm font-medium text-slate-900">{record.buyer}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-500">Style</p>
                  <p 
                    className="text-sm font-bold text-blue-600 cursor-pointer hover:underline"
                    onClick={() => {
                      window.dispatchEvent(new CustomEvent('app-navigate', { detail: { module: 'orders_and_buyers', styleNumber: record.style } }));
                    }}
                    title="View Order Details"
                  >
                    {record.style}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-500">Color / Size</p>
                  <p className="text-sm font-medium text-slate-900">{record.color} / {record.size}</p>
                </div>
              </div>

              {record.topDefects && record.topDefects.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-2 mb-3">Defects List</h3>
                  <div className="bg-rose-50/50 p-4 rounded border border-rose-100 text-sm">
                    {record.topDefects.map((defect, index) => (
                      <div key={index} className="flex justify-between py-1 text-slate-700">
                        <span>{defect.type}</span>
                        <span className="font-bold">{defect.count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {record.remarks && (
                <div className="mt-4">
                   <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-2 mb-3">Remarks</h3>
                   <div className="bg-blue-50/50 p-4 rounded border border-blue-100 text-sm text-slate-700">
                     {record.remarks}
                   </div>
                </div>
              )}
            </div>

            {/* Quality Stats */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-2">Quality Inspection Results</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded border border-slate-200">
                  <p className="text-[10px] uppercase font-bold text-slate-500">Inspected Quantity</p>
                  <p className="text-2xl font-black text-slate-900">{record.inspectedQuantity.toLocaleString()}</p>
                </div>
                <div className="bg-emerald-50 p-4 rounded border border-emerald-200">
                  <p className="text-[10px] uppercase font-bold text-emerald-700">Passed Quantity</p>
                  <p className="text-2xl font-black text-emerald-700">{record.passedQuantity.toLocaleString()}</p>
                  <p className="text-[10px] font-bold text-emerald-600 mt-1 cursor-help inline-block" title="Passed Quantity / Total Inspected Quantity">
                    {record.inspectedQuantity ? ((record.passedQuantity / record.inspectedQuantity) * 100).toFixed(1) : 0}% Pass Rate
                  </p>
                </div>
                <div className="bg-blue-50 p-4 rounded border border-blue-200">
                  <div className="cursor-help inline-block" title="Passed Quantity / Total Inspected Quantity">
                    <p className="text-[10px] uppercase font-bold text-blue-700">RFT (Right First Time)</p>
                  </div>
                  <p className="text-2xl font-black text-blue-700 cursor-help inline-block" title="Passed Quantity / Total Inspected Quantity">
                    {record.inspectedQuantity ? ((record.passedQuantity / record.inspectedQuantity) * 100).toFixed(1) : 0}%
                  </p>
                </div>
                <div className="bg-amber-50 p-4 rounded border border-amber-200">
                  <p className="text-[10px] uppercase font-bold text-amber-700">Defect/Rework</p>
                  <p className="text-xl font-black text-amber-700">{record.defectedQuantity.toLocaleString()} / {record.reworkedQuantity.toLocaleString()}</p>
                  <div className="cursor-help inline-block" title="Defected Quantity / Total Inspected Quantity * 100">
                    <p className="text-[10px] uppercase font-bold text-amber-700 mt-1">DHU (Defect Rate)</p>
                  </div>
                  <p className="text-xl font-black text-amber-900 cursor-help inline-block" title="Defected Quantity / Total Inspected Quantity * 100">
                    {record.inspectedQuantity ? ((record.defectedQuantity / record.inspectedQuantity) * 100).toFixed(2) : 0}
                  </p>
                </div>
                <div className="bg-rose-50 p-4 rounded border border-rose-200">
                  <p className="text-[10px] uppercase font-bold text-rose-700">Rejected Quantity</p>
                  <p className="text-2xl font-black text-rose-700">{record.rejectedQuantity.toLocaleString()}</p>
                  <p className="text-[10px] font-bold text-rose-600 mt-1 cursor-help inline-block" title="Rejected Quantity / Total Inspected Quantity">
                    {record.inspectedQuantity ? ((record.rejectedQuantity / record.inspectedQuantity) * 100).toFixed(1) : 0}% Reject Rate
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
