import React, { useState } from 'react';
import { MeetingRecord, MeetingType, MeetingStatus, Participant, AgendaItem, ActionItem } from './types';
import { ArrowLeft, Save, Plus, Trash2, Users, List as ListIcon, CheckSquare } from 'lucide-react';
import { format } from 'date-fns';

interface MeetingMinutesFormProps {
  initialData?: MeetingRecord;
  onSave: (data: MeetingRecord) => void;
  onCancel: () => void;
}

export function MeetingMinutesForm({ initialData, onSave, onCancel }: MeetingMinutesFormProps) {
  const [formData, setFormData] = useState<Partial<MeetingRecord>>(initialData || {
    id: `MM-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000).toString().padStart(3, '0')}`,
    title: '',
    type: 'General',
    date: format(new Date(), 'yyyy-MM-dd'),
    time: format(new Date(), 'HH:mm'),
    location: '',
    organizer: '',
    status: 'Draft',
    objective: '',
    participants: [],
    agenda: [],
    minutes: '',
    actionItems: [],
    dateCreated: format(new Date(), 'yyyy-MM-dd'),
    dateLastModified: format(new Date(), 'yyyy-MM-dd')
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: value,
      dateLastModified: format(new Date(), 'yyyy-MM-dd') 
    }));
  };

  // Participant Handlers
  const handleAddParticipant = () => {
    setFormData(prev => ({
      ...prev,
      participants: [...(prev.participants || []), {
        id: `P${Math.floor(1000 + Math.random() * 9000)}`,
        name: '',
        role: '',
        department: '',
        attended: true
      }]
    }));
  };

  const handleUpdateParticipant = (id: string, field: keyof Participant, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      participants: prev.participants?.map(p => p.id === id ? { ...p, [field]: value } : p)
    }));
  };

  const handleRemoveParticipant = (id: string) => {
    setFormData(prev => ({
      ...prev,
      participants: prev.participants?.filter(p => p.id !== id)
    }));
  };

  // Agenda Handlers
  const handleAddAgenda = () => {
    setFormData(prev => ({
      ...prev,
      agenda: [...(prev.agenda || []), {
        id: `A${Math.floor(1000 + Math.random() * 9000)}`,
        title: '',
        description: '',
        presenter: '',
        durationMinutes: 15
      }]
    }));
  };

  const handleUpdateAgenda = (id: string, field: keyof AgendaItem, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      agenda: prev.agenda?.map(a => a.id === id ? { ...a, [field]: value } : a)
    }));
  };

  const handleRemoveAgenda = (id: string) => {
    setFormData(prev => ({
      ...prev,
      agenda: prev.agenda?.filter(a => a.id !== id)
    }));
  };

  // Action Item Handlers
  const handleAddActionItem = () => {
    setFormData(prev => ({
      ...prev,
      actionItems: [...(prev.actionItems || []), {
        id: `ACT${Math.floor(1000 + Math.random() * 9000)}`,
        description: '',
        assignedTo: '',
        dueDate: format(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
        status: 'Open'
      }]
    }));
  };

  const handleUpdateActionItem = (id: string, field: keyof ActionItem, value: string) => {
    setFormData(prev => ({
      ...prev,
      actionItems: prev.actionItems?.map(a => a.id === id ? { ...a, [field]: value } : a)
    }));
  };

  const handleRemoveActionItem = (id: string) => {
    setFormData(prev => ({
      ...prev,
      actionItems: prev.actionItems?.filter(a => a.id !== id)
    }));
  };


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.date || !formData.time) return;
    onSave(formData as MeetingRecord);
  };

  return (
    <div className="max-w-5xl mx-auto w-full pb-12">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={onCancel} type="button" className="p-2 bg-slate-100 text-slate-500 hover:bg-slate-200 rounded-full transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-black text-slate-900">{initialData ? 'Edit Meeting Minutes' : 'New Meeting Minutes'}</h1>
          <p className="text-sm font-medium text-slate-500">Record discussion points and action items</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 sm:p-6 space-y-8 flex-1">
          
          {/* Basic Info */}
          <div>
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest mb-4 border-b border-slate-100 pb-2">Meeting Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:p-6">
              <div className="md:col-span-2">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Title *</label>
                <input required type="text" name="title" value={formData.title || ''} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500" placeholder="e.g. Q1 Operational Review" />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Type *</label>
                <select required name="type" value={formData.type || 'General'} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500">
                  <option value="General">General</option>
                  <option value="Management Review">Management Review</option>
                  <option value="Project status">Project status</option>
                  <option value="Board Meeting">Board Meeting</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Status</label>
                <select name="status" value={formData.status || 'Draft'} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500">
                  <option value="Draft">Draft</option>
                  <option value="Published">Published</option>
                  <option value="Archived">Archived</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Date *</label>
                  <input required type="date" name="date" value={formData.date || ''} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Time *</label>
                  <input required type="time" name="time" value={formData.time || ''} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500" />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Location / Link</label>
                <input type="text" name="location" value={formData.location || ''} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500" placeholder="e.g. Conference Room A or Zoom link" />
              </div>
              
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Organizer</label>
                <input type="text" name="organizer" value={formData.organizer || ''} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500" placeholder="Organizer name" />
              </div>

              <div className="md:col-span-2">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Objective</label>
                <textarea name="objective" value={formData.objective || ''} onChange={handleChange} rows={2} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500" placeholder="What is the goal of this meeting?" />
              </div>
            </div>
          </div>

          {/* Participants */}
          <div>
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-2">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest flex items-center gap-2"><Users className="w-4 h-4 text-indigo-600"/> Participants</h3>
              <button type="button" onClick={handleAddParticipant} className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-lg text-xs font-bold transition-colors">
                <Plus className="w-4 h-4" /> Add Participant
              </button>
            </div>

            {(!formData.participants || formData.participants.length === 0) ? (
              <p className="text-sm text-slate-500 italic">No participants added.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[500px]">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <th className="px-3 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Name</th>
                      <th className="px-3 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Role</th>
                      <th className="px-3 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Department</th>
                      <th className="px-3 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-center">Attended</th>
                      <th className="w-12"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {formData.participants.map(p => (
                      <tr key={p.id} className="border-b border-slate-100">
                        <td className="p-2"><input type="text" value={p.name} onChange={(e) => handleUpdateParticipant(p.id, 'name', e.target.value)} className="w-full px-2 py-1.5 border border-slate-300 rounded text-sm focus:border-indigo-500 outline-none" placeholder="Name" /></td>
                        <td className="p-2"><input type="text" value={p.role} onChange={(e) => handleUpdateParticipant(p.id, 'role', e.target.value)} className="w-full px-2 py-1.5 border border-slate-300 rounded text-sm focus:border-indigo-500 outline-none" placeholder="Role" /></td>
                        <td className="p-2"><input type="text" value={p.department} onChange={(e) => handleUpdateParticipant(p.id, 'department', e.target.value)} className="w-full px-2 py-1.5 border border-slate-300 rounded text-sm focus:border-indigo-500 outline-none" placeholder="Dept" /></td>
                        <td className="p-2 text-center"><input type="checkbox" checked={p.attended} onChange={(e) => handleUpdateParticipant(p.id, 'attended', e.target.checked)} className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500" /></td>
                        <td className="p-2 text-right">
                          <button type="button" onClick={() => handleRemoveParticipant(p.id)} className="p-1.5 text-rose-500 hover:bg-rose-50 rounded">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Agenda */}
          <div>
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-2">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest flex items-center gap-2"><ListIcon className="w-4 h-4 text-indigo-600"/> Agenda</h3>
              <button type="button" onClick={handleAddAgenda} className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-lg text-xs font-bold transition-colors">
                <Plus className="w-4 h-4" /> Add Topic
              </button>
            </div>

            {(!formData.agenda || formData.agenda.length === 0) ? (
              <p className="text-sm text-slate-500 italic">No agenda items added.</p>
            ) : (
              <div className="space-y-4">
                {formData.agenda.map((item, index) => (
                  <div key={item.id} className="relative bg-slate-50 border border-slate-200 rounded-lg p-3 pt-4">
                    <div className="absolute top-2 left-2 text-[10px] font-bold text-slate-400">#{index + 1}</div>
                    <button type="button" onClick={() => handleRemoveAgenda(item.id)} className="absolute top-2 right-2 p-1 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded">
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mt-4">
                      <div className="md:col-span-2">
                        <input type="text" value={item.title} onChange={(e) => handleUpdateAgenda(item.id, 'title', e.target.value)} className="w-full px-2 py-1.5 border border-slate-300 rounded text-sm focus:border-indigo-500 outline-none" placeholder="Topic Title" />
                      </div>
                      <div>
                        <input type="text" value={item.presenter} onChange={(e) => handleUpdateAgenda(item.id, 'presenter', e.target.value)} className="w-full px-2 py-1.5 border border-slate-300 rounded text-sm focus:border-indigo-500 outline-none" placeholder="Presenter" />
                      </div>
                      <div>
                        <div className="relative">
                          <input type="number" value={item.durationMinutes} onChange={(e) => handleUpdateAgenda(item.id, 'durationMinutes', Number(e.target.value))} className="w-full pl-2 pr-10 py-1.5 border border-slate-300 rounded text-sm focus:border-indigo-500 outline-none" placeholder="Duration" />
                          <span className="absolute right-2 top-1.5 text-xs text-slate-400 font-medium">min</span>
                        </div>
                      </div>
                      <div className="md:col-span-4">
                        <textarea value={item.description} onChange={(e) => handleUpdateAgenda(item.id, 'description', e.target.value)} rows={2} className="w-full px-2 py-1.5 border border-slate-300 rounded text-sm focus:border-indigo-500 outline-none" placeholder="Description/Notes..." />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Minutes / Meeting Notes */}
          <div>
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest mb-4 border-b border-slate-100 pb-2">Meeting Minutes</h3>
            <textarea 
              name="minutes" 
              value={formData.minutes || ''} 
              onChange={handleChange} 
              rows={8} 
              className="w-full px-3 py-3 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500 font-sans leading-relaxed mb-6" 
              placeholder="Record the official meeting minutes, decisions made, and key discussion points here..." 
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:p-6 bg-slate-50 p-4 rounded-lg border border-slate-100">
              <div className="md:col-span-2">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Decisions Made</label>
                <textarea 
                  name="decision" 
                  value={formData.decision || ''} 
                  onChange={handleChange} 
                  rows={3} 
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500" 
                  placeholder="Summarize key decisions made..." 
                />
              </div>
              <div className="flex items-center h-full pt-2">
                <input 
                  type="checkbox" 
                  id="followUpRequired"
                  name="followUpRequired" 
                  checked={!!formData.followUpRequired} 
                  onChange={(e) => setFormData(p => ({...p, followUpRequired: e.target.checked}))} 
                  className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500 mr-2" 
                />
                <label htmlFor="followUpRequired" className="text-sm font-bold text-slate-700">Follow-up Required</label>
              </div>
              <div>
                <label className={`block text-[10px] font-bold uppercase tracking-wider mb-1 ${formData.followUpRequired ? 'text-slate-500' : 'text-slate-400'}`}>Next Meeting Date</label>
                <input 
                  type="date" 
                  name="nextMeetingDate" 
                  disabled={!formData.followUpRequired}
                  value={formData.nextMeetingDate || ''} 
                  onChange={handleChange} 
                  className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-indigo-500 ${formData.followUpRequired ? 'border-slate-300 bg-white' : 'border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed'}`} 
                />
              </div>
            </div>
          </div>

          {/* Action Items */}
          <div>
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-2">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest flex items-center gap-2"><CheckSquare className="w-4 h-4 text-indigo-600"/> Action Items</h3>
              <button type="button" onClick={handleAddActionItem} className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-lg text-xs font-bold transition-colors">
                <Plus className="w-4 h-4" /> Add Action
              </button>
            </div>

            {(!formData.actionItems || formData.actionItems.length === 0) ? (
              <p className="text-sm text-slate-500 italic">No action items assigned.</p>
            ) : (
              <div className="space-y-3">
                {formData.actionItems.map((item, index) => (
                  <div key={item.id} className="flex flex-col md:flex-row gap-3 bg-white border border-slate-200 rounded-lg p-3">
                    <div className="flex-1">
                      <input type="text" value={item.description} onChange={(e) => handleUpdateActionItem(item.id, 'description', e.target.value)} className="w-full px-2 py-1.5 border border-slate-300 rounded text-sm focus:border-indigo-500 outline-none" placeholder="Action description..." />
                    </div>
                    <div className="w-full md:w-48">
                      <input type="text" value={item.assignedTo} onChange={(e) => handleUpdateActionItem(item.id, 'assignedTo', e.target.value)} className="w-full px-2 py-1.5 border border-slate-300 rounded text-sm focus:border-indigo-500 outline-none" placeholder="Assignee" />
                    </div>
                    <div className="w-full md:w-40">
                      <input type="date" value={item.dueDate} onChange={(e) => handleUpdateActionItem(item.id, 'dueDate', e.target.value)} className="w-full px-2 py-1.5 border border-slate-300 rounded text-sm focus:border-indigo-500 outline-none" />
                    </div>
                    <div className="w-full md:w-36">
                      <select value={item.status} onChange={(e) => handleUpdateActionItem(item.id, 'status', e.target.value)} className="w-full px-2 py-1.5 border border-slate-300 rounded text-sm focus:border-indigo-500 outline-none">
                        <option value="Open">Open</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                        <option value="Deferred">Deferred</option>
                      </select>
                    </div>
                    <button type="button" onClick={() => handleRemoveActionItem(item.id)} className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded md:mt-0 flex-shrink-0">
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
            <Save className="w-4 h-4" /> {initialData ? 'Update Minutes' : 'Save Minutes'}
          </button>
        </div>
      </form>
    </div>
  );
}
