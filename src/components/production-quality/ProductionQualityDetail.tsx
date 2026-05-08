import React, { useState } from 'react';
import { QualityRecord } from './types';
import { ArrowLeft, Edit, Download, Calendar } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { ExportModal, ProductionQualityExportOptions } from './ExportModal';

interface DetailProps {
  record: QualityRecord;
  onEdit: (id: string) => void;
  onBack: () => void;
}

export function ProductionQualityDetail({ record, onEdit, onBack }: DetailProps) {
  const [showExportModal, setShowExportModal] = useState(false);
  
  const getStatusBadgeColor = (status: string) => {
    switch(status) {
      case 'Passed': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'Rework': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Rejected': return 'bg-rose-100 text-rose-700 border-rose-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const exportPDF = (options: ProductionQualityExportOptions) => {
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text(`Production Quality Report: ${record.id}`, 14, 15);
    
    autoTable(doc, {
      startY: 20,
      head: [['Field', 'Value']],
      body: [
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

    if (options.includeDefects && record.topDefects && record.topDefects.length > 0) {
      const currentY = (doc as any).lastAutoTable?.finalY ? (doc as any).lastAutoTable.finalY + 10 : 200;
      doc.setFontSize(12);
      doc.text("Top Defects", 14, currentY);
      autoTable(doc, {
        startY: currentY + 5,
        head: [['Defect Type', 'Count']],
        body: record.topDefects.map(d => [d.type, d.count])
      });
    }

    if (options.includeSignature) {
      if (record.signatures && record.signatures.length > 0) {
        let sigY = (doc as any).lastAutoTable?.finalY ? (doc as any).lastAutoTable.finalY + 20 : 250;
        if (sigY > 220) {
          doc.addPage();
          sigY = 20;
        }
        
        doc.setFontSize(12);
        doc.setTextColor(0);
        doc.text('E-Signatures / Approvals', 14, sigY);
        doc.setFontSize(10);
        
        let startX = 14;
        let startY = sigY + 10;
        const colWidth = 90;

        record.signatures.forEach((sig, index) => {
          if (startX > 150) {
             startX = 14;
             startY += 60;
             if (startY > 250) {
               doc.addPage();
               startY = 20;
             }
          }

          let currentY = startY;
          if (sig.image) {
            try {
               doc.addImage(sig.image, 'PNG', startX, currentY, 40, 20);
               currentY += 25;
            } catch (e) {
               console.error("Failed to add signature image to PDF", e);
               currentY += 5;
            }
          } else {
             currentY += 5;
          }

          doc.text(`Signed By: ${sig.name || '________________'}`, startX, currentY);
          doc.text(`Designation: ${sig.designation || '________________'}`, startX, currentY + 8);
          doc.text(`Date: ${sig.date || '________________'}`, startX, currentY + 16);

          startX += colWidth;
        });

      } else if (record.signature || record.signatureDesignation || record.signatureImage) {
        let sigY = (doc as any).lastAutoTable?.finalY ? (doc as any).lastAutoTable.finalY + 20 : 250;
        if (sigY > 220) {
          doc.addPage();
          sigY = 20;
        }
        doc.setFontSize(12);
        doc.setTextColor(0);
        doc.text('E-Signature / Approval', 14, sigY);
        doc.setFontSize(10);
        
        let nextLineY = sigY + 10;
        
        if (record.signatureImage) {
          try {
            doc.addImage(record.signatureImage, 'PNG', 14, nextLineY, 50, 25);
            nextLineY += 30;
          } catch (e) {
            console.error("Failed to add signature image to PDF", e);
          }
        }
        
        doc.text(`Signed By: ${record.signature || '____________________'}`, 14, nextLineY);
        doc.text(`Designation: ${record.signatureDesignation || '____________________'}`, 14, nextLineY + 8);
        doc.text(`Date: ${record.signatureDate || '____________________'}`, 14, nextLineY + 16);
      }
    }
    
    doc.save(`Record_${record.id}.pdf`);
  };

  const exportExcel = (options: ProductionQualityExportOptions) => {
    let baseRow: any = {
      'Record ID': record.id,
      'Date': record.date,
      'Section': record.section,
      'Line': record.line,
      'Unit': record.unit,
      'Style': record.style,
      'Buyer': record.buyer,
      'Color': record.color,
      'Size': record.size,
      'Inspected Qty': record.inspectedQuantity,
      'Passed Qty': record.passedQuantity,
      'Defected Qty': record.defectedQuantity,
      'Reworked Qty': record.reworkedQuantity,
      'Rejected Qty': record.rejectedQuantity,
      'DHU': record.inspectedQuantity ? ((record.defectedQuantity / record.inspectedQuantity) * 100).toFixed(1) : 0,
      'RFT%': record.inspectedQuantity ? ((record.passedQuantity / record.inspectedQuantity) * 100).toFixed(1) + '%' : '0%',
      'Status': record.status,
      'Inspector': record.inspector,
      'Remarks': record.remarks,
    };

    if (options.includeDefects) {
      baseRow['Top Defects'] = record.topDefects?.map(d => `${d.type} (${d.count})`).join(' | ') || '';
    }

    if (options.includeSignature) {
       if (record.signatures && record.signatures.length > 0) {
         record.signatures.forEach((sig, index) => {
           baseRow[`Signature ${index + 1} Name`] = sig.name || '';
           baseRow[`Signature ${index + 1} Designation`] = sig.designation || '';
           baseRow[`Signature ${index + 1} Date`] = sig.date || '';
         });
       } else {
         baseRow['Signature Name'] = record.signature || '';
         baseRow['Designation'] = record.signatureDesignation || '';
         baseRow['Signature Date'] = record.signatureDate || '';
       }
    }

    const worksheet = XLSX.utils.json_to_sheet([baseRow]);
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
              onClick={() => setShowExportModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 border border-slate-200 rounded text-sm font-bold shadow-sm hover:bg-slate-200 transition-colors"
              title="Export"
            >
              <Download className="w-4 h-4" /> Export
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

            {/* Signatures */}
            <div className="col-span-1 md:col-span-2 mt-4 space-y-4">
              {(record.signatures && record.signatures.length > 0) && (
                <div className="bg-white border top-2 border-slate-200 rounded-xl shadow-sm p-4 sm:p-6">
                  <h3 className="text-lg font-bold text-slate-800 mb-6 border-b border-slate-100 pb-2">E-Signatures / Approvals</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {record.signatures.map((sig) => (
                      <div key={sig.id} className="border border-slate-100 rounded-lg p-4 bg-slate-50 relative">
                        {sig.image && (
                          <div className="mb-4">
                            <p className="text-[10px] font-bold text-slate-500 uppercase mb-2">DRAWN SIGNATURE</p>
                            <div className="border border-slate-200 rounded p-1 inline-block bg-white shadow-sm">
                              <img src={sig.image} alt="E-Signature" className="h-20 object-contain mix-blend-multiply" />
                            </div>
                          </div>
                        )}
                        <div className="grid grid-cols-1 gap-2">
                          <div>
                            <p className="text-[10px] font-bold text-slate-500 uppercase">SIGNED BY</p>
                            <p className="text-sm font-bold text-slate-800 border-b border-slate-200 pb-1 mt-1 inline-block font-serif italic">{sig.name || '________________'}</p>
                          </div>
                          <div className="flex justify-between items-end mt-2">
                            <div>
                              <p className="text-[10px] font-bold text-slate-500 uppercase">DESIGNATION</p>
                              <p className="text-xs font-medium text-slate-700 mt-1">{sig.designation || '________________'}</p>
                            </div>
                            <div>
                              <p className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1"><Calendar className="w-3 h-3"/> DATE</p>
                              <p className="text-xs font-medium text-slate-700 mt-1">{sig.date || '________________'}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Legacy handling fallback */}
              {(!record.signatures || record.signatures.length === 0) && (record.signature || record.signatureDesignation || record.signatureImage) && (
                <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4 sm:p-6">
                  <h3 className="text-lg font-bold text-slate-800 mb-6 border-b border-slate-100 pb-2">E-Signature Approval</h3>
                  {record.signatureImage && (
                    <div className="mb-6">
                      <p className="text-[10px] font-bold text-slate-500 uppercase mb-2">DRAWN SIGNATURE</p>
                      <div className="border border-slate-200 rounded-lg p-2 inline-block bg-slate-50">
                        <img src={record.signatureImage} alt="E-Signature" className="h-24 object-contain mix-blend-multiply" />
                      </div>
                    </div>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <p className="text-[10px] font-bold text-slate-500 uppercase">SIGNED BY</p>
                      <p className="text-sm font-bold text-slate-800 border-b border-slate-200 pb-1 mt-2 inline-block min-w-32 font-serif italic">{record.signature || '________________'}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-500 uppercase">DESIGNATION</p>
                      <p className="text-sm font-medium text-slate-800 mt-2">{record.signatureDesignation || '________________'}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1"><Calendar className="w-3 h-3"/> DATE</p>
                      <p className="text-sm font-medium text-slate-800 mt-2">{record.signatureDate || '________________'}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>

      {showExportModal && (
        <ExportModal 
          onClose={() => setShowExportModal(false)}
          onExportPDF={exportPDF}
          onExportCSV={exportExcel}
        />
      )}
    </div>
  );
}
