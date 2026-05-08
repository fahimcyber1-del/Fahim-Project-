import React, { useState, useRef } from 'react';
import { RiskRecord, RiskCategory, RiskLevel, RiskStatus, RiskAttachment } from './types';
import { ArrowLeft, Save, PlusCircle, Trash2, Paperclip } from 'lucide-react';
import { format } from 'date-fns';

interface RiskAssessmentFormProps {
  initialData?: RiskRecord;
  onSave: (data: RiskRecord) => void;
  onCancel: () => void;
}

export function RiskAssessmentForm({ initialData, onSave, onCancel }: RiskAssessmentFormProps) {
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
      styleNumber: ''
    },
    processName: '',
    attachments: [],
  });

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

  const handleProductDetailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      productDetails: { 
        ...(prev.productDetails || { itemCategory: '', styleNumber: '' }), 
        [name]: value 
      } 
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.category) return;
    onSave(formData as RiskRecord);
  };

  const getLevelColor = (level: RiskLevel) => {
    switch (level) {
      case 'Critical': return 'bg-rose-100 text-rose-800 border border-rose-200';
      case 'High': return 'bg-orange-100 text-orange-800 border border-orange-200';
      case 'Medium': return 'bg-amber-100 text-amber-800 border border-amber-200';
      case 'Low': return 'bg-emerald-100 text-emerald-800 border border-emerald-200';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  return (
    <div className="max-w-4xl mx-auto w-full pb-12">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={onCancel} className="p-2 bg-slate-100 text-slate-500 hover:bg-slate-200 rounded-full transition-colors">
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:p-6">
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Assessment Title *</label>
                <input required type="text" name="title" value={formData.title || ''} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500" placeholder="E.g., Chemical exposure during dyeing" />
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
                <div className="md:col-span-2 grid grid-cols-2 gap-4 sm:p-6 p-4 bg-slate-50 border border-slate-200 rounded-xl">
                   <div>
                     <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Item Category</label>
                     <input type="text" name="itemCategory" value={formData.productDetails?.itemCategory || ''} onChange={handleProductDetailChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500" placeholder="E.g., Kids Wear" />
                   </div>
                   <div>
                     <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Style Number / Item Code</label>
                     <input type="text" name="styleNumber" value={formData.productDetails?.styleNumber || ''} onChange={handleProductDetailChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500" placeholder="E.g., KW-001" />
                   </div>
                </div>
              ) : (
                <div className="md:col-span-2 p-4 bg-slate-50 border border-slate-200 rounded-xl">
                   <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Process Name</label>
                   <input type="text" name="processName" value={formData.processName || ''} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500" placeholder="E.g., Automated Sewing" />
                </div>
              )}
            </div>
          </div>

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
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 sm:p-6 items-end">
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
                     <div className={`px-4 py-2 rounded-lg font-bold text-sm ${getLevelColor(formData.riskLevel || 'Low')}`}>
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
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:p-6">
                 <div>
                   <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Assigned To *</label>
                   <input required type="text" name="mitigationOwner" value={formData.mitigationOwner || ''} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500" placeholder="Owner" />
                 </div>
                 <div>
                   <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Target Date *</label>
                   <input required type="date" name="mitigationDueDate" value={formData.mitigationDueDate || ''} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500" />
                 </div>
                 <div className="flex items-center gap-3 md:col-span-2 bg-slate-50 p-4 border border-slate-200 rounded-xl">
                   <input
                     type="checkbox"
                     id="mitigationComplete"
                     checked={formData.status === 'Mitigated' || formData.status === 'Closed'}
                     onChange={(e) => {
                       const isComplete = e.target.checked;
                       const newStatus = isComplete ? 'Mitigated' : 'Active';
                       
                       // Dynamically update residual scores to 1 if marking complete and not yet assessed
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
             <div className="grid grid-cols-1 md:grid-cols-4 gap-4 sm:p-6 items-end">
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
                       <div className={`px-4 py-2 rounded-lg font-bold text-sm ${getLevelColor(formData.residualRiskLevel || 'Low')}`}>
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
             
             <div className="mt-6 md:w-1/2">
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Overall Status</label>
                <select required name="status" value={formData.status || 'Draft'} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500">
                  <option value="Draft">Draft</option>
                  <option value="Active">Active</option>
                  <option value="Mitigated">Mitigated</option>
                  <option value="Closed">Closed</option>
                </select>
             </div>
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
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-lg text-xs font-bold transition-colors"
                >
                  <Paperclip className="w-3.5 h-3.5" /> Attach Files
                </button>
              </div>
            </h3>
            
            {(!formData.attachments || formData.attachments.length === 0) ? (
              <div className="border border-dashed border-slate-300 rounded-lg p-4 sm:p-6 lg:p-8 text-center bg-slate-50">
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
          <button type="button" onClick={onCancel} className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg text-sm font-bold hover:bg-white transition-colors">Cancel</button>
          <button type="submit" className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold hover:bg-indigo-700 transition-colors shadow-sm">
            <Save className="w-4 h-4" /> {initialData ? 'Update Assessment' : 'Save Assessment'}
          </button>
        </div>
      </form>
    </div>
  );
}
