import React, { useState, useRef, useEffect } from 'react';
import { CapaRecord, CapaStatus, CapaSeverity, getStatusProgress } from './types';
import { Search, Filter, PlusCircle, Eye, MoreHorizontal, ChevronDown, ChevronUp, FileText, Download, Edit, Trash2 } from 'lucide-react';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface CapaListProps {
  records: CapaRecord[];
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (idOrIds: string | string[]) => void;
  onNew: () => void;
}

export function CapaList({ records, onView, onEdit, onDelete, onNew }: CapaListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<CapaStatus | 'All'>('All');
  const [severityFilter, setSeverityFilter] = useState<CapaSeverity | 'All'>('All');

  const [openActionMenuId, setOpenActionMenuId] = useState<string | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
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

  const filteredRecords = records.filter(record => {
    const matchesSearch = record.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          record.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          record.sourceReference?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || record.status === statusFilter;
    const matchesSeverity = severityFilter === 'All' || record.severity === severityFilter;
    return matchesSearch && matchesStatus && matchesSeverity;
  });

  const totalPages = Math.ceil(filteredRecords.length / itemsPerPage);
  const paginatedRecords = filteredRecords.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, severityFilter]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Closed': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Open': return 'bg-rose-100 text-rose-800 border-rose-200';
      case 'In Investigation': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Action Planned': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'In Progress': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'Under Review': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch(severity) {
      case 'Critical': return <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-rose-600 text-white">Critical</span>;
      case 'High': return <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-rose-100 text-rose-800">High</span>;
      case 'Medium': return <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-100 text-amber-800">Medium</span>;
      case 'Low': return <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-100 text-slate-600">Low</span>;
      default: return null;
    }
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredRecords.length && filteredRecords.length > 0) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredRecords.map(r => r.id)));
    }
  };

  const toggleSelect = (id: string) => {
    const newSelect = new Set(selectedIds);
    if (newSelect.has(id)) newSelect.delete(id);
    else newSelect.add(id);
    setSelectedIds(newSelect);
  };

  const handleDeleteSelected = () => {
    if (!window.confirm(`Are you sure you want to delete ${selectedIds.size} records?`)) return;
    onDelete(Array.from(selectedIds));
    setSelectedIds(new Set());
  };

  const handleExportPDF = (data: CapaRecord[] = filteredRecords) => {
    const doc = new jsPDF();
    doc.text('CAPA Report', 14, 15);
    autoTable(doc, {
      head: [['ID', 'Title', 'Source', 'Severity', 'Status', 'Target Date']],
      body: data.map(r => [
        r.id, r.title, r.source, r.severity, r.status, r.targetDate
      ]),
      startY: 20,
    });
    doc.save('capa_report.pdf');
  };

  const handleExportExcel = (data: CapaRecord[] = filteredRecords) => {
    const ws = XLSX.utils.json_to_sheet(data.map(r => ({
      ID: r.id, Title: r.title, Source: r.source, Ref: r.sourceReference || '',
      Severity: r.severity, Status: r.status, AssignedTo: r.assignedTo, TargetDate: r.targetDate
    })));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'CAPA');
    XLSX.writeFile(wb, 'capa_report.xlsx');
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex-1 flex flex-col min-h-0">
      <div className="border-b border-slate-200 px-4 py-3 flex flex-col sm:flex-row justify-end items-start sm:items-center gap-4 bg-white shrink-0">
        <div className="flex flex-wrap items-center gap-2">
            <button 
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="flex items-center gap-2 px-3 py-1.5 border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg transition-colors"
              >
               <Filter className="w-4 h-4" /> Filters {isFilterOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            <button 
              onClick={() => handleExportPDF()}
              className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors"
            >
              <FileText className="w-4 h-4" /> Export PDF
            </button>
            <button 
              onClick={() => handleExportExcel()}
              className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors"
            >
              <Download className="w-4 h-4" /> Export Excel
            </button>
            <button 
              onClick={onNew}
              className="flex items-center gap-2 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg transition-colors shadow-sm"
            >
              <PlusCircle className="w-4 h-4" /> Raise CAPA
            </button>
        </div>
      </div>

      <div className="p-0 flex-1 flex flex-col min-h-0 bg-white">
        {isFilterOpen && (
          <div className="p-4 border-b border-slate-100 bg-slate-50 space-y-4">
            <div className="flex flex-wrap gap-4 items-end">
              <div className="relative flex-1 min-w-[200px]">
                <label className="block text-xs font-semibold text-slate-600 mb-1">Search</label>
                <Search className="absolute left-2.5 top-4 sm:p-6 lg:p-8 h-4 w-4 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search title, ID, ref..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div className="flex-1 min-w-[150px]">
                <label className="block text-xs font-semibold text-slate-600 mb-1">Status</label>
                <select 
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="w-full px-3 py-2 border border-slate-300 rounded text-sm text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="All">All Status</option>
                  <option value="Open">Open</option>
                  <option value="In Investigation">In Investigation</option>
                  <option value="Action Planned">Action Planned</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Under Review">Under Review</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>
              <div className="flex-1 min-w-[150px]">
                <label className="block text-xs font-semibold text-slate-600 mb-1">Severity</label>
                <select 
                  value={severityFilter}
                  onChange={(e) => setSeverityFilter(e.target.value as any)}
                  className="w-full px-3 py-2 border border-slate-300 rounded text-sm text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="All">All Severities</option>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Critical">Critical</option>
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

      <div className="overflow-auto flex-1 min-h-0 relative bg-white">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-slate-50 border-b border-slate-200 top-0 sticky z-10">
            <tr>
              <th className="px-6 py-4 w-12 text-center">
                <input 
                  type="checkbox" 
                  checked={selectedIds.size === filteredRecords.length && filteredRecords.length > 0}
                  onChange={toggleSelectAll}
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
              </th>
              <th className="px-6 py-4 font-semibold text-slate-600 text-xs uppercase tracking-wider">CAPA ID</th>
              <th className="px-6 py-4 font-semibold text-slate-600 text-xs uppercase tracking-wider">Title & Source</th>
              <th className="px-6 py-4 font-semibold text-slate-600 text-xs uppercase tracking-wider">Severity</th>
              <th className="px-6 py-4 font-semibold text-slate-600 text-xs uppercase tracking-wider">Assignment</th>
              <th className="px-6 py-4 font-semibold text-slate-600 text-xs uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 font-semibold text-slate-600 text-xs uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
             {paginatedRecords.map(record => (
               <tr key={record.id} className="hover:bg-slate-50 transition-colors group cursor-pointer" onClick={() => onView(record.id)}>
                 <td className="px-6 py-4 text-center" onClick={(e) => e.stopPropagation()}>
                   <input 
                     type="checkbox" 
                     checked={selectedIds.has(record.id)}
                     onChange={() => toggleSelect(record.id)}
                     className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                   />
                 </td>
                 <td className="px-6 py-4">
                   <div className="flex flex-col">
                     <span className="font-medium text-slate-900">{record.id}</span>
                     <span className="text-[10px] text-slate-500 mt-0.5">{record.dateRaised}</span>
                   </div>
                 </td>
                 <td className="px-6 py-4">
                   <div className="flex flex-col">
                     <span className="font-bold text-slate-900 whitespace-normal line-clamp-2 min-w-[200px]" title={record.title}>{record.title}</span>
                     <span className="text-[10px] uppercase font-bold text-slate-500 mt-1">{record.source} {record.sourceReference ? `(${record.sourceReference})` : ''}</span>
                   </div>
                 </td>
                 <td className="px-6 py-4">
                   {getSeverityBadge(record.severity)}
                 </td>
                 <td className="px-6 py-4">
                   <div className="flex flex-col">
                     <span className="text-sm font-semibold text-slate-800">{record.assignedTo}</span>
                     <span className={`text-xs ${new Date(record.targetDate) < new Date() && record.status !== 'Closed' ? 'text-rose-600 font-bold' : 'text-slate-500'}`}>
                       Due: {record.targetDate}
                       {new Date(record.targetDate) < new Date() && record.status !== 'Closed' && ' (Overdue)'}
                     </span>
                   </div>
                 </td>
                 <td className="px-6 py-4">
                   <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold border ${getStatusColor(record.status)}`}>
                     {record.status}
                   </span>
                 </td>
                 <td className="px-6 py-4 text-right relative">
                    <div className="flex items-center justify-end gap-2" ref={openActionMenuId === record.id ? menuRef : null}>
                      <button onClick={(e) => { e.stopPropagation(); onView(record.id); }} className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded" title="View details">
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
                          <div className="absolute right-0 mt-1 w-40 bg-white border border-slate-200 rounded-md shadow-lg z-20 flex flex-col p-1 text-sm">
                            <button onClick={(e) => { e.stopPropagation(); onEdit(record.id); setOpenActionMenuId(null); }} className="px-3 py-2 text-slate-700 hover:bg-slate-50 flex items-center gap-2 rounded">
                                <Edit className="w-4 h-4" /> Edit
                             </button>
                             <button onClick={(e) => { e.stopPropagation(); handleExportPDF([record]); setOpenActionMenuId(null); }} className="px-3 py-2 text-slate-700 hover:bg-slate-50 flex items-center gap-2 rounded">
                                <FileText className="w-4 h-4" /> Export PDF
                             </button>
                             <button onClick={(e) => { e.stopPropagation(); handleExportExcel([record]); setOpenActionMenuId(null); }} className="px-3 py-2 text-slate-700 hover:bg-slate-50 flex items-center gap-2 rounded">
                                <Download className="w-4 h-4" /> Export Excel
                             </button>
                             <button onClick={(e) => { e.stopPropagation(); if (window.confirm('Are you sure you want to delete this record?')) onDelete(record.id); setOpenActionMenuId(null); }} className="px-3 py-2 text-rose-600 hover:bg-rose-50 flex items-center gap-2 rounded">
                                <Trash2 className="w-4 h-4" /> Delete
                             </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
               </tr>
             ))}
             {filteredRecords.length === 0 && (
               <tr>
                 <td colSpan={7} className="px-6 py-12 text-center text-slate-500 font-medium whitespace-normal">
                   No CAPA records found matching your criteria.
                 </td>
               </tr>
             )}
          </tbody>
        </table>
      </div>
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
            Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredRecords.length)} of {filteredRecords.length} entries
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
    </div>
  );
}
