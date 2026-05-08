import React, { useState, useEffect, useRef } from 'react';
import { RootCauseRecord } from './types';
import { Search, Filter, AlertTriangle, Eye, Edit3, Trash2, Plus, ChevronLeft, ChevronRight, MoreHorizontal, ChevronDown, ChevronUp, FileText, Download, LayoutGrid, List } from 'lucide-react';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface RootCauseListProps {
  records: RootCauseRecord[];
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (ids: string[]) => void;
  onNew: () => void;
}

export function RootCauseList({ records, onView, onEdit, onDelete, onNew }: RootCauseListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [filterMethod, setFilterMethod] = useState<string>('All');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [confirmDelete, setConfirmDelete] = useState<{ ids: string[] | null, message: string }>({ ids: null, message: '' });
  const [openActionMenuId, setOpenActionMenuId] = useState<string | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
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

  const handleConfirmDelete = () => {
    if (confirmDelete.ids && confirmDelete.ids.length > 0) {
      onDelete(confirmDelete.ids);
      setSelectedIds(new Set());
    }
    setConfirmDelete({ ids: null, message: '' });
  };

  const filteredRecords = records.filter(record => {
    const matchesSearch = record.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          record.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          record.leadInvestigator.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'All' || record.status === filterStatus;
    const matchesMethod = filterMethod === 'All' || record.method === filterMethod;
    return matchesSearch && matchesStatus && matchesMethod;
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

  const toggleSelect = (id: string) => {
    const newSelect = new Set(selectedIds);
    if (newSelect.has(id)) {
      newSelect.delete(id);
    } else {
      newSelect.add(id);
    }
    setSelectedIds(newSelect);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Closed': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Completed': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'In Progress': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Draft': return 'bg-slate-100 text-slate-800 border-slate-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const handleExportPDF = (dataToExport: RootCauseRecord[] = filteredRecords) => {
    const doc = new jsPDF();
    doc.text('Root Cause Analysis Report', 14, 15);
    autoTable(doc, {
      startY: 20,
      head: [['ID', 'Title', 'Method', 'Status', 'Lead Investigator', 'Date']],
      body: dataToExport.map(r => [
        r.id, r.title, r.method, r.status, r.leadInvestigator, r.dateInitiated
      ]),
    });
    doc.save('rca_report.pdf');
  };

  const handleExportExcel = (dataToExport: RootCauseRecord[] = filteredRecords) => {
    const worksheet = XLSX.utils.json_to_sheet(dataToExport.map(r => ({
      ID: r.id,
      Title: r.title,
      Method: r.method,
      Status: r.status,
      LeadInvestigator: r.leadInvestigator,
      Date: r.dateInitiated,
      ProblemStatement: r.analysisData?.problemStatement || '',
      RootCause: r.analysisData?.rootCause || ''
    })));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, worksheet, 'RCA');
    XLSX.writeFile(wb, 'rca_report.xlsx');
  };

  const handleDeleteSelected = () => {
    setConfirmDelete({ ids: Array.from(selectedIds), message: `Are you sure you want to delete ${selectedIds.size} records?` });
  };

  return (
    <div className="border border-slate-200 bg-white rounded-lg shadow-sm flex flex-col h-full min-h-0">
      <div className="border-b border-slate-200 px-6 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 flex-shrink-0">
        <h2 className="text-lg font-bold text-slate-900">Root Cause Analysis List</h2>
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
                className="flex items-center gap-2 px-3 py-1.5 border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded transition-colors"
              >
               <Filter className="w-4 h-4" /> Filters {isFilterOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            <button 
              onClick={() => handleExportPDF()}
              className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded transition-colors"
            >
              <FileText className="w-4 h-4" /> Export PDF
            </button>
            <button 
              onClick={() => handleExportExcel()}
              className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded transition-colors"
            >
              <Download className="w-4 h-4" /> Export Excel
            </button>
            <button 
              onClick={onNew}
              className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" /> New RCA
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
                  placeholder="ID, Title, Investigator..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="flex-1 w-full sm:w-auto min-w-[150px]">
                <label className="block text-xs font-semibold text-slate-600 mb-1">Status</label>
                <select 
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="All">All Statuses</option>
                  <option value="Draft">Draft</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>
              <div className="flex-1 w-full sm:w-auto min-w-[150px]">
                <label className="block text-xs font-semibold text-slate-600 mb-1">Method</label>
                <select 
                  value={filterMethod}
                  onChange={(e) => setFilterMethod(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="All">All Methods</option>
                  <option value="5 Whys">5 Whys</option>
                  <option value="Fishbone (Ishikawa)">Fishbone</option>
                  <option value="Fault Tree Analysis">Fault Tree</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="flex-1 w-full sm:w-auto min-w-[150px]">
                <label className="block text-xs font-semibold text-slate-600 mb-1">Records per Page</label>
                <select 
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="w-full px-3 py-2 border border-slate-300 rounded text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                  <option value={75}>75</option>
                  <option value={100}>100</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2 border-t border-slate-200">
              <span className="text-xs font-semibold text-slate-600">Showing {filteredRecords.length} records</span>
              {selectedIds.size > 0 && (
                <>
                  <span className="text-slate-300">|</span>
                  <span className="text-xs font-semibold text-slate-600">{selectedIds.size} selected</span>
                  <button 
                    onClick={handleDeleteSelected}
                    className="flex items-center gap-1 px-2 py-1.5 bg-rose-100 text-rose-700 hover:bg-rose-200 text-xs font-semibold rounded transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Delete
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-auto min-h-0">
        {viewMode === 'list' ? (
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 border-b border-slate-200 sticky top-0 z-10">
              <tr>
                <th className="px-4 py-3 w-12 text-center">
                  <input 
                    type="checkbox" 
                    checked={selectedIds.size === paginatedRecords.length && paginatedRecords.length > 0}
                    onChange={toggleSelectAll}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th className="px-4 py-3 font-semibold text-slate-600">ID</th>
                <th className="px-4 py-3 font-semibold text-slate-600">Title</th>
                <th className="px-4 py-3 font-semibold text-slate-600 text-center">Status</th>
                <th className="px-4 py-3 font-semibold text-slate-600 text-center">Method</th>
                <th className="px-4 py-3 font-semibold text-slate-600">Lead Investigator</th>
                <th className="px-4 py-3 font-semibold text-slate-600 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
               {paginatedRecords.length > 0 ? (
                 paginatedRecords.map(record => (
                   <tr key={record.id} className="hover:bg-slate-50 transition-colors">
                     <td className="px-4 py-3 text-center">
                        <input 
                          type="checkbox" 
                          checked={selectedIds.has(record.id)}
                          onChange={() => toggleSelect(record.id)}
                          className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                        />
                      </td>
                     <td className="px-4 py-3 font-medium text-slate-900">{record.id}</td>
                     <td className="px-4 py-3">
                       <span className="font-medium text-slate-900">{record.title}</span>
                     </td>
                     <td className="px-4 py-3 text-center">
                       <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold border ${getStatusColor(record.status)}`}>
                         {record.status}
                       </span>
                     </td>
                     <td className="px-4 py-3 text-center">
                       <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600 uppercase tracking-wider">
                         {record.method}
                       </span>
                     </td>
                     <td className="px-4 py-3 text-slate-700">{record.leadInvestigator}</td>
                     <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2" ref={openActionMenuId === record.id ? menuRef : null}>
                          <button onClick={() => onView(record.id)} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded" title="View details">
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
                              <div className="absolute right-0 mt-1 w-40 bg-white border border-slate-200 rounded-md shadow-lg z-20 flex flex-col p-1 text-sm">
                                <button onClick={() => { setOpenActionMenuId(null); onEdit(record.id); }} className="px-3 py-2 text-slate-700 hover:bg-slate-50 flex items-center gap-2 rounded">
                                    <Edit3 className="w-4 h-4" /> Edit
                                 </button>
                                 <button onClick={() => { setOpenActionMenuId(null); handleExportPDF([record]); }} className="px-3 py-2 text-slate-700 hover:bg-slate-50 flex items-center gap-2 rounded">
                                    <FileText className="w-4 h-4" /> Export PDF
                                 </button>
                                 <button onClick={() => { setOpenActionMenuId(null); handleExportExcel([record]); }} className="px-3 py-2 text-slate-700 hover:bg-slate-50 flex items-center gap-2 rounded">
                                    <Download className="w-4 h-4" /> Export Excel
                                 </button>
                                 <button onClick={() => { setOpenActionMenuId(null); setConfirmDelete({ ids: [record.id], message: 'Are you sure you want to delete this RCA record?' }); }} className="px-3 py-2 text-rose-600 hover:bg-rose-50 flex items-center gap-2 rounded">
                                    <Trash2 className="w-4 h-4" /> Delete
                                 </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                   </tr>
                 ))
               ) : (
                 <tr>
                   <td colSpan={7} className="px-4 py-8 text-center text-slate-500">
                     No RCA records found matching your criteria.
                   </td>
                 </tr>
               )}
            </tbody>
          </table>
        ) : (
          <div className="p-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {paginatedRecords.length > 0 ? (
              paginatedRecords.map(record => (
                <div key={record.id} className="group bg-white border border-slate-200 hover:border-blue-300 rounded-xl p-5 shadow-sm hover:shadow transition-all flex flex-col relative">
                  <div className="absolute top-2 left-2 z-10 bg-white/90 backdrop-blur rounded shadow-sm">
                       <input 
                          type="checkbox" 
                          checked={selectedIds.has(record.id)}
                          onChange={() => toggleSelect(record.id)}
                          className="m-2 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                       />
                  </div>
                  <div className="flex justify-between items-start mb-3" ref={openActionMenuId === record.id ? menuRef : null}>
                    <div className="flex flex-col ml-8">
                       <span className="text-xs font-bold text-slate-500">{record.id}</span>
                       {record.relatedIssueId && (
                         <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 py-0.5 px-1.5 rounded mt-1 inline-block border border-indigo-100">
                           Related: {record.relatedIssueId}
                         </span>
                       )}
                    </div>
                    <div className="absolute top-2 right-2 z-10">
                       <button 
                         onClick={() => setOpenActionMenuId(openActionMenuId === record.id ? null : record.id)} 
                         className="p-1.5 text-slate-600 bg-white hover:bg-slate-100 rounded shadow-sm opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity"
                       >
                         <MoreHorizontal className="w-4 h-4" />
                       </button>
                       {openActionMenuId === record.id && (
                         <div className="absolute right-0 mt-1 w-40 bg-white border border-slate-200 rounded-md shadow-lg z-20 flex flex-col p-1 text-sm">
                           <button onClick={() => { onView(record.id); setOpenActionMenuId(null); }} className="px-3 py-2 text-slate-700 hover:bg-slate-50 flex items-center gap-2 rounded">
                              <Eye className="w-4 h-4" /> View
                           </button>
                           <button onClick={() => { onEdit(record.id); setOpenActionMenuId(null); }} className="px-3 py-2 text-slate-700 hover:bg-slate-50 flex items-center gap-2 rounded">
                              <Edit3 className="w-4 h-4" /> Edit
                           </button>
                           <button onClick={() => { handleExportPDF([record]); setOpenActionMenuId(null); }} className="px-3 py-2 text-slate-700 hover:bg-slate-50 flex items-center gap-2 rounded">
                              <FileText className="w-4 h-4" /> Export PDF
                           </button>
                           <button onClick={() => { handleExportExcel([record]); setOpenActionMenuId(null); }} className="px-3 py-2 text-slate-700 hover:bg-slate-50 flex items-center gap-2 rounded">
                              <Download className="w-4 h-4" /> Export Excel
                           </button>
                           <button onClick={() => { setConfirmDelete({ ids: [record.id], message: 'Are you sure you want to delete this RCA record?' }); setOpenActionMenuId(null); }} className="px-3 py-2 text-rose-600 hover:bg-rose-50 flex items-center gap-2 rounded">
                              <Trash2 className="w-4 h-4" /> Delete
                           </button>
                         </div>
                       )}
                    </div>
                  </div>

                  <div className="mb-4 flex-1 cursor-pointer" onClick={() => onView(record.id)}>
                    <h3 className="font-bold text-slate-900 text-lg leading-tight mb-2 line-clamp-2" title={record.title}>
                      {record.title}
                    </h3>
                  </div>

                  <div className="mt-auto pt-4 border-t border-slate-100 grid grid-cols-2 gap-4 cursor-pointer" onClick={() => onView(record.id)}>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider font-bold text-slate-500 mb-1">Status & Method</p>
                      <div className="flex flex-col gap-1.5 items-start">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${getStatusColor(record.status)}`}>
                          {record.status}
                        </span>
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-600 uppercase tracking-wider truncate">
                           {record.method}
                        </span>
                      </div>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider font-bold text-slate-500 mb-1">Lead Investigator</p>
                      <div className="text-xs font-medium text-slate-700 truncate" title={record.leadInvestigator}>
                        {record.leadInvestigator}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full py-12 text-center text-slate-500">
                No RCA records found matching your criteria.
              </div>
            )}
          </div>
        )}
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
  );
}

