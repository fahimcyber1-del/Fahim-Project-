import React, { useState, useEffect, useRef } from 'react';
import { QualityRecord } from './types';
import { Search, Filter, FileText, Download, Edit, Trash2, Eye, Plus, ChevronLeft, ChevronRight, MoreHorizontal, ChevronDown, ChevronUp } from 'lucide-react';
import { format } from 'date-fns';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { ExportModal, ProductionQualityExportOptions } from './ExportModal';

interface SummaryProps {
  records: QualityRecord[];
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (ids: string[]) => void;
  onCreate: () => void;
  initialLineFilter?: string;
  onClearInitialFilter?: () => void;
}

export function ProductionQualitySummary({ records, onView, onEdit, onDelete, onCreate, initialLineFilter = 'All', onClearInitialFilter }: SummaryProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [sectionFilter, setSectionFilter] = useState<string>('All');
  const [lineFilter, setLineFilter] = useState<string>(initialLineFilter);
  const [dateFilter, setDateFilter] = useState<string>('');
  const [buyerFilter, setBuyerFilter] = useState<string>('All');
  const [styleFilter, setStyleFilter] = useState<string>('All');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [openActionMenuId, setOpenActionMenuId] = useState<string | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);
  const [selectedRowId, setSelectedRowId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCurrentPage(1);
  }, [itemsPerPage, searchTerm, statusFilter, sectionFilter, lineFilter, dateFilter, buyerFilter, styleFilter]);

  const [confirmDelete, setConfirmDelete] = useState<{ ids: string[] | null, message: string }>({ ids: null, message: '' });

  useEffect(() => {
    if (initialLineFilter !== 'All') {
      setLineFilter(initialLineFilter);
      setIsFilterOpen(true);
      if (onClearInitialFilter) onClearInitialFilter();
    }
  }, [initialLineFilter, onClearInitialFilter]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenActionMenuId(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const sections = Array.from(new Set(records.map(r => r.section)));
  const lines = Array.from(new Set(records.map(r => r.line)));
  const buyers = Array.from(new Set(records.map(r => r.buyer)));
  const styles = Array.from(new Set(records.map(r => r.style)));
  
  const handleConfirmDelete = () => {
    if (confirmDelete.ids && confirmDelete.ids.length > 0) {
      onDelete(confirmDelete.ids);
      setSelectedIds(new Set());
    }
    setConfirmDelete({ ids: null, message: '' });
  };

  const filteredRecords = records.filter(record => {
    const matchesSearch = 
      record.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.style.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.line.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'All' || record.status === statusFilter;
    const matchesSection = sectionFilter === 'All' || record.section === sectionFilter;
    const matchesLine = lineFilter === 'All' || record.line === lineFilter;
    const matchesDate = dateFilter === '' || record.date === dateFilter;
    const matchesBuyer = buyerFilter === 'All' || record.buyer === buyerFilter;
    const matchesStyle = styleFilter === 'All' || record.style === styleFilter;
    
    return matchesSearch && matchesStatus && matchesSection && matchesLine && matchesDate && matchesBuyer && matchesStyle;
  });

  const totalPages = Math.ceil(filteredRecords.length / itemsPerPage);
  const paginatedRecords = filteredRecords.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const toggleSelectAll = () => {
    if (selectedIds.size === paginatedRecords.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(paginatedRecords.map(r => r.id)));
    }
  };

  const [showExportModal, setShowExportModal] = useState(false);
  const [exportTarget, setExportTarget] = useState<QualityRecord[] | null>(null);

  const toggleSelect = (id: string) => {
    const newSelect = new Set(selectedIds);
    if (newSelect.has(id)) {
      newSelect.delete(id);
    } else {
      newSelect.add(id);
    }
    setSelectedIds(newSelect);
  };

  const handleOpenExportModal = (target: QualityRecord[] = filteredRecords) => {
    setExportTarget(target);
    setShowExportModal(true);
  };

  const handleExportPDF = (options: any) => {
    const dataToExport = exportTarget || filteredRecords;
    const doc = new jsPDF();
    doc.text('Production Quality Report', 14, 15);
    
    autoTable(doc, {
      startY: 20,
      head: [['ID', 'Date', 'Unit', 'Line', 'Style', 'Inspected', 'Passed', 'DHU', 'RFT%', 'Status']],
      body: dataToExport.map(r => [
        r.id, 
        r.date, 
        r.unit,
        r.line, 
        r.style, 
        r.inspectedQuantity, 
        r.passedQuantity, 
        r.inspectedQuantity ? ((r.defectedQuantity / r.inspectedQuantity) * 100).toFixed(1) : '0',
        r.inspectedQuantity ? ((r.passedQuantity / r.inspectedQuantity) * 100).toFixed(1) + '%' : '0%',
        r.status
      ]),
    });
    
    doc.save('Production_Quality_Report.pdf');
  };

  const handleExportExcel = (options: any) => {
    const dataToExport = exportTarget || filteredRecords;
    const worksheet = XLSX.utils.json_to_sheet(dataToExport.map(r => {
      const baseRow: any = {
        ID: r.id,
        Date: r.date,
        Unit: r.unit,
        Line: r.line,
      };

      if (options?.includeGeneralDetails || !options) {
        baseRow['Style'] = r.style;
        baseRow['Buyer'] = r.buyer;
        baseRow['Color'] = r.color;
        baseRow['Size'] = r.size;
        baseRow['Inspected'] = r.inspectedQuantity;
        baseRow['Passed'] = r.passedQuantity;
        baseRow['Defected'] = r.defectedQuantity;
        baseRow['Status'] = r.status;
        baseRow['Reworked'] = r.reworkedQuantity;
        baseRow['Rejected'] = r.rejectedQuantity;
      }
      return baseRow;
    }));
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Quality Records');
    XLSX.writeFile(workbook, 'Production_Quality_Report.xlsx');
  };

  const handleDeleteSelected = () => {
    setConfirmDelete({ ids: Array.from(selectedIds), message: `Are you sure you want to delete ${selectedIds.size} records?` });
  };

  const getStatusBadgeColor = (status: string) => {
    switch(status) {
      case 'Passed': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'Rework': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Rejected': return 'bg-rose-100 text-rose-700 border-rose-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="border border-slate-200 bg-white rounded-lg shadow-sm">
      <div className="border-b border-slate-200 px-6 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-lg font-bold text-slate-900">Quality Records</h2>
        <div className="flex flex-wrap items-center gap-2">
            <button 
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="flex items-center gap-2 px-3 py-1.5 border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded transition-colors"
              >
               <Filter className="w-4 h-4" /> Filters {isFilterOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            <button 
              onClick={() => handleOpenExportModal()}
              className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded transition-colors"
            >
              <Download className="w-4 h-4" /> Export
            </button>
            <button 
              onClick={onCreate}
              className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" /> New Record
            </button>
          </div>
      </div>
      
      <div className="p-0">
        {/* Filters Area */}
        {isFilterOpen && (
          <div className="p-4 border-b border-slate-100 bg-slate-50 space-y-4">
            <div className="flex flex-wrap gap-4 items-end">
              <div className="relative flex-1 min-w-[200px]">
                <label className="block text-xs font-semibold text-slate-600 mb-1">Search</label>
                <Search className="absolute left-2.5 top-4 sm:p-6 lg:p-8 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="ID, Style..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div className="flex-1 min-w-[150px]">
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Date</label>
                  <input type="date" value={dateFilter} onChange={e => setDateFilter(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded text-sm" />
              </div>

              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-3 py-2 border border-slate-300 rounded text-sm text-slate-700">
                  <option value="All">All Status</option>
                  <option value="Passed">Passed</option>
                  <option value="Rework">Rework</option>
                  <option value="Rejected">Rejected</option>
              </select>
              
              <select value={sectionFilter} onChange={(e) => setSectionFilter(e.target.value)} className="px-3 py-2 border border-slate-300 rounded text-sm text-slate-700">
                  <option value="All">All Sections</option>
                  {sections.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              
              <select value={lineFilter} onChange={(e) => setLineFilter(e.target.value)} className="px-3 py-2 border border-slate-300 rounded text-sm text-slate-700">
                  <option value="All">All Lines</option>
                  {lines.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
              
              <select value={buyerFilter} onChange={(e) => setBuyerFilter(e.target.value)} className="px-3 py-2 border border-slate-300 rounded text-sm text-slate-700">
                  <option value="All">All Buyers</option>
                  {buyers.map(b => <option key={b} value={b}>{b}</option>)}
              </select>

              <select value={styleFilter} onChange={(e) => setStyleFilter(e.target.value)} className="px-3 py-2 border border-slate-300 rounded text-sm text-slate-700">
                  <option value="All">All Styles</option>
                  {styles.map(s => <option key={s} value={s}>{s}</option>)}
              </select>

              <select value={itemsPerPage} onChange={(e) => setItemsPerPage(Number(e.target.value))} className="px-3 py-2 border border-slate-300 rounded text-sm text-slate-700">
                  <option value={5}>5 per page</option>
                  <option value={10}>10 per page</option>
                  <option value={20}>20 per page</option>
                  <option value={50}>50 per page</option>
              </select>
            </div>
            
            {selectedIds.size > 0 && (
              <div className="flex items-center gap-2 pt-2 border-t border-slate-200">
                <span className="text-xs font-semibold text-slate-600">{selectedIds.size} selected</span>
                <button 
                  onClick={handleDeleteSelected}
                  className="flex items-center gap-1 px-2 py-1.5 bg-rose-100 text-rose-700 hover:bg-rose-200 text-xs font-semibold rounded transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Delete
                </button>
              </div>
            )}
          </div>
        )}

        {/* Table Area */}
        <div className="overflow-x-auto min-h-[400px] pb-48">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 w-12 text-center">
                  <input 
                    type="checkbox" 
                    checked={selectedIds.size === paginatedRecords.length && paginatedRecords.length > 0}
                    onChange={toggleSelectAll}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th className="px-4 py-3 font-semibold text-slate-600">Record ID</th>
                <th className="px-4 py-3 font-semibold text-slate-600">Date</th>
                <th className="px-4 py-3 font-semibold text-slate-600">Unit</th>
                <th className="px-4 py-3 font-semibold text-slate-600">Line</th>
                <th className="px-4 py-3 font-semibold text-slate-600">Buyer</th>
                <th className="px-4 py-3 font-semibold text-slate-600">Style</th>
                <th className="px-4 py-3 font-semibold text-slate-600 text-right">Inspected</th>
                <th className="px-4 py-3 font-semibold text-slate-600 text-right">RFT%</th>
                <th className="px-4 py-3 font-semibold text-slate-600 text-right">DHU</th>
                <th className="px-4 py-3 font-semibold text-slate-600 text-center">Status</th>
                <th className="px-4 py-3 font-semibold text-slate-600 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedRecords.length > 0 ? (
                paginatedRecords.map((record, index) => {
                  const isLastFew = index >= paginatedRecords.length - 2 && paginatedRecords.length > 3;
                  return (
                    <tr 
                      key={record.id} 
                      onClick={() => { setSelectedRowId(record.id); onView(record.id); }}
                      className={`cursor-pointer transition-colors ${selectedRowId === record.id ? 'bg-indigo-50/60' : 'hover:bg-slate-50'}`}
                    >
                      <td className="px-4 py-3 text-center" onClick={(e) => e.stopPropagation()}>
                        <input 
                          type="checkbox" 
                          checked={selectedIds.has(record.id)}
                          onChange={() => toggleSelect(record.id)}
                          className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-4 py-3 font-medium text-slate-900">{record.id}</td>
                      <td className="px-4 py-3 text-slate-500">{record.date}</td>
                      <td className="px-4 py-3 text-slate-700">{record.unit}</td>
                      <td className="px-4 py-3 text-slate-700">{record.line}</td>
                      <td className="px-4 py-3 text-slate-700">{record.buyer}</td>
                      <td className="px-4 py-3 text-slate-700">{record.style}</td>
                      <td className="px-4 py-3 text-right font-medium">{record.inspectedQuantity}</td>
                      <td className="px-4 py-3 text-right font-medium text-emerald-600">{record.inspectedQuantity ? ((record.passedQuantity / record.inspectedQuantity) * 100).toFixed(1) : 0}%</td>
                      <td className="px-4 py-3 text-right font-medium text-amber-600">{record.inspectedQuantity ? ((record.defectedQuantity / record.inspectedQuantity) * 100).toFixed(2) : 0}</td>
                      <td className="px-4 py-3 text-center">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold border ${getStatusBadgeColor(record.status)}`}>
                          {record.status}
                        </span>
                      </td>
                    <td className="px-4 py-3 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-2" ref={openActionMenuId === record.id ? menuRef : null}>
                          <button onClick={() => { setSelectedRowId(record.id); onView(record.id); }} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded" title="View details">
                            <Eye className="w-4 h-4" />
                          </button>
                          <div className="relative">
                            <button 
                              onClick={() => setOpenActionMenuId(openActionMenuId === record.id ? null : record.id)} 
                              className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded"
                            >
                              <MoreHorizontal className="w-4 h-4" />
                            </button>
                            {openActionMenuId === record.id && (
                              <div className={`absolute right-0 w-40 bg-white border border-slate-200 rounded-md shadow-lg z-50 flex flex-col p-1 text-sm ${isLastFew ? 'bottom-full mb-1' : 'top-full mt-1'}`}>
                                <button onClick={() => { onEdit(record.id); setOpenActionMenuId(null); }} className="px-3 py-2 text-slate-700 hover:bg-slate-50 flex items-center gap-2 rounded">
                                    <Edit className="w-4 h-4" /> Edit
                                 </button>
                                 <button onClick={() => { handleOpenExportModal([record]); setOpenActionMenuId(null); }} className="px-3 py-2 text-slate-700 hover:bg-slate-50 flex items-center gap-2 rounded">
                                    <Download className="w-4 h-4" /> Export
                                 </button>
                                 <button onClick={() => { setConfirmDelete({ ids: [record.id], message: 'Are you sure you want to delete this record?' }); setOpenActionMenuId(null); }} className="px-3 py-2 text-rose-600 hover:bg-rose-50 flex items-center gap-2 rounded">
                                    <Trash2 className="w-4 h-4" /> Delete
                                 </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td colSpan={11} className="px-4 py-8 text-center text-slate-500">
                    No records found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-500">
              Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredRecords.length)} of {filteredRecords.length} entries
            </span>
            <div className="flex gap-1">
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-1.5 rounded border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="px-3 py-1.5 text-sm font-medium text-slate-700 border border-slate-200 rounded min-w-[2rem] text-center">
                {currentPage}
              </span>
              <button 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-1.5 rounded border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Confirmation Dialog */}
        {confirmDelete.ids && (
          <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 max-w-sm w-full space-y-4">
              <h3 className="text-lg font-bold text-slate-900">Confirm Action</h3>
              <p className="text-sm text-slate-600">{confirmDelete.message}</p>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setConfirmDelete({ ids: null, message: '' })}
                  className="px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 rounded transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDelete}
                  className="px-4 py-2 text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded transition"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {showExportModal && (
        <ExportModal 
          onClose={() => setShowExportModal(false)}
          onExportPDF={handleExportPDF}
          onExportCSV={handleExportExcel}
        />
      )}
    </div>
  );
}
