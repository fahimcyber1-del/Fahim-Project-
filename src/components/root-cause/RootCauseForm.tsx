import React, { useState, useRef } from 'react';
import { RootCauseRecord, RCAMethod, RCAStatus, RCAAttachment, FiveWhysData, FishboneData, OtherMethodData } from './types';
import { ArrowLeft, Save, Paperclip, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

interface RootCauseFormProps {
  initialData?: RootCauseRecord;
  onSave: (data: RootCauseRecord) => void;
  onCancel: () => void;
}

export function RootCauseForm({ initialData, onSave, onCancel }: RootCauseFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<Partial<RootCauseRecord>>(initialData || {
    id: `RCA-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000).toString().padStart(4, '0')}`,
    dateInitiated: format(new Date(), 'yyyy-MM-dd'),
    title: '',
    leadInvestigator: '',
    relatedIssueId: '',
    status: 'Draft',
    method: '5 Whys',
    analysisData: {
      problemStatement: '',
      why1: '',
      why2: '',
      why3: '',
      why4: '',
      why5: '',
      rootCause: ''
    } as FiveWhysData,
    correctiveActionsProposed: '',
    attachments: [],
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file: File) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        const newAttachment: RCAAttachment = {
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
    
    if (fileInputRef.current) fileInputRef.current.value = '';
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

  const handleMethodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const method = e.target.value as RCAMethod;
    let newAnalysisData;
    if (method === '5 Whys') {
      newAnalysisData = { problemStatement: formData.analysisData?.problemStatement || '', why1: '', why2: '', why3: '', why4: '', why5: '', rootCause: '' } as FiveWhysData;
    } else if (method === 'Fishbone (Ishikawa)') {
      newAnalysisData = { problemStatement: formData.analysisData?.problemStatement || '', manpower: '', machine: '', material: '', method: '', measurement: '', environment: '', rootCause: '' } as FishboneData;
    } else {
      newAnalysisData = { problemStatement: formData.analysisData?.problemStatement || '', methodName: method.toString(), analysisDetails: '', rootCause: '' } as OtherMethodData;
    }
    setFormData(prev => ({ ...prev, method, analysisData: newAnalysisData }));
  };

  const handleAnalysisDataChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      analysisData: { ...(prev.analysisData as any), [name]: value }
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.method) return;
    onSave(formData as RootCauseRecord);
  };

  const renderMethodFields = () => {
    if (formData.method === '5 Whys') {
      const data = formData.analysisData as FiveWhysData;
      return (
        <div className="space-y-4 pt-4 border-t border-slate-100">
           <p className="text-sm font-bold text-slate-800 mb-2 border-b pb-2">5 Whys Analysis</p>
           {[1, 2, 3, 4, 5].map(num => (
             <div key={num}>
                <label className="block text-xs font-bold text-slate-600 mb-1">Why {num}?</label>
                <input type="text" name={`why${num}`} value={(data as any)[`why${num}`] || ''} onChange={handleAnalysisDataChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500" placeholder={`Reason ${num}`} />
             </div>
           ))}
           <div className="pt-2">
             <label className="block text-xs font-bold text-rose-600 mb-1 uppercase tracking-wider">Identified Root Cause (from 5 Whys)</label>
             <textarea required name="rootCause" value={data.rootCause || ''} onChange={handleAnalysisDataChange} rows={3} className="w-full px-3 py-2 border border-rose-300 bg-rose-50 rounded-lg text-sm focus:outline-none focus:border-rose-500" placeholder="Final root cause conclusion" />
           </div>
        </div>
      );
    } else if (formData.method === 'Fishbone (Ishikawa)') {
      const data = formData.analysisData as FishboneData;
      return (
        <div className="space-y-4 pt-4 border-t border-slate-100">
           <p className="text-sm font-bold text-slate-800 mb-2 border-b pb-2">Fishbone (6M) Analysis</p>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             {['manpower', 'machine', 'material', 'method', 'measurement', 'environment'].map(cause => (
               <div key={cause}>
                  <label className="block text-xs font-bold text-slate-600 capitalize mb-1">{cause}</label>
                  <textarea name={cause} value={(data as any)[cause] || ''} onChange={handleAnalysisDataChange} rows={2} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500" placeholder={`Issues related to ${cause}`} />
               </div>
             ))}
           </div>
           <div className="pt-2">
             <label className="block text-xs font-bold text-rose-600 mb-1 uppercase tracking-wider">Identified Root Cause</label>
             <textarea required name="rootCause" value={data.rootCause || ''} onChange={handleAnalysisDataChange} rows={3} className="w-full px-3 py-2 border border-rose-300 bg-rose-50 rounded-lg text-sm focus:outline-none focus:border-rose-500" placeholder="Final root cause conclusion" />
           </div>
        </div>
      );
    } else {
      const data = formData.analysisData as OtherMethodData;
      return (
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <p className="text-sm font-bold text-slate-800 mb-2 border-b pb-2">{formData.method} Analysis Base</p>
          {formData.method === 'Other' && (
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Method Name</label>
              <input type="text" name="methodName" value={data.methodName || ''} onChange={handleAnalysisDataChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500" placeholder="Specify method Name" />
            </div>
          )}
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">Analysis Details</label>
            <textarea name="analysisDetails" value={data.analysisDetails || ''} onChange={handleAnalysisDataChange} rows={5} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500" placeholder="Describe the analysis flow and reasoning..." />
          </div>
          <div className="pt-2">
             <label className="block text-xs font-bold text-rose-600 mb-1 uppercase tracking-wider">Identified Root Cause</label>
             <textarea required name="rootCause" value={data.rootCause || ''} onChange={handleAnalysisDataChange} rows={3} className="w-full px-3 py-2 border border-rose-300 bg-rose-50 rounded-lg text-sm focus:outline-none focus:border-rose-500" placeholder="Final root cause conclusion" />
          </div>
        </div>
      );
    }
  };

  return (
    <div className="max-w-4xl mx-auto w-full pb-12">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={onCancel} type="button" className="p-2 bg-slate-100 text-slate-500 hover:bg-slate-200 rounded-full transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-black text-slate-900">{initialData ? 'Edit RCA' : 'New RCA'}</h1>
          <p className="text-sm font-medium text-slate-500">Document the investigation process to identify root causes</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 sm:p-6 space-y-8 flex-1">
          
          <div>
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest mb-4 border-b border-slate-100 pb-2">Investigation Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:p-6">
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Investigation Title *</label>
                <input required type="text" name="title" value={formData.title || ''} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500" placeholder="Clear title for the RCA" />
              </div>
              
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Lead Investigator *</label>
                <input required type="text" name="leadInvestigator" value={formData.leadInvestigator || ''} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500" placeholder="Name or Department" />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Date Initiated *</label>
                <input required type="date" name="dateInitiated" value={formData.dateInitiated || ''} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500" />
              </div>
              
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Related Issue ID</label>
                <input type="text" name="relatedIssueId" value={formData.relatedIssueId || ''} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500" placeholder="e.g. CAPA-2023-010" />
              </div>
              
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Status</label>
                <select name="status" value={formData.status || 'Draft'} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500">
                  <option value="Draft">Draft</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
             <div className="flex items-center justify-between mb-4 border-b border-slate-200 pb-3">
                 <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest flex items-center gap-2">
                    Method & Analysis
                 </h3>
                 <div className="w-48">
                   <select name="method" value={formData.method || '5 Whys'} onChange={handleMethodChange} className="w-full px-3 py-1.5 border border-slate-300 bg-white rounded-lg text-xs font-bold focus:outline-none focus:border-indigo-500 shadow-sm">
                     <option value="5 Whys">5 Whys</option>
                     <option value="Fishbone (Ishikawa)">Fishbone (Ishikawa)</option>
                     <option value="Fault Tree Analysis">Fault Tree Analysis</option>
                     <option value="Other">Other</option>
                   </select>
                 </div>
             </div>
             
             <div className="space-y-4">
                <div>
                   <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Problem Statement *</label>
                   <textarea required name="problemStatement" value={formData.analysisData?.problemStatement || ''} onChange={handleAnalysisDataChange} rows={3} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500 bg-white" placeholder="What is the problem being analyzed?" />
                </div>
                
                {renderMethodFields()}
             </div>
          </div>

          <div>
             <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest mb-4 border-b border-slate-100 pb-2">Proposed Actions</h3>
             <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Corrective Actions Proposed / Recommendations</label>
                <textarea name="correctiveActionsProposed" value={formData.correctiveActionsProposed || ''} onChange={handleChange} rows={4} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500" placeholder="How do you plan to prevent this root cause from reoccurring?" />
             </div>
          </div>
          
          <div>
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest mb-4 border-b border-slate-100 pb-2 flex items-center justify-between">
              Evidence & Documentation
              <div>
                <input type="file" multiple className="hidden" ref={fileInputRef} onChange={handleFileUpload} />
                <button type="button" onClick={() => fileInputRef.current?.click()} className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-lg text-xs font-bold transition-colors">
                  <Paperclip className="w-3.5 h-3.5" /> Attach Files
                </button>
              </div>
            </h3>
            
            {(!formData.attachments || formData.attachments.length === 0) ? (
              <div className="border border-dashed border-slate-300 rounded-lg p-4 sm:p-6 lg:p-8 text-center bg-slate-50">
                <Paperclip className="w-8 h-8 mx-auto text-slate-400 mb-2" />
                <p className="text-sm font-bold text-slate-700 mb-1">No attachments yet</p>
                <p className="text-xs text-slate-500">Upload documents or evidence related to this RCA.</p>
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
                    <button type="button" onClick={() => removeAttachment(index)} className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-full transition-colors flex-shrink-0 ml-4">
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
          <button type="submit" className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors shadow-sm">
            <Save className="w-4 h-4" /> {initialData ? 'Update RCA' : 'Save RCA'}
          </button>
        </div>
      </form>
    </div>
  );
}
