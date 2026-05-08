import React, { useState } from 'react';
import { TestRequest } from './types';
import { ArrowLeft, Upload, Send, FileText } from 'lucide-react';

interface TestFormProps {
  initialData?: TestRequest;
  onSave: (record: TestRequest) => void;
  onCancel: () => void;
}

export function TestForm({ initialData, onSave, onCancel }: TestFormProps) {
  const [formData, setFormData] = useState<Partial<TestRequest>>(initialData || {
    poArticleNumber: '',
    orderQuantity: '',
    color: '',
    size: '',
    materialType: '',
    colorCodeRef: '',
    batchId: '',
    sampleOrigin: '',
    supplierReference: '',
    selectedTests: [],
    priorityLevel: 'Standard',
    requiredCompletionDate: '',
    internalRemarks: ''
  });

  const tests = [
    { id: 'Shrinkage Test', desc: 'Dimensional stability after washing cycles.' },
    { id: 'Color Fastness', desc: 'Resistance to fading from light and perspiration.' },
    { id: 'Tensile Strength', desc: 'Force required to rupture the specimen.' },
    { id: 'Pilling Resistance', desc: 'Tendency of fibers to form small balls on surface.' },
    { id: 'PH Value', desc: 'Chemical acidity/alkalinity measurement.' },
    { id: 'Formaldehyde', desc: 'Restricted substance content verification.' },
  ];

  const handleTestToggle = (testId: string) => {
    setFormData(prev => {
      const current = prev.selectedTests || [];
      if (current.includes(testId)) {
        return { ...prev, selectedTests: current.filter(t => t !== testId) };
      }
      return { ...prev, selectedTests: [...current, testId] };
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const mockOrders = [
    { poArticle: 'PO-65239-01', orderQuantity: '5,000 pcs', color: 'Navy Blue', size: 'M' },
    { poArticle: 'PO-65239-02', orderQuantity: '3,000 pcs', color: 'Crimson Red', size: 'L' },
    { poArticle: 'PO-77112-X', orderQuantity: '10,000 pcs', color: 'Charcoal', size: 'S, M, L' },
  ];

  const handlePoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedPo = e.target.value;
    const orderDetails = mockOrders.find(o => o.poArticle === selectedPo);
    if (orderDetails) {
      setFormData(prev => ({
        ...prev,
        poArticleNumber: selectedPo,
        orderQuantity: orderDetails.orderQuantity,
        color: orderDetails.color,
        size: orderDetails.size,
        colorCodeRef: orderDetails.color
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        poArticleNumber: selectedPo,
        orderQuantity: '',
        color: '',
        size: ''
      }));
    }
  };

  const submit = () => {
    onSave(formData as TestRequest);
  };

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto space-y-6 pb-20">
      
      <div className="mb-8">
        <button onClick={onCancel} className="text-sm font-bold text-[#0033a0] flex items-center gap-1 hover:underline mb-4">
          <ArrowLeft className="w-4 h-4" /> Back to Requests List
        </button>
        <h2 className="text-2xl font-black text-slate-800">New Lab Test Request</h2>
        <p className="text-slate-500 font-medium">Initialize a new quality assurance protocol for production samples.</p>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-6 lg:p-8 shadow-[0_1px_3px_rgba(0,0,0,0.05)] space-y-6 relative">
          <div className="absolute top-4 sm:p-6 lg:p-8 left-8 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm">01</div>
          <div className="pl-12">
            <h3 className="text-lg font-bold text-slate-800 mb-6">Sample Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 sm:p-6 mb-6">
              <div>
                <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-2">PO ARTICLE NUMBER</label>
                <select name="poArticleNumber" value={formData.poArticleNumber || ''} onChange={handlePoChange} className="w-full px-4 py-3 bg-white border border-slate-300 rounded-md text-sm text-slate-700 font-medium shadow-sm outline-none appearance-none bg-blue-50/50">
                  <option value="">Select PO Article</option>
                  {mockOrders.map(o => (
                    <option key={o.poArticle} value={o.poArticle}>{o.poArticle}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-2">ORDER QUANTITY</label>
                <input name="orderQuantity" value={formData.orderQuantity || ''} onChange={handleChange} type="text" placeholder="Auto-filled" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-md text-sm text-slate-700 font-medium shadow-sm outline-none" readOnly />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-2">COLOR (PO)</label>
                <input name="color" value={formData.color || ''} onChange={handleChange} type="text" placeholder="Auto-filled" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-md text-sm text-slate-700 font-medium shadow-sm outline-none" readOnly />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-2">SIZE</label>
                <input name="size" value={formData.size || ''} onChange={handleChange} type="text" placeholder="Auto-filled" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-md text-sm text-slate-700 font-medium shadow-sm outline-none" readOnly />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:p-6 mb-6">
              <div>
                <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-2">MATERIAL TYPE</label>
                <select name="materialType" value={formData.materialType || ''} onChange={handleChange} className="w-full px-4 py-3 bg-white border border-slate-300 rounded-md text-sm text-slate-700 font-medium shadow-sm outline-none appearance-none">
                  <option value="">Select Material</option>
                  <option value="Cotton Jersey">Cotton Jersey</option>
                  <option value="Denim">Denim</option>
                  <option value="Polyester Blend">Polyester Blend</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-2">COLOR CODE / REF</label>
                <input name="colorCodeRef" value={formData.colorCodeRef || ''} onChange={handleChange} type="text" placeholder="e.g. Pantone 19-4052" className="w-full px-4 py-3 bg-white border border-slate-300 rounded-md text-sm text-slate-700 font-medium shadow-sm outline-none" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-2">BATCH ID</label>
                <input name="batchId" value={formData.batchId || ''} onChange={handleChange} type="text" placeholder="Lot #8849-24" className="w-full px-4 py-3 bg-white border border-slate-300 rounded-md text-sm text-slate-700 font-medium shadow-sm outline-none" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:p-6">
               <div>
                <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-2">SAMPLE ORIGIN (FACTORY)</label>
                <input name="sampleOrigin" value={formData.sampleOrigin || ''} onChange={handleChange} type="text" placeholder="Unit 4 - Dyeing Wing" className="w-full px-4 py-3 bg-white border border-slate-300 rounded-md text-sm text-slate-700 font-medium shadow-sm outline-none" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-2">SUPPLIER REFERENCE</label>
                <input name="supplierReference" value={formData.supplierReference || ''} onChange={handleChange} type="text" placeholder="Global Textiles Corp" className="w-full px-4 py-3 bg-white border border-slate-300 rounded-md text-sm text-slate-700 font-medium shadow-sm outline-none" />
              </div>
            </div>
          </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-6 lg:p-8 shadow-[0_1px_3px_rgba(0,0,0,0.05)] relative overflow-hidden">
          <div className="absolute top-4 sm:p-6 lg:p-8 left-8 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm">02</div>
          <div className="absolute right-0 bottom-0 opacity-[0.03] pointer-events-none">
             {/* Huge Beaker Icon SVG */}
             <svg width="300" height="300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M4.5 3h15"/><path d="M6 3v16a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V3"/><path d="M6 14h12"/></svg>
          </div>
          <div className="pl-12 relative z-10">
            <h3 className="text-lg font-bold text-slate-800 mb-6">Test Selection</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
               {tests.map(test => {
                 const isChecked = (formData.selectedTests || []).includes(test.id);
                 return (
                   <div key={test.id} onClick={() => handleTestToggle(test.id)} className={`p-4 border rounded-lg cursor-pointer transition-colors flex items-start gap-4 ${isChecked ? 'border-[#0033a0] bg-blue-50/30' : 'border-slate-200 hover:border-slate-300'}`}>
                     <div className={`mt-0.5 w-5 h-5 rounded flex items-center justify-center shrink-0 border ${isChecked ? 'bg-[#0033a0] border-[#0033a0]' : 'bg-white border-slate-300'}`}>
                        {isChecked && <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                     </div>
                     <div>
                       <h4 className="font-bold text-sm text-slate-800">{test.id}</h4>
                       <p className="text-xs text-slate-500 mt-1 leading-relaxed">{test.desc}</p>
                     </div>
                   </div>
                 )
               })}
            </div>
          </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:p-6">
        <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-6 lg:p-8 shadow-[0_1px_3px_rgba(0,0,0,0.05)] relative flex flex-col">
            <div className="absolute top-4 sm:p-6 lg:p-8 left-8 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm">03</div>
            <div className="pl-12 flex-1 flex flex-col">
              <h3 className="text-lg font-bold text-slate-800 mb-6">Attachments</h3>
              
              <div className="border-2 border-dashed border-slate-300 rounded-xl bg-slate-50 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 mb-4 flex-1">
                 <Upload className="w-8 h-8 text-slate-400 mb-4" />
                 <h4 className="font-bold text-slate-800 mb-1">Drag and drop technical sheets</h4>
                 <p className="text-xs text-slate-500 mb-4">PDF, JPG or PNG up to 10MB</p>
                 <button className="px-4 py-2 border border-slate-300 bg-white shadow-sm font-bold text-sm rounded">Browse Files</button>
              </div>

               <div className="flex items-center justify-between p-3 border border-slate-200 rounded-lg bg-white">
                 <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-blue-600" />
                    <span className="text-sm font-bold text-slate-700">Material_Specs_V2.pdf</span>
                 </div>
                 <button className="text-rose-500 hover:text-rose-700 p-1">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                 </button>
               </div>
            </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-6 lg:p-8 shadow-[0_1px_3px_rgba(0,0,0,0.05)] relative">
            <div className="absolute top-4 sm:p-6 lg:p-8 left-8 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm">04</div>
            <div className="pl-12">
              <h3 className="text-lg font-bold text-slate-800 mb-6">Priority & Deadline</h3>
              
              <div className="mb-6">
                <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-2">PRIORITY LEVEL</label>
                <div className="flex bg-slate-50 border border-slate-200 p-1 rounded-lg">
                  {['Standard', 'Urgent', 'Critical'].map(level => (
                    <button 
                      key={level}
                      onClick={() => setFormData(prev => ({...prev, priorityLevel: level as any}))}
                      className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${formData.priorityLevel === level ? 'bg-white text-[#0033a0] shadow-sm border border-blue-200' : 'text-slate-500 hover:text-slate-700 border border-transparent'}`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

               <div className="mb-6">
                <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-2">REQUIRED COMPLETION DATE</label>
                <input name="requiredCompletionDate" value={formData.requiredCompletionDate || ''} onChange={handleChange} type="date" className="w-full px-4 py-3 bg-white border border-slate-300 rounded-md text-sm text-slate-700 font-medium shadow-sm outline-none" />
                {formData.priorityLevel === 'Urgent' && (
                  <p className="text-xs text-rose-600 font-medium mt-2">Urgent requests incur a 20% surcharge in laboratory fees.</p>
                )}
              </div>

               <div>
                <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-2">INTERNAL REMARKS</label>
                <textarea 
                  name="internalRemarks" 
                  value={formData.internalRemarks || ''} 
                  onChange={handleChange} 
                  placeholder="Additional instructions for lab technicians..." 
                  className="w-full px-4 py-3 bg-white border border-slate-300 rounded-md text-sm text-slate-700 font-medium shadow-sm outline-none h-24 resize-none"
                />
              </div>
            </div>
        </div>
      </div>

      <div className="flex justify-end items-center gap-4 pt-4 border-t border-slate-200 mt-6">
        <button onClick={onCancel} className="font-bold text-slate-600 hover:text-slate-800 px-4 py-2">Save as Draft</button>
        <button onClick={submit} className="bg-[#0033a0] text-white px-8 py-3 rounded text-sm font-bold flex items-center gap-2 hover:bg-blue-800 shadow-sm">
          Submit Test Request <Send className="w-4 h-4 ml-2" />
        </button>
      </div>

    </div>
  );
}
