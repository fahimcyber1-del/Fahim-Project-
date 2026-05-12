import React, { useState, useRef, useEffect } from 'react';
import { RiskRecord, RiskCategory, RiskLevel, RiskStatus, RiskAttachment, RiskItem } from './types';
import { ArrowLeft, Save, PlusCircle, Trash2, Paperclip, Search, Plus } from 'lucide-react';
import { format } from 'date-fns';
import { useApiStorage } from '../../hooks/useApiData';
import { INITIAL_ORDERS } from '../orders-buyers/mockData';

interface RiskAssessmentFormProps {
  initialData?: RiskRecord;
  onSave: (data: RiskRecord) => void;
  onCancel: () => void;
}

export function RiskAssessmentForm({ initialData, onSave, onCancel }: RiskAssessmentFormProps) {
  const [ordersRaw] = useApiStorage('aqm_ordersbuyers_orders', INITIAL_ORDERS);
  const orders = ordersRaw.map((o: any) => {
    const defaultOrder = INITIAL_ORDERS.find(io => io.id === o.id);
    return {
      ...o,
      itemName: o.itemName || defaultOrder?.itemName || '',
      productImage: o.productImage || defaultOrder?.productImage || ''
    };
  });

  const calculateRiskDetails = (se: number, li: number): { score: number, level: RiskLevel } => {
    const score = se * li;
    let level: RiskLevel = 'Low';
    if (score >= 15) level = 'Critical';
    else if (score >= 10) level = 'High';
    else if (score >= 5) level = 'Medium';
    else level = 'Low';
    return { score, level };
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<Partial<RiskRecord>>(initialData || {
    id: `RA-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000).toString().padStart(4, '0')}`,
    dateAssessed: format(new Date(), 'yyyy-MM-dd'),
    title: '',
    category: 'Product',
    processName: '',
    description: '',
    hazardIdentified: '',
    severity: 1,
    likelihood: 1,
    riskScore: 1,
    riskLevel: 'Low',
    mitigationPlan: '',
    mitigationOwner: '',
    mitigationDueDate: format(new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
    status: 'Draft',
    productDetails: {
      itemCategory: '',
      styleNumber: '',
      itemName: '',
      productImage: ''
    },
    identifiedRisks: [],
    attachments: [],
  });

  const [orderQuery, setOrderQuery] = useState('');
  const [showOrderSuggestions, setShowOrderSuggestions] = useState(false);

  useEffect(() => {
    if (formData.productDetails?.styleNumber) {
      setOrderQuery(formData.productDetails.styleNumber);
    }
  }, []);

  const handleOrderSelect = (order: any) => {
    setOrderQuery(order.styleNumber);
    setShowOrderSuggestions(false);
    
    setFormData(prev => ({
      ...prev,
      productDetails: {
        ...prev.productDetails,
        styleNumber: order.styleNumber,
        itemCategory: order.itemName || '',
        itemName: order.itemName || '',
        productImage: order.productImage || ''
      }
    }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file: File) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        const newAttachment: RiskAttachment = {
          name: file.name,
          type: file.type || 'application/octet-stream',
          data: base64
        };
        setFormData(prev => ({
          ...prev,
          attachments: [...(prev.attachments || []), newAttachment]
        }));
      };
      reader.readAsDataURL(file);
    });
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeAttachment = (indexToRemove: number) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments?.filter((_, index) => index !== indexToRemove)
    }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleProductDetailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      productDetails: { 
        ...(prev.productDetails || { itemCategory: '', styleNumber: '' }), 
        [name]: value 
      } 
    }));
    
    if (name === 'styleNumber') {
      setOrderQuery(value);
      setShowOrderSuggestions(true);
    }
  };

  // MULTIPLE RISKS LOGIC (for Product category)
  const addRiskItem = () => {
    const newItem: RiskItem = {
      id: `RI-${Math.random().toString(36).substring(2, 9)}`,
      description: '',
      hazardIdentified: '',
      severity: 1,
      likelihood: 1,
      riskScore: 1,
      riskLevel: 'Low',
      mitigationPlan: '',
      mitigationOwner: '',
      mitigationDueDate: format(new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd')
    };
    setFormData(prev => ({
      ...prev,
      identifiedRisks: [...(prev.identifiedRisks || []), newItem]
    }));
  };

  const removeRiskItem = (id: string) => {
    setFormData(prev => ({
      ...prev,
      identifiedRisks: (prev.identifiedRisks || []).filter(r => r.id !== id)
    }));
  };

  const updateRiskItem = (id: string, field: keyof RiskItem, value: any) => {
    setFormData(prev => {
      const risks = [...(prev.identifiedRisks || [])];
      const index = risks.findIndex(r => r.id === id);
      if (index === -1) return prev;
      
      const item = { ...risks[index], [field]: value };
      
      if (field === 'severity' || field === 'likelihood') {
        const se = field === 'severity' ? parseInt(value) : item.severity;
        const li = field === 'likelihood' ? parseInt(value) : item.likelihood;
        const { score, level } = calculateRiskDetails(se, li);
        item.riskScore = score;
        item.riskLevel = level;
      }
      
      if (field === 'residualSeverity' || field === 'residualLikelihood') {
        const se = field === 'residualSeverity' ? parseInt(value || item.residualSeverity || 1) : (item.residualSeverity || 1);
        const li = field === 'residualLikelihood' ? parseInt(value || item.residualLikelihood || 1) : (item.residualLikelihood || 1);
        const { score, level } = calculateRiskDetails(se, li);
        item.residualRiskScore = score;
        item.residualRiskLevel = level;
      }
      
      risks[index] = item;
      return { ...prev, identifiedRisks: risks };
    });
  };

  // SINGLE RISK LOGIC (for Process / legacy)
  const handleScoreChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    const valObj: any = { ...formData, [name]: parseInt(value) };
    const se = valObj.severity || 1;
    const li = valObj.likelihood || 1;
    const { score, level } = calculateRiskDetails(se, li);
    valObj.riskScore = score;
    valObj.riskLevel = level;
    setFormData(valObj);
  };
  
  const handleResidualScoreChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    const valObj: any = { ...formData, [name]: parseInt(value) };
    const se = valObj.residualSeverity || 1;
    const li = valObj.residualLikelihood || 1;
    const { score, level } = calculateRiskDetails(se, li);
    valObj.residualRiskScore = score;
    valObj.residualRiskLevel = level;
    setFormData(valObj);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.category) return;
    
    const saveData = { ...formData } as RiskRecord;
    
    if (saveData.category === 'Product' && saveData.identifiedRisks) {
      if (saveData.identifiedRisks.length > 0) {
        // Compute overall highest scores
        saveData.riskScore = Math.max(...saveData.identifiedRisks.map(r => r.riskScore));
        
        const levels = saveData.identifiedRisks.map(r => r.riskLevel);
        if (levels.includes('Critical')) saveData.riskLevel = 'Critical';
        else if (levels.includes('High')) saveData.riskLevel = 'High';
        else if (levels.includes('Medium')) saveData.riskLevel = 'Medium';
        else saveData.riskLevel = 'Low';

        const residualScores = saveData.identifiedRisks.map(r => r.residualRiskScore || 0);
        saveData.residualRiskScore = Math.max(...residualScores);

        const residualLevels = saveData.identifiedRisks.map(r => r.residualRiskLevel).filter(Boolean) as RiskLevel[];
        if (residualLevels.length > 0) {
          if (residualLevels.includes('Critical')) saveData.residualRiskLevel = 'Critical';
          else if (residualLevels.includes('High')) saveData.residualRiskLevel = 'High';
          else if (residualLevels.includes('Medium')) saveData.residualRiskLevel = 'Medium';
          else saveData.residualRiskLevel = 'Low';
        }
      } else {
        saveData.riskScore = 1;
        saveData.riskLevel = 'Low';
      }
    }

    onSave(saveData);
  };

  const getLevelColor = (level: RiskLevel) => {
    switch (level) {
      case 'Critical': return 'bg-rose-100 text-rose-800 border-rose-200';
      case 'High': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Medium': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Low': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  const isMultiple = formData.category === 'Product';

  return (
    <div className="max-w-5xl mx-auto w-full pb-12">
      <div className="flex items-center gap-4 mb-6">
        <button type="button" onClick={onCancel} className="p-2 bg-slate-100 text-slate-500 hover:bg-slate-200 rounded-full transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-black text-slate-900">{initialData ? 'Edit Risk Assessment' : 'New Risk Assessment'}</h1>
          <p className="text-sm font-medium text-slate-500">Document and mitigate identified risks</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 sm:p-6 space-y-8 flex-1">
          
          <div>
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest mb-4 border-b border-slate-100 pb-2">Basic Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Assessment Title *</label>
                <input required type="text" name="title" value={formData.title || ''} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500" placeholder="E.g., Production Hazards for Style X" />
              </div>
              
              <div>
                 <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Category *</label>
                 <select required name="category" value={formData.category || 'Product'} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500">
                   <option value="Product">Product</option>
                   <option value="Process">Process</option>
                   <option value="Critical Process">Critical Process</option>
                 </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Date Assessed *</label>
                <input required type="date" name="dateAssessed" value={formData.dateAssessed || ''} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500" />
              </div>

              {formData.category === 'Product' ? (
                <div className="md:col-span-2 p-4 bg-slate-50 border border-slate-200 rounded-xl flex flex-col md:flex-row gap-6">
                   <div className="flex-1 space-y-4">
                     <div className="relative">
                       <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Style Number / Item Code *</label>
                       <div className="relative">
                         <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                         <input 
                           type="text" 
                           name="styleNumber" onFocus={() => setShowOrderSuggestions(true)} onBlur={() => setShowOrderSuggestions(false)} 
                           value={orderQuery} 
                           onChange={handleProductDetailChange} 
                           required
                           autoComplete="off"
                           className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500 bg-white" 
                           placeholder="Type to search orders..." 
                         />
                       </div>
                       
                       {showOrderSuggestions && (
                          <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
                            {orders.filter((o: any) => o.styleNumber?.toLowerCase().includes(orderQuery.toLowerCase()) || o.poArticleNumber?.toLowerCase().includes(orderQuery.toLowerCase())).map((order: any) => (
                              <div 
                                key={order.id} 
                                className="px-4 py-2 hover:bg-slate-50 cursor-pointer border-b border-slate-100 last:border-0"
                                onMouseDown={(e) => { e.preventDefault(); handleOrderSelect(order); }}
                              >
                                <p className="text-sm font-bold text-slate-800">{order.styleNumber} <span className="text-slate-500 font-normal ml-2">{order.itemName}</span></p>
                                <p className="text-xs text-slate-500">PO: {order.poArticleNumber}</p>
                              </div>
                            ))}
                          </div>
                       )}
                     </div>
                     <div>
                       <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Item Category / Name</label>
                       <input type="text" name="itemCategory" value={formData.productDetails?.itemCategory || ''} onChange={handleProductDetailChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500 bg-white" placeholder="E.g., Kids Wear" />
                     </div>
                   </div>
                   {formData.productDetails?.productImage && (
                     <div className="w-32 h-32 shrink-0 border border-slate-200 rounded-lg overflow-hidden bg-white">
                        <img 
                          src={formData.productDetails.productImage} 
                          alt="Product" 
                          className="w-full h-full object-cover"
                        />
                     </div>
                   )}
                </div>
              ) : (
                <div className="md:col-span-2 p-4 bg-slate-50 border border-slate-200 rounded-xl">
                   <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Process Name</label>
                   <input required type="text" name="processName" value={formData.processName || ''} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500" placeholder="E.g., Automated Sewing" />
                </div>
              )}
            </div>
          </div>

          {/* MULTIPLE RISKS ENTRY */}
          {isMultiple ? (
            <div>
              <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-2">
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest">Identified Risks</h3>
                <button 
                  type="button"
                  onClick={addRiskItem}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-lg text-xs font-bold transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Risk
                </button>
              </div>

              {(!formData.identifiedRisks || formData.identifiedRisks.length === 0) ? (
                <div className="border border-dashed border-slate-300 rounded-lg p-8 text-center bg-slate-50">
                   <p className="text-sm font-bold text-slate-700 mb-1">No risks identified</p>
                   <p className="text-xs text-slate-500 mb-4">Click "Add Risk" to register hazards for this product.</p>
                   <button 
                    type="button"
                    onClick={addRiskItem}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white hover:bg-indigo-700 rounded-lg text-sm font-bold transition-colors shadow-sm"
                   >
                     <Plus className="w-4 h-4" /> Add First Risk
                   </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {formData.identifiedRisks.map((risk, index) => (
                    <div key={risk.id} className="border border-slate-200 rounded-xl bg-white shadow-sm overflow-hidden">
                      <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex justify-between items-center">
                        <h4 className="font-bold text-slate-800">Risk #{index + 1}</h4>
                        <button 
                          type="button" 
                          onClick={() => removeRiskItem(risk.id)}
                          className="text-rose-500 hover:text-rose-700 p-1 bg-white hover:bg-rose-50 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      
                      <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                         <div className="md:col-span-2">
                           <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Hazard Identified *</label>
                           <textarea required value={risk.hazardIdentified || ''} onChange={(e) => updateRiskItem(risk.id, 'hazardIdentified', e.target.value)} rows={2} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500" placeholder="Describe the hazard" />
                         </div>
                         
                         <div className="md:col-span-2 grid grid-cols-4 gap-4 items-end">
                            <div>
                               <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Severity (1-5)</label>
                               <select value={risk.severity} onChange={(e) => updateRiskItem(risk.id, 'severity', e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500">
                                 {[1,2,3,4,5].map(v => <option key={v} value={v}>{v}</option>)}
                               </select>
                            </div>
                            <div>
                               <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Likelihood (1-5)</label>
                               <select value={risk.likelihood} onChange={(e) => updateRiskItem(risk.id, 'likelihood', e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500">
                                 {[1,2,3,4,5].map(v => <option key={v} value={v}>{v}</option>)}
                               </select>
                            </div>
                            <div className="col-span-2">
                               <div className="border border-slate-200 rounded-lg p-2 flex items-center justify-between bg-slate-50">
                                  <div>
                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider leading-none mb-1">Risk Score</p>
                                    <p className="font-black text-slate-900 leading-none">{risk.riskScore} <span className="text-xs font-medium text-slate-500">/ 25</span></p>
                                  </div>
                                  <div className={`px-2 py-1 flex items-center justify-center rounded font-bold text-xs ${getLevelColor(risk.riskLevel)} border-0 shadow-sm`}>
                                    {risk.riskLevel}
                                  </div>
                               </div>
                            </div>
                         </div>
                         
                         <div className="md:col-span-2 mt-2 pt-4 border-t border-slate-100">
                            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Mitigation Action(s)</label>
                            <textarea value={risk.mitigationPlan || ''} onChange={(e) => updateRiskItem(risk.id, 'mitigationPlan', e.target.value)} rows={2} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500" placeholder="Steps to reduce the risk." />
                         </div>
                         
                         <div>
                           <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Assigned To</label>
                           <input type="text" value={risk.mitigationOwner || ''} onChange={(e) => updateRiskItem(risk.id, 'mitigationOwner', e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500" placeholder="Owner" />
                         </div>
                         <div>
                           <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Target Date</label>
                           <input type="date" value={risk.mitigationDueDate || ''} onChange={(e) => updateRiskItem(risk.id, 'mitigationDueDate', e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500" />
                         </div>
                         
                         {/* Residual Section For Item */}
                         <div className="md:col-span-2 pt-4 border-t border-slate-100 grid grid-cols-4 gap-4 items-end">
                            <div>
                               <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-2">Residual Severity</label>
                               <select value={risk.residualSeverity || ''} onChange={(e) => updateRiskItem(risk.id, 'residualSeverity', e.target.value)} className="w-full px-2 py-1.5 border border-slate-300 rounded-lg text-xs focus:outline-none focus:border-indigo-500">
                                 <option value="">N/A</option>
                                 {[1,2,3,4,5].map(v => <option key={v} value={v}>{v}</option>)}
                               </select>
                            </div>
                            <div>
                               <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-2">Residual Likelihood</label>
                               <select value={risk.residualLikelihood || ''} onChange={(e) => updateRiskItem(risk.id, 'residualLikelihood', e.target.value)} className="w-full px-2 py-1.5 border border-slate-300 rounded-lg text-xs focus:outline-none focus:border-indigo-500">
                                 <option value="">N/A</option>
                                 {[1,2,3,4,5].map(v => <option key={v} value={v}>{v}</option>)}
                               </select>
                            </div>
                            <div className="col-span-2">
                               <div className="border border-slate-200 rounded-lg p-2 flex items-center justify-between bg-slate-50 h-full">
                                  <div>
                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider leading-none mb-1">Residual Score</p>
                                    <p className="font-bold text-slate-900 leading-none">{risk.residualRiskScore || '-'} <span className="text-[10px] font-medium text-slate-500">/ 25</span></p>
                                  </div>
                                  {risk.residualRiskLevel && (
                                    <div className={`px-2 py-1 justify-center rounded font-bold text-[10px] ${getLevelColor(risk.residualRiskLevel)} border-0 shadow-sm`}>
                                      {risk.residualRiskLevel}
                                    </div>
                                  )}
                               </div>
                            </div>
                         </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <>
              {/* SINGLE RISK ENTRY */}
              <div>
                 <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest mb-4 border-b border-slate-100 pb-2">Risk Context</h3>
                 <div className="space-y-6">
                    <div>
                      <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Description</label>
                      <textarea name="description" value={formData.description || ''} onChange={handleChange} rows={3} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500" placeholder="Detailed description of the process, product, or scenario." />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Hazard Identified *</label>
                      <textarea required name="hazardIdentified" value={formData.hazardIdentified || ''} onChange={handleChange} rows={3} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500" placeholder="What is the potential hazard?" />
                    </div>
                 </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest mb-4 border-b border-slate-100 pb-2">Initial Risk Assessment</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                   <div>
                      <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Severity (1-5) *</label>
                      <select required name="severity" value={formData.severity || 1} onChange={handleScoreChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500">
                        {[1,2,3,4,5].map(v => <option key={v} value={v}>{v}</option>)}
                      </select>
                   </div>
                   <div>
                      <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Likelihood (1-5) *</label>
                      <select required name="likelihood" value={formData.likelihood || 1} onChange={handleScoreChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500">
                        {[1,2,3,4,5].map(v => <option key={v} value={v}>{v}</option>)}
                      </select>
                   </div>
                   <div className="col-span-2">
                      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center justify-between">
                         <div>
                           <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Initial Risk Score</p>
                           <p className="text-2xl font-black text-slate-900">{formData.riskScore || 1} <span className="text-sm font-medium text-slate-500">/ 25</span></p>
                         </div>
                         <div className={`px-4 py-2 rounded-lg font-bold text-sm border-0 shadow-sm ${getLevelColor(formData.riskLevel || 'Low')}`}>
                           {formData.riskLevel || 'Low'} Risk
                         </div>
                      </div>
                   </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest mb-4 border-b border-slate-100 pb-2">Mitigation Plan</h3>
                <div className="space-y-6">
                   <div>
                      <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Mitigation Action(s)</label>
                      <textarea name="mitigationPlan" value={formData.mitigationPlan || ''} onChange={handleChange} rows={4} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500" placeholder="Steps taken or planned to reduce the risk." />
                   </div>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div>
                       <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Assigned To *</label>
                       <input required type="text" name="mitigationOwner" value={formData.mitigationOwner || ''} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500" placeholder="Owner" />
                     </div>
                     <div>
                       <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Target Date *</label>
                       <input required type="date" name="mitigationDueDate" value={formData.mitigationDueDate || ''} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500" />
                     </div>
                     <div className="flex items-center gap-3 md:col-span-2 bg-slate-50 p-4 border border-slate-200 rounded-xl shadow-sm">
                       <input
                         type="checkbox"
                         id="mitigationComplete"
                         checked={formData.status === 'Mitigated' || formData.status === 'Closed'}
                         onChange={(e) => {
                           const isComplete = e.target.checked;
                           const newStatus = isComplete ? 'Mitigated' : 'Active';
                           
                           let resSev = formData.residualSeverity;
                           let resLik = formData.residualLikelihood;
                           let resScore = formData.residualRiskScore;
                           let resLevel = formData.residualRiskLevel;
                           
                           if (isComplete && !resSev && !resLik) {
                             resSev = Math.max(1, Math.floor((formData.severity || 1) / 2));
                             resLik = Math.max(1, Math.floor((formData.likelihood || 1) / 2));
                             const riskDetails = calculateRiskDetails(resSev, resLik);
                             resScore = riskDetails.score;
                             resLevel = riskDetails.level;
                           }
                           
                           setFormData({
                             ...formData,
                             status: newStatus,
                             residualSeverity: resSev,
                             residualLikelihood: resLik,
                             residualRiskScore: resScore,
                             residualRiskLevel: resLevel,
                           });
                         }}
                         className="w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                       />
                       <label htmlFor="mitigationComplete" className="text-sm font-bold text-slate-700">Mark Mitigation Actions as Complete</label>
                     </div>
                   </div>
                </div>
              </div>

              <div>
                 <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest mb-4 border-b border-slate-100 pb-2 col-span-2">Residual Risk (Post-Mitigation)</h3>
                 <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                   <div>
                      <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Residual Severity</label>
                      <select name="residualSeverity" value={formData.residualSeverity || ''} onChange={handleResidualScoreChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500">
                        <option value="">Not Assessed</option>
                        {[1,2,3,4,5].map(v => <option key={v} value={v}>{v}</option>)}
                      </select>
                   </div>
                   <div>
                      <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Residual Likelihood</label>
                      <select name="residualLikelihood" value={formData.residualLikelihood || ''} onChange={handleResidualScoreChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500">
                        <option value="">Not Assessed</option>
                        {[1,2,3,4,5].map(v => <option key={v} value={v}>{v}</option>)}
                      </select>
                   </div>
                   <div className="col-span-2">
                     {formData.residualRiskScore ? (
                        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center justify-between">
                           <div>
                             <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Residual Risk Score</p>
                             <p className="text-2xl font-black text-slate-900">{formData.residualRiskScore} <span className="text-sm font-medium text-slate-500">/ 25</span></p>
                           </div>
                           <div className={`px-4 py-2 rounded-lg font-bold text-sm border-0 shadow-sm ${getLevelColor(formData.residualRiskLevel || 'Low')}`}>
                             {formData.residualRiskLevel} Risk
                           </div>
                        </div>
                     ) : (
                        <div className="bg-slate-50 border border-slate-200 border-dashed rounded-xl p-4 flex items-center justify-center text-slate-500 text-sm h-full">
                           Evaluate residual risk after mitigation
                        </div>
                     )}
                   </div>
                 </div>
              </div>
            </>
          )}

          {/* COMMON STATUS & EVIDENCE */}
          <div className="mt-6 md:w-1/2">
             <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Overall Status</label>
             <select required name="status" value={formData.status || 'Draft'} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500">
               <option value="Draft">Draft</option>
               <option value="Active">Active</option>
               <option value="Mitigated">Mitigated</option>
               <option value="Closed">Closed</option>
             </select>
          </div>

          <div>
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest mb-4 border-b border-slate-100 pb-2 flex items-center justify-between">
              Evidence & Documentation
              <div>
                <input 
                  type="file" 
                  multiple 
                  className="hidden" 
                  ref={fileInputRef} 
                  onChange={handleFileUpload} 
                />
                <button 
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-lg text-xs font-bold transition-colors shadow-sm"
                >
                  <Paperclip className="w-3.5 h-3.5" /> Attach Files
                </button>
              </div>
            </h3>
            
            {(!formData.attachments || formData.attachments.length === 0) ? (
              <div className="border border-dashed border-slate-300 rounded-lg p-6 lg:p-8 text-center bg-slate-50">
                <Paperclip className="w-8 h-8 mx-auto text-slate-400 mb-2" />
                <p className="text-sm font-bold text-slate-700 mb-1">No attachments yet</p>
                <p className="text-xs text-slate-500">Upload documents or evidence related to this assessment.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {formData.attachments.map((attachment, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border border-slate-200 rounded-lg bg-white shadow-sm">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="w-8 h-8 rounded bg-indigo-50 flex items-center justify-center flex-shrink-0">
                        <Paperclip className="w-4 h-4 text-indigo-600" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-slate-900 truncate">{attachment.name}</p>
                        <p className="text-xs text-slate-500">{attachment.type}</p>
                      </div>
                    </div>
                    <button 
                      type="button" 
                      onClick={() => removeAttachment(index)}
                      className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-full transition-colors flex-shrink-0 ml-4"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-3 rounded-b-xl">
          <button type="button" onClick={onCancel} className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg text-sm font-bold hover:bg-white transition-colors shadow-sm">Cancel</button>
          <button type="submit" className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold hover:bg-indigo-700 transition-colors shadow-sm">
            <Save className="w-4 h-4" /> {initialData ? 'Update Assessment' : 'Save Assessment'}
          </button>
        </div>
      </form>
    </div>
  );
}
