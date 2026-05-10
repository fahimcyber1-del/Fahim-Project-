import React, { useState } from 'react';
import { SubSupplierRecord } from './types';
import { ArrowLeft, Edit3, Building2, MapPin, Mail, Phone, Globe, Calendar, Star, ShieldAlert, ShoppingCart, Clock, CheckCircle2, XCircle, FileText, Activity, Download, History, User } from 'lucide-react';
import { useAuditsState } from '../../store';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { ExportModal, SubSupplierExportOptions } from './ExportModal';

interface SubSupplierDetailProps {
  record: SubSupplierRecord;
  onBack: () => void;
  onEdit: () => void;
}

export function SubSupplierDetail({ record, onBack, onEdit }: SubSupplierDetailProps) {
  const { audits } = useAuditsState();
  const [showAudits, setShowAudits] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const supplierAudits = audits.filter(a => a.type === 'SUPPLIER' && a.subSupplier === record.name);

  const handleExportPDF = (options: SubSupplierExportOptions) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    
    // Header
    doc.setFillColor(37, 99, 235); // blue-600
    doc.rect(0, 0, pageWidth, 40, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('SUB-SUPPLIER REPORT', 14, 20);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 28);
    doc.text(`Supplier ID: ${record.id}`, 14, 34);

    if (record.documentCode) {
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text(`Doc Code: ${record.documentCode}`, pageWidth - 14, 20, { align: 'right' });
    }

    let currentY = 50;

    // Company Profile
    if (options.includeCompanyProfile) {
      doc.setTextColor(30, 30, 30);
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Company Profile', 14, currentY);
      currentY += 6;

      const profileData = [
        ['Name', record.name, 'Status', record.status],
        ['Category', record.category, 'Join Date', record.joinDate],
        ['Country', record.country, 'Address', record.address]
      ];

      autoTable(doc, {
        startY: currentY,
        body: profileData,
        theme: 'plain',
        styles: { cellPadding: 3, fontSize: 10 },
        columnStyles: {
          0: { fontStyle: 'bold', textColor: [100, 100, 100], cellWidth: 35 },
          1: { cellWidth: 55 },
          2: { fontStyle: 'bold', textColor: [100, 100, 100], cellWidth: 35 },
          3: { cellWidth: 55 }
        }
      });
      currentY = (doc as any).lastAutoTable.finalY + 15;
    }

    if (options.includeContactInfo) {
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Contact Information', 14, currentY);
      currentY += 6;

      const contactData = [
        ['Primary Contact', record.contactPerson, 'Email', record.email],
        ['Phone', record.phone, 'Website', record.website || '-']
      ];

      autoTable(doc, {
        startY: currentY,
        body: contactData,
        theme: 'plain',
        styles: { cellPadding: 3, fontSize: 10 },
        columnStyles: {
          0: { fontStyle: 'bold', textColor: [100, 100, 100], cellWidth: 35 },
          1: { cellWidth: 55 },
          2: { fontStyle: 'bold', textColor: [100, 100, 100], cellWidth: 35 },
          3: { cellWidth: 55 }
        }
      });
      currentY = (doc as any).lastAutoTable.finalY + 15;
    }

    if (options.includeNotes && record.notes) {
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Notes & Remarks', 14, currentY);
      currentY += 6;
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      const textLines = doc.splitTextToSize(record.notes, pageWidth - 28);
      doc.text(textLines, 14, currentY);
      currentY += (textLines.length * 5) + 10;
    }

    if (options.includePerformance) {
      if (currentY > 240) { doc.addPage(); currentY = 20; }
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Performance & Risk', 14, currentY);
      currentY += 6;
      
      const perfData = [
        ['Rating', `${record.rating} / 5`],
        ['Risk Level', record.riskLevel]
      ];
      autoTable(doc, {
        startY: currentY,
        body: perfData,
        theme: 'plain',
        styles: { cellPadding: 3, fontSize: 10 },
        columnStyles: {
          0: { fontStyle: 'bold', textColor: [100, 100, 100], cellWidth: 35 },
          1: { cellWidth: 55 }
        }
      });
      currentY = (doc as any).lastAutoTable.finalY + 15;
    }

    if (options.includeCertifications && record.certifications && record.certifications.length > 0) {
      if (currentY > 240) { doc.addPage(); currentY = 20; }
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Certifications', 14, currentY);
      currentY += 6;
      
      const certData = record.certifications.map(c => [c.name, c.validUntil]);
      autoTable(doc, {
        startY: currentY,
        head: [['Certification Name', 'Valid Until']],
        body: certData,
        theme: 'striped',
        headStyles: { fillColor: [241, 245, 249], textColor: [71, 85, 105], fontStyle: 'bold' },
        styles: { fontSize: 9, cellPadding: 4 }
      });
      currentY = (doc as any).lastAutoTable.finalY + 15;
    }

    if (options.includeAudits && supplierAudits.length > 0) {
      if (currentY > 240) { doc.addPage(); currentY = 20; }
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Audit History', 14, currentY);
      currentY += 6;
      
      const auditsData = supplierAudits.map(a => [a.id, a.date, a.title, a.status, a.score ? `${a.score}%` : '-']);
      autoTable(doc, {
        startY: currentY,
        head: [['Audit ID', 'Date', 'Title', 'Status', 'Score']],
        body: auditsData,
        theme: 'striped',
        headStyles: { fillColor: [241, 245, 249], textColor: [71, 85, 105], fontStyle: 'bold' },
        styles: { fontSize: 9, cellPadding: 4 }
      });
      currentY = (doc as any).lastAutoTable.finalY + 15;
    }

    // Add footer
    const pageCount = (doc as any).internal.getNumberOfPages();
    for(let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150);
        doc.text(`Page ${i} of ${pageCount}`, pageWidth / 2, doc.internal.pageSize.height - 10, { align: 'center' });
    }

    doc.save(`SubSupplier_${record.name.replace(/\s+/g, '_')}.pdf`);
  };

  const handleExportCSV = (options: SubSupplierExportOptions) => {
    const wb = XLSX.utils.book_new();

    if (options.includeCompanyProfile || options.includeContactInfo || options.includePerformance) {
      const basicInfo = [
        ['Supplier ID', record.id],
        ['Name', record.name],
        ['Status', record.status],
        ...(options.includeCompanyProfile ? [
          ['Category', record.category],
          ['Join Date', record.joinDate],
          ['Country', record.country],
          ['Address', record.address],
        ] : []),
        ...(options.includeContactInfo ? [
          ['Contact Person', record.contactPerson],
          ['Email', record.email],
          ['Phone', record.phone],
          ['Website', record.website || ''],
        ] : []),
        ...(options.includePerformance ? [
          ['Rating', record.rating],
          ['Risk Level', record.riskLevel],
        ] : []),
        ...(options.includeNotes ? [
          ['Notes', record.notes || ''],
        ] : []),
      ];
      const wsBasic = XLSX.utils.aoa_to_sheet(basicInfo);
      XLSX.utils.book_append_sheet(wb, wsBasic, 'Basic Info');
    }

    if (options.includeCertifications && record.certifications && record.certifications.length > 0) {
      const certData = record.certifications.map(c => ({
        'Name': c.name,
        'Valid Until': c.validUntil
      }));
      const wsCert = XLSX.utils.json_to_sheet(certData);
      XLSX.utils.book_append_sheet(wb, wsCert, 'Certifications');
    }

    if (options.includeAudits && supplierAudits.length > 0) {
      const auditsData = supplierAudits.map(a => ({
        'Audit ID': a.id,
        'Date': a.date,
        'Title': a.title,
        'Status': a.status,
        'Score': a.score || ''
      }));
      const wsAudits = XLSX.utils.json_to_sheet(auditsData);
      XLSX.utils.book_append_sheet(wb, wsAudits, 'Audits');
    }

    XLSX.writeFile(wb, `SubSupplier_${record.name.replace(/\s+/g, '_')}.xlsx`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-emerald-100 text-emerald-800';
      case 'Inactive': return 'bg-slate-100 text-slate-800';
      case 'Pending Approval': return 'bg-amber-100 text-amber-800';
      case 'Blacklisted': return 'bg-rose-100 text-rose-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Low': return 'text-emerald-600 bg-emerald-50 border-emerald-200';
      case 'Medium': return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'High': return 'text-rose-600 bg-rose-50 border-rose-200';
      case 'Critical': return 'text-white bg-rose-600 border-rose-700';
      default: return 'text-slate-600 bg-slate-50 border-slate-200';
    }
  };

  const getOrderStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-emerald-100 text-emerald-700';
      case 'In Progress': return 'bg-blue-100 text-blue-700';
      case 'Delayed': return 'bg-amber-100 text-amber-700';
      case 'Cancelled': return 'bg-rose-100 text-rose-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="max-w-5xl mx-auto w-full pb-12">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
           <button onClick={onBack} className="p-2 bg-slate-100 text-slate-500 hover:bg-slate-200 rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-3 mb-1">
              {record.logoUrl && (
                <img src={record.logoUrl} alt="Logo" className="w-8 h-8 rounded object-cover" />
              )}
              <h1 className="text-2xl font-black text-slate-900">{record.name}</h1>
              <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${getStatusColor(record.status)}`}>
                {record.status}
              </span>
            </div>
            <p className="text-sm font-medium text-slate-500">Supplier ID: {record.id}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button 
            onClick={() => setShowExportModal(true)}
            className="px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-2 shadow-sm"
          >
            <Download className="w-4 h-4 text-blue-500" /> Export
          </button>
          <button onClick={onEdit} className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm font-bold text-sm transition-colors">
            <Edit3 className="w-4 h-4" /> Edit Details
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:p-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4 sm:p-6">
             <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest mb-4 border-b border-slate-100 pb-2 flex items-center gap-2">
               <Building2 className="w-4 h-4 text-blue-600" /> Company Profile
             </h3>
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:p-6">
               <div className="flex items-start gap-3">
                 <Building2 className="w-5 h-5 text-slate-400 mt-0.5 flex-shrink-0" />
                 <div>
                   <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">Category</p>
                   <p className="text-sm font-semibold text-slate-800">{record.category}</p>
                 </div>
               </div>
               <div className="flex items-start gap-3">
                 <Calendar className="w-5 h-5 text-slate-400 mt-0.5 flex-shrink-0" />
                 <div>
                   <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">Onboarding Date</p>
                   <p className="text-sm font-semibold text-slate-800">{record.joinDate}</p>
                 </div>
               </div>
               <div className="flex items-start gap-3 sm:col-span-2">
                 <MapPin className="w-5 h-5 text-slate-400 mt-0.5 flex-shrink-0" />
                 <div>
                   <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">Physical Address</p>
                   <p className="text-sm font-semibold text-slate-800">{record.address}</p>
                   <p className="text-sm font-medium text-slate-500">{record.country}</p>
                 </div>
               </div>
             </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4 sm:p-6">
             <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest mb-4 border-b border-slate-100 pb-2 flex items-center gap-2">
               <Globe className="w-4 h-4 text-blue-600" /> Contact Information
             </h3>
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:p-6">
               <div className="flex items-start gap-3">
                 <div className="w-8 h-8 rounded bg-blue-50 text-blue-600 flex items-center justify-center font-bold flex-shrink-0">
                   {record.contactPerson.charAt(0)}
                 </div>
                 <div>
                   <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">Primary Contact</p>
                   <p className="text-sm font-semibold text-slate-800">{record.contactPerson}</p>
                 </div>
               </div>
               <div className="flex items-start gap-3">
                 <Mail className="w-5 h-5 text-slate-400 mt-0.5 flex-shrink-0" />
                 <div>
                   <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">Email Address</p>
                   <p className="text-sm font-semibold text-blue-600 hover:underline cursor-pointer">{record.email}</p>
                 </div>
               </div>
               <div className="flex items-start gap-3">
                 <Phone className="w-5 h-5 text-slate-400 mt-0.5 flex-shrink-0" />
                 <div>
                   <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">Phone Number</p>
                   <p className="text-sm font-semibold text-slate-800">{record.phone}</p>
                 </div>
               </div>
               {record.website && (
                 <div className="flex items-start gap-3">
                   <Globe className="w-5 h-5 text-slate-400 mt-0.5 flex-shrink-0" />
                   <div>
                     <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">Website</p>
                     <a href={record.website} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-blue-600 hover:underline">{record.website}</a>
                   </div>
                 </div>
               )}
             </div>
          </div>

          {(record.notes) && (
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4 sm:p-6">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest mb-4 border-b border-slate-100 pb-2">Notes & Remarks</h3>
              <p className="text-sm text-slate-700 bg-slate-50 p-4 rounded-lg border border-slate-100 whitespace-pre-wrap">{record.notes}</p>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4 sm:p-6">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest mb-4 border-b border-slate-100 pb-2">Performance & Risk</h3>
            <div className="space-y-5">
              <div>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Supplier Rating</p>
                <div className="flex items-center gap-2">
                  <div className="flex items-center text-amber-500">
                    {[1,2,3,4,5].map(star => (
                      <Star key={star} className={`w-5 h-5 ${star <= Math.round(record.rating) ? 'fill-current' : 'text-slate-200'}`} />
                    ))}
                  </div>
                  <span className="text-lg font-black text-slate-800">{record.rating}<span className="text-sm text-slate-500">/5</span></span>
                </div>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Risk Assessment</p>
                <div className={`px-4 py-3 rounded-lg border flex items-center gap-3 ${getRiskColor(record.riskLevel)}`}>
                  <ShieldAlert className="w-6 h-6" />
                  <div>
                    <p className="font-bold">{record.riskLevel} Risk Profile</p>
                    <p className="text-xs opacity-80 mt-0.5">Based on historical data & audits</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4 sm:p-6">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest mb-4 border-b border-slate-100 pb-2">Certifications</h3>
            {record.certifications && record.certifications.length > 0 ? (
              <div className="space-y-3">
                {record.certifications.map(cert => (
                  <div key={cert.id} className="p-3 bg-slate-50 border border-slate-100 rounded-lg flex justify-between items-center group">
                    <div>
                      <p className="text-sm font-bold text-slate-800">{cert.name}</p>
                      <p className="text-xs font-medium text-slate-500 mt-0.5">Valid until: {cert.validUntil}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 bg-slate-50 border border-slate-100 rounded-lg text-center">
                 <p className="text-xs font-medium text-slate-500 italic">No certifications recorded.</p>
              </div>
            )}
          </div>
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4 sm:p-6">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest mb-4 border-b border-slate-100 pb-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-blue-600" /> Audit History
              </div>
              <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full text-[10px]">{supplierAudits.length}</span>
            </h3>
            {supplierAudits.length > 0 ? (
              <div className="space-y-4">
                {supplierAudits.map((audit) => (
                  <div key={audit.id} className="p-4 bg-slate-50 border border-slate-100 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-bold text-slate-800">{audit.id}</p>
                      <p className="text-xs font-semibold text-slate-500">{audit.date}</p>
                    </div>
                    <p className="text-xs font-medium text-slate-600 mb-2">{audit.title}</p>
                    <div className="flex items-center justify-between">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${audit.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'}`}>
                        {audit.status}
                      </span>
                      {audit.score !== undefined && (
                        <span className="text-xs font-bold text-slate-700">Score: {audit.score}%</span>
                      )}
                    </div>
                    {(audit.findings?.length > 0 || audit.isoQuestions?.length > 0) && (
                      <div className="mt-3 pt-3 border-t border-slate-200/60 flex items-center gap-4">
                        {audit.findings && audit.findings.length > 0 && (
                          <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Findings</span>
                            <span className="text-sm font-semibold text-rose-600">{audit.findings.length} Open</span>
                          </div>
                        )}
                        {audit.isoQuestions && audit.isoQuestions.length > 0 && (
                          <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Evaluations</span>
                            <span className="text-sm font-semibold text-slate-700">{audit.isoQuestions.length} Checkpoints</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 bg-slate-50 border border-slate-100 rounded-lg text-center">
                 <p className="text-xs font-medium text-slate-500 italic">No audits recorded for this supplier.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Audit Trail */}
      <div className="mx-4 sm:mx-6 mb-6 bg-slate-50 p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 overflow-hidden relative">
         <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100 rounded-bl-full opacity-50 blur-xl"></div>
         <div className="relative z-10 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center border border-blue-200">
               <History className="w-5 h-5 text-blue-600" />
            </div>
            <div>
               <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-1">Audit Trail</h3>
               <p className="text-xs text-slate-500 font-medium">System tracking for this record</p>
            </div>
         </div>
         <div className="relative z-10 flex flex-col sm:flex-row gap-4 sm:gap-8">
            <div>
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Created By</p>
               <p className="text-sm font-semibold text-slate-900 flex items-center gap-1.5"><User className="w-3.5 h-3.5 text-slate-400" /> {record.createdBy || 'System Admin'}</p>
               <p className="text-xs text-slate-500 mt-0.5">{record.createdAt ? new Date(record.createdAt).toLocaleString() : record.joinDate || '-'}</p>
            </div>
            <div className="hidden sm:block w-px bg-slate-200 h-10 my-auto"></div>
            <div>
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Last Edited By</p>
               <p className="text-sm font-semibold text-slate-900 flex items-center gap-1.5"><Edit3 className="w-3.5 h-3.5 text-slate-400" /> {record.lastEditedBy || 'System Admin'}</p>
               <p className="text-xs text-slate-500 mt-0.5">{record.lastEditedAt ? new Date(record.lastEditedAt).toLocaleString() : '-'}</p>
            </div>
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
