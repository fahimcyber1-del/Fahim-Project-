import React, { useState, useEffect, useRef } from 'react';
import { CustomerComplaintRecord, ComplaintStatus, ComplaintSeverity } from './types';
import { Search, Filter, PlusCircle, Eye, MoreHorizontal, ChevronDown, ChevronUp, FileText, Download, Edit, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface CustomerComplaintsListProps {
  records: CustomerComplaintRecord[];
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string | string[]) => void;
  onNew: () => void;
}

export function CustomerComplaintsList({ records, onView, onEdit, onDelete, onNew }: CustomerComplaintsListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<ComplaintStatus | 'All'>('All');
  const [severityFilter, setSeverityFilter] = useState<ComplaintSeverity | 'All'>('All');
  const [dateFilter, setDateFilter] = useState<'All' | 'Last 7 Days' | 'Last 30 Days' | 'Custom'>('All');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');

  const [openActionMenuId, setOpenActionMenuId] = useState<string | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCurrentPage(1);
  }, [itemsPerPage, searchTerm, statusFilter, severityFilter, dateFilter, customStartDate, customEndDate]);

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
    const matchesSearch = record.customerName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          record.orderRef.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          record.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || record.status === statusFilter;
    const matchesSeverity = severityFilter === 'All' || record.severity === severityFilter;
    
    let matchesDate = true;
    if (dateFilter !== 'All' && record.dateReceived) {
      const recordDate = new Date(record.dateReceived);
      const today = new Date();
      if (dateFilter === 'Last 7 Days') {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(today.getDate() - 7);
        matchesDate = recordDate >= sevenDaysAgo && recordDate <= today;
      } else if (dateFilter === 'Last 30 Days') {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(today.getDate() - 30);
        matchesDate = recordDate >= thirtyDaysAgo && recordDate <= today;
      } else if (dateFilter === 'Custom') {
        if (customStartDate) {
          matchesDate = matchesDate && recordDate >= new Date(customStartDate);
        }
        if (customEndDate) {
          // Add 1 day to end date to include the whole day
          const end = new Date(customEndDate);
          end.setHours(23, 59, 59, 999);
          matchesDate = matchesDate && recordDate <= end;
        }
      }
    }

    return matchesSearch && matchesStatus && matchesSeverity && matchesDate;
  });

  const totalPages = Math.ceil(filteredRecords.length / itemsPerPage);
  const paginatedRecords = filteredRecords.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open': return 'bg-rose-100 text-rose-800 border-rose-200';
      case 'In Progress': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Resolved': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Closed': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'Critical': return <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-rose-600 text-white truncate">CRITICAL</span>;
      case 'High': return <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800 truncate">HIGH</span>;
      case 'Medium': return <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 truncate">MEDIUM</span>;
      case 'Low': return <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 truncate">LOW</span>;
      default: return null;
    }
  };

  const handleExportPDF = (dataToExport: CustomerComplaintRecord[] = filteredRecords) => {
    const doc = new jsPDF();
    doc.text('Customer Complaints Report', 14, 15);
    autoTable(doc, {
      head: [['ID', 'Date', 'Customer', 'Order Ref', 'Category', 'Severity', 'Status']],
      body: dataToExport.map(r => [
        r.id, r.dateReceived, r.customerName, r.orderRef, r.category, r.severity, r.status
      ]),
      startY: 20,
    });
    doc.save('customer_complaints.pdf');
  };

  const handleExportExcel = (dataToExport: CustomerComplaintRecord[] = filteredRecords) => {
    const ws = XLSX.utils.json_to_sheet(dataToExport.map(r => ({
      ID: r.id, Date: r.dateReceived, Customer: r.customerName, 
      Order: r.orderRef, Style: r.styleNo, Category: r.category, 
      Severity: r.severity, Status: r.status, AssignedTo: r.assignedTo || ''
    })));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Complaints');
    XLSX.writeFile(wb, 'customer_complaints.xlsx');
  };

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

  const handleDeleteSelected = () => {
    onDelete(Array.from(selectedIds));
    setSelectedIds(new Set());
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col h-full">
      <div className="border-b border-slate-200 px-6 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white">
        <h2 className="text-lg font-bold text-slate-900">Complaints List</h2>
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
              className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition-colors shadow-sm"
            >
              <PlusCircle className="w-4 h-4" /> New Complaint
            </button>
          </div>
      </div>

      <div className="p-0 flex-1 overflow-hidden flex flex-col">
        {isFilterOpen && (
          <div className="p-4 border-b border-slate-100 bg-slate-50 space-y-4">
            <div className="flex flex-wrap gap-4 items-end">
              <div className="relative flex-1 min-w-[200px]">
                <label className="block text-xs font-semibold text-slate-600 mb-1">Search Component</label>
                <Search className="absolute left-2.5 top-4 sm:p-6 lg:p-8 h-4 w-4 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search customer, order..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="flex-1 min-w-[150px]">
                <label className="block text-xs font-semibold text-slate-600 mb-1">Status</label>
                <select 
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="w-full px-3 py-2 border border-slate-300 rounded text-sm text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="All">All Status</option>
                  <option value="Open">Open</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>
              <div className="flex-1 min-w-[150px]">
                <label className="block text-xs font-semibold text-slate-600 mb-1">Severity</label>
                <select 
                  value={severityFilter}
                  onChange={(e) => setSeverityFilter(e.target.value as any)}
                  className="w-full px-3 py-2 border border-slate-300 rounded text-sm text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="All">All Severity</option>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>
              <div className="flex-1 min-w-[150px]">
                <label className="block text-xs font-semibold text-slate-600 mb-1">Date Received</label>
                <select 
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value as any)}
                  className="w-full px-3 py-2 border border-slate-300 rounded text-sm text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="All">All Time</option>
                  <option value="Last 7 Days">Last 7 Days</option>
                  <option value="Last 30 Days">Last 30 Days</option>
                  <option value="Custom">Custom Range</option>
                </select>
              </div>
              <div className="flex-1 min-w-[150px]">
                <label className="block text-xs font-semibold text-slate-600 mb-1">Items per Page</label>
                <select 
                  value={itemsPerPage}
                  onChange={(e) => setItemsPerPage(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-300 rounded text-sm text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
              </div>
              {dateFilter === 'Custom' && (
                <div className="flex-1 min-w-[250px] flex items-end gap-2">
                  <div className="flex-1">
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Start Date</label>
                    <input 
                      type="date" 
                      value={customStartDate}
                      onChange={(e) => setCustomStartDate(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded text-sm text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs font-semibold text-slate-600 mb-1">End Date</label>
                    <input 
                      type="date" 
                      value={customEndDate}
                      onChange={(e) => setCustomEndDate(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded text-sm text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              )}
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

      <div className="overflow-x-auto flex-1 h-full min-h-[400px] pb-48 relative">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-slate-50 border-b border-slate-200 top-0 sticky z-10">
            <tr>
              <th className="px-6 py-4 w-12 text-center">
                <input 
                  type="checkbox" 
                  checked={selectedIds.size === paginatedRecords.length && paginatedRecords.length > 0}
                  onChange={toggleSelectAll}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
              </th>
              <th className="px-6 py-4 font-semibold text-slate-600 text-xs uppercase tracking-wider">Complaint ID</th>
              <th className="px-6 py-4 font-semibold text-slate-600 text-xs uppercase tracking-wider">Date & Customer</th>
              <th className="px-6 py-4 font-semibold text-slate-600 text-xs uppercase tracking-wider">Reference Info</th>
              <th className="px-6 py-4 font-semibold text-slate-600 text-xs uppercase tracking-wider">Severity</th>
              <th className="px-6 py-4 font-semibold text-slate-600 text-xs uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 font-semibold text-slate-600 text-xs uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
             {paginatedRecords.map((record, index) => {
               const isLastFew = index >= paginatedRecords.length - 2 && paginatedRecords.length > 3;
               return (
                 <tr key={record.id} className="hover:bg-slate-50 transition-colors group cursor-pointer" onClick={() => onView(record.id)}>
                   <td className="px-6 py-4 text-center" onClick={(e) => e.stopPropagation()}>
                     <input 
                       type="checkbox" 
                       checked={selectedIds.has(record.id)}
                       onChange={() => toggleSelect(record.id)}
                       className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                     />
                   </td>
                   <td className="px-6 py-4">
                     <span className="font-medium text-slate-900">{record.id}</span>
                   </td>
                   <td className="px-6 py-4">
                     <div className="flex flex-col">
                       <span className="font-bold text-slate-900">{record.customerName}</span>
                       <span className="text-xs text-slate-500">{record.dateReceived}</span>
                     </div>
                   </td>
                   <td className="px-6 py-4">
                     <div className="flex flex-col">
                       <span className="text-sm font-medium text-slate-800">Ord: {record.orderRef}</span>
                       <span className="text-xs text-slate-500">Sty: {record.styleNo}</span>
                       <span className="text-[10px] uppercase font-bold text-slate-400 mt-1">{record.category}</span>
                     </div>
                   </td>
                   <td className="px-6 py-4">
                     {getSeverityBadge(record.severity)}
                   </td>
                   <td className="px-6 py-4">
                     <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold border ${getStatusColor(record.status)}`}>
                       {record.status}
                     </span>
                   </td>
                   <td className="px-6 py-4 text-right relative">
                      <div className="flex items-center justify-end gap-2" ref={openActionMenuId === record.id ? menuRef : null}>
                        <button onClick={(e) => { e.stopPropagation(); onView(record.id); }} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded" title="View details">
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
                            <div className={`absolute right-0 w-40 bg-white border border-slate-200 rounded-md shadow-lg z-50 flex flex-col p-1 text-sm ${isLastFew ? 'bottom-full mb-1' : 'top-full mt-1'}`}>
                              <button onClick={(e) => { e.stopPropagation(); onEdit(record.id); setOpenActionMenuId(null); }} className="px-3 py-2 text-slate-700 hover:bg-slate-50 flex items-center gap-2 rounded text-left">
                                  <Edit className="w-4 h-4" /> Edit
                               </button>
                               <button onClick={(e) => { e.stopPropagation(); handleExportPDF([record]); setOpenActionMenuId(null); }} className="px-3 py-2 text-slate-700 hover:bg-slate-50 flex items-center gap-2 rounded text-left">
                                  <FileText className="w-4 h-4" /> Export PDF
                               </button>
                               <button onClick={(e) => { e.stopPropagation(); handleExportExcel([record]); setOpenActionMenuId(null); }} className="px-3 py-2 text-slate-700 hover:bg-slate-50 flex items-center gap-2 rounded text-left">
                                  <Download className="w-4 h-4" /> Export Excel
                               </button>
                               <button onClick={(e) => { e.stopPropagation(); onDelete(record.id); setOpenActionMenuId(null); }} className="px-3 py-2 text-rose-600 hover:bg-rose-50 flex items-center gap-2 rounded text-left">
                                  <Trash2 className="w-4 h-4" /> Delete
                               </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                 </tr>
               );
             })}
             {paginatedRecords.length === 0 && (
               <tr>
                 <td colSpan={7} className="px-6 py-12 text-center text-slate-500 font-medium whitespace-normal">
                   No complaints found matching your criteria.
                 </td>
               </tr>
             )}
          </tbody>
        </table>
      </div>
      </div>
    <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-between items-center">
        <span className="text-xs font-medium text-slate-500">
          Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredRecords.length)} of {filteredRecords.length} entries
        </span>
        <div className="flex gap-1">
          <button 
            onClick={(e) => { e.stopPropagation(); setCurrentPage(p => Math.max(1, p - 1)); }}
            disabled={currentPage === 1}
            className="p-1.5 rounded border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="px-3 py-1.5 text-sm font-medium text-slate-700 border border-slate-200 rounded min-w-[2rem] text-center bg-white">
            {currentPage}
          </span>
          <button 
            onClick={(e) => { e.stopPropagation(); setCurrentPage(p => Math.min(totalPages, p + 1)); }}
            disabled={currentPage === totalPages}
            className="p-1.5 rounded border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
