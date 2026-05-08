import React, { useState, useEffect, useRef } from 'react';
import { MeetingRecord } from './types';
import { Search, Filter, FileText, Download, Edit, Trash2, Eye, Plus, ChevronDown, ChevronUp, MoreHorizontal, AlertTriangle, Users, Clock, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

interface MeetingMinutesListProps {
  records: MeetingRecord[];
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (ids: string[]) => void;
  onNew: () => void;
}

export function MeetingMinutesList({ records, onView, onEdit, onDelete, onNew }: MeetingMinutesListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [filterType, setFilterType] = useState<string>('All');
  const [dateFilter, setDateFilter] = useState<string>('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [openActionMenuId, setOpenActionMenuId] = useState<string | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);
  const [selectedRowId, setSelectedRowId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<{ ids: string[] | null, message: string }>({ ids: null, message: '' });
  const menuRef = useRef<HTMLDivElement>(null);
  const itemsPerPage = 8;
  
  const types = Array.from(new Set(records.map(r => r.type))).sort();

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
                          record.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'All' || record.status === filterStatus;
    const matchesType = filterType === 'All' || record.type === filterType;
    const matchesDate = dateFilter === '' || record.date === dateFilter;
    return matchesSearch && matchesStatus && matchesType && matchesDate;
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

  const handleDeleteSelected = () => {
    setConfirmDelete({ ids: Array.from(selectedIds), message: `Are you sure you want to delete ${selectedIds.size} records?` });
  };
  
  const handleConfirmBulkDelete = () => {
    if (confirmDelete.ids && confirmDelete.ids.length > 0) {
      onDelete(confirmDelete.ids);
      setSelectedIds(new Set());
    }
    setConfirmDelete({ ids: null, message: '' });
  };

  const exportPDF = (dataToExport: MeetingRecord[] = filteredRecords) => {
    const doc = new jsPDF();
    doc.text('Meeting Minutes Report', 14, 15);
    
    autoTable(doc, {
      startY: 20,
      head: [['ID', 'Date', 'Time', 'Type', 'Title', 'Status', 'Participants']],
      body: dataToExport.map(r => [
        r.id, 
        r.date, 
        r.time,
        r.type, 
        r.title, 
        r.status,
        r.participants.length.toString()
      ]),
    });
    
    doc.save('Meeting_Minutes_Report.pdf');
  };

  const exportExcel = (dataToExport: MeetingRecord[] = filteredRecords) => {
    const worksheet = XLSX.utils.json_to_sheet(dataToExport.map(r => ({
      ID: r.id,
      Date: r.date,
      Time: r.time,
      Type: r.type,
      Title: r.title,
      Objective: r.objective,
      Status: r.status,
      Participants: r.participants.length,
      FollowUpRequired: r.followUpRequired ? 'Yes' : 'No',
      NextMeetingDate: r.nextMeetingDate || 'N/A'
    })));
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Meeting Records');
    XLSX.writeFile(workbook, 'Meeting_Minutes_Report.xlsx');
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'Published': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'Draft': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Archived': return 'bg-slate-100 text-slate-700 border-slate-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="border border-slate-200 bg-white rounded-lg shadow-sm flex flex-col h-full min-h-0">
      <div className="border-b border-slate-200 px-6 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 flex-shrink-0">
        <h2 className="text-lg font-bold text-slate-900">Meeting Records</h2>
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
              onClick={onNew}
              className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" /> New Meeting
            </button>
          </div>
      </div>
      
      {/* Filters Area */}
      {isFilterOpen && (
        <div className="p-4 border-b border-slate-100 bg-slate-50 space-y-4 flex-shrink-0">
          <div className="flex flex-wrap gap-4 items-end">
            <div className="relative flex-1 min-w-[200px]">
              <label className="block text-xs font-semibold text-slate-600 mb-1">Search</label>
              <Search className="absolute left-2.5 top-4 sm:p-6 lg:p-8 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="ID, Title..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div className="flex-1 min-w-[150px]">
                <label className="block text-xs font-semibold text-slate-600 mb-1">Date</label>
                <input type="date" value={dateFilter} onChange={e => setDateFilter(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded text-sm text-slate-700" />
            </div>

            <div className="flex-1 min-w-[150px]">
              <label className="block text-xs font-semibold text-slate-600 mb-1">Status</label>
              <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded text-sm text-slate-700">
                  <option value="All">All Statuses</option>
                  <option value="Draft">Draft</option>
                  <option value="Published">Published</option>
                  <option value="Archived">Archived</option>
              </select>
            </div>
            
            <div className="flex-1 min-w-[150px]">
              <label className="block text-xs font-semibold text-slate-600 mb-1">Type</label>
              <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded text-sm text-slate-700">
                  <option value="All">All Types</option>
                  {types.map(t => <option key={t} value={t}>{t}</option>)}
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
                <Trash2 className="w-3.5 h-3.5" /> Delete Selected
              </button>
            </div>
          )}
        </div>
      )}

      {/* Table Area */}
      <div className="flex-1 overflow-auto min-h-0">
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
              <th className="px-4 py-3 font-semibold text-slate-600">Date/Time</th>
              <th className="px-4 py-3 font-semibold text-slate-600">Type</th>
              <th className="px-4 py-3 font-semibold text-slate-600 text-center">Participants</th>
              <th className="px-4 py-3 font-semibold text-slate-600 text-center">Status</th>
              <th className="px-4 py-3 font-semibold text-slate-600 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {paginatedRecords.length > 0 ? (
              paginatedRecords.map(record => (
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
                  <td className="px-4 py-3 font-medium text-slate-900 truncate max-w-[200px]" title={record.title}>{record.title}</td>
                  <td className="px-4 py-3 text-slate-500">
                     <div className="flex flex-col">
                        <span className="flex items-center gap-1 text-slate-700"><Calendar className="w-3 h-3 text-slate-400" /> {record.date}</span>
                        <span className="flex items-center gap-1 text-xs text-slate-500"><Clock className="w-3 h-3 text-slate-400" /> {record.time}</span>
                     </div>
                  </td>
                  <td className="px-4 py-3 text-slate-700">{record.type}</td>
                  <td className="px-4 py-3 text-center text-slate-700">
                    <span className="inline-flex items-center justify-center bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-full text-xs font-medium">
                      <Users className="w-3 h-3 mr-1" /> {record.participants.length}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${getStatusBadgeColor(record.status)}`}>
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
                          <div className="absolute right-0 mt-1 w-36 bg-white rounded-md shadow-lg border border-slate-200 z-50">
                            <div className="py-1">
                              <button
                                onClick={() => { setOpenActionMenuId(null); onEdit(record.id); }}
                                className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                              >
                                <Edit className="w-4 h-4" /> Edit
                              </button>
                              <button
                                onClick={() => { setOpenActionMenuId(null); setConfirmDelete({ ids: [record.id], message: 'Are you sure you want to delete this record?' }); }}
                                className="w-full text-left px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                              >
                                <Trash2 className="w-4 h-4" /> Delete
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="px-4 py-12 text-center text-slate-500">
                  <div className="flex flex-col items-center justify-center">
                    <AlertTriangle className="w-8 h-8 text-slate-300 mb-2" />
                    <p>No meeting records found.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination component logic */}
      {totalPages > 0 && (
        <div className="border-t border-slate-200 bg-slate-50 px-6 py-3 flex items-center justify-between flex-shrink-0">
          <div className="text-xs text-slate-500">
            Showing <span className="font-semibold text-slate-700">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-semibold text-slate-700">{Math.min(currentPage * itemsPerPage, filteredRecords.length)}</span> of <span className="font-semibold text-slate-700">{filteredRecords.length}</span> results
          </div>
          <div className="flex items-center gap-1">
            <button 
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1 rounded text-slate-500 hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronDown className="w-4 h-4 rotate-90" />
            </button>
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-6 h-6 flex items-center justify-center rounded text-xs font-semibold cursor-pointer transition-colors ${
                    currentPage === i + 1 ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <button 
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1 rounded text-slate-500 hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronDown className="w-4 h-4 -rotate-90" />
            </button>
          </div>
        </div>
      )}

      {/* Bulk Delete Confirmation Modal Component Logic */}
      {confirmDelete.ids && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-lg p-4 sm:p-6 max-w-sm w-full shadow-xl">
            <h3 className="text-lg font-bold text-slate-900 mb-2">Confirm Deletion</h3>
            <p className="text-slate-600 text-sm mb-6">{confirmDelete.message}</p>
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setConfirmDelete({ ids: null, message: '' })}
                className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 rounded border border-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleConfirmBulkDelete}
                className="px-4 py-2 text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded transition-colors"
              >
                Delete Records
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

