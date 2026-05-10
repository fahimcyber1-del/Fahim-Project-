import React, { useState } from 'react';
import { SubSupplierRecord, SupplierCategory, SupplierStatus, SupplierRiskLevel } from './types';
import { ArrowLeft, Save, Star, Upload, ImageIcon, Search } from 'lucide-react';
import { useSubSupplierCategoriesState, useSubSupplierConfig } from '../../store';
import { useApiStorage } from '../../hooks/useApiData';
import { INITIAL_DOCUMENTS } from '../document-control/mockData';
import { DocumentRecord } from '../document-control/types';
import { format } from 'date-fns';

interface SubSupplierFormProps {
  initialData?: SubSupplierRecord;
  onSave: (data: SubSupplierRecord) => void;
  onCancel: (view?: any) => void;
  onManageCategories?: () => void;
}

export function SubSupplierForm({ initialData, onSave, onCancel, onManageCategories }: SubSupplierFormProps) {
  const { categories } = useSubSupplierCategoriesState();
  const { config } = useSubSupplierConfig();
  const [documents] = useApiStorage<DocumentRecord>('aqm_documentcontrol_records', INITIAL_DOCUMENTS);
  const [showDocSuggestions, setShowDocSuggestions] = useState(false);

  const [formData, setFormData] = useState<Partial<SubSupplierRecord>>(initialData || {
    id: `SUP-${Math.floor(Math.random() * 10000)}`,
    name: '',
    email: '',
    phone: '',
    contactPerson: '',
    country: '',
    category: categories[0] || 'Fabric',
    rating: 0,
    status: 'Pending Approval',
    riskLevel: 'Medium',
    certifications: [],
    address: '',
    website: '',
    notes: '',
    joinDate: format(new Date(), 'yyyy-MM-dd'),
    logoUrl: '',
    documentCode: config.documentCode || ''
  });

  const filteredDocs = documents.filter(doc => 
    !formData.documentCode ||
    doc.id.toLowerCase().includes(formData.documentCode.toLowerCase()) || 
    doc.title.toLowerCase().includes(formData.documentCode.toLowerCase())
  );

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, logoUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'rating') {
      setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.contactPerson) return;
    
    const now = new Date().toISOString();
    const currentUser = 'John Doe'; // In a real app, this would be from an auth context
    
    const updatedData = {
      ...formData,
      lastEditedAt: now,
      lastEditedBy: currentUser,
      ...(initialData ? {} : { createdAt: now, createdBy: currentUser })
    };
    
    onSave(updatedData as SubSupplierRecord);
  };

  return (
    <div className="max-w-4xl mx-auto w-full pb-12">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={onCancel} className="p-2 bg-slate-100 text-slate-500 hover:bg-slate-200 rounded-full transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-black text-slate-900">{initialData ? 'Edit Supplier' : 'New Supplier Entry'}</h1>
          <p className="text-sm font-medium text-slate-500">Manage sub-supplier details and onboarding information</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 sm:p-6 space-y-8 flex-1">
          <div>
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest mb-4 border-b border-slate-100 pb-2">Company Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:p-6">
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Company Name</label>
                <input required type="text" name="name" value={formData.name || ''} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-blue-500" placeholder="Acme Corp" />
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider">Category</label>
                  {onManageCategories && (
                    <button type="button" onClick={onManageCategories} className="text-[10px] font-bold text-blue-600 hover:text-blue-800 uppercase tracking-wider">Manage</button>
                  )}
                </div>
                <select name="category" value={formData.category || ''} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-blue-500">
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div className="relative">
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Document Code</label>
                <div className="relative">
                  <input 
                    type="text" 
                    name="documentCode" 
                    value={formData.documentCode || ''} 
                    onChange={handleChange}
                    onFocus={() => setShowDocSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowDocSuggestions(false), 200)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 pl-9" 
                    placeholder="Search docs or type..." 
                  />
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                </div>
                {showDocSuggestions && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg z-50 max-h-48 overflow-y-auto">
                    {filteredDocs.length > 0 ? (
                      filteredDocs.map(doc => (
                        <button
                          key={doc.id}
                          type="button"
                          onClick={() => {
                            setFormData(prev => ({ ...prev, documentCode: `${doc.id} Rev ${doc.version}` }));
                            setShowDocSuggestions(false);
                          }}
                          className="w-full text-left px-3 py-2 hover:bg-slate-50 border-b border-slate-100 last:border-0 flex flex-col gap-0.5"
                        >
                          <span className="text-sm font-bold text-slate-800">{doc.id} (Rev {doc.version})</span>
                          <span className="text-[10px] text-slate-500 truncate">{doc.title}</span>
                        </button>
                      ))
                    ) : (
                      <div className="px-3 py-2 text-xs text-slate-500 text-center">No documents found.</div>
                    )}
                  </div>
                )}
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Country</label>
                <input required type="text" name="country" value={formData.country || ''} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-blue-500" placeholder="e.g., Vietnam" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Address</label>
                <input required type="text" name="address" value={formData.address || ''} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-blue-500" placeholder="123 Street Name, City, Postal Code" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Website</label>
                <input type="text" name="website" value={formData.website || ''} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-blue-500" placeholder="https://..." />
              </div>
            </div>
            
            <div className="mt-6">
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Company Logo</label>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 border rounded bg-slate-50 flex items-center justify-center overflow-hidden flex-shrink-0">
                  {formData.logoUrl ? (
                    <img src={formData.logoUrl} alt="Logo" className="w-full h-full object-cover" />
                  ) : (
                    <ImageIcon className="w-6 h-6 text-slate-300" />
                  )}
                </div>
                <div className="flex-1">
                  <label className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg shadow-sm text-sm font-bold hover:bg-slate-50 cursor-pointer transition-colors max-w-fit">
                    <Upload className="w-4 h-4" /> Upload Logo
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                  </label>
                  <p className="text-xs text-slate-500 mt-1">Recommended size: 256x256px. Formats: JPG, PNG.</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest mb-4 border-b border-slate-100 pb-2">Contact Person</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:p-6">
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Name</label>
                <input required type="text" name="contactPerson" value={formData.contactPerson || ''} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-blue-500" placeholder="Full Name" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Email</label>
                <input required type="email" name="email" value={formData.email || ''} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-blue-500" placeholder="email@example.com" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Phone</label>
                <input required type="text" name="phone" value={formData.phone || ''} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-blue-500" placeholder="+1..." />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest mb-4 border-b border-slate-100 pb-2">Onboarding & Risk Options</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:p-6">
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Status</label>
                <select name="status" value={formData.status || ''} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-blue-500">
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Pending Approval">Pending Approval</option>
                  <option value="Blacklisted">Blacklisted</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Risk Level</label>
                <select name="riskLevel" value={formData.riskLevel || ''} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-blue-500">
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Rating (0-5)</label>
                <div className="flex items-center gap-1 mt-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, rating: star }))}
                      className="focus:outline-none"
                    >
                      <Star 
                        className={`w-6 h-6 ${star <= (formData.rating || 0) ? 'fill-amber-500 text-amber-500' : 'text-slate-300'}`} 
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div>
             <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Notes / Remarks</label>
             <textarea 
               name="notes" 
               value={formData.notes || ''} 
               onChange={handleChange} 
               rows={4}
               className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-blue-500" 
               placeholder="Additional information..."
             />
          </div>

        </div>

        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-3 rounded-b-xl">
          <button type="button" onClick={onCancel} className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg text-sm font-bold hover:bg-white transition-colors">Cancel</button>
          <button type="submit" className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors shadow-sm">
            <Save className="w-4 h-4" /> {initialData ? 'Update Supplier' : 'Save Supplier'}
          </button>
        </div>
      </form>
    </div>
  );
}
