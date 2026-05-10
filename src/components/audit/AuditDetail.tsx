import React, { useState } from 'react';
import { AuditRecord } from './types';
import { ArrowLeft, Edit3, ClipboardList, MapPin, Calendar, Clock, AlertTriangle, Download, Building } from 'lucide-react';
import { FileViewer } from '../inspection/FileViewer';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { ExportModal, ExportOptions } from './ExportModal';

interface AuditDetailProps {
  record: AuditRecord;
  onBack: () => void;
}

export function AuditDetail({ record, onBack }: AuditDetailProps) {
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  React.useEffect(() => {
    window.dispatchEvent(new CustomEvent('app-fullscreen', { detail: true }));
    return () => {
      window.dispatchEvent(new CustomEvent('app-fullscreen', { detail: false }));
    };
  }, []);

  const exportPDF = (options: ExportOptions) => {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(20);
    doc.text('Audit Report', 14, 22);
    
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`ID: ${record.id} | Generated: ${new Date().toLocaleDateString()}`, 14, 30);
    
    // Basic Details
    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.text('Audit Overview', 14, 40);
    
    autoTable(doc, {
      startY: 45,
      theme: 'grid',
      headStyles: { fillColor: [241, 245, 249], textColor: [15, 23, 42] },
      body: [
        ['Title', record.title],
        ['Type', record.type],
        ['Date', `${record.date} ${record.endDate ? `to ${record.endDate}` : ''}`],
        ['Status', record.status],
        ['Location', record.location],
        ['Department/Scope', record.department],
        ['Auditor', record.auditor],
      ],
    });

    let currentY = (doc as any).lastAutoTable.finalY + 15;

    // ISO Evaluation & Score
    if ((record.type === 'INTERNAL' || record.type === 'SUPPLIER') && record.isoQuestions && record.isoQuestions.length > 0) {
      doc.setFontSize(14);
      let heading = `${record.type === 'SUPPLIER' ? 'Sub Supplier' : 'ISO 9001:2015'} Evaluation`;
      if (options.includeScores && record.score !== undefined) {
         heading += ` (Score: ${record.score}%)`;
      }
      doc.text(heading, 14, currentY);
      currentY += 10;
      
      const tableData = record.isoQuestions.map(q => [
        q.clause,
        q.question,
        q.evaluation || 'Not Assessed',
        q.evidence || '-'
      ]);

      autoTable(doc, {
        startY: currentY,
        head: [['Clause', 'Question', 'Evaluation', 'Evidence']],
        body: tableData,
        theme: 'striped',
        styles: { fontSize: 8 },
        columnStyles: {
          0: { cellWidth: 15 },
          1: { cellWidth: 80 },
          2: { cellWidth: 25 },
          3: { cellWidth: 'auto' }
        }
      });
      
      currentY = (doc as any).lastAutoTable.finalY + 15;
    }

    // Findings
    if (options.includeFindings) {
      doc.setFontSize(14);
      doc.text('Findings', 14, currentY);
      
      if (record.findings && record.findings.length > 0) {
        const findingsData = record.findings.map(f => {
          let row = [f.id, f.severity, f.status, f.description];
          if (options.includeCorrectiveActions) {
            row.push(f.correctiveAction || '-');
          }
          return row;
        });

        const findingsHead = ['ID', 'Severity', 'Status', 'Description'];
        if (options.includeCorrectiveActions) {
           findingsHead.push('Corrective Action');
        }

        autoTable(doc, {
          startY: currentY + 5,
          head: [findingsHead],
          body: findingsData,
          theme: 'grid',
          styles: { fontSize: 9 }
        });
        currentY = (doc as any).lastAutoTable.finalY + 15;
      } else {
        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text('No findings collected.', 14, currentY + 8);
        currentY += 20;
      }
    }

    // Process images if there are any attached to the ISO questions
    if (options.includeImages && (record.type === 'INTERNAL' || record.type === 'SUPPLIER') && record.isoQuestions && record.isoQuestions.some(q => q.image)) {
      doc.addPage();
      doc.setFontSize(14);
      doc.setTextColor(0);
      doc.text('Attached Evidence Images', 14, 20);
      
      let imgY = 30;
      record.isoQuestions.forEach(q => {
        if (q.image) {
          if (imgY > 200) {
            doc.addPage();
            imgY = 20;
          }
          doc.setFontSize(10);
          doc.text(`Clause ${q.clause}: ${q.evaluation || ''}`, 14, imgY);
          
          try {
             // Basic image addition, assuming JPEG or PNG data URL format
             doc.addImage(q.image, 'JPEG', 14, imgY + 5, 80, 60);
          } catch (e) {
             console.error("Failed to add image to PDF", e);
             doc.text("(Image data not supported or invalid format)", 14, imgY + 15);
          }
          
          imgY += 75;
        }
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
    
    doc.save(`Audit_Report_${record.id}.pdf`);
  };

  const exportCSV = (options: ExportOptions) => {
      const baseRow: any = {
        ID: record.id,
        Title: record.title,
        Type: record.type,
        Date: record.date,
        Auditor: record.auditor,
        Status: record.status
      };
      
      if (options.includeScores) {
        baseRow['Score'] = record.score !== undefined ? `${record.score}%` : 'N/A';
      }

      if (options.includeFindings) {
        baseRow['Findings Count'] = record.findings?.length || 0;
        baseRow['Detailed Findings'] = record.findings?.map(f => `[${f.severity}] ${f.description}`).join(' | ') || '';
      }

      if (options.includeCorrectiveActions) {
         baseRow['Corrective Actions'] = record.findings?.filter(f => f.correctiveAction).map(f => f.correctiveAction).join(' | ') || '';
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
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Audit Details');
      XLSX.writeFile(workbook, `Audit_Report_${record.id}.csv`);
  };

  return (
    <div className="max-w-5xl mx-auto w-full pb-12">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 bg-slate-100 text-slate-500 hover:bg-slate-200 rounded-full">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-black text-slate-900">{record.title}</h1>
            <p className="text-sm font-medium text-slate-500">ID: {record.id}</p>
          </div>
        </div>
        <button
          onClick={() => setIsExportModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm font-bold text-sm transition-colors"
        >
          <Download className="w-4 h-4" /> Export Report
        </button>
      </div>

      {isExportModalOpen && (
        <ExportModal 
          onClose={() => setIsExportModalOpen(false)} 
          onExportPDF={exportPDF} 
          onExportCSV={exportCSV} 
        />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:p-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4 sm:p-6">
            <h3 className="text-lg font-bold text-slate-800 mb-6 border-b border-slate-100 pb-2">Audit Details</h3>
            <div className="grid grid-cols-2 gap-y-6 gap-x-8">
              <div>
                <p className="text-[10px] font-bold text-slate-500 uppercase">TYPE</p>
                <p className="text-sm font-bold text-slate-800">{record.type}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-500 uppercase">STATUS</p>
                <p className="text-sm font-bold text-slate-800">{record.status}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1"><Calendar className="w-3 h-3"/> DATE</p>
                <p className="text-sm font-bold text-slate-800">{record.date} {record.endDate ? `to ${record.endDate}` : ''}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1"><MapPin className="w-3 h-3"/> LOCATION</p>
                <p className="text-sm font-bold text-slate-800">{record.location}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-500 uppercase">AUDITOR</p>
                <p className="text-sm font-bold text-slate-800">{record.auditor}</p>
              </div>
              {record.type === 'SUPPLIER' && record.subSupplier && (
                <div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1"><Building className="w-3 h-3"/> SUB SUPPLIER</p>
                  <p className="text-sm font-bold text-slate-800">{record.subSupplier}</p>
                </div>
              )}
              <div>
                <p className="text-[10px] font-bold text-slate-500 uppercase">DEPARTMENT / SCOPE</p>
                <p className="text-sm font-bold text-slate-800">{record.department}</p>
              </div>
            </div>
            {record.remarks && (
              <div className="mt-6 pt-4 border-t border-slate-100">
                <p className="text-[10px] font-bold text-slate-500 uppercase">REMARKS</p>
                <p className="text-sm text-slate-700 mt-1">{record.remarks}</p>
              </div>
            )}
          </div>

          <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4 sm:p-6">
            <h3 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">Findings</h3>
            {record.findings && record.findings.length > 0 ? (
              <div className="space-y-4">
                {record.findings.map(finding => (
                  <div key={finding.id} className="p-4 border border-slate-200 rounded-lg bg-slate-50 flex gap-4">
                    <AlertTriangle className={`w-5 h-5 shrink-0 ${finding.severity === 'CRITICAL' || finding.severity === 'MAJOR' ? 'text-rose-500' : 'text-amber-500'}`} />
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${finding.status === 'OPEN' ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'}`}>
                          {finding.status}
                        </span>
                        <span className="text-xs font-bold text-slate-500">{finding.severity}</span>
                      </div>
                      <p className="text-sm font-medium text-slate-800 mt-2">{finding.description}</p>
                      <p className="text-xs font-mono text-slate-400 mt-2">{finding.id}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-500">No findings collected yet.</p>
            )}
          </div>

          {(record.type === 'INTERNAL' || record.type === 'SUPPLIER') && record.isoQuestions && record.isoQuestions.length > 0 && (() => {
            const evaluationCounts = {
              'OK': 0,
              'Minor NC': 0,
              'Major NC': 0,
              'Critical NC': 0,
              'Not Assessed': 0
            };
            record.isoQuestions.forEach(q => {
              if (q.evaluation === 'OK') evaluationCounts['OK']++;
              else if (q.evaluation === 'Minor NC' || (q.evaluation as string) === 'MINOR NC') evaluationCounts['Minor NC']++;
              else if (q.evaluation === 'Major NC' || (q.evaluation as string) === 'MAJOR NC') evaluationCounts['Major NC']++;
              else if (q.evaluation === 'Critical NC' || (q.evaluation as string) === 'CRITICAL NC') evaluationCounts['Critical NC']++;
              else evaluationCounts['Not Assessed']++;
            });

            const chartData = [
              { name: 'OK', value: evaluationCounts['OK'], color: '#10b981' }, // emerald-500
              { name: 'Minor NC', value: evaluationCounts['Minor NC'], color: '#f59e0b' }, // amber-500
              { name: 'Major NC', value: evaluationCounts['Major NC'], color: '#f43f5e' }, // rose-500
              { name: 'Critical NC', value: evaluationCounts['Critical NC'], color: '#9f1239' } // rose-800
            ].filter(d => d.value > 0);

            return (
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-2">
                <h3 className="text-lg font-bold text-slate-800">{record.type === 'SUPPLIER' ? 'Sub Supplier Evaluation' : 'ISO 9001:2015 Evaluation'}</h3>
                {record.score !== undefined && (
                  <div className="bg-slate-100 px-4 py-1.5 rounded-full border border-slate-200 shadow-sm">
                    <span className="text-sm font-bold text-slate-600 uppercase mr-2">Calculated Score:</span>
                    <span className="text-base font-black text-blue-700">{record.score}%</span>
                  </div>
                )}
              </div>

              {chartData.length > 0 && (
                <div className="mb-8 pt-4 border-b border-slate-100 pb-8 flex flex-col items-center">
                  <h4 className="text-sm font-bold text-slate-600 mb-4 uppercase">Evaluation Status Distribution</h4>
                  <div className="h-64 w-full max-w-md">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={chartData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                {record.isoQuestions.map(q => (
                  <div key={q.id} className="p-4 border border-slate-200 rounded-lg bg-slate-50">
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded font-bold text-xs">Clause {q.clause}</span>
                          <h4 className="font-semibold text-slate-800 text-sm leading-tight">{q.question}</h4>
                        </div>
                        
                        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <div>
                            <p className="text-[10px] font-bold text-slate-500 uppercase">Evaluation</p>
                            <p className={`text-sm font-bold mt-0.5 ${
                              q.evaluation === 'OK' ? 'text-emerald-600' : 
                              q.evaluation === 'Minor NC' ? 'text-amber-600' :
                              (q.evaluation === 'Major NC' || q.evaluation === 'Critical NC') ? 'text-rose-600' :
                              'text-slate-600'
                            }`}>{q.evaluation || 'Not Assessed'}</p>
                          </div>
                          <div>
                            <p className="text-[10px] font-bold text-slate-500 uppercase">Evidence</p>
                            <p className="text-sm font-medium text-slate-800 mt-0.5">{q.evidence || '-'}</p>
                          </div>
                        </div>
                      </div>
                      {q.image && (
                        <div className="w-full md:w-32 shrink-0 border-t md:border-t-0 md:border-l border-slate-200 pt-3 md:pt-0 md:pl-4">
                          <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Attachment</p>
                          <img src={q.image} alt="Evidence" className="w-full h-20 object-cover rounded border border-slate-200" />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            );
          })()}

          {record.attachments && record.attachments.length > 0 && (
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4 sm:p-6">
              <FileViewer attachments={record.attachments} />
            </div>
          )}

          {(record.signatures && record.signatures.length > 0) && (
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4 sm:p-6">
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
  );
}
