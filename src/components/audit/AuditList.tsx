import React, { useState, useEffect, useRef } from 'react';
import { AuditRecord } from './types';
import { Search, Plus, Filter, FileText, Download, Eye, Edit, Trash2, ChevronDown, ChevronUp, MoreHorizontal, ChevronLeft, ChevronRight } from 'lucide-react';
import jsPDF from 'jspdf';
import { ExportModal, ExportOptions } from './ExportModal';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

interface AuditListProps {
  audits: AuditRecord[];
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (ids: string[]) => void;
  onCreate: () => void;
}

export function AuditList({ audits, onView, onEdit, onDelete, onCreate }: AuditListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [openActionMenuId, setOpenActionMenuId] = useState<string | null>(null);

  useEffect(() => {
    setCurrentPage(1);
  }, [itemsPerPage, searchTerm]);
  const [confirmDelete, setConfirmDelete] = useState<{ ids: string[] | null, message: string }>({ ids: null, message: '' });
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenActionMenuId(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredAudits = audits.filter(a => 
    a.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    a.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredAudits.length / itemsPerPage);
  const paginatedAudits = filteredAudits.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const toggleSelectAll = () => {
    if (selectedIds.size === paginatedAudits.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(paginatedAudits.map(a => a.id)));
    }
  };

  const toggleSelect = (id: string) => {
    const newSelect = new Set(selectedIds);
    if (newSelect.has(id)) {
      newSelect.delete(id);
    } else {
      newSelect.add(id);
    }
    setSelectedIds(newSelect);
  };

  const handleDeleteSelected = () => {
    setConfirmDelete({ ids: Array.from(selectedIds), message: `Are you sure you want to delete ${selectedIds.size} records?` });
  };

  const handleConfirmDelete = () => {
    if (confirmDelete.ids && confirmDelete.ids.length > 0) {
      onDelete(confirmDelete.ids);
      setSelectedIds(new Set());
    }
    setConfirmDelete({ ids: null, message: '' });
  };

  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [dataToExport, setDataToExport] = useState<AuditRecord[] | null>(null);

  const exportPDF = (options: ExportOptions) => {
    const data = dataToExport || filteredAudits;
    const doc = new jsPDF();
    doc.text('Audit Report', 14, 15);
    
    let currentY = 20;

    data.forEach((r, index) => {
      if (index > 0) {
        doc.addPage();
        currentY = 20;
      }
      
      doc.setFontSize(14);
      doc.text(`Audit: ${r.title} (${r.id})`, 14, currentY);
      currentY += 10;
      doc.setFontSize(10);
      doc.text(`Type: ${r.type} | Date: ${r.date} | Auditor: ${r.auditor} | Status: ${r.status}`, 14, currentY);
      currentY += 10;

      if (options.includeScores && r.score !== undefined) {
        doc.text(`Calculated Score: ${r.score}%`, 14, currentY);
        currentY += 10;
      }

      if (options.includeFindings && r.findings && r.findings.length > 0) {
        doc.setFontSize(12);
        doc.text('Detailed Findings', 14, currentY);
        currentY += 5;
        
        const findingsBody = r.findings.map(f => {
          let row = [f.id, f.severity, f.status, f.description];
          if (options.includeCorrectiveActions) {
            row.push(f.correctiveAction || 'None');
          }
          return row;
        });

        const findingsHead = ['ID', 'Severity', 'Status', 'Description'];
        if (options.includeCorrectiveActions) {
          findingsHead.push('Corrective Action');
        }

        autoTable(doc, {
          startY: currentY,
          head: [findingsHead],
          body: findingsBody,
          styles: { fontSize: 8 }
        });
        currentY = (doc as any).lastAutoTable.finalY + 15;
      }
      
      if (options.includeImages && r.isoQuestions) {
         r.isoQuestions.forEach(q => {
           // We can't actually embed base64 well without knowing proportions, but if there's a requirement...
           // just indicate image available if we actually want to show.
         });
      }
    });
    
    doc.save('Audit_Report.pdf');
  };

  const exportExcel = (options: ExportOptions) => {
    const data = dataToExport || filteredAudits;
    const worksheet = XLSX.utils.json_to_sheet(data.map(r => {
      const baseRow: any = {
        ID: r.id,
        Title: r.title,
        Type: r.type,
        Date: r.date,
        Auditor: r.auditor,
        Status: r.status
      };
      
      if (options.includeScores) {
        baseRow['Score'] = r.score !== undefined ? `${r.score}%` : 'N/A';
      }

      if (options.includeFindings) {
        baseRow['Findings Count'] = r.findings?.length || 0;
        baseRow['Detailed Findings'] = r.findings?.map(f => `[${f.severity}] ${f.description}`).join(' | ') || '';
      }

      if (options.includeCorrectiveActions) {
         baseRow['Corrective Actions'] = r.findings?.filter(f => f.correctiveAction).map(f => f.correctiveAction).join(' | ') || '';
      }

      return baseRow;
    }));
    
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Audits');
    XLSX.writeFile(workbook, 'Audit_Report.csv');
  };

  const handleExportClick = (data?: AuditRecord[]) => {
    setDataToExport(data || null);
    setIsExportModalOpen(true);
  };

  return (
    <div className="border border-slate-200 bg-white rounded-lg shadow-sm h-full flex-1 flex flex-col min-h-0">
      <div className="border-b border-slate-200 px-4 py-3 flex flex-col sm:flex-row justify-end items-start sm:items-center gap-4 shrink-0">
        <div className="flex flex-wrap items-center gap-2">
            <button onClick={() => setIsFilterOpen(!isFilterOpen)} className="flex items-center gap-2 px-3 py-1.5 border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded transition-colors"><Filter className="w-4 h-4" /> Filters {isFilterOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}</button>
            <button onClick={() => handleExportClick()} className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded transition-colors"><Download className="w-4 h-4" /> Export Report</button>
            <button onClick={onCreate} className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded shadow-sm transition-colors"><Plus className="w-4 h-4" /> New Audit</button>
        </div>
      </div>
      
      {isFilterOpen && (
        <div className="p-4 border-b border-slate-100 bg-slate-50 space-y-4">
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <label className="block text-xs font-semibold text-slate-600 mb-1">Search</label>
              <input type="text" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500" />
            </div>
            {selectedIds.size > 0 && <button onClick={handleDeleteSelected} className="mt-2 flex items-center gap-1 px-3 py-2 bg-rose-100 text-rose-700 text-xs font-semibold rounded h-[38px]"><Trash2 className="w-3 h-3" /> Delete ({selectedIds.size})</button>}
          </div>
        </div>
      )}

      <div className="overflow-auto flex-1 min-h-0 bg-white">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-slate-50 border-b border-slate-200 sticky top-0 z-10">
            <tr>
              <th className="px-4 py-3 w-10"><input type="checkbox" checked={selectedIds.size === paginatedAudits.length && paginatedAudits.length > 0} onChange={toggleSelectAll} className="rounded border-slate-300"/></th>
              <th className="px-4 py-3 font-semibold text-slate-600">Audit ID</th>
              <th className="px-4 py-3 font-semibold text-slate-600">Title</th>
              <th className="px-4 py-3 font-semibold text-slate-600">Type</th>
              <th className="px-4 py-3 font-semibold text-slate-600">Date</th>
              <th className="px-4 py-3 font-semibold text-slate-600">Auditor</th>
              <th className="px-4 py-3 font-semibold text-slate-600">Status</th>
              <th className="px-4 py-3 font-semibold text-slate-600 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {paginatedAudits.length > 0 ? (
              paginatedAudits.map((audit, index) => {
                const isLastFew = index >= paginatedAudits.length - 2 && paginatedAudits.length > 3;
                return (
                  <tr key={audit.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3"><input type="checkbox" checked={selectedIds.has(audit.id)} onChange={() => toggleSelect(audit.id)} className="rounded border-slate-300"/></td>
                    <td className="px-4 py-3 font-medium text-blue-700">{audit.id}</td>
                    <td className="px-4 py-3 text-slate-800 font-medium">{audit.title}</td>
                    <td className="px-4 py-3 text-slate-600">{audit.type}</td>
                    <td className="px-4 py-3 text-slate-600">{audit.date}</td>
                    <td className="px-4 py-3 text-slate-600">{audit.auditor}</td>
                    <td className="px-4 py-3"><span className={`inline-flex px-2 py-0.5 rounded text-xs font-bold ${audit.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'}`}>{audit.status.replace('_', ' ')}</span></td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2" ref={openActionMenuId === audit.id ? menuRef : null}>
                        <button onClick={() => onView(audit.id)} className="p-1.5 text-slate-400 hover:text-blue-600 rounded" title="View"><Eye className="w-4 h-4" /></button>
                        <div className="relative">
                          <button onClick={() => setOpenActionMenuId(openActionMenuId === audit.id ? null : audit.id)} className="p-1.5 text-slate-400 hover:text-slate-600 rounded">
                            <MoreHorizontal className="w-4 h-4" />
                          </button>
                          {openActionMenuId === audit.id && (
                            <div className={`absolute right-0 w-40 bg-white border rounded shadow-lg z-50 flex flex-col p-1 ${isLastFew ? 'bottom-full mb-1' : 'top-full mt-1'}`}>
                              <button onClick={() => { onEdit(audit.id); setOpenActionMenuId(null); }} className="px-3 py-2 hover:bg-slate-50 text-left text-sm flex items-center gap-2 rounded"><Edit className="w-4 h-4"/> Edit</button>
                              <button onClick={() => { setConfirmDelete({ ids: [audit.id], message: 'Delete?' }); setOpenActionMenuId(null); }} className="px-3 py-2 hover:bg-rose-50 text-left text-sm flex items-center gap-2 text-rose-600 rounded"><Trash2 className="w-4 h-4"/> Delete</button>
                              <button onClick={() => { handleExportClick([audit]); setOpenActionMenuId(null); }} className="px-3 py-2 hover:bg-slate-50 text-left text-sm flex items-center gap-2 rounded"><Download className="w-4 h-4"/> Export</button>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr><td colSpan={8} className="px-4 py-8 text-center text-slate-500">No records found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
      
      <div className="p-4 border-t border-slate-200 bg-slate-50 flex flex-col sm:flex-row justify-between items-center z-20 gap-4 mt-auto">
        <div className="flex items-center gap-4 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-600 whitespace-nowrap">Rows per page:</span>
            <select
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(Number(e.target.value))}
              className="px-2 py-1 border border-slate-300 rounded text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>
          <span className="text-xs font-medium text-slate-500 whitespace-nowrap">
            Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredAudits.length)} of {filteredAudits.length} entries
          </span>
        </div>
        <div className="flex gap-1 shrink-0">
          <button 
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))} 
            disabled={currentPage === 1} 
            className="flex items-center gap-1 px-3 py-1.5 rounded border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed text-xs font-semibold bg-white"
          >
            Previous
          </button>
          <span className="px-3 py-1.5 text-sm font-medium text-slate-700 border border-slate-200 rounded min-w-[2rem] text-center bg-white flex items-center justify-center">
            {currentPage}
          </span>
          <button 
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} 
            disabled={currentPage === totalPages || totalPages === 0} 
            className="flex items-center gap-1 px-3 py-1.5 rounded border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed text-xs font-semibold bg-white"
          >
            Next
          </button>
        </div>
      </div>

      {confirmDelete.ids && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50">
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg">
            <h3 className="font-bold">Confirm Action</h3>
            <p className="text-sm py-4">{confirmDelete.message}</p>
            <div className="flex justify-end gap-2">
              <button onClick={() => setConfirmDelete({ ids: null, message: '' })} className="px-3 py-1 border rounded">Cancel</button>
              <button onClick={handleConfirmDelete} className="px-3 py-1 bg-rose-600 text-white rounded">Delete</button>
            </div>
          </div>
        </div>
      )}

      {isExportModalOpen && (
        <ExportModal 
          onClose={() => setIsExportModalOpen(false)} 
          onExportPDF={exportPDF} 
          onExportCSV={exportExcel} 
        />
      )}
    </div>
  );
}
