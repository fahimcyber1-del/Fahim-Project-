import React, { useState, useEffect } from 'react';
import { InspectionRecord } from './types';
import { ArrowLeft, Save, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { calculateAQL } from './aqlCalculator';
import { INITIAL_ORDERS } from '../orders-buyers/mockData';
import { SizeColorBreakdown } from '../orders-buyers/types';

interface FormProps {
  initialData?: InspectionRecord;
  onSave: (data: InspectionRecord) => void;
  onCancel: () => void;
  sections?: string[];
  lines?: string[];
  units?: string[];
  shifts?: string[];
}

export function InspectionForm({ initialData, onSave, onCancel }: FormProps) {
  const [formData, setFormData] = useState<Partial<InspectionRecord>>({
    id: `INSP-${format(new Date(), 'yyyy')}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
    date: format(new Date(), 'yyyy-MM-dd'),
    category: 'Inline',
    poNumber: '',
    styleNumber: '',
    crdDate: format(new Date(), 'yyyy-MM-dd'),
    buyer: '',
    color: '',
    size: 'M',
    inspectedQuantity: 0,
    criticalDefects: 0,
    majorDefects: 0,
    minorDefects: 0,
    shortage: 0,
    excess: 0,
    status: 'Pass',
    aqlLevel: '2.5',
    inspectionLevel: '2',
    orderQuantity: 0,
    sampleQuantity: 0,
    workmanship: 'OK',
    measurement: 'OK',
    productSafety: 'OK',
    labeling: 'OK',
    packing: 'OK',
    shippingMark: 'OK',
    bomCheck: 'OK',
    inspector: '',
    remarks: '',
  });

  const [aqlLimits, setAqlLimits] = useState({ sampleSize: 0, ac: 0, re: 0 });
  const [breakdowns, setBreakdowns] = useState<SizeColorBreakdown[]>([]);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
      
      const order = INITIAL_ORDERS.find(o => o.poArticleNumber === initialData.poNumber);
      if (order && order.poDetails) {
         setBreakdowns(order.poDetails.flatMap(d => d.breakdowns || []));
      }
    }
  }, [initialData]);

  useEffect(() => {
    const orderQty = Number(formData.orderQuantity) || 0;
    const inspectedQty = Number(formData.inspectedQuantity) || 0;
    const crit = Number(formData.criticalDefects) || 0;
    const maj = Number(formData.majorDefects) || 0;
    const min = Number(formData.minorDefects) || 0;
    const aql = formData.aqlLevel || '2.5';
    
    // 1. AQL Calculation
    const result = calculateAQL(orderQty, aql);
    setAqlLimits(result);
    
    // 2. Auto-fail logic
    const totalDefects = crit + maj + min;
    let newStatus = formData.status;
    if (totalDefects >= result.re) {
        newStatus = 'Fail';
    } else if (totalDefects > result.ac) {
        newStatus = 'Recheck';
    } else {
        if (newStatus !== 'Fail' && newStatus !== 'Recheck') {
            newStatus = 'Pass';
        }
    }
    
    // 3. Shortage/Excess
    let shortage = 0;
    let excess = 0;
    const diff = inspectedQty - orderQty;
    if (diff > 0) excess = diff;
    else if (diff < 0) shortage = Math.abs(diff);

    setFormData(prev => ({
        ...prev,
        sampleQuantity: result.sampleSize,
        status: newStatus as 'Pass' | 'Recheck' | 'Fail',
        shortage,
        excess
    }));
  }, [formData.orderQuantity, formData.aqlLevel, formData.inspectedQuantity, formData.criticalDefects, formData.majorDefects, formData.minorDefects]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (['inspectedQuantity', 'criticalDefects', 'majorDefects', 'minorDefects'].includes(name)) {
      const numValue = value === '' ? '' : parseInt(value);
      setFormData(prev => ({ ...prev, [name]: numValue }));
    } else {
      if (name === 'poNumber') {
        const order = INITIAL_ORDERS.find(o => o.poArticleNumber === value);
        if (order) {
          const breakdownList = order.poDetails?.flatMap(d => d.breakdowns || []) || [];
          setBreakdowns(breakdownList);
          const breakdown = breakdownList[0];
          setFormData(prev => ({ 
            ...prev, 
            [name]: value,
            buyer: order.buyerName,
            styleNumber: order.styleNumber,
            orderQuantity: order.quantity,
            color: breakdown?.color || prev.color || '',
            size: breakdown?.size || prev.size || ''
          }));
          return;
        } else {
          setBreakdowns([]);
        }
      }
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData as InspectionRecord);
  };

  const uniquePoNumbers = Array.from(new Set(INITIAL_ORDERS.map(o => o.poArticleNumber))).filter(Boolean);

  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      <datalist id="po-numbers-list">
        {uniquePoNumbers.map(s => <option key={s} value={s} />)}
      </datalist>
      <button 
        onClick={onCancel}
        className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Summary
      </button>

      <form onSubmit={handleSubmit}>
        <div className="shadow-sm border border-slate-200 bg-white rounded-lg">
          <div className="border-b border-slate-100 p-4 sm:p-6">
            <h2 className="text-lg font-bold text-slate-900">
              {initialData ? 'Edit Quality Record' : 'New Quality Record'}
            </h2>
          </div>
          <div className="p-4 sm:p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:p-6">
              
              {/* Basic Info */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b pb-2">Basic Information</h3>
                
                 <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Record ID</label>
                    <input 
                      type="text" 
                      name="id" 
                      value={formData.id} 
                      readOnly
                      className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded text-sm text-slate-500 cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Date</label>
                    <input 
                      type="date" 
                      name="date" 
                      value={formData.date} 
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-slate-300 rounded text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Category</label>
                  <select 
                    name="category" 
                    value={formData.category || 'Inline'} 
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="Inline">Inline</option>
                    <option value="Prefinal">Prefinal</option>
                    <option value="Final">Final</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">PO/Article Number</label>
                    <input 
                      type="text" 
                      name="poNumber" 
                      list="po-numbers-list"
                      value={formData.poNumber || ''} 
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-slate-300 rounded text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Style Number</label>
                    <input 
                      type="text" 
                      name="styleNumber" 
                      value={formData.styleNumber || ''} 
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-slate-300 rounded text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">CRD Date</label>
                    <input 
                      type="date" 
                      name="crdDate" 
                      value={formData.crdDate || ''} 
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-slate-300 rounded text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Buyer</label>
                    <input 
                      type="text" 
                      name="buyer" 
                      value={formData.buyer || ''} 
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-slate-300 rounded text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Quality Inspector Name</label>
                    <input 
                      type="text" 
                      name="inspector" 
                      value={formData.inspector || ''} 
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-slate-300 rounded text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Color</label>
                    <input 
                      type="text" 
                      name="color" 
                      value={formData.color || ''} 
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-slate-300 rounded text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Size</label>
                    <input 
                      type="text" 
                      name="size" 
                      value={formData.size || ''} 
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-slate-300 rounded text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Inspection Data & Conditions */}
              <div className="col-span-1 md:col-span-2 space-y-6">
                <div className="space-y-4">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b pb-2 flex justify-between items-center">
                    Inspection Data
                  </h3>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">AQL Level</label>
                      <select 
                        name="aqlLevel" 
                        value={formData.aqlLevel || '2.5'} 
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-slate-300 rounded text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      >
                        <option value="1.0">1.0</option>
                        <option value="1.5">1.5</option>
                        <option value="2.5">2.5</option>
                        <option value="4.0">4.0</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">Inspection Level</label>
                      <select 
                        name="inspectionLevel" 
                        value={formData.inspectionLevel || '2'} 
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-slate-300 rounded text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      >
                        <option value="1">Level I</option>
                        <option value="2">Level II</option>
                        <option value="3">Level III</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">Order Qty</label>
                      <input 
                        type="number" 
                        name="orderQuantity" 
                        value={formData.orderQuantity ?? ''} 
                        onChange={handleChange}
                        min="0"
                        className="w-full px-3 py-2 border border-slate-300 rounded text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">Sample Qty</label>
                      <input 
                        type="number" 
                        name="sampleQuantity" 
                        value={formData.sampleQuantity ?? ''} 
                        onChange={handleChange}
                        min="0"
                        className="w-full px-3 py-2 border border-slate-300 rounded text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-slate-50"
                        readOnly
                      />
                      <div className="flex gap-2 mt-1">
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-bold">Ac: {aqlLimits.ac}</span>
                        <span className="text-[10px] bg-rose-100 text-rose-800 px-1.5 py-0.5 rounded font-bold">Re: {aqlLimits.re}</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="col-span-2">
                      <label className="block text-xs font-semibold text-slate-600 mb-1">Inspected Qty</label>
                      <input 
                        type="number" 
                        name="inspectedQuantity" 
                        value={formData.inspectedQuantity ?? ''} 
                        onChange={handleChange}
                        required
                        min="0"
                        className="w-full px-3 py-2 border border-slate-300 rounded text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  {breakdowns.length > 0 && formData.sampleQuantity && formData.sampleQuantity > 0 && formData.orderQuantity && formData.orderQuantity > 0 ? (
                    <div className="mt-4 bg-slate-50 border border-slate-200 rounded p-4">
                      <h4 className="text-xs font-bold text-slate-800 mb-3 border-b border-slate-200 pb-2">Size-Wise Sample Quantity Distribution</h4>
                      <div className="grid grid-cols-4 gap-2 text-xs font-bold text-slate-500 mb-2">
                        <div>Color</div>
                        <div>Size</div>
                        <div className="text-right">Order Qty</div>
                        <div className="text-right text-blue-700">Sample Qty</div>
                      </div>
                      <div className="space-y-1">
                        {breakdowns.map((bd, i) => {
                          const orderTotal = formData.orderQuantity || 1;
                          const sampleSize = Math.round((formData.sampleQuantity! / orderTotal) * bd.quantity);
                          return (
                            <div key={i} className="grid grid-cols-4 gap-2 text-xs text-slate-800 py-1.5 border-b border-slate-100 last:border-0 hover:bg-white rounded px-1">
                              <div className="font-medium">{bd.color}</div>
                              <div className="font-bold">{bd.size}</div>
                              <div className="text-right">{bd.quantity}</div>
                              <div className="text-right font-black text-blue-700">{sampleSize}</div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ) : null}

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-600 mb-1">Critical Defect Qty</label>
                      <input 
                        type="number" 
                        name="criticalDefects" 
                        value={formData.criticalDefects ?? ''} 
                        onChange={handleChange}
                        min="0"
                        className="w-full px-3 py-2 border border-rose-300 rounded text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-rose-500 bg-rose-50"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-600 mb-1">Major Defect Qty</label>
                      <input 
                        type="number" 
                        name="majorDefects" 
                        value={formData.majorDefects ?? ''} 
                        onChange={handleChange}
                        min="0"
                        className="w-full px-3 py-2 border border-amber-300 rounded text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-amber-500 bg-amber-50"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-600 mb-1">Minor Defect Qty</label>
                      <input 
                        type="number" 
                        name="minorDefects" 
                        value={formData.minorDefects ?? ''} 
                        onChange={handleChange}
                        min="0"
                        className="w-full px-3 py-2 border border-slate-300 rounded text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-500 bg-slate-50"
                      />
                    </div>
                  </div>

                  {/* Conditions & Visual Checks */}
                  <div className="pt-4 pb-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 border-b border-slate-100 pb-2 mb-3">Inspection Checkpoints</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {[ 
                        { label: 'Workmanship', field: 'workmanship' },
                        { label: 'Measurement', field: 'measurement' },
                        { label: 'Product Safety', field: 'productSafety' },
                        { label: 'Labeling', field: 'labeling' },
                        { label: 'Packing', field: 'packing' },
                        { label: 'Shipping Mark', field: 'shippingMark' },
                        { label: 'BOM Check', field: 'bomCheck' }
                      ].map(check => (
                        <div key={check.field} className="flex flex-col">
                          <label className="block text-[10px] font-semibold text-slate-600 mb-1">{check.label}</label>
                          <select 
                            name={check.field} 
                            value={(formData as any)[check.field] || 'OK'} 
                            onChange={handleChange}
                            className={`w-full px-2 py-1.5 border rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                              (formData as any)[check.field] === 'NOT OK' ? 'border-rose-300 bg-rose-50 text-rose-700' : 'border-slate-300 bg-white text-slate-900'
                            }`}
                          >
                            <option value="OK">OK</option>
                            <option value="NOT OK">NOT OK</option>
                            <option value="N/A">N/A</option>
                          </select>
                        </div>
                      ))}
                    </div>
                  </div>


                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Final Status</label>
                  <div className="flex gap-4">
                    {['Pass', 'Recheck', 'Fail'].map(status => (
                      <label key={status} className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                        <input 
                          type="radio" 
                          name="status" 
                          value={status} 
                          checked={formData.status === status} 
                          onChange={handleChange}
                          className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-slate-300"
                        />
                        {status}
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Remarks</label>
                  <textarea 
                    name="remarks" 
                    value={formData.remarks || ''} 
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-slate-300 rounded text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Any observations or comments..."
                  ></textarea>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Attachments (Images/PDFs)</label>
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    multiple
                    onChange={(e) => {
                      if (e.target.files) {
                        const files = Array.from(e.target.files);
                        const newAttachments = files.map((file: File) => ({
                          name: file.name,
                          type: file.type,
                          data: URL.createObjectURL(file), // Using object URL for preview
                        }));
                        setFormData((prev) => ({
                          ...prev,
                          attachments: [...(prev.attachments || []), ...newAttachments],
                        }));
                      }
                    }}
                    className="w-full px-3 py-2 border border-slate-300 rounded text-sm text-slate-900"
                  />
                  {formData.attachments && formData.attachments.length > 0 && (
                    <div className="mt-4 space-y-2">
                      <p className="text-xs font-semibold text-slate-600">Selected files:</p>
                      {formData.attachments.map((file, index) => (
                        <div key={index} className="flex items-center justify-between text-sm bg-white border border-slate-200 px-3 py-2 rounded">
                          <span className="truncate flex-1 mr-2 text-slate-700">{file.name}</span>
                          <div className="flex items-center gap-2">
                            <a 
                              href={file.data} 
                              download={file.name} 
                              className="text-xs text-blue-600 font-bold hover:underline"
                            >
                              Download
                            </a>
                            <button
                              type="button"
                              onClick={() => {
                                setFormData((prev) => ({
                                  ...prev,
                                  attachments: prev.attachments?.filter((_, i) => i !== index),
                                }));
                              }}
                              className="text-rose-500 hover:text-rose-700 font-bold"
                            >
                              ✕
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>


              </div>
              </div>

            </div>
          </div>
          <div className="border-t border-slate-100 bg-slate-50 p-4 flex justify-end gap-3 rounded-b-lg">
            <button 
              type="button" 
              onClick={onCancel}
              className="px-4 py-2 border border-slate-300 rounded text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="px-4 py-2 bg-blue-600 text-white rounded text-sm font-bold shadow-sm hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Save className="w-4 h-4" /> Save Record
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
