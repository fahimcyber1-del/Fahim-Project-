import React, { useState, useEffect, useRef } from 'react';
import SignaturePad, { SignaturePadRef } from "../ui/SignaturePad";
import { AuditRecord, IsoQuestion, IsoQuestionTemplate } from './types';
import { ArrowLeft, Save, Upload, Camera, FileText, Trash2, Plus } from 'lucide-react';
import { useSubSuppliersState } from '../../store';

interface AuditFormProps {
  initialData?: AuditRecord;
  isoQuestionsTemplate?: IsoQuestionTemplate[];
  supplierQuestionsTemplate?: IsoQuestionTemplate[];
  onSave: (data: AuditRecord) => void;
  onCancel: () => void;
}

export function AuditForm({ initialData, isoQuestionsTemplate = [], supplierQuestionsTemplate = [], onSave, onCancel }: AuditFormProps) {
  const { suppliers } = useSubSuppliersState();
  const [formData, setFormData] = useState<Partial<AuditRecord>>(initialData || {
    id: `AUD-2023-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
    title: '',
    type: 'INTERNAL',
    status: 'PLANNED',
    date: new Date().toISOString().split('T')[0],
    auditor: '',
    department: '',
    location: '',
    findings: [],
    isoQuestions: [],
    remarks: '',
    attachments: []
  });

  const sigPadRef = useRef<SignaturePadRef>(null);

  const [sigInputName, setSigInputName] = useState('');
  const [sigInputDesignation, setSigInputDesignation] = useState('');
  const [sigInputDate, setSigInputDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    try {
      const storedProfile = localStorage.getItem('userProfile');
      if (storedProfile) {
        const profile = JSON.parse(storedProfile);
        if (profile.name) setSigInputName(profile.name);
        if (profile.role) setSigInputDesignation(profile.role);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const handleClearSignature = () => {
    if (sigPadRef.current) {
      sigPadRef.current.clear();
    }
  };

  const handleAddSignature = () => {
    if (!sigPadRef.current) return;
    const imgUrl = sigPadRef.current.isEmpty() ? '' : sigPadRef.current.toDataURL();
    
    if (!sigInputName.trim() && !imgUrl) {
      alert("Please draw a signature or provide a name.");
      return;
    }

    const newSig = {
      id: `sig-${Date.now()}`,
      name: sigInputName,
      designation: sigInputDesignation,
      date: sigInputDate,
      image: imgUrl
    };

    setFormData(prev => ({
      ...prev,
      signatures: [...(prev.signatures || []), newSig]
    }));

    setSigInputName('');
    setSigInputDesignation('');
    setSigInputDate(new Date().toISOString().split('T')[0]);
    sigPadRef.current.clear();
  };

  const handleRemoveSignature = (id: string) => {
    setFormData(prev => ({
      ...prev,
      signatures: (prev.signatures || []).filter(s => s.id !== id)
    }));
  };

  useEffect(() => {
    if (initialData?.signatureImage && sigPadRef.current) {
      // We don't load the image into the canvas if it's already in signatures
      // Or we can leave this block since we are moving away from single signature.
    }
  }, [initialData]);

  useEffect(() => {
    if ((formData.type === 'INTERNAL' || formData.type === 'SUPPLIER') && (!formData.isoQuestions || formData.isoQuestions.length === 0)) {
      const targetTemplate = formData.type === 'SUPPLIER' ? supplierQuestionsTemplate : isoQuestionsTemplate;
      setFormData(prev => ({ 
        ...prev, 
        isoQuestions: targetTemplate.map(q => ({
          ...q,
          evaluation: null,
          evidence: ''
        }))
      }));
    }
  }, [formData.type, isoQuestionsTemplate, supplierQuestionsTemplate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleIsoQuestionChange = (index: number, field: keyof IsoQuestion, value: any) => {
    setFormData(prev => {
      const qs = [...(prev.isoQuestions || [])];
      qs[index] = { ...qs[index], [field]: value };
      
      // Calculate score based on answers if necessary
      let score = 0;
      let totalAssessed = 0;
      qs.forEach(q => {
        if (q.evaluation) {
          totalAssessed++;
          if (q.evaluation === 'OK') score += 10;
          else if (q.evaluation === 'Minor NC') score += 5;
          // Major NC / Critical NC = 0
        }
      });
      const finalScore = totalAssessed > 0 ? Math.round((score / (totalAssessed * 10)) * 100) : 0;

      return { ...prev, isoQuestions: qs, score: finalScore };
    });
  };

  const handleImageUpload = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleIsoQuestionChange(index, 'image', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGeneralFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []) as File[];
    
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          attachments: [
            ...(prev.attachments || []),
            { name: file.name, type: file.type, data: reader.result as string }
          ]
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const removeAttachment = (indexToRemove: number) => {
    setFormData(prev => ({
      ...prev,
      attachments: (prev.attachments || []).filter((_, index) => index !== indexToRemove)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData as AuditRecord);
  };

  return (
    <div className="max-w-4xl mx-auto pb-12 w-full">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button 
            onClick={onCancel}
            className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-2xl font-black text-slate-800">Schedule New Audit</h2>
            <p className="text-sm font-medium text-slate-500">Enter details for the new audit.</p>
          </div>
        </div>
      </div>

      <form className="bg-white border border-slate-200 rounded-xl shadow-sm p-4 sm:p-6 lg:p-8 space-y-8" onSubmit={handleSubmit}>
        <div>
          <h3 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">Audit Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:p-6">
            <div className="col-span-2">
              <label className="block text-xs font-bold text-slate-600 uppercase mb-2">Audit Title</label>
              <input 
                type="text" name="title" value={formData.title} onChange={handleChange} required
                className="w-full px-4 py-2 border border-slate-300 rounded text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500" 
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase mb-2">Audit Type</label>
              <select name="type" value={formData.type} onChange={handleChange} className="w-full px-4 py-2 border border-slate-300 rounded text-sm">
                <option value="INTERNAL">Internal Quality Audit</option>
                <option value="EXTERNAL">External Official Audit</option>
                <option value="SUPPLIER">Supplier Audit</option>
                <option value="THIRD_PARTY">Third Party Certification</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase mb-2">Date</label>
              <input type="date" name="date" value={formData.date} onChange={handleChange} required className="w-full px-4 py-2 border border-slate-300 rounded text-sm" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase mb-2">Auditor / Lead Auditor</label>
              <input type="text" name="auditor" value={formData.auditor} onChange={handleChange} required className="w-full px-4 py-2 border border-slate-300 rounded text-sm" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase mb-2">Department / Scope</label>
              <input type="text" name="department" value={formData.department} onChange={handleChange} required className="w-full px-4 py-2 border border-slate-300 rounded text-sm" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase mb-2">Location</label>
              <input type="text" name="location" value={formData.location} onChange={handleChange} required className="w-full px-4 py-2 border border-slate-300 rounded text-sm" />
            </div>
            {formData.type === 'SUPPLIER' && (
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-2">Sub Supplier</label>
                <select name="subSupplier" value={formData.subSupplier || ''} onChange={handleChange} required className="w-full px-4 py-2 border border-slate-300 rounded text-sm">
                  <option value="">Select Sub Supplier...</option>
                  {suppliers.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                </select>
              </div>
            )}
            <div className="col-span-2">
              <label className="block text-xs font-bold text-slate-600 uppercase mb-2">Initial Remarks / Scope Notes</label>
              <textarea name="remarks" value={formData.remarks} onChange={handleChange} rows={3} className="w-full px-4 py-2 border border-slate-300 rounded text-sm resize-none" />
            </div>
          </div>
        </div>

        {(formData.type === 'INTERNAL' || formData.type === 'SUPPLIER') && formData.isoQuestions && formData.isoQuestions.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-2">
              <h3 className="text-lg font-bold text-slate-800">
                {formData.type === 'SUPPLIER' ? 'Sub Supplier Evaluation' : 'ISO 9001:2015 Evaluation'}
              </h3>
              {formData.score !== undefined && (
                <div className="bg-slate-100 px-4 py-1.5 rounded-full border border-slate-200 shadow-sm">
                  <span className="text-sm font-bold text-slate-600 uppercase mr-2">Calculated Score:</span>
                  <span className="text-base font-black text-blue-700">{formData.score}%</span>
                </div>
              )}
            </div>
            
            <div className="space-y-6">
              {formData.isoQuestions.map((q, index) => (
                <div key={q.id} className="p-4 border border-slate-200 rounded-lg bg-slate-50 relative">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded font-bold text-xs">Clause {q.clause}</span>
                        <h4 className="font-semibold text-slate-800 text-sm leading-tight">{q.question}</h4>
                      </div>
                      
                      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Evaluation</label>
                          <select 
                            value={q.evaluation || ''} 
                            onChange={(e) => handleIsoQuestionChange(index, 'evaluation', e.target.value)}
                            className="w-full px-3 py-1.5 border border-slate-300 rounded text-sm bg-white"
                          >
                            <option value="">Select Evaluation...</option>
                            <option value="CRITICAL NC">Critical NC</option>
                            <option value="MAJOR NC">Major NC</option>
                            <option value="MINOR NC">Minor NC</option>
                            <option value="OK">OK</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Evidence / Remarks</label>
                          <input 
                            type="text" 
                            value={q.evidence} 
                            onChange={(e) => handleIsoQuestionChange(index, 'evidence', e.target.value)}
                            placeholder="Document Ref, observation, etc."
                            className="w-full px-3 py-1.5 border border-slate-300 rounded text-sm bg-white"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="w-full md:w-32 flex flex-col gap-2 shrink-0 border-l border-slate-200 pl-4">
                      <label className="block text-xs font-bold text-slate-500 uppercase">Attachment</label>
                      {q.image ? (
                        <div className="relative group rounded border border-slate-200 overflow-hidden h-20 w-full">
                          <img src={q.image} alt="Evidence" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/50 hidden group-hover:flex items-center justify-center">
                            <label className="cursor-pointer text-white hover:text-blue-200">
                              <Camera className="w-5 h-5" />
                              <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(index, e)} />
                            </label>
                          </div>
                        </div>
                      ) : (
                        <label className="flex flex-col items-center justify-center h-20 border-2 border-dashed border-slate-300 rounded cursor-pointer hover:bg-slate-100 transition-colors">
                          <Upload className="w-5 h-5 text-slate-400 mb-1" />
                          <span className="text-[10px] text-slate-500 font-semibold uppercase">Add Image</span>
                          <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(index, e)} />
                        </label>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div>
           <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-2">
             <h3 className="text-lg font-bold text-slate-800">Additional Attachments</h3>
           </div>
           
           <div className="space-y-4">
             {formData.attachments && formData.attachments.length > 0 && (
               <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-4">
                 {formData.attachments.map((file, index) => (
                   <div key={index} className="relative group border border-slate-200 rounded-lg p-2 flex flex-col items-center bg-slate-50">
                     <button 
                       type="button" 
                       onClick={() => removeAttachment(index)}
                       className="absolute -top-2 -right-2 bg-white border border-slate-200 text-rose-500 rounded-full p-1 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity z-10 hover:bg-rose-50"
                     >
                       <Trash2 className="w-3 h-3" />
                     </button>
                     <FileText className="w-8 h-8 text-slate-400 mb-2" />
                     <p className="text-[10px] text-slate-700 truncate w-full text-center" title={file.name}>{file.name}</p>
                   </div>
                 ))}
               </div>
             )}
             
             <label className="flex flex-col items-center justify-center p-4 sm:p-6 border-2 border-dashed border-slate-300 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors w-full">
               <Upload className="w-6 h-6 text-slate-400 mb-2" />
               <span className="text-sm font-semibold text-slate-600">Click to upload files</span>
               <span className="text-xs text-slate-500 mt-1">PDF, JPG, PNG (Max 5MB)</span>
               <input type="file" multiple accept="image/*,.pdf" className="hidden" onChange={handleGeneralFileUpload} />
             </label>
           </div>
        </div>

        {/* E-Signatures Section */}
        <div>
          <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-2">
            <h3 className="text-lg font-bold text-slate-800">E-Signatures / Approvals</h3>
          </div>
          
          {(formData.signatures && formData.signatures.length > 0) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              {formData.signatures.map((sig) => (
                <div key={sig.id} className="border border-slate-200 rounded-lg p-4 bg-white shadow-sm flex items-start gap-4">
                  <div className="flex-1 space-y-1">
                    <p className="font-bold text-slate-800">{sig.name || 'Unnamed'}</p>
                    <p className="text-sm font-medium text-slate-500">{sig.designation || 'No Designation'}</p>
                    <p className="text-xs text-slate-400">Signed on: {sig.date}</p>
                    {sig.image && (
                      <div className="mt-2 border border-slate-100 rounded bg-slate-50 inline-block p-1">
                        <img src={sig.image} alt="Signature" className="h-12 object-contain mix-blend-multiply" />
                      </div>
                    )}
                  </div>
                  <button type="button" onClick={() => handleRemoveSignature(sig.id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded" title="Remove signature">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 border border-slate-200 rounded-lg">
            <div className="md:col-span-2 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-2">Draw Signature</label>
                <div className="border border-slate-300 bg-white rounded-lg overflow-hidden flex items-center justify-center relative touch-none aspect-square w-full max-w-[250px]">
                  <SignaturePad 
                    ref={sigPadRef} 
                    canvasProps={{className: 'w-full h-full cursor-crosshair'}} 
                    backgroundColor="white"
                  />
                  <button type="button" onClick={handleClearSignature} className="absolute top-2 right-2 p-1.5 bg-red-100 text-red-600 rounded opacity-70 hover:opacity-100 transition-opacity" title="Clear signature">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase mb-2">E-Signature Name</label>
              <input 
                type="text" 
                value={sigInputName} 
                onChange={(e) => setSigInputName(e.target.value)}
                placeholder="Type full name"
                className="w-full px-4 py-2 border border-slate-300 rounded text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 font-serif italic" 
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase mb-2">Designation</label>
              <input
                type="text"
                value={sigInputDesignation}
                onChange={(e) => setSigInputDesignation(e.target.value)}
                placeholder="e.g. Lead Auditor"
                className="w-full px-4 py-2 border border-slate-300 rounded text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-600 uppercase mb-2">Signature Date</label>
              <input 
                type="date" 
                value={sigInputDate} 
                onChange={(e) => setSigInputDate(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500" 
              />
            </div>
            <div className="md:col-span-2 mt-2">
              <button type="button" onClick={handleAddSignature} className="px-4 py-2 bg-slate-800 text-white rounded text-sm font-bold shadow-sm hover:bg-slate-700 flex items-center justify-center gap-2">
                <Plus className="w-4 h-4" /> Add Signature
              </button>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
          <button type="button" onClick={onCancel} className="px-6 py-2 rounded border border-slate-300 text-slate-700 text-sm font-bold hover:bg-slate-50">Cancel</button>
          <button type="submit" className="px-6 py-2 rounded bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 flex items-center gap-2">
            <Save className="w-4 h-4" /> Save Audit
          </button>
        </div>
      </form>
    </div>
  );
}
