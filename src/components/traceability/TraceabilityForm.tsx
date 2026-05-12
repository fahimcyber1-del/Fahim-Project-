import React, { useState, useEffect } from 'react';
import { TraceabilityRecord } from './types';
import { ArrowLeft, Save, Plus, Search } from 'lucide-react';
import { useApiStorage } from '../../hooks/useApiData';
import { INITIAL_ORDERS } from '../orders-buyers/mockData';

interface TraceabilityFormProps {
  onSave: (data: TraceabilityRecord) => void;
  onCancel: () => void;
}

export function TraceabilityForm({ onSave, onCancel }: TraceabilityFormProps) {
  const [ordersRaw] = useApiStorage('aqm_ordersbuyers_orders', INITIAL_ORDERS);
  const orders = ordersRaw.map((o: any) => {
    const defaultOrder = INITIAL_ORDERS.find(io => io.id === o.id);
    return {
      ...o,
      itemName: o.itemName || defaultOrder?.itemName || '',
      productImage: o.productImage || defaultOrder?.productImage || ''
    };
  });

  const [orderQuery, setOrderQuery] = useState('');
  const [showOrderSuggestions, setShowOrderSuggestions] = useState(false);

  const [formData, setFormData] = useState<Partial<TraceabilityRecord>>({
    id: `TRC-2023-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
    productBatchNo: '',
    poNumber: '',
    styleNumber: '',
    orderQuantity: 0,
    productImage: '',
    type: 'GARMENT',
    status: 'IN_PROGRESS',
    date: new Date().toISOString().split('T')[0],
    certifications: [],
    supplierName: '',
    originCountry: '',
    notes: '',
    stages: []
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleOrderQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setOrderQuery(val);
    setFormData(prev => ({ ...prev, poNumber: val }));
    setShowOrderSuggestions(true);
  };

  const handleOrderSelect = (order: any) => {
    setOrderQuery(order.poArticleNumber);
    setShowOrderSuggestions(false);
    
    setFormData(prev => ({
      ...prev,
      poNumber: order.poArticleNumber,
      styleNumber: order.styleNumber,
      orderQuantity: order.quantity,
      productImage: order.productImage,
    }));
  };

  const handleCertificationsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const certs = e.target.value.split(',').map(s => s.trim()).filter(s => s);
    setFormData(prev => ({ ...prev, certifications: certs }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData as TraceabilityRecord);
  };

  return (
    <div className="max-w-4xl mx-auto pb-12 w-full">
      <div className="flex justify-end mb-4">
        <button 
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-slate-100 text-slate-700 text-sm font-bold rounded-lg hover:bg-slate-200"
        >
          Back to List
        </button>
      </div>

      <form className="bg-white border border-slate-200 rounded-xl shadow-sm p-4 sm:p-6 lg:p-8 space-y-8" onSubmit={handleSubmit}>
        <div>
          <h3 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">Batch Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:p-6">
            <div className="col-span-2 md:col-span-1 relative">
              <label className="block text-xs font-bold text-slate-600 uppercase mb-2">PO / Article Number</label>
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input 
                  type="text" 
                  name="poNumber"
                  value={orderQuery} 
                  autoComplete="off"
                  onFocus={() => setShowOrderSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowOrderSuggestions(false), 200)}
                  onChange={handleOrderQueryChange} 
                  className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
                  placeholder="Search PO number..." 
                />
              </div>
              {showOrderSuggestions && orderQuery && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
                  {orders.filter((o: any) => o.poArticleNumber?.toLowerCase().includes(orderQuery.toLowerCase()) || o.styleNumber?.toLowerCase().includes(orderQuery.toLowerCase())).map((order: any) => (
                    <div 
                      key={order.id} 
                      className="px-4 py-2 hover:bg-slate-50 cursor-pointer border-b border-slate-100 last:border-0"
                      onMouseDown={(e) => { e.preventDefault(); handleOrderSelect(order); }}
                    >
                      <p className="text-sm font-bold text-slate-800">{order.poArticleNumber}</p>
                      <p className="text-xs text-slate-500">Style: {order.styleNumber} | Qty: {order.quantity}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="col-span-2 md:col-span-1">
              <label className="block text-xs font-bold text-slate-600 uppercase mb-2">Internal Batch No.</label>
              <input 
                type="text" name="productBatchNo" value={formData.productBatchNo} onChange={handleChange} required
                className="w-full px-4 py-2 border border-slate-300 rounded text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500" 
              />
            </div>
            
            {(formData.styleNumber || formData.orderQuantity || formData.productImage) ? (
              <div className="col-span-2 bg-slate-50 p-4 border border-slate-200 rounded flex gap-4">
                {formData.productImage && (
                  <div className="w-20 h-20 shrink-0 bg-white border border-slate-200 rounded overflow-hidden">
                    <img src={formData.productImage} alt="Product" className="w-full h-full object-cover" />
                  </div>
                )}
                <div>
                  <div className="mb-2">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Style Number</span>
                    <span className="text-sm font-bold text-slate-900">{formData.styleNumber || '-'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Order Quantity</span>
                    <span className="text-sm font-bold text-slate-900">{formData.orderQuantity || 0}</span>
                  </div>
                </div>
              </div>
            ) : null}

            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase mb-2">Material / Product Type</label>
              <select name="type" value={formData.type} onChange={handleChange} className="w-full px-4 py-2 border border-slate-300 rounded text-sm">
                <option value="GARMENT">Finished Good / Garment</option>
                <option value="FABRIC">Fabric Roll / Batch</option>
                <option value="YARN">Yarn Lot</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase mb-2">Initiation Date</label>
              <input type="date" name="date" value={formData.date} onChange={handleChange} required className="w-full px-4 py-2 border border-slate-300 rounded text-sm" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase mb-2">Status</label>
              <select name="status" value={formData.status} onChange={handleChange} className="w-full px-4 py-2 border border-slate-300 rounded text-sm">
                <option value="IN_PROGRESS">In Progress</option>
                <option value="VERIFIED">Verified</option>
                <option value="PENDING">Pending Documents</option>
                <option value="FAILED">Verification Failed</option>
              </select>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">Supplier & Claims</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:p-6">
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase mb-2">Primary Supplier / Division</label>
              <input type="text" name="supplierName" value={formData.supplierName || ''} onChange={handleChange} className="w-full px-4 py-2 border border-slate-300 rounded text-sm" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase mb-2">Country of Origin</label>
              <input type="text" name="originCountry" value={formData.originCountry || ''} onChange={handleChange} className="w-full px-4 py-2 border border-slate-300 rounded text-sm" />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-bold text-slate-600 uppercase mb-2">Certifications Claimed (Comma separated)</label>
              <input 
                type="text" 
                value={formData.certifications?.join(', ') || ''} 
                onChange={handleCertificationsChange} 
                placeholder="e.g. GOTS, OCS, GRS"
                className="w-full px-4 py-2 border border-slate-300 rounded text-sm" 
              />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-bold text-slate-600 uppercase mb-2">Remarks / Notes</label>
              <textarea name="notes" value={formData.notes || ''} onChange={handleChange} rows={3} className="w-full px-4 py-2 border border-slate-300 rounded text-sm resize-none" />
            </div>
          </div>
        </div>
        
        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
          <button type="button" onClick={onCancel} className="px-6 py-2 rounded border border-slate-300 text-slate-700 text-sm font-bold hover:bg-slate-50">Cancel</button>
          <button type="submit" className="px-6 py-2 rounded bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 flex items-center gap-2">
            <Save className="w-4 h-4" /> Save Record
          </button>
        </div>
      </form>
    </div>
  );
}
