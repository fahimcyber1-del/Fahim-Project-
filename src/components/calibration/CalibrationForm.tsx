import React, { useState } from 'react';
import { Equipment } from './types';
import { ArrowLeft, Save, Upload, XCircle, FileText } from 'lucide-react';

interface CalibrationFormProps {
  initialData?: Equipment;
  onSave: (data: Equipment) => void;
  onCancel: () => void;
}

export function CalibrationForm({ initialData, onSave, onCancel }: CalibrationFormProps) {
  const [formData, setFormData] = useState<Partial<Equipment>>(initialData || {
    id: `EQ-2023-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
    name: '',
    manufacturer: '',
    model: '',
    serialNumber: '',
    location: '',
    status: 'ACTIVE',
    lastCalibrationDate: new Date().toISOString().split('T')[0],
    nextCalibrationDate: '',
    calibrationFrequency: 12,
    calibrationType: 'INTERNAL',
    vendor: '',
    certificateNumber: '',
    tolerance: '',
    remarks: '',
    calibrations: []
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'calibrationFrequency' ? parseInt(value) || 0 : value
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, imageUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePdfUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, certificateUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData as Equipment);
  };

  return (
    <div className="max-w-4xl mx-auto pb-12 w-full">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button 
            onClick={onCancel}
            className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 hover:text-slate-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-2xl font-black text-slate-800">
              {initialData ? 'Edit Equipment' : 'Add New Equipment'}
            </h2>
            <p className="text-sm font-medium text-slate-500">
              {initialData ? 'Update equipment details and calibration.' : 'Enter new laboratory equipment details.'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={onCancel}
            className="px-6 py-2.5 rounded-lg border border-slate-300 text-slate-700 text-sm font-bold hover:bg-slate-50 transition-colors bg-white shadow-sm"
          >
            Cancel
          </button>
          <button 
            onClick={handleSubmit}
            className="px-6 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 transition-colors shadow-sm flex items-center gap-2"
          >
            <Save className="w-4 h-4" /> Save Equipment
          </button>
        </div>
      </div>

      <form className="bg-white border border-slate-200 rounded-xl shadow-sm p-4 sm:p-6 lg:p-8 space-y-8" onSubmit={handleSubmit}>
        
        {/* Basic Information */}
        <div>
          <h3 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">Basic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:p-6">
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Equipment Name</label>
              <input 
                type="text" 
                name="name" 
                value={formData.name || ''} 
                onChange={handleChange} 
                required
                className="w-full px-4 py-3 bg-white border border-slate-300 rounded-md text-sm text-slate-700 font-medium shadow-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" 
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Equipment ID</label>
              <input 
                type="text" 
                name="id" 
                value={formData.id || ''} 
                onChange={handleChange} 
                readOnly
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-md text-sm text-slate-700 font-medium shadow-sm outline-none" 
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Manufacturer</label>
              <input 
                type="text" 
                name="manufacturer" 
                value={formData.manufacturer || ''} 
                onChange={handleChange} 
                required
                className="w-full px-4 py-3 bg-white border border-slate-300 rounded-md text-sm text-slate-700 font-medium shadow-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" 
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Model</label>
              <input 
                type="text" 
                name="model" 
                value={formData.model || ''} 
                onChange={handleChange} 
                required
                className="w-full px-4 py-3 bg-white border border-slate-300 rounded-md text-sm text-slate-700 font-medium shadow-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" 
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Serial Number</label>
              <input 
                type="text" 
                name="serialNumber" 
                value={formData.serialNumber || ''} 
                onChange={handleChange} 
                required
                className="w-full px-4 py-3 bg-white border border-slate-300 rounded-md text-sm text-slate-700 font-medium shadow-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" 
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Location</label>
              <input 
                type="text" 
                name="location" 
                value={formData.location || ''} 
                onChange={handleChange} 
                required
                className="w-full px-4 py-3 bg-white border border-slate-300 rounded-md text-sm text-slate-700 font-medium shadow-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" 
              />
            </div>
          </div>
        </div>

        {/* Calibration Settings */}
        <div>
          <h3 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">Calibration Settings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:p-6">
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Status</label>
              <select 
                name="status" 
                value={formData.status || ''} 
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white border border-slate-300 rounded-md text-sm text-slate-700 font-medium shadow-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              >
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
                <option value="CALIBRATION_DUE">Calibration Due</option>
                <option value="OUT_OF_SERVICE">Out of Service</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Calibration Type</label>
              <select 
                name="calibrationType" 
                value={formData.calibrationType || ''} 
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white border border-slate-300 rounded-md text-sm text-slate-700 font-medium shadow-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              >
                <option value="INTERNAL">Internal Calibration</option>
                <option value="EXTERNAL">External (3rd Party)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Calibration Frequency (Months)</label>
              <input 
                type="number" 
                name="calibrationFrequency" 
                value={formData.calibrationFrequency || 12} 
                onChange={handleChange} 
                min="1"
                className="w-full px-4 py-3 bg-white border border-slate-300 rounded-md text-sm text-slate-700 font-medium shadow-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" 
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Tolerance / Acceptance Criteria</label>
              <input 
                type="text" 
                name="tolerance" 
                value={formData.tolerance || ''} 
                onChange={handleChange} 
                placeholder="e.g. +/- 0.5%"
                className="w-full px-4 py-3 bg-white border border-slate-300 rounded-md text-sm text-slate-700 font-medium shadow-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" 
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Last Calibration Date</label>
              <input 
                type="date" 
                name="lastCalibrationDate" 
                value={formData.lastCalibrationDate || ''} 
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white border border-slate-300 rounded-md text-sm text-slate-700 font-medium shadow-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" 
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Next Calibration Date</label>
              <input 
                type="date" 
                name="nextCalibrationDate" 
                value={formData.nextCalibrationDate || ''} 
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white border border-slate-300 rounded-md text-sm text-slate-700 font-medium shadow-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" 
              />
            </div>
            {formData.calibrationType === 'EXTERNAL' && (
              <div className="col-span-2">
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">External Vendor</label>
                <input 
                  type="text" 
                  name="vendor" 
                  value={formData.vendor || ''} 
                  onChange={handleChange} 
                  className="w-full px-4 py-3 bg-white border border-slate-300 rounded-md text-sm text-slate-700 font-medium shadow-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" 
                />
              </div>
            )}
          </div>
        </div>
        
        {/* Attachments & Remarks */}
        <div>
           <h3 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">Documentation</h3>
           <div className="space-y-6">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:p-6">
               <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Certificate PDF</label>
                  {formData.certificateUrl ? (
                    <div className="relative group rounded border border-slate-200 overflow-hidden h-32 w-full flex items-center justify-center bg-slate-50">
                      <FileText className="w-8 h-8 text-slate-400 mb-2" />
                      <span className="text-xs font-medium text-slate-600 ml-2">PDF Uploaded</span>
                      <div className="absolute inset-0 bg-black/50 hidden group-hover:flex items-center justify-center gap-4">
                        <label className="cursor-pointer text-white hover:text-blue-200">
                          <Upload className="w-5 h-5 mx-auto" />
                          <span className="text-[10px] uppercase font-bold mt-1 block">Change</span>
                          <input type="file" accept="application/pdf" className="hidden" onChange={handlePdfUpload} />
                        </label>
                        <button type="button" onClick={() => setFormData(prev => ({...prev, certificateUrl: undefined}))} className="text-rose-200 hover:text-rose-400">
                           <XCircle className="w-5 h-5 mx-auto" />
                           <span className="text-[10px] uppercase font-bold mt-1 block">Remove</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <label className="border-2 border-dashed border-slate-300 rounded-lg p-4 sm:p-6 bg-slate-50 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-100 transition-colors">
                      <Upload className="w-8 h-8 text-slate-400 mb-2" />
                      <p className="text-sm font-semibold text-blue-600">Click to Upload PDF</p>
                      <input type="file" accept="application/pdf" className="hidden" onChange={handlePdfUpload} />
                    </label>
                  )}
               </div>
               <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Equipment Image</label>
                  {formData.imageUrl ? (
                    <div className="relative group rounded border border-slate-200 overflow-hidden h-32 w-full">
                      <img src={formData.imageUrl} alt="Equipment" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/50 hidden group-hover:flex items-center justify-center gap-4">
                        <label className="cursor-pointer text-white hover:text-blue-200">
                          <Upload className="w-5 h-5 mx-auto" />
                          <span className="text-[10px] uppercase font-bold mt-1 block">Change</span>
                          <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                        </label>
                        <button type="button" onClick={() => setFormData(prev => ({...prev, imageUrl: undefined}))} className="text-rose-200 hover:text-rose-400">
                           <XCircle className="w-5 h-5 mx-auto" />
                           <span className="text-[10px] uppercase font-bold mt-1 block">Remove</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <label className="border-2 border-dashed border-slate-300 rounded-lg p-4 sm:p-6 bg-slate-50 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-100 transition-colors">
                      <Upload className="w-8 h-8 text-slate-400 mb-2" />
                      <p className="text-sm font-semibold text-blue-600">Click to Upload Image</p>
                      <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                    </label>
                  )}
               </div>
             </div>
             <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Remarks / Notes</label>
              <textarea 
                name="remarks" 
                value={formData.remarks || ''} 
                onChange={handleChange} 
                rows={3}
                className="w-full px-4 py-3 bg-white border border-slate-300 rounded-md text-sm text-slate-700 font-medium shadow-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none" 
              />
            </div>
           </div>
        </div>

      </form>
    </div>
  );
}
