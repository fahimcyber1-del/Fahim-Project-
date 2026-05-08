import React, { useState, useEffect, useRef } from 'react';
import { Buyer, Order } from './types';
import { Search, Filter, FileText, Download, Edit, Trash2, Eye, Plus, ChevronLeft, ChevronRight, MoreHorizontal, ChevronDown, ChevronUp } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

interface BuyersListProps {
  buyers: Buyer[];
  orders: Order[];
  onSave: (buyer: Buyer) => void;
  onDelete: (ids: string[]) => void;
}

export function BuyersList({ buyers, orders, onSave, onDelete }: BuyersListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [countryFilter, setCountryFilter] = useState<string>('All');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingBuyer, setEditingBuyer] = useState<Buyer | null>(null);

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [confirmDelete, setConfirmDelete] = useState<{ ids: string[] | null, message: string }>({ ids: null, message: '' });
  const [openActionMenuId, setOpenActionMenuId] = useState<string | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);
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

  useEffect(() => {
    setCurrentPage(1);
  }, [itemsPerPage, searchTerm, statusFilter, countryFilter]);

  const uniqueCountries = Array.from(new Set(buyers.map(b => b.country)));

  const handleConfirmDelete = () => {
    if (confirmDelete.ids && confirmDelete.ids.length > 0) {
      onDelete(confirmDelete.ids);
      setSelectedIds(new Set());
    }
    setConfirmDelete({ ids: null, message: '' });
  };

  const filteredBuyers = buyers.filter(b => {
    const matchesSearch = 
      b.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      b.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.contactPerson.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesStatus = statusFilter === 'All' || b.status === statusFilter;
    const matchesCountry = countryFilter === 'All' || b.country === countryFilter;

    return matchesSearch && matchesStatus && matchesCountry;
  });

  const totalPages = Math.ceil(filteredBuyers.length / itemsPerPage);
  const paginatedBuyers = filteredBuyers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const toggleSelectAll = () => {
    if (selectedIds.size === paginatedBuyers.length && paginatedBuyers.length > 0) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(paginatedBuyers.map(r => r.id)));
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

  const totalQuantityPerBuyer = (buyerId: string) => {
    return orders.filter(o => o.buyerId === buyerId).reduce((sum, o) => sum + o.quantity, 0);
  };

  const exportPDF = (dataToExport: Buyer[] = filteredBuyers) => {
    const doc = new jsPDF();
    doc.text('Buyers Report', 14, 15);
    
    autoTable(doc, {
      startY: 20,
      head: [['ID', 'Name', 'Country', 'Contact', 'Merchandiser', 'Email', 'Status', 'Orders', 'Total Pcs']],
      body: dataToExport.map(r => [
        r.id, 
        r.name,
        r.country, 
        r.contactPerson,
        r.merchandiserName || '',
        r.email, 
        r.status,
        r.totalOrders.toString(),
        totalQuantityPerBuyer(r.id).toLocaleString()
      ]),
    });
    
    doc.save('Buyers_Report.pdf');
  };

  const exportExcel = (dataToExport: Buyer[] = filteredBuyers) => {
    const worksheet = XLSX.utils.json_to_sheet(dataToExport.map(r => ({
      ID: r.id,
      Name: r.name,
      Country: r.country,
      'Contact Person': r.contactPerson,
      Merchandiser: r.merchandiserName || '',
      Email: r.email,
      Phone: r.phone,
      Status: r.status,
      Orders: r.totalOrders,
      'Total Pcs': totalQuantityPerBuyer(r.id)
    })));
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Buyers');
    XLSX.writeFile(workbook, 'Buyers_Report.xlsx');
  };

  const handleDeleteSelected = () => {
    setConfirmDelete({ ids: Array.from(selectedIds), message: `Are you sure you want to delete ${selectedIds.size} buyers? (Note: Multi-delete may require backend support)` });
  };

  const handleEdit = (buyer: Buyer) => {
    setEditingBuyer(buyer);
    setIsFormOpen(true);
  };

  const handleNew = () => {
    setEditingBuyer(null);
    setIsFormOpen(true);
  };

  if (isFormOpen) {
    return (
      <BuyerForm 
        buyer={editingBuyer} 
        onSave={(b) => { onSave(b); setIsFormOpen(false); }} 
        onCancel={() => setIsFormOpen(false)} 
      />
    );
  }

  return (
    <div className="border border-slate-200 bg-white rounded-lg shadow-sm">
      <div className="border-b border-slate-200 px-6 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-lg font-bold text-slate-900">Buyers List</h2>
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
              onClick={handleNew}
              className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" /> New Buyer
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
                  placeholder="Name, Country, Contact..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div className="flex-1 w-full sm:w-auto min-w-[150px]">
                <label className="block text-xs font-semibold text-slate-600 mb-1">Status</label>
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded text-sm text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500">
                    <option value="All">All Status</option>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                </select>
              </div>
              <div className="flex-1 w-full sm:w-auto min-w-[150px]">
                <label className="block text-xs font-semibold text-slate-600 mb-1">Country</label>
                <select value={countryFilter} onChange={(e) => setCountryFilter(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded text-sm text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500">
                    <option value="All">All Countries</option>
                    {uniqueCountries.map(c => <option key={c} value={c}>{c}</option>)}
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
                  className="w-full px-3 py-2 border border-slate-300 rounded text-sm text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
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
              <span className="text-xs font-semibold text-slate-600">Showing {filteredBuyers.length} records</span>
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

        {/* Table Area */}
        <div className="overflow-x-auto min-h-[400px] pb-48">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 w-12 text-center">
                  <input 
                    type="checkbox" 
                    checked={selectedIds.size === paginatedBuyers.length && paginatedBuyers.length > 0}
                    onChange={toggleSelectAll}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th className="px-4 py-3 font-semibold text-slate-600">ID</th>
                <th className="px-4 py-3 font-semibold text-slate-600">Logo</th>
                <th className="px-4 py-3 font-semibold text-slate-600">Buyer Name</th>
                <th className="px-4 py-3 font-semibold text-slate-600">Country</th>
                <th className="px-4 py-3 font-semibold text-slate-600">Contact</th>
                <th className="px-4 py-3 font-semibold text-slate-600">Merchandiser</th>
                <th className="px-4 py-3 font-semibold text-slate-600 text-center">Status</th>
                <th className="px-4 py-3 font-semibold text-slate-600 text-right">Orders</th>
                <th className="px-4 py-3 font-semibold text-slate-600 text-right">Total Pcs</th>
                <th className="px-4 py-3 font-semibold text-slate-600 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedBuyers.length > 0 ? (
                paginatedBuyers.map((buyer, index) => {
                  const isLastFew = index >= paginatedBuyers.length - 2 && paginatedBuyers.length > 3;
                  return (
                    <tr key={buyer.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 text-center">
                        <input 
                          type="checkbox" 
                          checked={selectedIds.has(buyer.id)}
                          onChange={() => toggleSelect(buyer.id)}
                          className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-4 py-3 font-medium text-slate-900">{buyer.id}</td>
                      <td className="px-4 py-3">
                           <div className="w-8 h-8 rounded-full border border-slate-200 bg-slate-100 overflow-hidden flex items-center justify-center">
                              {buyer.logo ? (
                                 <img src={buyer.logo} alt={buyer.name} className="w-full h-full object-cover" />
                              ) : (
                                 <span className="text-[10px] font-bold text-slate-400">{buyer.name.substring(0, 2).toUpperCase()}</span>
                              )}
                           </div>
                      </td>
                      <td className="px-4 py-3 font-bold text-slate-700">{buyer.name}</td>
                      <td className="px-4 py-3 text-slate-600">{buyer.country}</td>
                      <td className="px-4 py-3">
                        <p className="text-slate-900 font-medium">{buyer.contactPerson}</p>
                        <p className="text-[10px] text-slate-500">{buyer.email}</p>
                      </td>
                      <td className="px-4 py-3 text-slate-600 font-medium">
                        {buyer.merchandiserName || <span className="text-slate-400 italic font-normal">Not Assigned</span>}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`inline-flex px-2 py-0.5 rounded text-xs font-bold ${
                          buyer.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {buyer.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right font-medium text-slate-700">{buyer.totalOrders}</td>
                      <td className="px-4 py-3 text-right font-medium text-slate-700">{totalQuantityPerBuyer(buyer.id).toLocaleString()}</td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2" ref={openActionMenuId === buyer.id ? menuRef : null}>
                          <div className="relative">
                            <button 
                              onClick={() => setOpenActionMenuId(openActionMenuId === buyer.id ? null : buyer.id)} 
                              className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded"
                            >
                              <MoreHorizontal className="w-4 h-4" />
                            </button>
                            {openActionMenuId === buyer.id && (
                              <div className={`absolute right-0 w-40 bg-white border border-slate-200 rounded-md shadow-lg z-20 flex flex-col p-1 text-sm ${isLastFew ? 'bottom-full mb-1' : 'top-full mt-1'}`}>
                                 <button onClick={() => { handleEdit(buyer); setOpenActionMenuId(null); }} className="px-3 py-2 text-slate-700 hover:bg-slate-50 flex items-center gap-2 rounded">
                                    <Edit className="w-4 h-4" /> Edit
                                 </button>
                                 <button onClick={() => { exportPDF([buyer]); setOpenActionMenuId(null); }} className="px-3 py-2 text-slate-700 hover:bg-slate-50 flex items-center gap-2 rounded">
                                    <FileText className="w-4 h-4" /> Export PDF
                                 </button>
                                 <button onClick={() => { exportExcel([buyer]); setOpenActionMenuId(null); }} className="px-3 py-2 text-slate-700 hover:bg-slate-50 flex items-center gap-2 rounded">
                                    <Download className="w-4 h-4" /> Export Excel
                                 </button>
                                 <button onClick={() => { setConfirmDelete({ ids: [buyer.id], message: 'Are you sure you want to delete this buyer?' }); setOpenActionMenuId(null); }} className="px-3 py-2 text-rose-600 hover:bg-rose-50 flex items-center gap-2 rounded">
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
                  <td colSpan={9} className="px-4 py-8 text-center text-slate-500">
                    No buyers found matching your criteria.
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
              Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredBuyers.length)} of {filteredBuyers.length} entries
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

function BuyerForm({ buyer, onSave, onCancel }: { buyer: Buyer | null, onSave: (b: Buyer) => void, onCancel: () => void }) {
  const [formData, setFormData] = useState<Partial<Buyer>>(buyer || {
    id: `B-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
    name: '',
    country: '',
    contactPerson: '',
    email: '',
    phone: '',
    status: 'Active',
    totalOrders: 0,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData as Buyer);
  };

  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg border border-slate-200">
      <h3 className="text-lg font-bold text-slate-900 mb-6">{buyer ? 'Edit Buyer' : 'Add New Buyer'}</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Company Name *</label>
            <input required type="text" value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-3 py-2 border rounded" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Country *</label>
            <input required type="text" value={formData.country || ''} onChange={e => setFormData({...formData, country: e.target.value})} className="w-full px-3 py-2 border rounded" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Contact Person *</label>
            <input required type="text" value={formData.contactPerson || ''} onChange={e => setFormData({...formData, contactPerson: e.target.value})} className="w-full px-3 py-2 border rounded" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Email *</label>
            <input required type="email" value={formData.email || ''} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-3 py-2 border rounded" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Phone</label>
            <input type="text" value={formData.phone || ''} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full px-3 py-2 border rounded" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Assigned Merchandiser</label>
            <input type="text" value={formData.merchandiserName || ''} onChange={e => setFormData({...formData, merchandiserName: e.target.value})} placeholder="e.g. Sarah Smith" className="w-full px-3 py-2 border rounded" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Status</label>
            <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value as any})} className="w-full px-3 py-2 border rounded bg-white">
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
          <div className="md:col-span-1">
            <label className="block text-xs font-semibold text-slate-600 mb-1">Logo</label>
            <div className="flex items-center gap-2">
               <div className="flex-1">
                  <input type="text" value={formData.logo || ''} onChange={e => setFormData({...formData, logo: e.target.value})} placeholder="Logo URL or Browse..." className="w-full px-3 py-2 border border-slate-300 border-b-0 rounded-t text-sm" />
                  <input type="file" accept="image/*" onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => setFormData(prev => ({ ...prev, logo: reader.result as string }));
                      reader.readAsDataURL(file);
                    }
                  }} className="w-full px-2 py-1.5 border border-slate-300 rounded-b text-xs file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:bg-blue-50 file:text-blue-700" />
               </div>
               {formData.logo && formData.logo.startsWith('data:image') && (
                  <div className="w-12 h-12 flex-shrink-0 border border-slate-200 rounded overflow-hidden">
                    <img src={formData.logo} alt="Preview" className="w-full h-full object-cover" />
                  </div>
               )}
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-3 pt-4">
          <button type="button" onClick={onCancel} className="px-4 py-2 border rounded text-slate-600 hover:bg-slate-50">Cancel</button>
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Save</button>
        </div>
      </form>
    </div>
  );
}
