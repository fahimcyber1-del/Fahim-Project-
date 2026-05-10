import React, { useState } from 'react';
import { JobDescriptionRecord, EmploymentType, ExperienceLevel, JDStatus, listItem } from './types';
import { ArrowLeft, Save, Plus, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

interface JobDescriptionFormProps {
  initialData?: JobDescriptionRecord;
  onSave: (data: JobDescriptionRecord) => void;
  onCancel: () => void;
}

export function JobDescriptionForm({ initialData, onSave, onCancel }: JobDescriptionFormProps) {
  const [formData, setFormData] = useState<Partial<JobDescriptionRecord>>(initialData || {
    id: `JD-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000).toString().padStart(4, '0')}`,
    title: '',
    department: '',
    location: '',
    employmentType: 'Full-time',
    experienceLevel: 'Entry Level',
    salaryRange: '',
    reportsTo: '',
    status: 'Draft',
    dateCreated: format(new Date(), 'yyyy-MM-dd'),
    dateLastModified: format(new Date(), 'yyyy-MM-dd'),
    summary: '',
    responsibilities: [],
    requirements: [],
    skills: []
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: value,
      dateLastModified: format(new Date(), 'yyyy-MM-dd') 
    }));
  };

  const handleListChange = (field: 'responsibilities' | 'requirements' | 'skills', id: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field]?.map(item => item.id === id ? { ...item, value } : item)
    }));
  };

  const handleAddListItem = (field: 'responsibilities' | 'requirements' | 'skills') => {
    setFormData(prev => ({
      ...prev,
      [field]: [...(prev[field] || []), { id: Math.random().toString(36).substring(7), value: '' }]
    }));
  };

  const handleRemoveListItem = (field: 'responsibilities' | 'requirements' | 'skills', id: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field]?.filter(item => item.id !== id)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.department || !formData.location) return;
    onSave(formData as JobDescriptionRecord);
  };

  return (
    <div className="max-w-5xl mx-auto w-full pb-12">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={onCancel} type="button" className="p-2 bg-slate-100 text-slate-500 hover:bg-slate-200 rounded-full transition-colors" aria-label="Go back">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-black text-slate-900">{initialData ? 'Edit Job Description' : 'New Job Description'}</h1>
          <p className="text-sm font-medium text-slate-500">Define role requirements and responsibilities</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 sm:p-6 space-y-8 flex-1">
          
          <div>
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest mb-4 border-b border-slate-100 pb-2">Basic Info</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:p-6">
              <div className="md:col-span-2">
                <label htmlFor="title" className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Job Title *</label>
                <input required id="title" type="text" name="title" value={formData.title || ''} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500" placeholder="e.g. Senior Software Engineer" />
              </div>

              <div>
                <label htmlFor="department" className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Department *</label>
                <input required id="department" type="text" name="department" value={formData.department || ''} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500" placeholder="e.g. Engineering" />
              </div>

              <div>
                <label htmlFor="location" className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Location *</label>
                <input required id="location" type="text" name="location" value={formData.location || ''} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500" placeholder="e.g. Remote, New York, NY" />
              </div>

              <div>
                <label htmlFor="employmentType" className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Employment Type</label>
                <select id="employmentType" name="employmentType" value={formData.employmentType || 'Full-time'} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500">
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Temporary">Temporary</option>
                  <option value="Internship">Internship</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="experienceLevel" className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Experience Level</label>
                <select id="experienceLevel" name="experienceLevel" value={formData.experienceLevel || 'Entry Level'} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500">
                  <option value="Entry Level">Entry Level</option>
                  <option value="Mid Level">Mid Level</option>
                  <option value="Senior Level">Senior Level</option>
                  <option value="Director">Director</option>
                  <option value="Executive">Executive</option>
                </select>
              </div>

              <div>
                <label htmlFor="salaryRange" className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Salary Range</label>
                <input id="salaryRange" type="text" name="salaryRange" value={formData.salaryRange || ''} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500" placeholder="e.g. $100,000 - $120,000" />
              </div>

              <div>
                <label htmlFor="reportsTo" className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Reports To</label>
                <input id="reportsTo" type="text" name="reportsTo" value={formData.reportsTo || ''} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500" placeholder="e.g. Director of Engineering" />
              </div>
              
              <div>
                <label htmlFor="status" className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Status</label>
                <select id="status" name="status" value={formData.status || 'Draft'} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500">
                  <option value="Draft">Draft</option>
                  <option value="Active">Active</option>
                  <option value="Closed">Closed</option>
                  <option value="Archived">Archived</option>
                </select>
              </div>
            </div>
          </div>

          <div>
             <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest mb-4 border-b border-slate-100 pb-2">Description</h3>
             <div className="space-y-4">
                <div>
                  <label htmlFor="summary" className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Summary *</label>
                  <textarea id="summary" required name="summary" rows={3} value={formData.summary || ''} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500" placeholder="Brief overview of the role..." />
                </div>
             </div>
          </div>

          {/* Responsibilities */}
          <div>
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-2">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest">Responsibilities</h3>
              <button type="button" onClick={() => handleAddListItem('responsibilities')} className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-lg text-xs font-bold transition-colors">
                <Plus className="w-4 h-4" /> Add Responsibility
              </button>
            </div>
            {(!formData.responsibilities || formData.responsibilities.length === 0) ? (
              <p className="text-sm text-slate-500 italic">No responsibilities added.</p>
            ) : (
              <div className="space-y-2">
                {formData.responsibilities.map((item, idx) => (
                  <div key={item.id} className="flex items-center gap-2">
                    <input type="text" aria-label={`Responsibility ${idx + 1}`} value={item.value} onChange={(e) => handleListChange('responsibilities', item.id, e.target.value)} className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500" placeholder="e.g. Develop and maintain backend services" />
                    <button type="button" aria-label={`Remove responsibility ${idx + 1}`} onClick={() => handleRemoveListItem('responsibilities', item.id)} className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Requirements */}
          <div>
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-2">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest">Requirements</h3>
              <button type="button" onClick={() => handleAddListItem('requirements')} className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-lg text-xs font-bold transition-colors">
                <Plus className="w-4 h-4" /> Add Requirement
              </button>
            </div>
            {(!formData.requirements || formData.requirements.length === 0) ? (
              <p className="text-sm text-slate-500 italic">No requirements added.</p>
            ) : (
              <div className="space-y-2">
                {formData.requirements.map((item, idx) => (
                  <div key={item.id} className="flex items-center gap-2">
                    <input type="text" aria-label={`Requirement ${idx + 1}`} value={item.value} onChange={(e) => handleListChange('requirements', item.id, e.target.value)} className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500" placeholder="e.g. 5+ years of software development experience." />
                    <button type="button" aria-label={`Remove requirement ${idx + 1}`} onClick={() => handleRemoveListItem('requirements', item.id)} className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Skills */}
          <div>
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-2">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest">Skills</h3>
              <button type="button" onClick={() => handleAddListItem('skills')} className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-lg text-xs font-bold transition-colors">
                <Plus className="w-4 h-4" /> Add Skill
              </button>
            </div>
            {(!formData.skills || formData.skills.length === 0) ? (
              <p className="text-sm text-slate-500 italic">No skills added.</p>
            ) : (
              <div className="space-y-2">
                {formData.skills.map((item, idx) => (
                  <div key={item.id} className="flex items-center gap-2">
                    <input type="text" aria-label={`Skill ${idx + 1}`} value={item.value} onChange={(e) => handleListChange('skills', item.id, e.target.value)} className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500" placeholder="e.g. TypeScript" />
                    <button type="button" aria-label={`Remove skill ${idx + 1}`} onClick={() => handleRemoveListItem('skills', item.id)} className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors">
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
            <Save className="w-4 h-4" /> {initialData ? 'Update JD' : 'Save JD'}
          </button>
        </div>
      </form>
    </div>
  );
}
