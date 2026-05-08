import React, { useState, useEffect, useRef } from 'react';
import { Order, Buyer } from './types';
import { Search, Filter, FileText, Download, Edit, Trash2, Eye, Plus, ChevronLeft, ChevronRight, MoreHorizontal, ChevronDown, ChevronUp, LayoutGrid, List, Image as ImageIcon } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { OrderDetail } from './OrderDetail';

interface OrdersListProps {
  orders: Order[];
  buyers: Buyer[];
  onSave: (order: Order) => void;
  onDelete: (ids: string[]) => void;
  externalViewOrderId?: string | null;
  onExternalViewHandled?: () => void;
}

export function OrdersList({ orders, buyers, onSave, onDelete, externalViewOrderId, onExternalViewHandled }: OrdersListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [buyerFilter, setBuyerFilter] = useState<string>('All');
  const [poFilter, setPoFilter] = useState<string>('All');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [viewingOrder, setViewingOrder] = useState<Order | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);

  useEffect(() => {
    if (externalViewOrderId && !viewingOrder) {
      const order = orders.find(o => o.id === externalViewOrderId);
      if (order) {
        setViewingOrder(order);
        if (onExternalViewHandled) onExternalViewHandled();
      }
    }
  }, [externalViewOrderId, orders, viewingOrder, onExternalViewHandled]);
  
  useEffect(() => {
    setCurrentPage(1);
  }, [itemsPerPage, searchTerm, statusFilter, buyerFilter, poFilter]);
  
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [confirmDelete, setConfirmDelete] = useState<{ ids: string[] | null, message: string }>({ ids: null, message: '' });
  const [openActionMenuId, setOpenActionMenuId] = useState<string | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);
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

  const uniqueBuyers = Array.from(new Set(orders.map(o => o.buyerName)));
  const uniquePOs = Array.from(new Set(orders.filter(o => buyerFilter === 'All' || o.buyerName === buyerFilter).map(o => o.poArticleNumber)));

  const handleConfirmDelete = () => {
    if (confirmDelete.ids && confirmDelete.ids.length > 0) {
      onDelete(confirmDelete.ids);
      setSelectedIds(new Set());
    }
    setConfirmDelete({ ids: null, message: '' });
  };

  const filteredOrders = orders.filter(o => {
    const matchesSearch = 
      o.poArticleNumber.toLowerCase().includes(searchTerm.toLowerCase()) || 
      o.buyerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.styleNumber.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesStatus = statusFilter === 'All' || o.status === statusFilter;
    const matchesBuyer = buyerFilter === 'All' || o.buyerName === buyerFilter;
    const matchesPo = poFilter === 'All' || o.poArticleNumber === poFilter;

    return matchesSearch && matchesStatus && matchesBuyer && matchesPo;
  });

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const paginatedOrders = filteredOrders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const toggleSelect = (id: string) => {
    const newSelect = new Set(selectedIds);
    if (newSelect.has(id)) {
      newSelect.delete(id);
    } else {
      newSelect.add(id);
    }
    setSelectedIds(newSelect);
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === paginatedOrders.length && paginatedOrders.length > 0) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(paginatedOrders.map(r => r.id)));
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'Completed':
      case 'Shipped':
        return 'bg-emerald-100 text-emerald-700 ring-1 ring-inset ring-emerald-600/20';
      case 'In Production':
        return 'bg-blue-100 text-blue-700 ring-1 ring-inset ring-blue-600/20';
      case 'Cancelled':
        return 'bg-rose-100 text-rose-700 ring-1 ring-inset ring-rose-600/20';
      case 'Pending':
        return 'bg-amber-100 text-amber-800 ring-1 ring-inset ring-amber-600/20';
      default:
        return 'bg-slate-100 text-slate-700 ring-1 ring-inset ring-slate-600/20';
    }
  };

  const exportPDF = (dataToExport: Order[] = filteredOrders) => {
    const doc = new jsPDF();
    doc.text('Orders Report', 14, 15);
    
    autoTable(doc, {
      startY: 20,
      head: [['PO Number', 'Buyer', 'Style', 'Order Date', 'Delivery Date', 'Quantity', 'Status']],
      body: dataToExport.map(r => [
        r.poArticleNumber, 
        r.buyerName,
        r.styleNumber, 
        r.orderDate,
        r.deliveryDate, 
        r.quantity.toString(),
        r.status
      ]),
    });
    
    doc.save('Orders_Report.pdf');
  };

  const exportExcel = (dataToExport: Order[] = filteredOrders) => {
    const worksheet = XLSX.utils.json_to_sheet(dataToExport.map(r => ({
      ID: r.id,
      'PO/Article Number': r.poArticleNumber,
      Buyer: r.buyerName,
      'Style Number': r.styleNumber,
      'Order Date': r.orderDate,
      'Delivery Date': r.deliveryDate,
      Quantity: r.quantity,
      'Unit Price': r.unitPrice,
      'Total Amount': r.totalAmount,
      Status: r.status,
    })));
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Orders');
    XLSX.writeFile(workbook, 'Orders_Report.xlsx');
  };

  const handleDeleteSelected = () => {
    setConfirmDelete({ ids: Array.from(selectedIds), message: `Are you sure you want to delete ${selectedIds.size} orders?` });
  };

  const handleEdit = (order: Order) => {
    setEditingOrder(order);
    setIsFormOpen(true);
    setViewingOrder(null);
  };

  const handleNew = () => {
    setEditingOrder(null);
    setIsFormOpen(true);
    setViewingOrder(null);
  };
  
  if (viewingOrder) {
    return (
      <OrderDetail 
        order={viewingOrder} 
        onBack={() => setViewingOrder(null)} 
        onEdit={handleEdit} 
      />
    );
  }
  
  if (isFormOpen) {
    return (
      <OrderForm 
        order={editingOrder} 
        buyers={buyers}
        onSave={(o) => { onSave(o); setIsFormOpen(false); }} 
        onCancel={() => setIsFormOpen(false)} 
      />
    );
  }

  return (
    <div className="border border-slate-200 bg-white rounded-lg shadow-sm">
      <div className="border-b border-slate-200 px-6 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-lg font-bold text-slate-900">Orders List</h2>
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
              <Plus className="w-4 h-4" /> New Order
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
                  placeholder="PO, Style..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div className="flex-1 w-full sm:w-auto min-w-[150px]">
                <label className="block text-xs font-semibold text-slate-600 mb-1">Status</label>
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded text-sm text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500">
                    <option value="All">All Status</option>
                    <option value="Pending">Pending</option>
                    <option value="In Production">In Production</option>
                    <option value="Completed">Completed</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Cancelled">Cancelled</option>
                </select>
              </div>
              
              <div className="flex-1 w-full sm:w-auto min-w-[150px]">
                <label className="block text-xs font-semibold text-slate-600 mb-1">Buyer</label>
                <select 
                  value={buyerFilter} 
                  onChange={(e) => {
                    setBuyerFilter(e.target.value);
                    setPoFilter('All');
                  }} 
                  className="w-full px-3 py-2 border border-slate-300 rounded text-sm text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                    <option value="All">All Buyers</option>
                    {uniqueBuyers.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>
              
              <div className="flex-1 w-full sm:w-auto min-w-[150px]">
                <label className="block text-xs font-semibold text-slate-600 mb-1">PO / Article</label>
                <select value={poFilter} onChange={(e) => setPoFilter(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded text-sm text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500">
                    <option value="All">All POs/Articles</option>
                    {uniquePOs.map(po => <option key={po} value={po}>{po}</option>)}
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
              <span className="text-xs font-semibold text-slate-600">Showing {filteredOrders.length} records</span>
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

        {/* Table/Grid Area */}
        {viewMode === 'list' ? (
        <div className="overflow-x-auto min-h-[400px] pb-48">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 w-12 text-center">
                  <input 
                    type="checkbox" 
                    checked={selectedIds.size === paginatedOrders.length && paginatedOrders.length > 0}
                    onChange={toggleSelectAll}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th className="px-4 py-3 font-semibold text-slate-600">Image</th>
                <th className="px-4 py-3 font-semibold text-slate-600">PO/Article Number</th>
                <th className="px-4 py-3 font-semibold text-slate-600">Buyer</th>
                <th className="px-4 py-3 font-semibold text-slate-600">Style</th>
                <th className="px-4 py-3 font-semibold text-slate-600">Dates</th>
                <th className="px-4 py-3 font-semibold text-slate-600 text-right">Quantity</th>
                <th className="px-4 py-3 font-semibold text-slate-600 text-right">Total ($)</th>
                <th className="px-4 py-3 font-semibold text-slate-600 text-center">Status</th>
                <th className="px-4 py-3 font-semibold text-slate-600 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedOrders.length > 0 ? (
                paginatedOrders.map((order, index) => {
                  const isLastFew = index >= paginatedOrders.length - 2 && paginatedOrders.length > 3;
                  return (
                    <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 text-center">
                        <input 
                          type="checkbox" 
                          checked={selectedIds.has(order.id)}
                          onChange={() => toggleSelect(order.id)}
                          className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <div className="w-10 h-10 rounded border border-slate-200 bg-slate-100 overflow-hidden flex items-center justify-center flex-shrink-0">
                          {order.productImage ? (
                            <img src={order.productImage} alt={order.styleNumber} className="w-full h-full object-cover" />
                          ) : (
                            <ImageIcon className="w-4 h-4 text-slate-400" />
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 font-medium text-slate-900">{order.poArticleNumber}</td>
                      <td className="px-4 py-3 font-bold text-slate-700">{order.buyerName}</td>
                      <td className="px-4 py-3 text-slate-600">{order.styleNumber}</td>
                      <td className="px-4 py-3 text-[10px]">
                        <p><span className="font-semibold">Ord:</span> {order.orderDate}</p>
                        <p><span className="font-semibold text-rose-600">Del: {order.deliveryDate}</span></p>
                      </td>
                      <td className="px-4 py-3 text-right font-medium text-slate-700">{order.quantity.toLocaleString()}</td>
                      <td className="px-4 py-3 text-right text-emerald-600 font-bold">${order.totalAmount.toLocaleString()}</td>
                      <td className="px-4 py-3 text-center">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${getStatusBadgeClass(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2" ref={openActionMenuId === order.id ? menuRef : null}>
                          <button
                            onClick={() => setViewingOrder(order)}
                            className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <div className="relative">
                            <button 
                              onClick={() => setOpenActionMenuId(openActionMenuId === order.id ? null : order.id)} 
                              className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded"
                            >
                              <MoreHorizontal className="w-4 h-4" />
                            </button>
                            {openActionMenuId === order.id && (
                              <div className={`absolute right-0 w-40 bg-white border border-slate-200 rounded-md shadow-lg z-50 flex flex-col p-1 text-sm ${isLastFew ? 'bottom-full mb-1' : 'top-full mt-1'}`}>
                                 <button onClick={() => { handleEdit(order); setOpenActionMenuId(null); }} className="px-3 py-2 text-slate-700 hover:bg-slate-50 flex items-center gap-2 rounded text-left">
                                    <Edit className="w-4 h-4" /> Edit
                                 </button>
                                 <button onClick={() => { exportPDF([order]); setOpenActionMenuId(null); }} className="px-3 py-2 text-slate-700 hover:bg-slate-50 flex items-center gap-2 rounded text-left">
                                    <FileText className="w-4 h-4" /> Export PDF
                                 </button>
                                 <button onClick={() => { exportExcel([order]); setOpenActionMenuId(null); }} className="px-3 py-2 text-slate-700 hover:bg-slate-50 flex items-center gap-2 rounded text-left">
                                    <Download className="w-4 h-4" /> Export Excel
                                 </button>
                                 <button onClick={() => { setConfirmDelete({ ids: [order.id], message: 'Are you sure you want to delete this order?' }); setOpenActionMenuId(null); }} className="px-3 py-2 text-rose-600 hover:bg-rose-50 flex items-center gap-2 rounded text-left">
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
                  <td colSpan={10} className="px-4 py-8 text-center text-slate-500">
                    No orders found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        ) : (
        <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {paginatedOrders.length > 0 ? (
            paginatedOrders.map(order => (
              <div key={order.id} className="border border-slate-200 rounded-lg overflow-hidden bg-white shadow-sm hover:shadow transition-shadow group relative flex flex-col">
                <div className="absolute top-2 left-2 z-10 bg-white/90 backdrop-blur rounded shadow-sm">
                   <input 
                      type="checkbox" 
                      checked={selectedIds.has(order.id)}
                      onChange={() => toggleSelect(order.id)}
                      className="m-2 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                   />
                </div>
                <div className="absolute top-2 right-2 z-10" ref={openActionMenuId === order.id ? menuRef : null}>
                   <button 
                     onClick={() => setOpenActionMenuId(openActionMenuId === order.id ? null : order.id)} 
                     className="p-1.5 text-slate-600 bg-white/90 backdrop-blur hover:bg-white rounded shadow-sm"
                   >
                     <MoreHorizontal className="w-4 h-4" />
                   </button>
                   {openActionMenuId === order.id && (
                     <div className="absolute right-0 mt-1 w-40 bg-white border border-slate-200 rounded-md shadow-lg z-20 flex flex-col p-1 text-sm">
                         <button onClick={() => { setViewingOrder(order); setOpenActionMenuId(null); }} className="px-3 py-2 text-slate-700 hover:bg-slate-50 flex items-center gap-2 rounded">
                            <Eye className="w-4 h-4" /> View
                         </button>
                         <button onClick={() => { handleEdit(order); setOpenActionMenuId(null); }} className="px-3 py-2 text-slate-700 hover:bg-slate-50 flex items-center gap-2 rounded">
                            <Edit className="w-4 h-4" /> Edit
                         </button>
                         <button onClick={() => { exportPDF([order]); setOpenActionMenuId(null); }} className="px-3 py-2 text-slate-700 hover:bg-slate-50 flex items-center gap-2 rounded">
                            <FileText className="w-4 h-4" /> Export PDF
                         </button>
                         <button onClick={() => { exportExcel([order]); setOpenActionMenuId(null); }} className="px-3 py-2 text-slate-700 hover:bg-slate-50 flex items-center gap-2 rounded">
                            <Download className="w-4 h-4" /> Export Excel
                         </button>
                         <button onClick={() => { setConfirmDelete({ ids: [order.id], message: 'Are you sure you want to delete this order?' }); setOpenActionMenuId(null); }} className="px-3 py-2 text-rose-600 hover:bg-rose-50 flex items-center gap-2 rounded">
                            <Trash2 className="w-4 h-4" /> Delete
                         </button>
                     </div>
                   )}
                </div>

                {/* Big Image for Grid */}
                <div className="h-48 w-full bg-slate-100 flex items-center justify-center border-b border-slate-200 cursor-pointer overflow-hidden" onClick={() => setViewingOrder(order)}>
                  {order.productImage ? (
                    <img src={order.productImage} alt={order.styleNumber} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  ) : (
                    <ImageIcon className="w-10 h-10 text-slate-300" />
                  )}
                </div>
                
                <div className="p-4 flex-1 flex flex-col cursor-pointer" onClick={() => setViewingOrder(order)}>
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-bold text-slate-900 line-clamp-1">{order.poArticleNumber}</h3>
                      <p className="text-sm font-semibold text-slate-600">{order.buyerName}</p>
                    </div>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${getStatusBadgeClass(order.status)}`}>
                        {order.status}
                    </span>
                  </div>
                  
                  <p className="text-xs text-slate-500 mb-3">{order.styleNumber}</p>
                  
                  <div className="grid grid-cols-2 gap-2 mt-auto text-xs">
                    <div>
                      <p className="text-slate-500 uppercase font-semibold text-[10px]">Qty</p>
                      <p className="font-medium text-slate-900">{order.quantity.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-slate-500 uppercase font-semibold text-[10px]">Total ($)</p>
                      <p className="font-bold text-emerald-600">${order.totalAmount.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-slate-500 uppercase font-semibold text-[10px]">Del. Date</p>
                      <p className="font-medium text-rose-600">{order.deliveryDate}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-12 text-center text-slate-500">
               No orders found matching your criteria.
            </div>
          )}
        </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-500">
              Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredOrders.length)} of {filteredOrders.length} entries
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

function OrderForm({ order, buyers, onSave, onCancel }: { order: Order | null, buyers: Buyer[], onSave: (o: Order) => void, onCancel: () => void }) {
  const [formData, setFormData] = useState<Partial<Order>>(order || {
    id: `ORD-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
    poArticleNumber: '',
    buyerId: buyers.length > 0 ? buyers[0].id : '',
    buyerName: buyers.length > 0 ? buyers[0].name : '',
    styleNumber: '',
    orderDate: new Date().toISOString().split('T')[0],
    deliveryDate: '',
    quantity: 0,
    unitPrice: 0,
    totalAmount: 0,
    status: 'Pending',
    merchandiserName: buyers.length > 0 ? (buyers[0].merchandiserName || '') : '',
    timelineStatus: '',
    productImage: '',
    buyerTechPack: '',
    productItemDetail: '',
    shipmentMode: 'Sea',
    vesselFlightNo: '',
    portOfLoading: '',
    portOfDischarge: '',
    poDetails: [],
    hasWashing: false,
    washingInstructions: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.poArticleNumber?.trim()) newErrors.poArticleNumber = "PO/Article required";
    if (!formData.buyerId?.trim()) newErrors.buyerId = "Buyer required";
    if (!formData.styleNumber?.trim()) newErrors.styleNumber = "Style required";
    if (!formData.orderDate) newErrors.orderDate = "Order Date required";
    if (!formData.deliveryDate) newErrors.deliveryDate = "Delivery Date required";
    if (formData.quantity === undefined || formData.quantity <= 0) newErrors.quantity = "Must be > 0";
    if (formData.unitPrice === undefined || formData.unitPrice <= 0) newErrors.unitPrice = "Must be > 0";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'buyerId') {
      const buyer = buyers.find(b => b.id === value);
      setFormData(prev => ({ 
        ...prev, 
        buyerId: value, 
        buyerName: buyer ? buyer.name : '',
        merchandiserName: (buyer && buyer.merchandiserName) ? buyer.merchandiserName : prev.merchandiserName
      }));
    } else if (name === 'quantity' || name === 'unitPrice') {
      const numValue = Number(value);
      const otherField = name === 'quantity' ? 'unitPrice' : 'quantity';
      const otherValue = Number(formData[otherField as keyof Order]) || 0;
      setFormData(prev => ({ 
        ...prev, 
        [name]: numValue, 
        totalAmount: numValue * otherValue 
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSave(formData as Order);
    }
  };

  const handleAddPoDetail = () => {
    const current = formData.poDetails || [];
    setFormData(prev => ({
       ...prev,
       poDetails: [...current, { id: `po-${Date.now()}`, poArticleNumber: '', breakdowns: [] }]
    }));
  };

  const handleRemovePoDetail = (index: number) => {
    const updated = [...(formData.poDetails || [])];
    updated.splice(index, 1);
    setFormData(prev => ({ ...prev, poDetails: updated }));
  }

  const handleUpdatePoDetail = (index: number, field: string, value: string) => {
    const updated = [...(formData.poDetails || [])];
    updated[index] = { ...updated[index], [field]: value };
    setFormData(prev => ({ ...prev, poDetails: updated }));
  }

  const handleAddBreakdown = (poIndex: number) => {
     const updated = [...(formData.poDetails || [])];
     updated[poIndex].breakdowns.push({ id: `bd-${Date.now()}`, size: '', color: '', quantity: 0 });
     setFormData(prev => ({ ...prev, poDetails: updated }));
  }

  const handleRemoveBreakdown = (poIndex: number, bdIndex: number) => {
     const updated = [...(formData.poDetails || [])];
     updated[poIndex].breakdowns.splice(bdIndex, 1);
     setFormData(prev => ({ ...prev, poDetails: updated }));
  }

  const handleUpdateBreakdown = (poIndex: number, bdIndex: number, field: string, value: string | number) => {
     const updated = [...(formData.poDetails || [])];
     updated[poIndex].breakdowns[bdIndex] = { ...updated[poIndex].breakdowns[bdIndex], [field]: value };
     setFormData(prev => ({ ...prev, poDetails: updated }));
  }

  const handleAddBomEntry = () => {
    const current = formData.bomEntries || [];
    setFormData(prev => ({
       ...prev,
       bomEntries: [...current, { id: `bom-${Date.now()}`, category: '', itemDescription: '', supplierName: '', consumption: 0, uom: '', unitPrice: 0, totalCost: 0 }]
    }));
  };

  const handleRemoveBomEntry = (index: number) => {
    const updated = [...(formData.bomEntries || [])];
    updated.splice(index, 1);
    setFormData(prev => ({ ...prev, bomEntries: updated }));
  }

  const handleUpdateBomEntry = (index: number, field: string, value: string | number) => {
    const updated = [...(formData.bomEntries || [])];
    
    // Auto-calculate total cost
    const entry = { ...updated[index], [field]: value };
    if (field === 'consumption' || field === 'unitPrice') {
       entry.totalCost = (Number(entry.consumption) || 0) * (Number(entry.unitPrice) || 0);
    }
    
    updated[index] = entry;
    setFormData(prev => ({ ...prev, bomEntries: updated }));
  }

  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg border border-slate-200">
      <h3 className="text-lg font-bold text-slate-900 mb-6">{order ? 'Edit Order' : 'Add New Order'}</h3>
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Core Order Details */}
        <div>
          <h4 className="text-sm font-bold text-slate-800 mb-3 pb-2 border-b border-slate-100">Core Details</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Primary PO/Article *</label>
              <input type="text" name="poArticleNumber" value={formData.poArticleNumber || ''} onChange={handleChange} className={`w-full px-3 py-2 border rounded ${errors.poArticleNumber ? 'border-rose-500' : 'border-slate-300'}`} />
              {errors.poArticleNumber && <p className="text-xs text-rose-500 mt-1">{errors.poArticleNumber}</p>}
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Buyer *</label>
              <select name="buyerId" value={formData.buyerId} onChange={handleChange} className={`w-full px-3 py-2 border rounded bg-white ${errors.buyerId ? 'border-rose-500' : 'border-slate-300'}`}>
                <option value="" disabled>Select Buyer</option>
                {buyers.map(b => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </select>
              {errors.buyerId && <p className="text-xs text-rose-500 mt-1">{errors.buyerId}</p>}
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Style Number *</label>
              <input type="text" name="styleNumber" value={formData.styleNumber || ''} onChange={handleChange} className={`w-full px-3 py-2 border rounded ${errors.styleNumber ? 'border-rose-500' : 'border-slate-300'}`} />
              {errors.styleNumber && <p className="text-xs text-rose-500 mt-1">{errors.styleNumber}</p>}
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Item Name / Description</label>
              <input type="text" name="itemName" value={formData.itemName || ''} onChange={handleChange} className="w-full px-3 py-2 border rounded border-slate-300" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Order Date *</label>
              <input type="date" name="orderDate" value={formData.orderDate || ''} onChange={handleChange} className={`w-full px-3 py-2 border rounded ${errors.orderDate ? 'border-rose-500' : 'border-slate-300'}`} />
              {errors.orderDate && <p className="text-xs text-rose-500 mt-1">{errors.orderDate}</p>}
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Delivery Date *</label>
              <input type="date" name="deliveryDate" value={formData.deliveryDate || ''} onChange={handleChange} className={`w-full px-3 py-2 border rounded ${errors.deliveryDate ? 'border-rose-500' : 'border-slate-300'}`} />
              {errors.deliveryDate && <p className="text-xs text-rose-500 mt-1">{errors.deliveryDate}</p>}
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Status</label>
              <select name="status" value={formData.status} onChange={handleChange} className="w-full px-3 py-2 border rounded border-slate-300 bg-white">
                <option value="Pending">Pending</option>
                <option value="In Production">In Production</option>
                <option value="Shipped">Shipped</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        {/* Commercials */}
        <div>
          <h4 className="text-sm font-bold text-slate-800 mb-3 pb-2 border-b border-slate-100">Commercials</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Total Quantity</label>
              <input type="number" min="0" name="quantity" value={formData.quantity === 0 ? '' : formData.quantity} onChange={handleChange} className={`w-full px-3 py-2 border rounded ${errors.quantity ? 'border-rose-500' : 'border-slate-300'}`} />
              {errors.quantity && <p className="text-xs text-rose-500 mt-1">{errors.quantity}</p>}
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Unit Price ($)</label>
              <input type="number" min="0" step="0.01" name="unitPrice" value={formData.unitPrice === 0 ? '' : formData.unitPrice} onChange={handleChange} className={`w-full px-3 py-2 border rounded ${errors.unitPrice ? 'border-rose-500' : 'border-slate-300'}`} />
              {errors.unitPrice && <p className="text-xs text-rose-500 mt-1">{errors.unitPrice}</p>}
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Total Amount ($)</label>
              <input type="number" readOnly value={formData.totalAmount || 0} className="w-full px-3 py-2 border border-slate-300 rounded bg-slate-50 font-bold" />
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div>
           <h4 className="text-sm font-bold text-slate-800 mb-3 pb-2 border-b border-slate-100">Additional Information</h4>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Merchandiser Name</label>
                <input type="text" name="merchandiserName" value={formData.merchandiserName || ''} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Timeline Status</label>
                <input type="text" name="timelineStatus" value={formData.timelineStatus || ''} onChange={handleChange} placeholder="e.g. Design > Cutting > Sewing" className="w-full px-3 py-2 border border-slate-300 rounded" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Product Image</label>
                <div className="flex items-center gap-2">
                   <div className="flex-1">
                      <input type="text" name="productImage" value={formData.productImage || ''} onChange={handleChange} placeholder="Image URL or Browse..." className="w-full px-3 py-2 border border-slate-300 border-b-0 rounded-t text-sm" />
                      <input type="file" accept="image/*" onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => setFormData(prev => ({ ...prev, productImage: reader.result as string }));
                          reader.readAsDataURL(file);
                        }
                      }} className="w-full px-2 py-1.5 border border-slate-300 rounded-b text-xs file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:bg-blue-50 file:text-blue-700" />
                   </div>
                   {formData.productImage && formData.productImage.startsWith('data:image') && (
                      <div className="w-12 h-12 flex-shrink-0 border border-slate-200 rounded overflow-hidden">
                        <img src={formData.productImage} alt="Preview" className="w-full h-full object-cover" />
                      </div>
                   )}
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Buyer Tech Pack</label>
                <div className="flex flex-col">
                   <input type="text" name="buyerTechPack" value={formData.buyerTechPack || ''} onChange={handleChange} placeholder="File Path/URL or Browse..." className="w-full px-3 py-2 border border-slate-300 border-b-0 rounded-t text-sm" />
                   <input type="file" accept=".pdf,.doc,.docx" onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                           setFormData(prev => ({ 
                             ...prev, 
                             buyerTechPack: URL.createObjectURL(file),
                             buyerTechPackName: file.name
                           }));
                        }
                   }} className="w-full px-2 py-1.5 border border-slate-300 rounded-b text-xs file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:bg-blue-50 file:text-blue-700" />
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-600 mb-1">Product Item Detail</label>
                <textarea name="productItemDetail" value={formData.productItemDetail || ''} onChange={handleChange} rows={3} className="w-full px-3 py-2 border border-slate-300 rounded" />
              </div>
           </div>
        </div>

        {/* Logistics Information */}
        <div>
           <h4 className="text-sm font-bold text-slate-800 mb-3 pb-2 border-b border-slate-100">Logistics & Shipment</h4>
           <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Shipment Mode</label>
                <select name="shipmentMode" value={formData.shipmentMode || 'Sea'} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded bg-white">
                  <option value="Sea">Sea</option>
                  <option value="Air">Air</option>
                  <option value="Road">Road</option>
                  <option value="Courier">Courier</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Vessel/Flight No.</label>
                <input type="text" name="vesselFlightNo" value={formData.vesselFlightNo || ''} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Port of Loading</label>
                <input type="text" name="portOfLoading" value={formData.portOfLoading || ''} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Port of Discharge</label>
                <input type="text" name="portOfDischarge" value={formData.portOfDischarge || ''} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded" />
              </div>
           </div>
        </div>

        {/* Production Tracking */}
        <div>
           <h4 className="text-sm font-bold text-slate-800 mb-3 pb-2 border-b border-slate-100">Production Tracking</h4>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:p-6">
             {/* Accessories */}
             <div className="space-y-4 bg-slate-50 p-4 rounded border border-slate-100">
                <h5 className="font-bold text-slate-700 text-xs uppercase tracking-wider text-rose-600">Accessories</h5>
                <div>
                   <label className="block text-xs font-semibold text-slate-600 mb-1">Item Name</label>
                   <input type="text" name="accessoriesItemName" value={formData.accessoriesItemName || ''} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded" />
                </div>
                <div>
                   <label className="block text-xs font-semibold text-slate-600 mb-1">Inhouse Date</label>
                   <input type="date" name="accessoriesInhouseDate" value={formData.accessoriesInhouseDate || ''} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded" />
                </div>
             </div>

              {/* Cutting */}
              <div className="space-y-4 bg-slate-50 p-4 rounded border border-slate-100">
                <h5 className="font-bold text-slate-700 text-xs uppercase tracking-wider text-blue-600">Cutting</h5>
                <div>
                   <label className="block text-xs font-semibold text-slate-600 mb-1">Quantity</label>
                   <input type="number" name="cuttingQuantity" value={formData.cuttingQuantity || ''} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                   <div>
                     <label className="block text-xs font-semibold text-slate-600 mb-1">Start Date</label>
                     <input type="date" name="cuttingStartDate" value={formData.cuttingStartDate || ''} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded text-sm" />
                   </div>
                   <div>
                     <label className="block text-xs font-semibold text-slate-600 mb-1">End Date</label>
                     <input type="date" name="cuttingEndDate" value={formData.cuttingEndDate || ''} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded text-sm" />
                   </div>
                </div>
              </div>

              {/* Sewing */}
              <div className="space-y-4 bg-slate-50 p-4 rounded border border-slate-100">
                <h5 className="font-bold text-slate-700 text-xs uppercase tracking-wider text-emerald-600">Sewing</h5>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                     <label className="block text-xs font-semibold text-slate-600 mb-1">Input Qty</label>
                     <input type="number" name="sewingInputQuantity" value={formData.sewingInputQuantity || ''} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded text-sm" />
                  </div>
                  <div>
                     <label className="block text-xs font-semibold text-slate-600 mb-1">Complete Qty</label>
                     <input type="number" name="sewingCompleteQuantity" value={formData.sewingCompleteQuantity || ''} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded text-sm" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                   <div>
                     <label className="block text-xs font-semibold text-slate-600 mb-1">Start Date</label>
                     <input type="date" name="sewingStartDate" value={formData.sewingStartDate || ''} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded text-sm" />
                   </div>
                   <div>
                     <label className="block text-xs font-semibold text-slate-600 mb-1">End Date</label>
                     <input type="date" name="sewingEndDate" value={formData.sewingEndDate || ''} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded text-sm" />
                   </div>
                </div>
              </div>

              {/* Finishing & Packing */}
              <div className="space-y-4 bg-slate-50 p-4 rounded border border-slate-100">
                <h5 className="font-bold text-slate-700 text-xs uppercase tracking-wider text-indigo-600">Finishing & Packing</h5>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                     <label className="block text-xs font-semibold text-slate-600 mb-1">Input Qty</label>
                     <input type="number" name="finishingInputQuantity" value={formData.finishingInputQuantity || ''} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded text-sm" />
                  </div>
                  <div>
                     <label className="block text-xs font-semibold text-slate-600 mb-1">Complete Qty</label>
                     <input type="number" name="finishingCompleteQuantity" value={formData.finishingCompleteQuantity || ''} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded text-sm" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                   <div>
                     <label className="block text-xs font-semibold text-slate-600 mb-1">Start Date</label>
                     <input type="date" name="finishingStartDate" value={formData.finishingStartDate || ''} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded text-sm" />
                   </div>
                   <div>
                     <label className="block text-xs font-semibold text-slate-600 mb-1">End Date</label>
                     <input type="date" name="finishingEndDate" value={formData.finishingEndDate || ''} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded text-sm" />
                   </div>
                </div>
                <div>
                   <label className="block text-xs font-semibold text-slate-600 mb-1">Packing Quantity</label>
                   <input type="number" name="packingQuantity" value={formData.packingQuantity || ''} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded" />
                </div>
              </div>
           </div>
        </div>

        {/* Washing Information */}
        <div>
           <h4 className="text-sm font-bold text-slate-800 mb-3 pb-2 border-b border-slate-100">Washing Information</h4>
           <div className="flex items-center gap-4">
              <label className="flex items-center gap-2">
                <input type="checkbox" name="hasWashing" checked={formData.hasWashing || false} onChange={e => setFormData(prev => ({ ...prev, hasWashing: e.target.checked }))} className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                <span className="text-sm">Style Requires Washing</span>
              </label>
           </div>
           {formData.hasWashing && (
             <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 rounded border border-slate-100">
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Washing Instructions</label>
                  <textarea name="washingInstructions" value={formData.washingInstructions || ''} onChange={handleChange} rows={2} className="w-full px-3 py-2 border border-slate-300 rounded" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Send Quantity</label>
                  <input type="number" name="washingQuantitySend" value={formData.washingQuantitySend || ''} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Receive Quantity</label>
                  <input type="number" name="washingQuantityReceive" value={formData.washingQuantityReceive || ''} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Send Date</label>
                  <input type="date" name="washingSendDate" value={formData.washingSendDate || ''} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Receive Date</label>
                  <input type="date" name="washingReceiveDate" value={formData.washingReceiveDate || ''} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Washing Send Address</label>
                  <textarea name="washingSendAddress" value={formData.washingSendAddress || ''} onChange={handleChange} rows={2} className="w-full px-3 py-2 border border-slate-300 rounded" />
                </div>
             </div>
           )}
        </div>


        {/* PO and Breakdown Config (Multi PO per Style) */}
        <div>
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
             <h4 className="text-sm font-bold text-slate-800">PO & Size/Color Breakdown</h4>
             <button type="button" onClick={handleAddPoDetail} className="flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-700 text-xs font-semibold rounded hover:bg-blue-100 transition-colors">
               <Plus className="w-3.5 h-3.5" /> Add PO
             </button>
          </div>

          <div className="space-y-4">
             {formData.poDetails?.map((po, poIndex) => (
                <div key={po.id} className="p-4 border border-slate-200 rounded-md bg-slate-50 relative">
                   <div className="flex items-end gap-4 mb-4">
                     <div className="flex-1">
                        <label className="block text-xs font-semibold text-slate-600 mb-1">PO/Article Number</label>
                        <input type="text" value={po.poArticleNumber} onChange={(e) => handleUpdatePoDetail(poIndex, 'poArticleNumber', e.target.value)} placeholder="Enter localized PO" className="w-full px-2 py-1.5 text-sm border border-slate-300 rounded" />
                     </div>
                     <button type="button" onClick={() => handleRemovePoDetail(poIndex)} className="p-1.5 text-rose-500 hover:bg-rose-100 rounded transition-colors mb-0.5">
                       <Trash2 className="w-4 h-4" />
                     </button>
                   </div>
                   
                   <div className="pl-4 border-l-2 border-blue-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-600">Breakdown (Color/Size)</span>
                        <button type="button" onClick={() => handleAddBreakdown(poIndex)} className="text-xs text-blue-600 font-semibold hover:text-blue-800 flex items-center gap-1">
                          <Plus className="w-3 h-3" /> Add Row
                        </button>
                      </div>
                      
                      {po.breakdowns.map((bd, bdIndex) => (
                         <div key={bd.id} className="flex items-center gap-2">
                           <input type="text" placeholder="Color" value={bd.color} onChange={(e) => handleUpdateBreakdown(poIndex, bdIndex, 'color', e.target.value)} className="w-1/3 px-2 py-1.5 text-sm border border-slate-300 rounded" />
                           <input type="text" placeholder="Size" value={bd.size} onChange={(e) => handleUpdateBreakdown(poIndex, bdIndex, 'size', e.target.value)} className="w-1/3 px-2 py-1.5 text-sm border border-slate-300 rounded" />
                           <input type="number" min="0" placeholder="Qty" value={bd.quantity === 0 ? '' : bd.quantity} onChange={(e) => handleUpdateBreakdown(poIndex, bdIndex, 'quantity', parseInt(e.target.value) || 0)} className="w-1/4 px-2 py-1.5 text-sm border border-slate-300 rounded" />
                           <button type="button" onClick={() => handleRemoveBreakdown(poIndex, bdIndex)} className="p-1 text-slate-400 hover:text-rose-500">
                             <Trash2 className="w-3.5 h-3.5" />
                           </button>
                         </div>
                      ))}
                      {po.breakdowns.length === 0 && <span className="text-xs text-slate-400 italic">No breakdown added.</span>}
                   </div>
                </div>
             ))}
             {!formData.poDetails?.length && (
               <div className="text-center py-6 bg-slate-50 border border-slate-200 border-dashed rounded-md text-slate-500 text-sm">
                  Click 'Add PO' to include size and color composition.
               </div>
             )}
          </div>
        </div>

        {/* BOM Form Section */}
        <div>
           <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
             <h4 className="text-sm font-bold text-slate-800">Bill of Materials (BOM)</h4>
             <button type="button" onClick={handleAddBomEntry} className="flex items-center gap-1 px-3 py-1.5 bg-indigo-50 text-indigo-700 text-xs font-semibold rounded hover:bg-indigo-100 transition-colors">
               <Plus className="w-3.5 h-3.5" /> Add BOM Entry
             </button>
           </div>
           
           <div className="space-y-4">
              {formData.bomEntries?.map((bom, index) => (
                 <div key={bom.id} className="p-3 border border-slate-200 rounded-md bg-white shadow-sm flex flex-col gap-3">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                       <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Category</label>
                          <input type="text" value={bom.category} onChange={(e) => handleUpdateBomEntry(index, 'category', e.target.value)} placeholder="e.g. Fabric, Trims" className="w-full px-2 py-1.5 text-sm border border-slate-300 rounded" />
                       </div>
                       <div className="md:col-span-2">
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Item Description</label>
                          <input type="text" value={bom.itemDescription} onChange={(e) => handleUpdateBomEntry(index, 'itemDescription', e.target.value)} placeholder="e.g. 100% Cotton Jersey 180gsm" className="w-full px-2 py-1.5 text-sm border border-slate-300 rounded" />
                       </div>
                       <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Supplier</label>
                          <input type="text" value={bom.supplierName} onChange={(e) => handleUpdateBomEntry(index, 'supplierName', e.target.value)} className="w-full px-2 py-1.5 text-sm border border-slate-300 rounded" />
                       </div>
                    </div>
                     <div className="grid grid-cols-2 md:grid-cols-5 gap-3 border-t border-slate-100 pt-3">
                       <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Consumption</label>
                          <input type="number" min="0" step="0.01" value={bom.consumption === 0 ? '' : bom.consumption} onChange={(e) => handleUpdateBomEntry(index, 'consumption', parseFloat(e.target.value) || 0)} className="w-full px-2 py-1.5 text-sm border border-slate-300 rounded" />
                       </div>
                       <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">UOM</label>
                          <input type="text" value={bom.uom} onChange={(e) => handleUpdateBomEntry(index, 'uom', e.target.value)} placeholder="Wait, Yds, Pcs" className="w-full px-2 py-1.5 text-sm border border-slate-300 rounded" />
                       </div>
                       <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Unit Price ($)</label>
                          <input type="number" min="0" step="0.01" value={bom.unitPrice === 0 ? '' : bom.unitPrice} onChange={(e) => handleUpdateBomEntry(index, 'unitPrice', parseFloat(e.target.value) || 0)} className="w-full px-2 py-1.5 text-sm border border-slate-300 rounded" />
                       </div>
                       <div>
                           <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Image</label>
                           <input type="file" accept="image/*" onChange={(e) => {
                             const file = e.target.files?.[0];
                             if (file) {
                               const reader = new FileReader();
                               reader.onloadend = () => handleUpdateBomEntry(index, 'image', reader.result as string);
                               reader.readAsDataURL(file);
                             }
                           }} className="w-full text-[10px] file:py-1 file:px-2 file:rounded file:border-0 file:bg-blue-50 file:text-blue-700" />
                       </div>
                       <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Total Cost ($)</label>
                          <input type="text" readOnly value={bom.totalCost.toFixed(2)} className="w-full px-2 py-1.5 text-sm border border-slate-200 bg-slate-50 rounded font-bold text-slate-700" />
                       </div>
                       <div className="flex items-end pb-0.5 justify-end col-span-2 md:col-span-1">
                          <button type="button" onClick={() => handleRemoveBomEntry(index)} className="p-1.5 text-rose-500 hover:bg-rose-100 rounded transition-colors flex items-center justify-center gap-1 w-full border border-rose-200 bg-rose-50 font-bold text-xs h-[34px]">
                            <Trash2 className="w-3.5 h-3.5" /> Remove
                          </button>
                       </div>
                    </div>
                 </div>
              ))}
              {!formData.bomEntries?.length && (
                 <div className="text-center py-6 bg-slate-50 border border-slate-200 border-dashed rounded-md text-slate-500 text-sm">
                    No BOM entries configured. Click "Add BOM Entry" to start.
                 </div>
              )}
           </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
          <button type="button" onClick={onCancel} className="px-4 py-2 border rounded text-slate-600 hover:bg-slate-50 font-semibold text-sm">Cancel</button>
          <button type="submit" className="px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-semibold text-sm shadow-sm">Save Order Data</button>
        </div>
      </form>
    </div>
  );
}

