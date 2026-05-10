import React, { useState, useRef, useEffect } from 'react';
import { TestRequest } from './types';
import { Search, Filter, FileText, Download, Edit, Trash2, Eye, Plus, ChevronLeft, ChevronRight, MoreHorizontal, ChevronDown, ChevronUp } from 'lucide-react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

interface TestListProps {
  records: TestRequest[];
  onView: (id: string) => void;
  onCreate: () => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export function TestList({ records, onView, onCreate, onEdit, onDelete }: TestListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All Categories');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  
  useEffect(() => {
    setCurrentPage(1);
  }, [itemsPerPage, searchTerm, categoryFilter, statusFilter]);

  const [openActionMenuId, setOpenActionMenuId] = useState<string | null>(null);
  
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

  const categories = Array.from(new Set(records.map(r => r.testCategory)));

  const filteredRecords = records.filter(r => {
    const matchesSearch = 
      r.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
      r.buyer.toLowerCase().includes(searchTerm.toLowerCase()) || 
      r.technician.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === 'All Categories' || r.testCategory === categoryFilter;
    const matchesStatus = statusFilter === 'All' || r.status === statusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
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

  const getStatusBadgeColor = (status: string) => {
    switch(status) {
      case 'COMPLETED': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'FAILED': return 'bg-rose-100 text-rose-700 border-rose-200';
      case 'IN-PROGRESS': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const exportPDF = (dataToExport: TestRequest[] = filteredRecords) => {
    const doc = new jsPDF();
    doc.text('Testing Log Report', 14, 15);
    
    autoTable(doc, {
      startY: 20,
      head: [['Request ID', 'Date', 'Buyer', 'Category', 'Technician', 'Status', 'Result']],
      body: dataToExport.map(r => [
        r.id, 
        r.date, 
        r.buyer, 
        r.testCategory, 
        r.technician, 
        r.status,
        r.overallResult || 'N/A'
      ]),
    });
    
    doc.save('Testing_Log_Report.pdf');
  };

  const exportExcel = (dataToExport: TestRequest[] = filteredRecords) => {
    const worksheet = XLSX.utils.json_to_sheet(dataToExport.map(r => ({
      'Request ID': r.id,
      Date: r.date,
      Buyer: r.buyer,
      Category: r.testCategory,
      Technician: r.technician,
      Status: r.status,
      'Overall Result': r.overallResult,
      'Turnaround Time': r.turnaroundTime,
      'Compliance Score': r.complianceScore,
      'Material Type': r.materialType,
      'Batch ID': r.batchId,
    })));
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'TestingLog');
    XLSX.writeFile(workbook, 'Testing_Log_Report.xlsx');
  };

  return (
    <div className="border border-slate-200 bg-white rounded-lg shadow-sm">
      <div className="border-b border-slate-200 px-6 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Testing Log</h2>
          <p className="text-sm font-medium text-slate-500 mt-0.5">Real-time laboratory testing and quality verification</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
            <button 
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="flex items-center gap-2 px-3 py-1.5 border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded transition-colors"
              >
               <Filter className="w-4 h-4" /> Filters {isFilterOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            <button 
              onClick={() => exportPDF()}
              className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded transition-colors"
            >
              <FileText className="w-4 h-4" /> Export PDF
            </button>
            <button 
              onClick={() => exportExcel()}
              className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded transition-colors"
            >
              <Download className="w-4 h-4" /> Export Excel
            </button>
            <button 
              onClick={onCreate}
              className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" /> New Test
            </button>
          </div>
      </div>
      
      <div className="p-0">
        {/* Filters Area */}
        {isFilterOpen && (
          <div className="p-4 border-b border-slate-100 bg-slate-50 space-y-4">
            <div className="flex flex-wrap gap-4 items-end">
              <div className="relative flex-1 min-w-[200px]">
                <label className="block text-xs font-semibold text-slate-600 mb-1">Search Keywords</label>
                <Search className="absolute left-2.5 top-4 sm:p-6 lg:p-8 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="ID, Buyer, Tech..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="flex-1 min-w-[200px]">
                 <label className="block text-xs font-semibold text-slate-600 mb-1">Category</label>
                 <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded text-sm text-slate-700">
                     <option value="All Categories">All Categories</option>
                     {categories.map(c => <option key={c} value={c}>{c}</option>)}
                 </select>
              </div>

              <div className="flex-1 min-w-[200px]">
                 <label className="block text-xs font-semibold text-slate-600 mb-1">Status</label>
                 <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded text-sm text-slate-700">
                     <option value="All">All Status</option>
                     <option value="COMPLETED">Completed</option>
                     <option value="PENDING">Pending</option>
                     <option value="IN-PROGRESS">In Progress</option>
                     <option value="FAILED">Failed</option>
                 </select>
              </div>

              <div className="flex-1 min-w-[200px]">
                 <label className="block text-xs font-semibold text-slate-600 mb-1">Items per Page</label>
                 <select value={itemsPerPage} onChange={(e) => setItemsPerPage(Number(e.target.value))} className="w-full px-3 py-2 border border-slate-300 rounded text-sm text-slate-700">
                     <option value={10}>10</option>
                     <option value={20}>20</option>
                     <option value={50}>50</option>
                     <option value={100}>100</option>
                 </select>
              </div>
            </div>
            
            {selectedIds.size > 0 && (
              <div className="flex items-center gap-2 pt-2 border-t border-slate-200">
                <span className="text-xs font-semibold text-slate-600">{selectedIds.size} selected</span>
                <button 
                  onClick={() => {
                    if(window.confirm(`Are you sure you want to delete ${selectedIds.size} selected records?`)) {
                      // Bulk delete logic would go here
                      setSelectedIds(new Set());
                    }
                  }}
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
                <th className="px-4 py-3 font-semibold text-slate-600">Request ID</th>
                <th className="px-4 py-3 font-semibold text-slate-600">Date/Time</th>
                <th className="px-4 py-3 font-semibold text-slate-600">Buyer</th>
                <th className="px-4 py-3 font-semibold text-slate-600">Category</th>
                <th className="px-4 py-3 font-semibold text-slate-600">Technician</th>
                <th className="px-4 py-3 font-semibold text-slate-600 text-center">Status</th>
                <th className="px-4 py-3 font-semibold text-slate-600 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedRecords.length > 0 ? (
                paginatedRecords.map((record, index) => {
                  const isLastFew = index >= paginatedRecords.length - 2 && paginatedRecords.length > 3;
                  return (
                    <tr key={record.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 text-center">
                        <input 
                          type="checkbox" 
                          checked={selectedIds.has(record.id)}
                          onChange={() => toggleSelect(record.id)}
                          className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-4 py-3 font-medium text-blue-700">{record.id}</td>
                      <td className="px-4 py-3 text-slate-600">{record.date}</td>
                      <td className="px-4 py-3 text-slate-700 font-medium">{record.buyer}</td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center px-2 py-0.5 rounded textxs font-bold bg-slate-100 text-slate-700 text-xs">
                          {record.testCategory}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {record.technicianInitials && record.technicianInitials !== '--' ? (
                            <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-[10px] font-bold">
                              {record.technicianInitials}
                            </div>
                          ) : null}
                          <span className={`font-medium ${record.technician === '-- Unassigned' ? 'text-slate-400 italic' : 'text-slate-700'}`}>
                            {record.technician}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold border ${getStatusBadgeColor(record.status)}`}>
                          {record.status}
                        </span>
                      </td>
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
                              <div className={`absolute right-0 w-40 bg-white border border-slate-200 rounded-md shadow-lg z-50 flex flex-col p-1 text-sm ${isLastFew ? 'bottom-full mb-1' : 'top-full mt-1'}`}>
                                 <button onClick={() => { onEdit?.(record.id); setOpenActionMenuId(null); }} className="px-3 py-2 text-slate-700 hover:bg-slate-50 flex items-center gap-2 rounded text-left">
                                    <Edit className="w-4 h-4" /> Edit
                                 </button>
                                 <button onClick={() => { exportPDF([record]); setOpenActionMenuId(null); }} className="px-3 py-2 text-slate-700 hover:bg-slate-50 flex items-center gap-2 rounded text-left">
                                    <FileText className="w-4 h-4" /> Export PDF
                                 </button>
                                 <button onClick={() => { exportExcel([record]); setOpenActionMenuId(null); }} className="px-3 py-2 text-slate-700 hover:bg-slate-50 flex items-center gap-2 rounded text-left">
                                    <Download className="w-4 h-4" /> Export Excel
                                 </button>
                                 <button onClick={() => { if(window.confirm('Are you sure you want to delete this record?')) onDelete?.(record.id); setOpenActionMenuId(null); }} className="px-3 py-2 text-rose-600 hover:bg-rose-50 flex items-center gap-2 rounded text-left">
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
                  <td colSpan={8} className="px-4 py-8 text-center text-slate-500">
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

      </div>
    </div>
  );
}
