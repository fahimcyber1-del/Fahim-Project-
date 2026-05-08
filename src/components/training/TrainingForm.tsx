import React, { useState, useRef } from 'react';
import { TrainingRecord, TrainingType, TrainingStatus, Attendee } from './types';
import { ArrowLeft, Save, Plus, Trash2, Users, UploadCloud } from 'lucide-react';
import { format } from 'date-fns';

interface TrainingFormProps {
  initialData?: TrainingRecord;
  onSave: (data: TrainingRecord) => void;
  onCancel: () => void;
}

export function TrainingForm({ initialData, onSave, onCancel }: TrainingFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState<Partial<TrainingRecord>>(initialData || {
    id: `TRN-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000).toString().padStart(4, '0')}`,
    title: '',
    description: '',
    type: 'Internal',
    status: 'Planned',
    trainer: '',
    location: '',
    startDate: format(new Date(), 'yyyy-MM-dd'),
    endDate: format(new Date(), 'yyyy-MM-dd'),
    durationHours: 1,
    maxAttendees: 20,
    attendees: [],
    dateCreated: format(new Date(), 'yyyy-MM-dd'),
    dateLastModified: format(new Date(), 'yyyy-MM-dd')
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'number' ? Number(value) : value,
      dateLastModified: format(new Date(), 'yyyy-MM-dd') 
    }));
  };

  const handleAddAttendee = () => {
    setFormData(prev => ({
      ...prev,
      attendees: [...(prev.attendees || []), {
        id: `A${Math.floor(1000 + Math.random() * 9000)}`,
        name: '',
        department: '',
        status: 'Registered',
        score: undefined
      }]
    }));
  };

  const handleUpdateAttendee = (id: string, field: keyof Attendee, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      attendees: prev.attendees?.map(a => a.id === id ? { ...a, [field]: value } : a)
    }));
  };

  const handleRemoveAttendee = (id: string) => {
    setFormData(prev => ({
      ...prev,
      attendees: prev.attendees?.filter(a => a.id !== id)
    }));
  };

  const handleCSVUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const csvData = event.target?.result as string;
      const lines = csvData.split('\n');
      const newAttendees: Attendee[] = [];
      
      // Skip header row if it contains 'name'
      let startIndex = 0;
      if (lines[0].toLowerCase().includes('name')) {
        startIndex = 1;
      }

      for (let i = startIndex; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        const parts = line.split(',');
        const name = parts[0];
        const department = parts[1] || '';
        const statusStr = parts[2]?.trim();
        const scoreStr = parts[3]?.trim();
        
        let status: 'Registered' | 'Attended' | 'Absent' = 'Registered';
        if (statusStr && ['Registered', 'Attended', 'Absent'].includes(statusStr)) {
          status = statusStr as 'Registered' | 'Attended' | 'Absent';
        }

        newAttendees.push({
          id: `A${Math.floor(10000 + Math.random() * 90000)}`,
          name: name?.trim() || 'Unknown',
          department: department?.trim() || '',
          status: status,
          score: scoreStr && !isNaN(Number(scoreStr)) ? Number(scoreStr) : undefined
        });
      }

      setFormData(prev => ({
        ...prev,
        attendees: [...(prev.attendees || []), ...newAttendees]
      }));

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    };
    reader.readAsText(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.trainer || !formData.startDate) return;
    onSave(formData as TrainingRecord);
  };

  return (
    <div className="max-w-5xl mx-auto w-full pb-12">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={onCancel} type="button" className="p-2 bg-slate-100 text-slate-500 hover:bg-slate-200 rounded-full transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-black text-slate-900">{initialData ? 'Edit Training' : 'New Training'}</h1>
          <p className="text-sm font-medium text-slate-500">Plan and manage training sessions</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 sm:p-6 space-y-8 flex-1">
          
          <div>
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest mb-4 border-b border-slate-100 pb-2">Training Info</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:p-6">
              <div className="md:col-span-2">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Title *</label>
                <input required type="text" name="title" value={formData.title || ''} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500" placeholder="e.g. ISO 9001 Awareness" />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Type</label>
                <select name="type" value={formData.type || 'Internal'} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500">
                  <option value="Internal">Internal</option>
                  <option value="External">External</option>
                  <option value="Online">Online</option>
                  <option value="On-the-job">On-the-job</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Status</label>
                <select name="status" value={formData.status || 'Planned'} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500">
                  <option value="Planned">Planned</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Trainer / Provider *</label>
                <input required type="text" name="trainer" value={formData.trainer || ''} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500" placeholder="Name or Organization" />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Location</label>
                <input type="text" name="location" value={formData.location || ''} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500" placeholder="e.g. Room A or Zoom link" />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Description</label>
                <textarea name="description" value={formData.description || ''} onChange={handleChange} rows={2} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500" placeholder="Training overview..." />
              </div>
            </div>
          </div>

          <div>
             <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest mb-4 border-b border-slate-100 pb-2">Scheduling</h3>
             <div className="grid grid-cols-1 md:grid-cols-4 gap-4 sm:p-6">
                <div>
                   <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Start Date *</label>
                   <input required type="date" name="startDate" value={formData.startDate || ''} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500" />
                </div>
                <div>
                   <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">End Date *</label>
                   <input required type="date" name="endDate" value={formData.endDate || ''} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500" />
                </div>
                <div>
                   <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Duration (Hours) *</label>
                   <input required type="number" min="0.5" step="0.5" name="durationHours" value={formData.durationHours || ''} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500" />
                </div>
                <div>
                   <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Max Attendees *</label>
                   <input required type="number" min="1" name="maxAttendees" value={formData.maxAttendees || ''} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500" />
                </div>
             </div>
          </div>

          <div>
             <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-2">
               <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest">Attendees & Attendance</h3>
               <div className="flex items-center gap-2">
                 <input 
                   type="file" 
                   accept=".csv" 
                   className="hidden" 
                   ref={fileInputRef} 
                   onChange={handleCSVUpload}
                 />
                 <button type="button" onClick={() => fileInputRef.current?.click()} className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-lg text-xs font-bold transition-colors">
                   <UploadCloud className="w-4 h-4" /> Bulk Import
                 </button>
                 <button type="button" onClick={handleAddAttendee} className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-lg text-xs font-bold transition-colors">
                   <Plus className="w-4 h-4" /> Add Attendee
                 </button>
               </div>
             </div>

             {(!formData.attendees || formData.attendees.length === 0) ? (
               <div className="text-center py-8 bg-slate-50 border border-dashed border-slate-300 rounded-xl">
                 <Users className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                 <p className="text-sm font-medium text-slate-500">No attendees registered yet.</p>
               </div>
             ) : (
               <div className="overflow-x-auto">
                 <table className="w-full text-left border-collapse">
                    <thead>
                       <tr className="bg-slate-50 border-b border-slate-200">
                          <th className="px-3 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Employee Name</th>
                          <th className="px-3 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Department</th>
                          <th className="px-3 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Status</th>
                          <th className="px-3 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider w-24">Score (%)</th>
                          <th className="px-3 py-2 w-12 text-center"></th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                       {formData.attendees.map((attendee) => (
                         <tr key={attendee.id}>
                            <td className="px-3 py-2">
                               <input type="text" value={attendee.name} onChange={(e) => handleUpdateAttendee(attendee.id, 'name', e.target.value)} className="w-full px-2 py-1.5 border border-slate-300 rounded text-sm focus:outline-none focus:border-indigo-500" placeholder="Name" />
                            </td>
                            <td className="px-3 py-2">
                               <input type="text" value={attendee.department} onChange={(e) => handleUpdateAttendee(attendee.id, 'department', e.target.value)} className="w-full px-2 py-1.5 border border-slate-300 rounded text-sm focus:outline-none focus:border-indigo-500" placeholder="Dept" />
                            </td>
                            <td className="px-3 py-2">
                               <select value={attendee.status} onChange={(e) => handleUpdateAttendee(attendee.id, 'status', e.target.value)} className="w-full px-2 py-1.5 border border-slate-300 rounded text-sm focus:outline-none focus:border-indigo-500">
                                  <option value="Registered">Registered</option>
                                  <option value="Attended">Attended</option>
                                  <option value="Absent">Absent</option>
                               </select>
                            </td>
                            <td className="px-3 py-2">
                               <input type="number" min="0" max="100" value={attendee.score === undefined ? '' : attendee.score} onChange={(e) => handleUpdateAttendee(attendee.id, 'score', e.target.value === '' ? '' : Number(e.target.value))} className="w-full px-2 py-1.5 border border-slate-300 rounded text-sm focus:outline-none focus:border-indigo-500" placeholder="-" />
                            </td>
                            <td className="px-3 py-2 text-right">
                               <button type="button" onClick={() => handleRemoveAttendee(attendee.id)} className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded transition-colors">
                                 <Trash2 className="w-4 h-4" />
                               </button>
                            </td>
                         </tr>
                       ))}
                    </tbody>
                 </table>
                 <div className="mt-2 text-xs font-semibold text-slate-500 text-right">
                    Total Attendees: {formData.attendees.length} / {formData.maxAttendees}
                 </div>
               </div>
             )}
          </div>
          
        </div>

        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-3 rounded-b-xl">
          <button type="button" onClick={onCancel} className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg text-sm font-bold hover:bg-white transition-colors">Cancel</button>
          <button type="submit" className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold hover:bg-indigo-700 transition-colors shadow-sm">
            <Save className="w-4 h-4" /> {initialData ? 'Update Training' : 'Save Training'}
          </button>
        </div>
      </form>
    </div>
  );
}
