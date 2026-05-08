import React, { useState, useRef } from 'react';
import { DefectItem } from './types';
import { Save, AlertTriangle, CheckCircle, ArrowLeft, Upload, Link, Link2, Search, X, FileText, Image as ImageIcon, Plus, Trash2, ShieldCheck, History } from 'lucide-react';

interface DefectFormProps {
  initialData?: DefectItem;
  categories: string[];
  departments: string[];
  standards: string[];
  onSave: (record: DefectItem) => void;
  onCancel: () => void;
}

export function DefectForm({ initialData, categories, departments, standards, onSave, onCancel }: DefectFormProps) {
  const fileInputPass = useRef<HTMLInputElement>(null);
  const fileInputFail = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<Partial<DefectItem>>(initialData || {
    id: `DEF-${Math.floor(Math.random() * 10000)}`,
    code: '',
    name: '',
    category: categories[0] || 'Stitching',
    severity: 'Major',
    status: 'Draft',
    impactedDepartments: [],
    passReferenceImages: [],
    failCriteriaImages: [],
    qualityStandardRef: '',
    sopLink: '',
    acceptanceCriteria: '',
    rootCauseAnalysis: [],
    correctiveAction: '',
    preventiveAction: '',
    revisionNumber: 'v1.0',
    lastUpdatedBy: 'Current User',
    lastUpdatedDate: 'Just now'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDepartmentToggle = (dept: string) => {
    setFormData(prev => {
      const current = prev.impactedDepartments || [];
      if (current.includes(dept)) {
        return { ...prev, impactedDepartments: current.filter(d => d !== dept) };
      }
      return { ...prev, impactedDepartments: [...current, dept] };
    });
  };

  const handleSave = (status: 'Active' | 'Draft' = 'Active') => {
    if (!formData.code || !formData.name) {
      alert("Please enter Defect Code and Name");
      return;
    }
    onSave({ ...formData, status } as DefectItem);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, fieldName: 'passReferenceImages' | 'failCriteriaImages') => {
    const files = e.target.files;
    if (files && files.length > 0) {
      Array.from(files as Iterable<File>).forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setFormData(prev => {
            const currentArray = prev[fieldName] || [];
            return { ...prev, [fieldName]: [...currentArray, reader.result as string] };
          });
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number, fieldName: 'passReferenceImages' | 'failCriteriaImages') => {
    setFormData(prev => {
      const currentArray = [...(prev[fieldName] || [])];
      currentArray.splice(index, 1);
      return { ...prev, [fieldName]: currentArray };
    });
  };

  const addRCAStep = () => {
    setFormData(prev => {
      const rca = prev.rootCauseAnalysis || [];
      return {
        ...prev,
        rootCauseAnalysis: [...rca, { step: rca.length + 1, description: '' }]
      };
    });
  };

  const updateRCAStep = (index: number, value: string) => {
    setFormData(prev => {
      const rca = [...(prev.rootCauseAnalysis || [])];
      rca[index].description = value;
      return { ...prev, rootCauseAnalysis: rca };
    });
  };

  const removeRCAStep = (index: number) => {
    setFormData(prev => {
      const rca = [...(prev.rootCauseAnalysis || [])];
      rca.splice(index, 1);
      // Re-number steps
      const newRca = rca.map((item, i) => ({ ...item, step: i + 1 }));
      return { ...prev, rootCauseAnalysis: newRca };
    });
  };

  return (
    <div className="max-w-6xl mx-auto flex flex-col h-full space-y-6 pb-12">
      <div className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-slate-200">
        <div className="flex flex-col">
          <h2 className="text-xl font-black text-slate-800 tracking-tight">Registration: New Defect Entry</h2>
          <p className="text-slate-500 font-medium text-sm">Define standard quality attributes and classification for manufacturing defects.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={onCancel} className="px-4 py-2 border border-slate-300 text-slate-700 bg-white hover:bg-slate-50 font-semibold rounded-lg text-sm shadow-sm transition-colors">
            Cancel
          </button>
          <button onClick={() => handleSave('Draft')} className="px-4 py-2 border border-slate-300 text-slate-700 bg-white hover:bg-slate-50 font-semibold rounded-lg text-sm shadow-sm transition-colors">
            Save as Draft
          </button>
          <button onClick={() => handleSave('Active')} className="px-6 py-2 bg-blue-700 text-white font-bold rounded-lg shadow-sm hover:bg-blue-800 transition-colors">
            Publish to Library
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:p-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4 sm:p-6">
            <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-6">
              <AlertTriangle className="w-5 h-5 text-blue-600" /> General Information
            </h3>
            
            <div className="grid grid-cols-2 gap-4 sm:p-6 mb-6">
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Defect Code</label>
                <input 
                  type="text" 
                  name="code"
                  placeholder="e.g., DF-TEX-042" 
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold outline-none focus:border-blue-500 focus:bg-white transition-all"
                  value={formData.code || ''}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Category</label>
                <select 
                  name="category"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold outline-none focus:border-blue-500 focus:bg-white transition-all appearance-none"
                  value={formData.category}
                  onChange={handleChange}
                >
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Defect Name</label>
              <input 
                type="text" 
                name="name"
                placeholder="e.g., Vertical Needle Drop" 
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold outline-none focus:border-blue-500 focus:bg-white transition-all"
                value={formData.name || ''}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4 sm:p-6">
             <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-6">
              <Search className="w-5 h-5 text-blue-600" /> Visual Standards
            </h3>
            
            <div className="grid grid-cols-2 gap-4 sm:p-6">
              {/* Pass Reference */}
              <div className="flex flex-col gap-3">
                <div 
                  className="relative group rounded-xl border-2 border-dashed border-slate-200 hover:border-emerald-400 bg-slate-50 transition-all overflow-hidden flex flex-col items-center justify-center cursor-pointer" 
                  style={{ minHeight: '160px' }}
                  onClick={() => fileInputPass.current?.click()}
                >
                  <input type="file" ref={fileInputPass} className="hidden" accept="image/*" multiple onChange={(e) => handleFileUpload(e, 'passReferenceImages')} />
                  <ImageIcon className="w-8 h-8 text-slate-400 mb-2" />
                  <p className="font-bold text-slate-700 text-sm mb-1 group-hover:text-emerald-600 transition-colors">Upload Pass Reference</p>
                  <p className="text-xs text-slate-400 font-medium">Acceptable boundary image</p>
                </div>
                {formData.passReferenceImages && formData.passReferenceImages.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.passReferenceImages.map((img, i) => (
                      <div key={i} className="relative w-20 h-20 rounded-lg overflow-hidden border border-slate-200 group">
                        <img src={img} alt="Pass" className="w-full h-full object-cover" />
                        <button 
                          onClick={(e) => { e.stopPropagation(); removeImage(i, 'passReferenceImages'); }} 
                          className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity z-10"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Fail Criteria */}
              <div className="flex flex-col gap-3">
                <div 
                  className="relative group rounded-xl border-2 border-dashed border-slate-200 hover:border-rose-400 bg-slate-50 transition-all overflow-hidden flex flex-col items-center justify-center cursor-pointer" 
                  style={{ minHeight: '160px' }}
                  onClick={() => fileInputFail.current?.click()}
                >
                  <input type="file" ref={fileInputFail} className="hidden" accept="image/*" multiple onChange={(e) => handleFileUpload(e, 'failCriteriaImages')} />
                  <ImageIcon className="w-8 h-8 text-slate-400 mb-2" />
                  <p className="font-bold text-slate-700 text-sm mb-1 group-hover:text-rose-600 transition-colors">Upload Fail Criteria</p>
                  <p className="text-xs text-slate-400 font-medium">Current reference image</p>
                </div>
                {formData.failCriteriaImages && formData.failCriteriaImages.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.failCriteriaImages.map((img, i) => (
                      <div key={i} className="relative w-20 h-20 rounded-lg overflow-hidden border border-slate-200 group">
                        <img src={img} alt="Fail" className="w-full h-full object-cover" />
                        <button 
                          onClick={(e) => { e.stopPropagation(); removeImage(i, 'failCriteriaImages'); }} 
                          className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity z-10"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4 sm:p-6">
            <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-4">
              <ShieldCheck className="w-5 h-5 text-blue-600" /> Resolution Protocol
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:p-6">
              <div>
                 <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Corrective Action</label>
                 <textarea 
                    name="correctiveAction"
                    className="w-full h-24 px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium outline-none focus:border-blue-500 focus:bg-white transition-all resize-none"
                    placeholder="Immediate steps to correct the defect..."
                    value={formData.correctiveAction || ''}
                    onChange={handleChange}
                 />
              </div>
              <div>
                 <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Preventive Action</label>
                 <textarea 
                    name="preventiveAction"
                    className="w-full h-24 px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium outline-none focus:border-blue-500 focus:bg-white transition-all resize-none"
                    placeholder="Long-term steps to prevent recurrence..."
                    value={formData.preventiveAction || ''}
                    onChange={handleChange}
                 />
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
               <h3 className="font-bold text-slate-800 flex items-center gap-2">
                 <Search className="w-5 h-5 text-blue-600" /> Root Cause Analysis
               </h3>
               <button onClick={addRCAStep} className="text-sm font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 flex items-center gap-1 px-3 py-1.5 rounded transition">
                 <Plus className="w-4 h-4" /> Add Step
               </button>
            </div>
            <div className="space-y-3">
              {(formData.rootCauseAnalysis || []).map((rca, index) => (
                <div key={index} className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 font-bold flex flex-shrink-0 justify-center items-center text-xs">
                    {rca.step}
                  </div>
                  <input
                    type="text"
                    value={rca.description}
                    onChange={(e) => updateRCAStep(index, e.target.value)}
                    placeholder="Describe investigation step..."
                    className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500 focus:bg-white"
                  />
                  <button onClick={() => removeRCAStep(index)} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {(formData.rootCauseAnalysis || []).length === 0 && (
                <div className="text-center py-6 bg-slate-50 border border-slate-200 border-dashed rounded-lg">
                  <p className="text-sm font-medium text-slate-500">No Root Cause steps added.</p>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4 sm:p-6">
             <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-6">
              <AlertTriangle className="w-5 h-5 text-blue-600" /> Classification
            </h3>
            
            <div className="space-y-3">
              {[
                { type: 'Critical', desc: 'Unusable, safety hazard or major loss', color: 'rose', bg: 'bg-rose-50', border: 'border-rose-200' },
                { type: 'Major', desc: 'Significant aesthetic issue, reduced life', color: 'amber', bg: 'bg-amber-50', border: 'border-amber-400' }, // Current selected border style in example
                { type: 'Minor', desc: 'Small aesthetic blemish, fully functional', color: 'slate', bg: 'bg-slate-50', border: 'border-slate-200' },
              ].map(level => {
                const isSelected = formData.severity === level.type;
                const activeColor = level.color === 'rose' ? 'border-rose-500 bg-rose-50' : 
                                    level.color === 'amber' ? 'border-amber-500 bg-amber-50' : 
                                    'border-slate-500 bg-slate-100';

                return (
                  <label key={level.type} className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${isSelected ? activeColor : `border-slate-100 hover:border-slate-300`}`}>
                    <input 
                      type="radio" 
                      name="severity" 
                      value={level.type} 
                      className="w-4 h-4 text-blue-600" 
                      checked={isSelected}
                      onChange={handleChange}
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`font-bold text-${level.color}-700`}>{level.type}</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">{level.desc}</p>
                    </div>
                  </label>
                )
              })}
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4 sm:p-6">
             <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-4">
              <FileText className="w-5 h-5 text-blue-600" /> Acceptance Criteria
            </h3>
            <textarea 
               name="acceptanceCriteria"
               className="w-full h-32 px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium outline-none focus:border-blue-500 focus:bg-white transition-all resize-none"
               placeholder="Describe the quantitative and qualitative tolerance for this defect..."
               value={formData.acceptanceCriteria || ''}
               onChange={handleChange}
            />
          </div>

          <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4 sm:p-6">
            <h3 className="font-bold text-slate-800 uppercase tracking-wider text-xs mb-4">Impacted Departments</h3>
            <div className="flex flex-wrap gap-2">
              {departments.map(dept => {
                const isSelected = formData.impactedDepartments?.includes(dept);
                return (
                  <button
                    key={dept}
                    onClick={() => handleDepartmentToggle(dept)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${
                      isSelected 
                      ? 'bg-blue-100 text-blue-700 border border-blue-200 flex items-center gap-1.5' 
                      : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100 relative'
                    }`}
                  >
                    {dept}
                    {isSelected && <X className="w-3 h-3" />}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4 sm:p-6">
            <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-6">
              <Link2 className="w-5 h-5 text-blue-600" /> Standards & Config
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Quality Standard Ref</label>
                <div className="relative">
                  <select
                    name="qualityStandardRef"
                    className="w-full px-4 py-2.5 pr-10 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold outline-none focus:border-blue-500 focus:bg-white transition-all appearance-none"
                    value={formData.qualityStandardRef || ''}
                    onChange={handleChange}
                  >
                    <option value="">Select a Standard...</option>
                    {standards.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <Link className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">SOP Link (Internal)</label>
                <div className="relative">
                  <input 
                    type="text" 
                    name="sopLink"
                    placeholder="Paste internal Wiki or SharePoint link" 
                    className="w-full px-4 py-2.5 pr-10 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold outline-none focus:border-blue-500 focus:bg-white transition-all"
                    value={formData.sopLink || ''}
                    onChange={handleChange}
                  />
                  <Link2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2 flex justify-between items-center">
                  <span>Revision Number</span>
                  <History className="w-3.5 h-3.5" />
                </label>
                <input 
                  type="text" 
                  name="revisionNumber"
                  placeholder="e.g. v1.2" 
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500 focus:bg-white transition-all"
                  value={formData.revisionNumber || ''}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
