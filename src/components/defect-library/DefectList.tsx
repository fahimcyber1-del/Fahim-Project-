import React, { useState, useRef, useEffect } from 'react';
import { DefectItem } from './types';
import { Search, Plus, Download, Edit3, Trash2, Filter, FileText, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, Eye, MoreHorizontal, LayoutGrid, List, Image as ImageIcon } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { ExportModal, DefectExportOptions } from './ExportModal';

interface DefectListProps {
  records: DefectItem[];
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (ids: string[]) => void;
  onCreate: () => void;
}

export function DefectList({ records, onView, onEdit, onDelete, onCreate }: DefectListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [severityFilter, setSeverityFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportTarget, setExportTarget] = useState<DefectItem[] | null>(null);
  
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [openActionMenuId, setOpenActionMenuId] = useState<string | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);
  const menuRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    setCurrentPage(1);
  }, [itemsPerPage, searchTerm, categoryFilter, severityFilter, statusFilter]);

  const [confirmDelete, setConfirmDelete] = useState<{ ids: string[] | null, message: string }>({ ids: null, message: '' });

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenActionMenuId(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const categories = Array.from(new Set(records.map(r => r.category)));

  const filteredRecords = records.filter(record => {
    const matchesSearch = 
      record.code.toLowerCase().includes(searchTerm.toLowerCase()) || 
      record.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === 'All' || record.category === categoryFilter;
    const matchesSeverity = severityFilter === 'All' || record.severity === severityFilter;
    const matchesStatus = statusFilter === 'All' || record.status === statusFilter;
    
    return matchesSearch && matchesCategory && matchesSeverity && matchesStatus;
  });

  const totalPages = Math.ceil(filteredRecords.length / itemsPerPage);
  const paginatedRecords = filteredRecords.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const toggleSelectAll = () => {
    if (selectedIds.size === paginatedRecords.length && paginatedRecords.length > 0) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(paginatedRecords.map(r => r.id)));
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

  const handleConfirmDelete = () => {
    if (confirmDelete.ids && confirmDelete.ids.length > 0) {
      onDelete(confirmDelete.ids);
      setSelectedIds(new Set());
    }
    setConfirmDelete({ ids: null, message: '' });
  };

  const handleDeleteSelected = () => {
    setConfirmDelete({ ids: Array.from(selectedIds), message: `Are you sure you want to delete ${selectedIds.size} records?` });
  };

  const handleOpenExportModal = (target: DefectItem[] = filteredRecords) => {
    setExportTarget(target);
    setShowExportModal(true);
  };

  const handleExportPDF = (options: DefectExportOptions) => {
    const dataToExport = exportTarget || filteredRecords;
    const doc = new jsPDF();
    doc.text('Defect Library Report', 14, 15);
    
    autoTable(doc, {
      startY: 20,
      head: [['Code', 'Name', 'Category', 'Severity', 'Status']],
      body: dataToExport.map(r => [
        r.code, 
        r.name,
        r.category, 
        r.severity,
        r.status
      ]),
    });
    
    doc.save('Defect_Library.pdf');
  };

  const handleExportExcel = (options: DefectExportOptions) => {
    const dataToExport = exportTarget || filteredRecords;
    const worksheet = XLSX.utils.json_to_sheet(dataToExport.map(r => {
      const baseRow: any = {
        'Defect ID': r.id,
        Code: r.code,
        Name: r.name,
        Category: r.category,
      Severity: r.severity,
      Status: r.status,
      'Impacted Departments': r.impactedDepartments?.join(', '),
      'Standard Ref': r.qualityStandardRef,
      'SOP Link': r.sopLink,
    };
    
    if (options.includeRootCause) {
      baseRow['Root Cause'] = r.rootCauseAnalysis?.map(rc => `${rc.step}: ${rc.description}`).join(' | ') || '';
    }
    if (options.includeResolution) {
      baseRow['Corrective Action'] = r.correctiveAction || '';
      baseRow['Preventive Action'] = r.preventiveAction || '';
    }
    if (options.includeAcceptanceCriteria) {
      baseRow['Acceptance Criteria'] = r.acceptanceCriteria || '';
    }

    return baseRow;
  }));
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Defects');
    XLSX.writeFile(workbook, 'Defect_Library.xlsx');
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col h-full overflow-hidden">
      <div className="border-b border-slate-200 px-6 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-50">
        <h2 className="text-lg font-bold text-slate-900 flex-1">Defect Records</h2>
        <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center bg-slate-100 rounded-md p-1 mr-2">
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded transition-colors ${viewMode === 'list' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
                  title="List View"
                >
                  <List className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded transition-colors ${viewMode === 'grid' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
                  title="Grid View"
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
            </div>
            <button 
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="flex items-center gap-2 px-3 py-1.5 border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded transition-colors shadow-sm"
              >
               <Filter className="w-4 h-4" /> Filters {isFilterOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            <button 
              onClick={() => handleOpenExportModal()}
              className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded transition-colors shadow-sm"
            >
              <FileText className="w-4 h-4" /> Export
            </button>
            <button onClick={onCreate} className="flex items-center gap-2 px-4 py-1.5 bg-blue-700 text-white rounded font-semibold text-xs transition-colors shadow-sm hover:bg-blue-800">
               <Plus className="w-4 h-4" /> Register New Defect
            </button>
        </div>
      </div>

      {isFilterOpen && (
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 space-y-4">
          <div className="flex flex-wrap gap-4 items-end">
            <div className="relative flex-1 min-w-[200px]">
              <label className="block text-xs font-semibold text-slate-600 mb-1">Search</label>
              <Search className="absolute left-2.5 top-4 sm:p-6 lg:p-8 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Code or Name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white"
              />
            </div>
            
            <div className="flex-1 min-w-[150px]">
                <label className="block text-xs font-semibold text-slate-600 mb-1">Category</label>
                <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded text-sm text-slate-700 bg-white">
                    <option value="All">All Categories</option>
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
            </div>

            <div className="flex-1 min-w-[150px]">
                <label className="block text-xs font-semibold text-slate-600 mb-1">Severity</label>
                <select value={severityFilter} onChange={(e) => setSeverityFilter(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded text-sm text-slate-700 bg-white">
                    <option value="All">All Severities</option>
                    <option value="Critical">Critical</option>
                    <option value="Major">Major</option>
                    <option value="Minor">Minor</option>
                </select>
            </div>
            
            <div className="flex-1 min-w-[150px]">
                <label className="block text-xs font-semibold text-slate-600 mb-1">Status</label>
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded text-sm text-slate-700 bg-white">
                    <option value="All">All Statuses</option>
                    <option value="Active">Active</option>
                    <option value="Draft">Draft</option>
                    <option value="Archived">Archived</option>
                </select>
            </div>

            <div className="flex-1 min-w-[150px]">
                <label className="block text-xs font-semibold text-slate-600 mb-1">Show</label>
                <select value={itemsPerPage} onChange={(e) => setItemsPerPage(Number(e.target.value))} className="w-full px-3 py-2 border border-slate-300 rounded text-sm text-slate-700 bg-white">
                    <option value={10}>10 per page</option>
                    <option value={20}>20 per page</option>
                    <option value={50}>50 per page</option>
                    <option value={100}>100 per page</option>
                </select>
            </div>
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

      <div className="flex-1 overflow-auto bg-slate-50/50 min-h-[400px] pb-48">
        {viewMode === 'list' ? (
        <table className="w-full text-left border-collapse text-sm whitespace-nowrap bg-white">
          <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 font-bold sticky top-0 z-10 shadow-sm">
            <tr>
              <th className="px-4 py-3 w-12 text-center">
                <input 
                  type="checkbox" 
                  checked={selectedIds.size === paginatedRecords.length && paginatedRecords.length > 0}
                  onChange={toggleSelectAll}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
              </th>
              <th className="px-4 py-3">Defect Code</th>
              <th className="px-4 py-3">Defect Name</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Severity</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {paginatedRecords.length > 0 ? paginatedRecords.map((record, index) => {
              const isLastFew = index >= paginatedRecords.length - 2 && paginatedRecords.length > 3;
              return (
                <tr key={record.id} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="px-4 py-3 text-center">
                    <input 
                      type="checkbox" 
                      checked={selectedIds.has(record.id)}
                      onChange={() => toggleSelect(record.id)}
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-4 py-3 font-bold text-slate-700">{record.code}</td>
                  <td className="px-4 py-3 font-bold text-slate-900">{record.name}</td>
                  <td className="px-4 py-3">
                     <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">{record.category}</span>
                  </td>
                  <td className="px-4 py-3">
                     <span className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                       record.severity === 'Critical' ? 'bg-rose-100 text-rose-700' :
                       record.severity === 'Major' ? 'bg-amber-100 text-amber-700' :
                       'bg-slate-100 text-slate-700'
                     }`}>
                       {record.severity}
                     </span>
                  </td>
                  <td className="px-4 py-3 flex items-center gap-2 mt-1">
                     <div className={`w-2 h-2 rounded-full ${record.status === 'Active' ? 'bg-emerald-500' : record.status === 'Draft' ? 'bg-slate-400' : 'bg-red-500'}`} />
                     <span className="text-slate-700 font-medium">{record.status}</span>
                  </td>
                  <td className="px-4 py-3 text-right">
                     <div className="flex items-center justify-end gap-2" ref={openActionMenuId === record.id ? menuRef : null}>
                       <button 
                         onClick={() => onView(record.id)} 
                         className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                         title="View details"
                       >
                         <Eye className="w-4 h-4" />
                       </button>
                       <div className="relative">
                          <button 
                            onClick={(e) => { e.stopPropagation(); setOpenActionMenuId(openActionMenuId === record.id ? null : record.id); }} 
                            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded"
                          >
                            <MoreHorizontal className="w-4 h-4" />
                          </button>
                          {openActionMenuId === record.id && (
                            <div className={`absolute right-0 w-40 bg-white border border-slate-200 rounded-md shadow-lg z-50 flex flex-col p-1 text-sm text-left ${isLastFew ? 'bottom-full mb-1' : 'top-full mt-1'}`}>
                              <button onClick={() => { onEdit(record.id); setOpenActionMenuId(null); }} className="px-3 py-2 text-slate-700 hover:bg-slate-50 flex items-center gap-2 rounded">
                                  <Edit3 className="w-4 h-4" /> Edit
                                </button>
                                <button onClick={() => { handleOpenExportModal([record]); setOpenActionMenuId(null); }} className="px-3 py-2 text-slate-700 hover:bg-slate-50 flex items-center gap-2 rounded">
                                  <FileText className="w-4 h-4" /> Export
                                </button>
                                <button onClick={() => { setConfirmDelete({ ids: [record.id], message: 'Are you sure you want to delete this defect?' }); setOpenActionMenuId(null); }} className="px-3 py-2 text-rose-600 hover:bg-rose-50 flex items-center gap-2 rounded">
                                  <Trash2 className="w-4 h-4" /> Delete
                                </button>
                            </div>
                          )}
                        </div>
                     </div>
                  </td>
                </tr>
              );
            }) : (
              <tr>
                <td colSpan={7} className="p-12 text-center text-slate-500 font-medium">
                  No defect records found matching your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        ) : (
          <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {paginatedRecords.length > 0 ? paginatedRecords.map(record => (
              <div key={record.id} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow transition-shadow group relative flex flex-col">
                <div className="absolute top-2 left-2 z-10 bg-white/90 backdrop-blur rounded shadow-sm">
                   <input 
                      type="checkbox" 
                      checked={selectedIds.has(record.id)}
                      onChange={() => toggleSelect(record.id)}
                      className="m-2 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                   />
                </div>
                <div className="absolute top-2 right-2 z-10" ref={openActionMenuId === record.id ? menuRef : null}>
                   <button 
                     onClick={(e) => { e.stopPropagation(); setOpenActionMenuId(openActionMenuId === record.id ? null : record.id); }} 
                     className="p-1.5 text-slate-600 bg-white/90 backdrop-blur hover:bg-white rounded shadow-sm"
                   >
                     <MoreHorizontal className="w-4 h-4" />
                   </button>
                   {openActionMenuId === record.id && (
                     <div className="absolute right-0 mt-1 w-40 bg-white border border-slate-200 rounded-md shadow-lg z-20 flex flex-col p-1 text-sm text-left">
                         <button onClick={() => { onView(record.id); setOpenActionMenuId(null); }} className="px-3 py-2 text-slate-700 hover:bg-slate-50 flex items-center gap-2 rounded">
                            <Eye className="w-4 h-4" /> View
                         </button>
                         <button onClick={() => { onEdit(record.id); setOpenActionMenuId(null); }} className="px-3 py-2 text-slate-700 hover:bg-slate-50 flex items-center gap-2 rounded">
                            <Edit3 className="w-4 h-4" /> Edit
                         </button>
                         <button onClick={() => { handleOpenExportModal([record]); setOpenActionMenuId(null); }} className="px-3 py-2 text-slate-700 hover:bg-slate-50 flex items-center gap-2 rounded">
                            <FileText className="w-4 h-4" /> Export
                         </button>
                         <button onClick={() => { setConfirmDelete({ ids: [record.id], message: 'Are you sure you want to delete this defect?' }); setOpenActionMenuId(null); }} className="px-3 py-2 text-rose-600 hover:bg-rose-50 flex items-center gap-2 rounded">
                            <Trash2 className="w-4 h-4" /> Delete
                         </button>
                     </div>
                   )}
                </div>

                <div className="h-48 w-full bg-slate-100 flex items-center justify-center border-b border-slate-200 cursor-pointer overflow-hidden p-0" onClick={() => onView(record.id)}>
                  {(record.failCriteriaImages?.[0] || record.passReferenceImages?.[0]) ? (
                    <img src={record.failCriteriaImages?.[0] || record.passReferenceImages?.[0]} alt={record.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  ) : (
                    <ImageIcon className="w-10 h-10 text-slate-300" />
                  )}
                </div>
                
                <div className="p-4 flex-1 flex flex-col cursor-pointer" onClick={() => onView(record.id)}>
                  <div className="flex items-start justify-between mb-2 gap-2">
                    <div>
                      <h3 className="font-bold text-slate-900 line-clamp-1" title={record.name}>{record.name}</h3>
                      <p className="text-xs font-semibold text-slate-500 mt-0.5">{record.code}</p>
                    </div>
                    <span className={`shrink-0 inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                     record.severity === 'Critical' ? 'bg-rose-100 text-rose-700' :
                     record.severity === 'Major' ? 'bg-amber-100 text-amber-700' :
                     'bg-slate-100 text-slate-700'
                   }`}>
                     {record.severity}
                   </span>
                  </div>
                  
                  <div className="mt-auto pt-3 flex items-center justify-between">
                     <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                        {record.category}
                     </span>
                     <div className="flex items-center gap-1.5">
                        <div className={`w-2 h-2 rounded-full ${record.status === 'Active' ? 'bg-emerald-500' : record.status === 'Draft' ? 'bg-slate-400' : 'bg-red-500'}`} />
                        <span className="text-[10px] font-semibold text-slate-600 uppercase tracking-wider">{record.status}</span>
                     </div>
                  </div>
                </div>
              </div>
            )) : (
              <div className="col-span-full py-12 text-center text-slate-500 font-medium">
                No defect records found matching your filters.
              </div>
            )}
          </div>
        )}
      </div>
      
      {totalPages > 1 && (
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500 font-medium">
          <span>Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredRecords.length)} of {filteredRecords.length} entries</span>
          <div className="flex gap-1">
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-1.5 rounded border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="px-3 py-1.5 text-sm font-bold text-blue-700 bg-blue-50 border border-blue-200 rounded min-w-[2rem] text-center shadow-sm">
                {currentPage}
              </span>
              <button 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-1.5 rounded border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
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

