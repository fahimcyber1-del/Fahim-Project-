import React, { useState, useRef, useEffect } from 'react';
import { Equipment } from './types';
import { Search, Plus, Filter, FileText, Download, Eye, Edit, Trash2, ChevronLeft, ChevronRight, MoreHorizontal, ChevronDown, ChevronUp, LayoutGrid, List, Scale } from 'lucide-react';

interface EquipmentListProps {
  equipmentList: Equipment[];
  onView: (id: string) => void;
  onCreate: () => void;
  onDelete?: (id: string) => void;
}

export function EquipmentList({ equipmentList, onView, onCreate, onDelete }: EquipmentListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [openActionMenuId, setOpenActionMenuId] = useState<string | null>(null);

  useEffect(() => {
    setCurrentPage(1);
  }, [itemsPerPage, searchTerm, statusFilter]);

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

  const filteredRecords = equipmentList.filter(eq => {
    const matchesSearch = 
      eq.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
      eq.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      eq.serialNumber.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'All' || eq.status === statusFilter;

    return matchesSearch && matchesStatus;
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
      case 'ACTIVE': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'CALIBRATION_DUE': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'OUT_OF_SERVICE': return 'bg-rose-100 text-rose-700 border-rose-200';
      case 'INACTIVE': return 'bg-slate-100 text-slate-700 border-slate-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="border border-slate-200 bg-white rounded-lg shadow-sm">
      <div className="border-b border-slate-200 px-6 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Equipment List</h2>
          <p className="text-sm font-medium text-slate-500 mt-0.5">Manage lab equipment and calibration statuses</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
            <div className="flex bg-slate-100 p-1 rounded-md border border-slate-200 mr-2">
              <button 
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-sm transition-colors ${viewMode === 'list' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                title="List View"
              >
                <List className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-sm transition-colors ${viewMode === 'grid' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
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
              className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded transition-colors"
            >
              <Download className="w-4 h-4" /> Export CSV
            </button>
            <button 
              onClick={onCreate}
              className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" /> Add Equipment
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
                  placeholder="ID, Name, S/N..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="flex-1 min-w-[200px]">
                 <label className="block text-xs font-semibold text-slate-600 mb-1">Status</label>
                 <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded text-sm text-slate-700">
                     <option value="All">All Status</option>
                     <option value="ACTIVE">Active</option>
                     <option value="CALIBRATION_DUE">Calibration Due</option>
                     <option value="OUT_OF_SERVICE">Out of Service</option>
                     <option value="INACTIVE">Inactive</option>
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
                    if (window.confirm(`Are you sure you want to delete ${selectedIds.size} selected records?`)) {
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

        {/* Table/Grid Area */}
        {viewMode === 'list' ? (
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
                <th className="px-4 py-3 font-semibold text-slate-600">Equip. ID</th>
                <th className="px-4 py-3 font-semibold text-slate-600">Equipment Name</th>
                <th className="px-4 py-3 font-semibold text-slate-600">Serial No.</th>
                <th className="px-4 py-3 font-semibold text-slate-600">Location</th>
                <th className="px-4 py-3 font-semibold text-slate-600">Last Cal.</th>
                <th className="px-4 py-3 font-semibold text-slate-600">Next Cal.</th>
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
                      <td className="px-4 py-3 text-slate-700 font-semibold">{record.name}</td>
                      <td className="px-4 py-3 text-slate-600 text-xs font-mono">{record.serialNumber}</td>
                      <td className="px-4 py-3 text-slate-600">{record.location}</td>
                      <td className="px-4 py-3 text-slate-600">{record.lastCalibrationDate}</td>
                      <td className="px-4 py-3 text-slate-600">{record.nextCalibrationDate}</td>
                      <td className="px-4 py-3 text-center">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold border ${getStatusBadgeColor(record.status)}`}>
                          {record.status.replace('_', ' ')}
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
                                 <button onClick={() => { setOpenActionMenuId(null); onView(record.id); }} className="px-3 py-2 text-slate-700 hover:bg-slate-50 flex items-center gap-2 rounded text-left">
                                    <Edit className="w-4 h-4" /> Edit
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
                  <td colSpan={9} className="px-4 py-8 text-center text-slate-500">
                    No records found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        ) : (
          <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 min-h-[400px] content-start">
            {paginatedRecords.length > 0 ? (
              paginatedRecords.map(record => (
                <div key={record.id} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow flex flex-col relative group">
                  <div className="absolute top-4 right-4 z-10 flex gap-1">
                    <button onClick={() => onView(record.id)} className="p-1.5 bg-white/80 hover:bg-white text-slate-500 hover:text-blue-600 rounded shadow-sm border border-slate-200 transition-colors opacity-0 group-hover:opacity-100">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button onClick={() => { onView(record.id); }} className="p-1.5 bg-white/80 hover:bg-white text-slate-500 hover:text-blue-600 rounded shadow-sm border border-slate-200 transition-colors opacity-0 group-hover:opacity-100">
                      <Edit className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between mb-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${getStatusBadgeColor(record.status)}`}>
                      {record.status.replace('_', ' ')}
                    </span>
                    <input 
                      type="checkbox" 
                      checked={selectedIds.has(record.id)}
                      onChange={() => toggleSelect(record.id)}
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                  </div>
                  <div className="cursor-pointer" onClick={() => onView(record.id)}>
                    <div className="w-full h-32 bg-slate-100 rounded-md mb-3 flex items-center justify-center overflow-hidden">
                       {record.imageUrl ? <img src={record.imageUrl} alt={record.name} className="w-full h-full object-cover" /> : <Scale className="w-10 h-10 text-slate-300" />}
                    </div>
                  </div>
                  <div className="flex-1 space-y-2 cursor-pointer" onClick={() => onView(record.id)}>
                    <div>
                      <h3 className="font-bold text-slate-900 text-lg group-hover:text-blue-600 transition-colors leading-tight">{record.name}</h3>
                      <p className="text-xs font-mono text-slate-500 mt-1">{record.id} • {record.serialNumber}</p>
                    </div>
                    <div className="space-y-1.5 mt-4 pt-4 border-t border-slate-100">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-500">Location</span>
                        <span className="font-medium text-slate-800">{record.location}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-500">Last Calibrated</span>
                        <span className="font-medium text-slate-800">{record.lastCalibrationDate}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-500">Next Due</span>
                        <span className="font-medium text-slate-800">{record.nextCalibrationDate}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full py-12 text-center text-slate-500 flex flex-col items-center">
                <Search className="w-8 h-8 text-slate-300 mb-3" />
                No records found matching your criteria.
              </div>
            )}
          </div>
        )}

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
