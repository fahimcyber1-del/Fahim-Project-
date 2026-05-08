import React, { useState } from 'react';
import { InventoryItem } from './types';
import { Search, Plus, MoreVertical, Edit, FileText, Trash2, Box, ArrowDownLeft, ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react';
import * as XLSX from 'xlsx';

interface Props {
  items: InventoryItem[];
  onNew: () => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onTransaction: (id: string, type: 'Entry' | 'Issue') => void;
}

export function QualityInventoryList({ items, onNew, onEdit, onDelete, onTransaction }: Props) {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const filteredItems = items.filter(r => {
    const matchesSearch = r.itemName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || r.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const paginatedItems = filteredItems.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleExport = () => {
    const exportData = filteredItems.map(r => ({
      'ID': r.id,
      'Item Name': r.itemName,
      'Category': r.category,
      'Current Stock': r.currentStock,
      'Unit': r.unit,
      'Location': r.location,
      'Re-order Level': r.reorderLevel
    }));
    
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Stock Report');
    XLSX.writeFile(wb, 'Stock_Inventory_Report.xlsx');
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col h-full overflow-hidden">
      <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
           <div className="w-10 h-10 bg-indigo-50 border border-indigo-100 rounded-lg flex items-center justify-center text-indigo-600">
             <Box className="w-5 h-5" />
           </div>
           <div>
              <h2 className="text-lg font-bold text-slate-800">Inventory Items Master</h2>
              <p className="text-sm text-slate-500">{filteredItems.length} items registered</p>
           </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button onClick={handleExport} className="px-3 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors">
            Export
          </button>
          <button onClick={onNew} className="px-3 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors flex items-center gap-2">
            <Plus className="w-4 h-4" />
            New Item
          </button>
        </div>
      </div>

      <div className="p-4 bg-slate-50/50 border-b border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-3">
         <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search items by name..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
         </div>
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <label className="block text-xs font-semibold text-slate-500 mb-1">Category</label>
              <select 
                value={categoryFilter}
                onChange={e => { setCategoryFilter(e.target.value); setCurrentPage(1); }}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              >
                 <option value="All">All Categories</option>
                 <option value="Stationery">Stationery</option>
                 <option value="Electronics">Electronics</option>
                 <option value="Consumables">Consumables</option>
                 <option value="Tools">Tools</option>
                 <option value="Packaging">Packaging</option>
                 <option value="Other">Other</option>
              </select>
            </div>
            <div className="w-32">
              <label className="block text-xs font-semibold text-slate-500 mb-1">Items per page</label>
              <select 
                value={itemsPerPage}
                onChange={e => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>
          </div>
      </div>

      <div className="flex-1 overflow-auto min-h-[400px] pb-48">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 font-bold sticky top-0 z-10">
              <th className="p-4">Item Details</th>
              <th className="p-4">Category</th>
              <th className="p-4">Current Stock</th>
              <th className="p-4">Location</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {paginatedItems.length > 0 ? (
              paginatedItems.map((item, index) => {
                const isLastFew = index >= paginatedItems.length - 2 && paginatedItems.length > 3;
                return (
                  <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-slate-800 text-sm">{item.itemName}</div>
                      <div className="text-xs text-slate-500">{item.id}</div>
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs font-medium border border-slate-200">
                        {item.category}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className={`text-sm font-bold ${item.currentStock <= item.reorderLevel ? 'text-rose-600' : 'text-emerald-600'}`}>
                          {item.currentStock} <span className="text-xs font-normal text-slate-500">{item.unit}</span>
                        </div>
                        {item.currentStock <= item.reorderLevel && (
                          <span className="px-1.5 py-0.5 bg-rose-100 text-rose-700 rounded text-[10px] font-bold border border-rose-200">LOW</span>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm font-medium text-slate-700">{item.location}</div>
                    </td>
                    <td className="p-4 relative text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          title="Stock Issue (Out)"
                          onClick={() => onTransaction(item.id, 'Issue')}
                          className="px-2 py-1 bg-white border border-slate-200 text-rose-600 text-xs font-medium rounded hover:bg-rose-50 transition-colors flex items-center gap-1"
                        >
                           <ArrowUpRight className="w-3 h-3" /> Issue
                        </button>
                        <button 
                          title="Stock Entry (In)"
                          onClick={() => onTransaction(item.id, 'Entry')}
                          className="px-2 py-1 bg-white border border-slate-200 text-emerald-600 text-xs font-medium rounded hover:bg-emerald-50 transition-colors flex items-center gap-1"
                        >
                           <ArrowDownLeft className="w-3 h-3" /> Entry
                        </button>
                        <div className="relative">
                          <button 
                            onClick={() => setOpenMenuId(openMenuId === item.id ? null : item.id)}
                            className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-500 transition-colors ml-1"
                          >
                            <MoreVertical className="w-5 h-5" />
                          </button>
                          {openMenuId === item.id && (
                            <div className={`absolute right-0 w-48 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-50 ${isLastFew ? 'bottom-full mb-1' : 'top-full mt-1'}`}>
                              <button onClick={() => { onEdit(item.id); setOpenMenuId(null); }} className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2 rounded text-left">
                                <Edit className="w-4 h-4" /> Edit Record
                              </button>
                              <div className="h-px bg-slate-100 my-1 mx-2"></div>
                              <button onClick={() => { if(window.confirm('Delete this item completely?')) onDelete(item.id); setOpenMenuId(null); }} className="w-full px-4 py-2 text-left text-sm text-rose-600 hover:bg-rose-50 flex items-center gap-2 font-medium rounded text-left">
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
                   <td colSpan={5} className="p-4 sm:p-6 lg:p-8 text-center text-slate-500">
                      No inventory items found matching your filters.
                   </td>
                </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-between items-center">
            <span className="text-xs font-medium text-slate-500">
              Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredItems.length)} of {filteredItems.length} entries
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
      )}
    </div>
  );
}
