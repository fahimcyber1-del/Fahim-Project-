import React, { useState, useRef, useEffect } from 'react';
import { QualityGoalRecord, GoalStatus, GoalCategory } from './types';
import { Search, Filter, PlusCircle, Eye, MoreHorizontal, ChevronDown, ChevronUp, FileText, Download, Edit, Trash2 } from 'lucide-react';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface QualityGoalListProps {
  records: QualityGoalRecord[];
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (idOrIds: string | string[]) => void;
  onNew: () => void;
}

export function QualityGoalList({ records, onView, onEdit, onDelete, onNew }: QualityGoalListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<GoalStatus | 'All'>('All');
  const [categoryFilter, setCategoryFilter] = useState<GoalCategory | 'All'>('All');

  const [openActionMenuId, setOpenActionMenuId] = useState<string | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
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
                          (record.owner && record.owner.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'All' || record.status === statusFilter;
    const matchesCategory = categoryFilter === 'All' || record.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Achieved': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'On Track': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'At Risk': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Off Track': return 'bg-rose-100 text-rose-800 border-rose-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
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
    onDelete(Array.from(selectedIds));
    setSelectedIds(new Set());
  };

  const handleExportPDF = (data: QualityGoalRecord[] = filteredRecords) => {
    const doc = new jsPDF();
    doc.text('Quality Goals Report', 14, 15);
    autoTable(doc, {
      head: [['ID', 'Title', 'Category', 'Target', 'Current', 'Status', 'Due Date']],
      body: data.map(r => [
        r.id, r.title, r.category, 
        `${r.targetValue}${r.unit}`, 
        `${r.currentValue}${r.unit}`, 
        r.status, r.endDate
      ]),
      startY: 20,
    });
    doc.save('quality_goals.pdf');
  };

  const handleExportExcel = (data: QualityGoalRecord[] = filteredRecords) => {
    const ws = XLSX.utils.json_to_sheet(data.map(r => ({
      ID: r.id, Title: r.title, Category: r.category, 
      Target: `${r.targetValue}${r.unit}`, Current: `${r.currentValue}${r.unit}`, 
      Status: r.status, StartDate: r.startDate, EndDate: r.endDate, Owner: r.owner || ''
    })));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Quality Goals');
    XLSX.writeFile(wb, 'quality_goals.xlsx');
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col h-full">
      <div className="border-b border-slate-200 px-6 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white">
        <h2 className="text-lg font-bold text-slate-900">Quality Goals List</h2>
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
              <PlusCircle className="w-4 h-4" /> New Goal
            </button>
        </div>
      </div>

      <div className="p-0 flex-1 overflow-hidden flex flex-col">
        {isFilterOpen && (
          <div className="p-4 border-b border-slate-100 bg-slate-50 space-y-4">
            <div className="flex flex-wrap gap-4 items-end">
              <div className="relative flex-1 min-w-[200px]">
                <label className="block text-xs font-semibold text-slate-600 mb-1">Search</label>
                <Search className="absolute left-2.5 top-4 sm:p-6 lg:p-8 h-4 w-4 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search goals..." 
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
                  <option value="On Track">On Track</option>
                  <option value="At Risk">At Risk</option>
                  <option value="Off Track">Off Track</option>
                  <option value="Achieved">Achieved</option>
                </select>
              </div>
              <div className="flex-1 min-w-[150px]">
                <label className="block text-xs font-semibold text-slate-600 mb-1">Category</label>
                <select 
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value as any)}
                  className="w-full px-3 py-2 border border-slate-300 rounded text-sm text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="All">All Categories</option>
                  <option value="Defect Rate">Defect Rate</option>
                  <option value="Customer Satisfaction">Customer Satisfaction</option>
                  <option value="Compliance">Compliance</option>
                  <option value="Process Efficiency">Process Efficiency</option>
                  <option value="Safety">Safety</option>
                  <option value="Other">Other</option>
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

      <div className="overflow-x-auto flex-1 h-full min-h-0 relative">
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
              <th className="px-6 py-4 font-semibold text-slate-600 text-xs uppercase tracking-wider">Goal ID</th>
              <th className="px-6 py-4 font-semibold text-slate-600 text-xs uppercase tracking-wider">Title & Category</th>
              <th className="px-6 py-4 font-semibold text-slate-600 text-xs uppercase tracking-wider">Progress</th>
              <th className="px-6 py-4 font-semibold text-slate-600 text-xs uppercase tracking-wider">Timeline</th>
              <th className="px-6 py-4 font-semibold text-slate-600 text-xs uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 font-semibold text-slate-600 text-xs uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
             {filteredRecords.map(record => (
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
                   <span className="font-medium text-slate-900">{record.id}</span>
                 </td>
                 <td className="px-6 py-4">
                   <div className="flex flex-col">
                     <span className="font-bold text-slate-900 whitespace-pre-wrap line-clamp-2 max-w-[250px]" title={record.title}>{record.title}</span>
                     <span className="text-[10px] uppercase font-bold text-slate-500 mt-0.5">{record.category}</span>
                   </div>
                 </td>
                 <td className="px-6 py-4">
                   <div className="flex flex-col gap-1 w-40">
                     <span className="text-sm font-semibold text-slate-800">
                       <span className="text-slate-500 font-normal">Cur:</span> {record.currentValue}{record.unit} {' '}
                       <span className="text-slate-500 font-normal ml-2">Tgt:</span> {record.targetValue}{record.unit}
                     </span>
                     {record.progress !== undefined && (
                       <div className="flex items-center gap-2">
                         <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                           <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${record.progress}%` }}></div>
                         </div>
                         <span className="text-[10px] font-bold text-indigo-600">{record.progress}%</span>
                       </div>
                     )}
                   </div>
                 </td>
                 <td className="px-6 py-4">
                   <div className="flex flex-col">
                     <span className="text-xs text-slate-600">Start: {record.startDate}</span>
                     <span className="text-xs text-slate-800 font-medium">Due: {record.endDate}</span>
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
                             <button onClick={(e) => { e.stopPropagation(); onDelete(record.id); setOpenActionMenuId(null); }} className="px-3 py-2 text-rose-600 hover:bg-rose-50 flex items-center gap-2 rounded">
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
                   No goals found matching your criteria.
                 </td>
               </tr>
             )}
          </tbody>
        </table>
      </div>
      </div>
      <div className="p-4 border-t border-slate-200 bg-slate-50 text-xs font-medium text-slate-500 flex justify-between items-center">
         <span>Showing {filteredRecords.length} of {records.length} goals</span>
      </div>
    </div>
  );
}
