import React, { useState, useEffect, useRef } from 'react';
import { SubSupplierRecord, SupplierStatus, SupplierCategory } from './types';
import { Search, Filter, FileText, Download, Edit, Trash2, Eye, Plus, ChevronLeft, ChevronRight, MoreHorizontal, ChevronDown, ChevronUp, Star, LayoutGrid, List } from 'lucide-react';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface SubSuppliersListProps {
  records: SubSupplierRecord[];
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (ids: string[]) => void;
  onNew: () => void;
}

export function SubSuppliersList({ records, onView, onEdit, onDelete, onNew }: SubSuppliersListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<SupplierStatus | 'All'>('All');
  const [categoryFilter, setCategoryFilter] = useState<SupplierCategory | 'All'>('All');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const [confirmDelete, setConfirmDelete] = useState<{ ids: string[] | null, message: string }>({ ids: null, message: '' });
  const [openActionMenuId, setOpenActionMenuId] = useState<string | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCurrentPage(1);
  }, [itemsPerPage, searchTerm, statusFilter, categoryFilter]);

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
    const matchesSearch = 
      record.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      record.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.contactPerson.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'All' || record.status === statusFilter;
    const matchesCategory = categoryFilter === 'All' || record.category === categoryFilter;
    
    return matchesSearch && matchesStatus && matchesCategory;
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
      case 'Active': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Inactive': return 'bg-slate-100 text-slate-800 border-slate-200';
      case 'Pending Approval': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Blacklisted': return 'bg-rose-100 text-rose-800 border-rose-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const handleExportPDF = (dataToExport: SubSupplierRecord[] = filteredRecords) => {
    const doc = new jsPDF();
    doc.text('Sub Suppliers Report', 14, 15);
    autoTable(doc, {
      startY: 20,
      head: [['ID', 'Name', 'Category', 'Country', 'Rating', 'Risk', 'Status']],
      body: dataToExport.map(r => [
        r.id, r.name, r.category, r.country, r.rating.toString(), r.riskLevel, r.status
      ]),
    });
    doc.save('sub_suppliers_report.pdf');
  };

  const handleExportExcel = (dataToExport: SubSupplierRecord[] = filteredRecords) => {
    const ws = XLSX.utils.json_to_sheet(dataToExport.map(r => ({
      ID: r.id, Name: r.name, Category: r.category, Country: r.country, 
      Contact: r.contactPerson, Email: r.email, Rating: r.rating, 
      RiskLevel: r.riskLevel, Status: r.status, JoinDate: r.joinDate
    })));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Suppliers');
    XLSX.writeFile(wb, 'sub_suppliers_report.xlsx');
  };

  const handleDeleteSelected = () => {
    setConfirmDelete({ ids: Array.from(selectedIds), message: `Are you sure you want to delete ${selectedIds.size} records?` });
  };

  return (
    <div className="border border-slate-200 bg-white rounded-lg shadow-sm">
      <div className="border-b border-slate-200 px-6 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-lg font-bold text-slate-900">Sub Suppliers List</h2>
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
              <Plus className="w-4 h-4" /> New Supplier
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
                  placeholder="ID, Name, Contact..." 
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
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Pending Approval">Pending Approval</option>
                  <option value="Blacklisted">Blacklisted</option>
                </select>
              </div>
              <div className="flex-1 min-w-[150px]">
                <label className="block text-xs font-semibold text-slate-600 mb-1">Category</label>
                <select 
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value as any)}
                  className="w-full px-3 py-2 border border-slate-300 rounded text-sm text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="All">All Categories</option>
                  <option value="Fabric">Fabric</option>
                  <option value="Trims & Accessories">Trims & Accessories</option>
                  <option value="Packaging">Packaging</option>
                  <option value="Chemicals">Chemicals</option>
                  <option value="Service">Service</option>
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

        <div className="overflow-x-auto min-h-[400px] pb-48">
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
                <th className="px-4 py-3 font-semibold text-slate-600">Supplier</th>
                <th className="px-4 py-3 font-semibold text-slate-600">Category</th>
                <th className="px-4 py-3 font-semibold text-slate-600">Contact & Location</th>
                <th className="px-4 py-3 font-semibold text-slate-600">Rating & Risk</th>
                <th className="px-4 py-3 font-semibold text-slate-600 text-center">Status</th>
                <th className="px-4 py-3 font-semibold text-slate-600 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
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
                       <td className="px-4 py-3">
                         <div className="flex items-center gap-3">
                           {record.logoUrl ? (
                             <img src={record.logoUrl} alt="Logo" className="w-8 h-8 rounded object-cover flex-shrink-0" />
                           ) : (
                             <div className="w-8 h-8 rounded bg-blue-50 text-blue-600 flex items-center justify-center font-bold flex-shrink-0 text-xs">
                               {record.name.charAt(0)}
                             </div>
                           )}
                           <div className="flex flex-col">
                             <span className="font-bold text-slate-900">{record.name}</span>
                             <span className="text-xs font-medium text-slate-500">{record.id}</span>
                           </div>
                         </div>
                       </td>
                       <td className="px-4 py-3 flex items-center"><span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-700">{record.category}</span></td>
                       <td className="px-4 py-3">
                         <div className="flex flex-col">
                           <span className="text-sm font-medium text-slate-800">{record.contactPerson}</span>
                           <span className="text-xs text-slate-500">{record.country}</span>
                         </div>
                       </td>
                       <td className="px-4 py-3">
                         <div className="flex flex-col gap-1">
                           <div className="flex items-center gap-1 text-sm font-bold text-amber-500">
                             <Star className="w-4 h-4 fill-current" /> {record.rating}
                           </div>
                           <span className={`text-[10px] font-bold uppercase tracking-wider ${
                              record.riskLevel === 'Low' ? 'text-emerald-600' :
                              record.riskLevel === 'Medium' ? 'text-amber-600' :
                              'text-rose-600'
                           }`}>{record.riskLevel} Risk</span>
                         </div>
                       </td>
                       <td className="px-4 py-3 text-center">
                         <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold border ${getStatusColor(record.status)}`}>
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
                                  <button onClick={() => { setOpenActionMenuId(null); onEdit(record.id); }} className="px-3 py-2 text-slate-700 hover:bg-slate-50 flex items-center gap-2 rounded">
                                      <Edit className="w-4 h-4" /> Edit
                                   </button>
                                   <button onClick={() => { setOpenActionMenuId(null); handleExportPDF([record]); }} className="px-3 py-2 text-slate-700 hover:bg-slate-50 flex items-center gap-2 rounded">
                                      <FileText className="w-4 h-4" /> Export PDF
                                   </button>
                                   <button onClick={() => { setOpenActionMenuId(null); handleExportExcel([record]); }} className="px-3 py-2 text-slate-700 hover:bg-slate-50 flex items-center gap-2 rounded">
                                      <Download className="w-4 h-4" /> Export Excel
                                   </button>
                                   <button onClick={() => { setOpenActionMenuId(null); setConfirmDelete({ ids: [record.id], message: 'Are you sure you want to delete this record?' }); }} className="px-3 py-2 text-rose-600 hover:bg-rose-50 flex items-center gap-2 rounded">
                                      <Trash2 className="w-4 h-4" /> Delete
                                   </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                     </tr>
                   );
                 })
               ) : (
                 <tr>
                   <td colSpan={7} className="px-4 py-8 text-center text-slate-500">
                     No records found matching your criteria.
                   </td>
                 </tr>
               )}
            </tbody>
          </table>
          ) : (
            <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {paginatedRecords.length > 0 ? (
                paginatedRecords.map(record => (
                  <div key={record.id} className="border border-slate-200 rounded-lg overflow-hidden bg-white shadow-sm hover:shadow transition-shadow group relative flex flex-col">
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
                         onClick={() => setOpenActionMenuId(openActionMenuId === record.id ? null : record.id)} 
                         className="p-1.5 text-slate-600 bg-white/90 backdrop-blur hover:bg-white rounded shadow-sm"
                       >
                         <MoreHorizontal className="w-4 h-4" />
                       </button>
                       {openActionMenuId === record.id && (
                         <div className="absolute right-0 mt-1 w-40 bg-white border border-slate-200 rounded-md shadow-lg z-20 flex flex-col p-1 text-sm">
                             <button onClick={() => { onView(record.id); setOpenActionMenuId(null); }} className="px-3 py-2 text-slate-700 hover:bg-slate-50 flex items-center gap-2 rounded">
                                <Eye className="w-4 h-4" /> View
                             </button>
                             <button onClick={() => { onEdit(record.id); setOpenActionMenuId(null); }} className="px-3 py-2 text-slate-700 hover:bg-slate-50 flex items-center gap-2 rounded">
                                <Edit className="w-4 h-4" /> Edit
                             </button>
                             <button onClick={() => { handleExportPDF([record]); setOpenActionMenuId(null); }} className="px-3 py-2 text-slate-700 hover:bg-slate-50 flex items-center gap-2 rounded">
                                <FileText className="w-4 h-4" /> Export PDF
                             </button>
                             <button onClick={() => { handleExportExcel([record]); setOpenActionMenuId(null); }} className="px-3 py-2 text-slate-700 hover:bg-slate-50 flex items-center gap-2 rounded">
                                <Download className="w-4 h-4" /> Export Excel
                             </button>
                             <button onClick={() => { setConfirmDelete({ ids: [record.id], message: 'Are you sure you want to delete this record?' }); setOpenActionMenuId(null); }} className="px-3 py-2 text-rose-600 hover:bg-rose-50 flex items-center gap-2 rounded">
                                <Trash2 className="w-4 h-4" /> Delete
                             </button>
                         </div>
                       )}
                    </div>

                    <div className="h-48 w-full bg-slate-100 flex items-center justify-center border-b border-slate-200 cursor-pointer overflow-hidden p-4 sm:p-6" onClick={() => onView(record.id)}>
                      {record.logoUrl ? (
                        <img src={record.logoUrl} alt={record.name} className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300" />
                      ) : (
                        <div className="w-20 h-20 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-3xl shadow-sm">
                          {record.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    
                    <div className="p-4 flex-1 flex flex-col cursor-pointer" onClick={() => onView(record.id)}>
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1 mr-2">
                          <h3 className="font-bold text-slate-900 line-clamp-1" title={record.name}>{record.name}</h3>
                          <p className="text-xs font-medium text-slate-500">{record.id}</p>
                        </div>
                        <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold border ${getStatusColor(record.status)} shrink-0`}>
                            {record.status}
                        </span>
                      </div>
                      
                      <div className="mb-3 space-y-1">
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-700">{record.category}</span>
                          <p className="text-xs text-slate-600 line-clamp-1 pt-1">{record.contactPerson} &bull; {record.country}</p>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 mt-auto text-xs border-t border-slate-100 pt-3">
                        <div>
                          <p className="text-slate-500 uppercase font-semibold text-[10px]">Rating</p>
                          <div className="flex items-center gap-1 font-bold text-amber-500">
                             <Star className="w-3.5 h-3.5 fill-current" /> {record.rating}
                          </div>
                        </div>
                        <div>
                          <p className="text-slate-500 uppercase font-semibold text-[10px]">Risk Level</p>
                          <p className={`font-semibold ${
                            record.riskLevel === 'Low' ? 'text-emerald-600' :
                            record.riskLevel === 'Medium' ? 'text-amber-600' :
                            'text-rose-600'
                          }`}>{record.riskLevel}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full py-12 text-center text-slate-500">
                   No records found matching your criteria.
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
    </div>
  );
}

