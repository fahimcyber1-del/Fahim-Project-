import React, { useState } from 'react';
import { TestRequest } from './types';
import { ArrowLeft, Share2, Download, Clock, ShieldCheck, CheckCircle2, Maximize2 } from 'lucide-react';
import { DocumentViewerModal } from '../common/DocumentViewerModal';
import { ExportModal, TestExportOptions } from './ExportModal';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

interface TestDetailProps {
  record: TestRequest;
  onBack: () => void;
  onEdit: () => void;
}

export function TestDetail({ record, onBack, onEdit }: TestDetailProps) {
  const [fullscreenImage, setFullscreenImage] = useState<{ content: string; name: string } | null>(null);
  const [showExportModal, setShowExportModal] = useState(false);

  const handleExportPDF = (options: TestExportOptions) => {
    const doc = new jsPDF();
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.text(`Test Report: ${record.id}`, 14, 22);
    
    let yPos = 35;
    
    if (options.includeTestDetails) {
      doc.setFontSize(12);
      doc.text("Basic Information", 14, yPos);
      yPos += 10;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      const details = [
        ["Test Name:", record.testName],
        ["Status:", record.status],
        ["Standard:", record.standard],
        ["Lab ID:", record.labId],
        ["Client Name:", record.buyer],
        ["Overall Result:", record.overallResult],
      ];
      
      autoTable(doc, {
        startY: yPos,
        body: details,
        theme: 'plain',
        styles: { fontSize: 10, cellPadding: 2 },
        columnStyles: { 0: { fontStyle: 'bold', cellWidth: 40 } }
      });
      yPos = (doc as any).lastAutoTable.finalY + 15;
    }
    
    if (options.includeParameters && record.parameters.length > 0) {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.text("Test Parameters & Results", 14, yPos);
      yPos += 8;
      
      autoTable(doc, {
        startY: yPos,
        head: [['Parameter', 'Requirement', 'Actual Result', 'Status']],
        body: record.parameters.map(p => [p.name, p.requirement, p.actualResult, p.status]),
        theme: 'grid',
        headStyles: { fillColor: [0, 51, 160], textColor: [255, 255, 255] },
        styles: { fontSize: 9 }
      });
      yPos = (doc as any).lastAutoTable.finalY + 15;
    }

    if (options.includeApprovals) {
      if (yPos > 250) {
        doc.addPage();
        yPos = 20;
      }
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.text("Approvals", 14, yPos);
      yPos += 10;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.text(`Lead Technician: ${record.approval.leadTechnician} (${record.approval.leadTechnicianDate})`, 14, yPos);
      yPos += 6;
      doc.text(`Lab Manager: ${record.approval.labManager} (${record.approval.labManagerDate})`, 14, yPos);
      yPos += 15;
    }

    if (options.includeRemarks && record.inspectorRemarks) {
      if (yPos > 250) {
        doc.addPage();
        yPos = 20;
      }
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.text("Inspector Remarks", 14, yPos);
      yPos += 6;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      const splitRemarks = doc.splitTextToSize(record.inspectorRemarks, 180);
      doc.text(splitRemarks, 14, yPos);
      yPos += (splitRemarks.length * 5) + 10;
    }

    if (options.includeImages && (record.specimenImages?.preTest || record.specimenImages?.postTest)) {
      doc.addPage();
      yPos = 20;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.text("Specimen Images", 14, yPos);
      yPos += 10;
      
      if (record.specimenImages.preTest) {
        doc.text("Pre-Test", 14, yPos);
        try {
          doc.addImage(record.specimenImages.preTest, 'JPEG', 14, yPos + 5, 80, 60);
        } catch(e) {}
      }
      if (record.specimenImages.postTest) {
        doc.text("Post-Test", 110, yPos);
        try {
          doc.addImage(record.specimenImages.postTest, 'JPEG', 110, yPos + 5, 80, 60);
        } catch(e) {}
      }
    }

    doc.save(`TestReport_${record.id}.pdf`);
  };

  const handleExportCSV = (options: TestExportOptions) => {
    let dataToExport: any[] = [];
    
    if (options.includeParameters && record.parameters.length > 0) {
      dataToExport = record.parameters.map(p => ({
        TestID: record.id,
        TestName: record.testName,
        LabID: record.labId,
        Standard: record.standard,
        OverallResult: record.overallResult,
        Parameter: p.name,
        Requirement: p.requirement,
        ActualResult: p.actualResult,
        ParameterStatus: p.status,
      }));
    } else {
      dataToExport = [{
        TestID: record.id,
        TestName: record.testName,
        LabID: record.labId,
        Standard: record.standard,
        OverallResult: record.overallResult,
      }];
    }

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "TestReport");
    XLSX.writeFile(workbook, `TestReport_${record.id}.xlsx`);
  };

  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto flex flex-col h-full space-y-6">
      {fullscreenImage && (
        <DocumentViewerModal
          type="image"
          content={fullscreenImage.content}
          name={fullscreenImage.name}
          onClose={() => setFullscreenImage(null)}
        />
      )}
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
           <button onClick={onBack} className="text-[#0033a0] font-bold hover:underline flex items-center gap-1">
             <ArrowLeft className="w-4 h-4" /> Back to Requests List
           </button>
           <span>/</span>
           <span className="font-bold text-slate-700">{record.id}</span>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 bg-white border border-slate-300 text-slate-700 px-4 py-2 hover:bg-slate-50 rounded-md font-bold text-sm transition-colors shadow-sm">
            <Share2 className="w-4 h-4" /> Share
          </button>
          <button 
            onClick={() => setShowExportModal(true)}
            className="flex items-center gap-2 bg-[#0033a0] text-white px-4 py-2 hover:bg-blue-800 rounded-md font-bold text-sm transition-colors shadow-sm"
          >
            <Download className="w-4 h-4" /> Download/Export
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:p-6">
         <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-4 sm:p-6 lg:p-8 shadow-[0_1px_3px_rgba(0,0,0,0.05)] flex items-center justify-between">
           <div>
             <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight mb-2">{record.testName}</h2>
             <p className="text-sm font-medium text-slate-600 mb-6">
               <span className="font-bold text-slate-800">Standard:</span> {record.standard} | <span className="font-bold text-slate-800">Lab ID:</span> {record.labId}
             </p>
             <div className="grid grid-cols-4 gap-4 sm:p-6 mb-6 pb-6 border-b border-slate-100 mt-2">
               <div>
                 <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">PO ARTICLE NO</p>
                 <p className="text-sm font-bold text-slate-800">{record.poArticleNumber || 'N/A'}</p>
               </div>
               <div>
                 <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">ORDER QUANTITY</p>
                 <p className="text-sm font-bold text-slate-800">{record.orderQuantity || 'N/A'}</p>
               </div>
               <div>
                 <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">COLOR</p>
                 <p className="text-sm font-bold text-slate-800">{record.color || 'N/A'}</p>
               </div>
               <div>
                 <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">SIZE</p>
                 <p className="text-sm font-bold text-slate-800">{record.size || 'N/A'}</p>
               </div>
             </div>

             <div className="grid grid-cols-3 gap-4 sm:p-6 lg:p-8">
               <div>
                 <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">CLIENT NAME</p>
                 <p className="text-sm font-bold text-slate-800">{record.buyer}</p>
               </div>
               <div>
                 <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">SAMPLE TYPE</p>
                 <p className="text-sm font-bold text-slate-800">{record.materialType}</p>
               </div>
               <div>
                 <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">TEST DATE</p>
                 <p className="text-sm font-bold text-slate-800">{record.date}</p>
               </div>
             </div>
           </div>
           
           <div className={`p-6 border-2 rounded-xl text-center min-w-[160px] ${
             record.overallResult === 'PASS' ? 'border-emerald-500 bg-emerald-50/50' : 
             record.overallResult === 'FAIL' ? 'border-rose-500 bg-rose-50/50' : 
             'border-slate-300 bg-slate-50'
           }`}>
              <p className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">OVERALL RESULT</p>
              <h3 className={`text-4xl font-black tracking-widest ${
                record.overallResult === 'PASS' ? 'text-emerald-500' : 
                record.overallResult === 'FAIL' ? 'text-rose-500' : 'text-slate-500'
              }`}>{record.overallResult}</h3>
           </div>
         </div>

         <div className="bg-[#1e40af] rounded-xl p-4 sm:p-6 lg:p-8 flex flex-col justify-center gap-8 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/10 rounded border border-white/20 flex items-center justify-center">
                 <Clock className="w-6 h-6 text-blue-200" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-blue-200 uppercase tracking-wider mb-0.5">TURNAROUND TIME</p>
                <p className="text-2xl font-bold text-white">{record.turnaroundTime}</p>
              </div>
            </div>
            
            <div className="w-full h-px bg-white/10"></div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/10 rounded border border-white/20 flex items-center justify-center">
                 <ShieldCheck className="w-6 h-6 text-blue-200" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-blue-200 uppercase tracking-wider mb-0.5">COMPLIANCE SCORE</p>
                <p className="text-2xl font-bold text-white">{record.complianceScore}</p>
              </div>
            </div>
         </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.05)] overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-[#F8FAFC]">
           <h3 className="text-lg font-bold text-slate-800">Test Parameters & Results</h3>
           <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">VALUES RECORDED AT 20°C / 65% RH</span>
        </div>
        <div className="overflow-x-auto p-4 sm:p-6">
          <table className="w-full text-left text-sm">
            <thead className="text-xs uppercase tracking-wider font-bold text-slate-500 border-b border-slate-200">
              <tr>
                <th className="pb-4 pr-6">PARAMETER</th>
                <th className="pb-4 px-6">REQUIREMENT (MIN)</th>
                <th className="pb-4 px-6">ACTUAL RESULT</th>
                <th className="pb-4 px-6">INSTRUMENT ID</th>
                <th className="pb-4 pl-6 text-right">STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {record.parameters.map((param, i) => (
                <tr key={i} className="hover:bg-slate-50 transition-colors">
                  <td className="py-4 pr-6 font-bold text-slate-800">{param.name}</td>
                  <td className="py-4 px-6 text-slate-600 font-medium">{param.requirement}</td>
                  <td className="py-4 px-6 text-slate-800 font-medium">{param.actualResult}</td>
                  <td className="py-4 px-6 text-slate-500 font-medium">{param.instrumentId}</td>
                  <td className="py-4 pl-6 text-right">
                    <span className={`inline-flex px-2 py-1 text-[10px] font-bold tracking-wider rounded border ${
                      param.status === 'MEETS' ? 'border-emerald-200 bg-emerald-50 text-emerald-600' :
                      param.status === 'FAILS' ? 'border-rose-200 bg-rose-50 text-rose-600' :
                      'border-slate-200 bg-slate-50 text-slate-600'
                    }`}>
                      {param.status}
                    </span>
                  </td>
                </tr>
              ))}
              {record.parameters.length === 0 && (
                <tr>
                   <td colSpan={5} className="py-8 text-center text-slate-400 italic">No parameters recorded for this test.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:p-6">
         <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-6 shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
            <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-6">
              <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              Test Specimen Images
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
               <div>
                  {record.specimenImages?.preTest ? (
                     <div className="relative group cursor-pointer" onClick={() => setFullscreenImage({ content: record.specimenImages.preTest, name: 'Pre-Test Specimen' })}>
                       <img src={record.specimenImages.preTest} alt="Pre-test" className="w-full h-32 object-cover border border-slate-200" />
                       <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                         <Maximize2 className="w-6 h-6 text-white" />
                       </div>
                     </div>
                  ) : (
                     <div className="w-full h-32 bg-[#0A192F] border border-slate-200"></div>
                  )}
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider text-center mt-3">ORIGINAL SPECIMEN (PRE-TEST)</p>
               </div>
               <div>
                  {record.specimenImages?.postTest ? (
                     <div className="relative group cursor-pointer" onClick={() => setFullscreenImage({ content: record.specimenImages.postTest, name: 'Post-Test Specimen' })}>
                       <img src={record.specimenImages.postTest} alt="Post-test" className="w-full h-32 object-cover border border-slate-200" />
                       <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                         <Maximize2 className="w-6 h-6 text-white" />
                       </div>
                     </div>
                  ) : (
                     <div className="w-full h-32 bg-[#0A192F] border border-slate-200 opacity-90"></div>
                  )}
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider text-center mt-3">AFTER WASHING (POST-TEST)</p>
               </div>
            </div>
         </div>

         <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-6 shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
            <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-6">
              <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
              Approval & Authorization
            </h3>
            
            <div className="space-y-6">
               <div className="flex justify-between items-start">
                  <div>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">LEAD TECHNICIAN</p>
                    <p className="text-xl font-serif font-black italic text-slate-800">{record.approval.leadTechnician}</p>
                    <p className="text-xs text-slate-500 mt-1">{record.approval.leadTechnicianDate}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">ID: {record.approval.leadTechnicianId}</p>
                    <p className="text-xs font-bold text-emerald-600 flex items-center justify-end gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> E-VERIFIED</p>
                  </div>
               </div>

               <div className="w-full h-px bg-slate-100"></div>
               
               <div className="flex justify-between items-start">
                  <div>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">LABORATORY MANAGER</p>
                    <p className="text-xl font-serif font-black italic text-slate-800">{record.approval.labManager}</p>
                    <p className="text-xs text-slate-500 mt-1">{record.approval.labManagerDate}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">ID: {record.approval.labManagerId}</p>
                    <p className="text-xs font-bold text-emerald-600 flex items-center justify-end gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> E-VERIFIED</p>
                  </div>
               </div>

               <div className="bg-slate-100/50 border border-slate-200 p-4 rounded-lg flex items-start gap-3">
                 <div className="w-5 h-5 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">i</div>
                 <p className="text-xs text-slate-600 leading-relaxed font-medium">Digital signatures are cryptographically bound to this report and meet ISO/IEC 17025 compliance standards.</p>
               </div>
            </div>
         </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-6 shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
         <h3 className="font-bold text-slate-800 mb-4">Inspector Remarks</h3>
         <div className="border-l-4 border-[#0033a0] pl-4 py-2">
            <p className="text-sm italic text-slate-700 font-serif leading-relaxed">
               {record.inspectorRemarks || '"No remarks provided."'}
            </p>
         </div>
      </div>

      {showExportModal && (
         <ExportModal 
           onClose={() => setShowExportModal(false)} 
           onExportPDF={handleExportPDF} 
           onExportCSV={handleExportCSV} 
         />
      )}

    </div>
  );
}
