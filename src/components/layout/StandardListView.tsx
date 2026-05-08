import React, { useState, useMemo } from 'react';
import { 
  Search, Filter, LayoutGrid, List, FileText, Download, 
  MoreVertical, Eye, Edit, Trash2, ChevronLeft, ChevronRight 
} from 'lucide-react';

interface Column<T> {
  header: string;
  accessor: keyof T | ((row: T) => React.ReactNode);
  renderer?: (row: T) => React.ReactNode;
}

interface StandardListViewProps<T> {
  title: string;
  description: string;
  data: T[];
  columns: Column<T>[];
  gridComponent?: React.FC<{ data: T, onAction: (action: string, id: string) => void }>;
  renderStatus?: (row: T) => React.ReactNode;
  idAccessor: (row: T) => string;
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onCreate: () => void;
  createButtonLabel?: string;
  filterableFields?: (keyof T)[];
}

export function StandardListView<T>({
  title,
  description,
  data,
  columns,
  gridComponent: GridCard,
  idAccessor,
  onView,
  onEdit,
  onDelete,
  onCreate,
  createButtonLabel = 'Create New',
  filterableFields = []
}: StandardListViewProps<T>) {
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  // Close dropdown on click outside
  React.useEffect(() => {
    const handleClickOutside = () => setActiveDropdown(null);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const filteredData = useMemo(() => {
    if (!searchTerm) return data;
    const lowerSearch = searchTerm.toLowerCase();
    return data.filter(item => {
      // Basic search implementation across values
      return Object.values(item as any).some(val => 
        String(val).toLowerCase().includes(lowerSearch)
      );
    });
  }, [data, searchTerm]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleDeleteClick = (id: string) => {
    if (window.confirm("Are you sure you want to delete this record? This action cannot be undone.")) {
      onDelete(id);
    }
    setActiveDropdown(null);
  };

  const handleGlobalExportExcel = () => {
    alert("Exporting up to 50 records to Excel...");
  };

  const handleGlobalExportPDF = () => {
    alert("Exporting up to 50 records to PDF...");
  };

  return (
    <div className="flex flex-col h-full bg-slate-50">
      {/* Header section */}
      <div className="flex-none p-4 sm:p-6 pb-4 bg-white border-b border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-black text-slate-900">{title}</h1>
            <p className="text-sm text-slate-500 mt-1">{description}</p>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={handleGlobalExportPDF}
              className="px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-2"
            >
               <FileText className="w-4 h-4 text-rose-500" /> Export PDF
            </button>
            <button 
              onClick={handleGlobalExportExcel}
              className="px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-2"
            >
               <Download className="w-4 h-4 text-emerald-500" /> Export Excel
            </button>
            <button 
              onClick={onCreate}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-colors"
            >
              {createButtonLabel}
            </button>
          </div>
        </div>

        {/* Toolbar: Search, Filters, View Toggles */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-slate-50 p-2 rounded-xl border border-slate-200">
           <div className="relative flex-1 max-w-md w-full">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
             <input 
                type="text"
                placeholder="Search records..."
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500 transition-colors"
             />
           </div>
           
           <div className="flex items-center gap-2 shrink-0">
              <button className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50">
                 <Filter className="w-4 h-4" /> Filter
              </button>
              
              <div className="flex bg-white rounded-lg border border-slate-300 p-0.5">
                 <button 
                    onClick={() => setViewMode('list')}
                    className={`p-1.5 rounded-md transition-colors ${viewMode === 'list' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-400 hover:text-slate-700 hover:bg-slate-50'}`}
                 >
                    <List className="w-4 h-4" />
                 </button>
                 <button 
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-400 hover:text-slate-700 hover:bg-slate-50'}`}
                 >
                    <LayoutGrid className="w-4 h-4" />
                 </button>
              </div>
           </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 min-h-0">
        
        {viewMode === 'list' ? (
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col h-full">
            <div className="overflow-x-auto flex-1 min-h-[300px] pb-24">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    {columns.map((col, idx) => (
                      <th key={idx} className="px-4 py-3 font-bold text-slate-600 uppercase tracking-wider text-xs">
                        {col.header}
                      </th>
                    ))}
                    <th className="px-4 py-3 font-bold text-slate-600 text-right uppercase tracking-wider text-xs w-24">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {paginatedData.map((row, index) => {
                    const id = idAccessor(row);
                    return (
                      <tr key={id} className="hover:bg-slate-50/50 transition-colors">
                        {columns.map((col, idx) => (
                          <td key={idx} className="px-4 py-3 text-slate-700">
                            {col.renderer ? col.renderer(row) : (typeof col.accessor === 'function' ? col.accessor(row) : row[col.accessor] as any)}
                          </td>
                        ))}
                        <td className="px-4 py-3 text-right sticky right-0 bg-white group-hover:bg-slate-50 transition-colors">
                          <button 
                            onClick={(e) => { e.stopPropagation(); onView(id); }}
                            className="p-1.5 mx-1 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors"
                          >
                             <Eye className="w-4 h-4" />
                          </button>
                          
                          <div className="inline-block relative">
                            <button 
                              onClick={(e) => { e.stopPropagation(); setActiveDropdown(activeDropdown === id ? null : id); }}
                              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded transition-colors"
                            >
                              <MoreVertical className="w-4 h-4" />
                            </button>
                            
                            {activeDropdown === id && (
                              <div className={`absolute right-0 ${index >= paginatedData.length - 2 && paginatedData.length > 3 ? 'bottom-full mb-1' : 'top-full mt-1'} w-48 bg-white border border-slate-200 rounded-lg shadow-xl z-50 py-1`} onClick={(e) => e.stopPropagation()}>
                                 <button onClick={() => { onEdit(id); setActiveDropdown(null); }} className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-indigo-600 flex items-center gap-2">
                                    <Edit className="w-4 h-4" /> Edit Record
                                 </button>
                                 <button onClick={() => alert('Exporting individual PDF')} className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2">
                                    <FileText className="w-4 h-4 text-rose-500" /> Export to PDF
                                 </button>
                                 <button onClick={() => alert('Exporting individual Excel')} className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2">
                                    <Download className="w-4 h-4 text-emerald-500" /> Export to Excel
                                 </button>
                                 <div className="h-px bg-slate-100 my-1 w-full" />
                                 <button onClick={() => handleDeleteClick(id)} className="w-full text-left px-4 py-2 text-sm font-semibold text-rose-600 hover:bg-rose-50 flex items-center gap-2">
                                    <Trash2 className="w-4 h-4" /> Delete Record
                                 </button>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {paginatedData.length === 0 && (
                    <tr>
                      <td colSpan={columns.length + 1} className="px-4 py-12 text-center text-slate-500">
                        No records found matching your filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-4 py-3 border-t border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-sm mt-auto">
               <div className="text-slate-500">
                 Showing <span className="font-semibold text-slate-900">{filteredData.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}</span> to <span className="font-semibold text-slate-900">{Math.min(currentPage * itemsPerPage, filteredData.length)}</span> of <span className="font-semibold text-slate-900">{filteredData.length}</span> entries
               </div>
               
               <div className="flex items-center gap-2">
                 <select 
                    value={itemsPerPage} 
                    onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
                    className="border border-slate-300 rounded px-2 py-1 text-slate-700 focus:outline-none focus:border-indigo-500 hidden sm:block"
                 >
                    <option value={10}>10 per page</option>
                    <option value={20}>20 per page</option>
                    <option value={50}>50 per page</option>
                 </select>
                 
                 <div className="flex bg-white border border-slate-300 rounded-md overflow-hidden">
                    <button 
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      className="p-1 px-2 hover:bg-slate-50 disabled:opacity-50 disabled:bg-slate-100 border-r border-slate-300 transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="px-3 py-1 font-semibold text-slate-700 border-r border-slate-300 bg-slate-50 min-w-[3rem] text-center">
                       {currentPage}
                    </span>
                    <button 
                      disabled={currentPage >= totalPages}
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      className="p-1 px-2 hover:bg-slate-50 disabled:opacity-50 disabled:bg-slate-100 transition-colors"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                 </div>
               </div>
            </div>
          </div>
        ) : (
          <div>
            {GridCard ? (
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {paginatedData.map(row => (
                    <GridCard 
                      key={idAccessor(row)} 
                      data={row} 
                      onAction={(action, id) => {
                         if (action === 'view') onView(id);
                         if (action === 'edit') onEdit(id);
                         if (action === 'delete') handleDeleteClick(id);
                         if (action === 'pdf') alert('Export PDF');
                         if (action === 'excel') alert('Export Excel');
                      }} 
                    />
                  ))}
               </div>
            ) : (
               <div className="p-12 text-center border-2 border-dashed border-slate-300 rounded-xl text-slate-500 bg-white">
                  <LayoutGrid className="w-8 h-8 text-slate-400 mx-auto mb-3" />
                  <p className="font-semibold text-slate-900">Grid View Not Provided</p>
                  <p className="text-sm mt-1">This module has not defined a grid view layout.</p>
               </div>
            )}
            
            {/* Grid Pagination */}
            {filteredData.length > itemsPerPage && (
               <div className="mt-6 flex justify-center">
                 <div className="flex bg-white border border-slate-300 rounded-md overflow-hidden shadow-sm">
                    <button 
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      className="p-2 px-3 hover:bg-slate-50 disabled:opacity-50 disabled:bg-slate-100 border-r border-slate-300 transition-colors text-slate-600"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="px-4 py-2 font-semibold text-slate-700 border-r border-slate-300 bg-slate-50">
                       Page {currentPage} of {totalPages}
                    </span>
                    <button 
                      disabled={currentPage >= totalPages}
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      className="p-2 px-3 hover:bg-slate-50 disabled:opacity-50 disabled:bg-slate-100 transition-colors text-slate-600"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                 </div>
               </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
