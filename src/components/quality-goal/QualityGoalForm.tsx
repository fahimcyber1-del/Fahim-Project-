import React, { useState } from 'react';
import { QualityGoalRecord, GoalMilestone } from './types';
import { ArrowLeft, Save, Plus, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

interface QualityGoalFormProps {
  initialData?: QualityGoalRecord;
  onSave: (data: QualityGoalRecord) => void;
  onCancel: () => void;
}

export function QualityGoalForm({ initialData, onSave, onCancel }: QualityGoalFormProps) {
  const [formData, setFormData] = useState<Partial<QualityGoalRecord>>(initialData || {
    id: `QG-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000).toString().padStart(4, '0')}`,
    title: '',
    category: 'Process Efficiency',
    targetValue: 0,
    currentValue: 0,
    unit: '%',
    status: 'On Track',
    startDate: format(new Date(), 'yyyy-MM-dd'),
    endDate: format(new Date(new Date().setFullYear(new Date().getFullYear() + 1)), 'yyyy-MM-dd'),
    owner: '',
    description: '',
    milestones: []
  });

  const getCalculatedProgress = (milestones: GoalMilestone[]): number => {
    if (!milestones || milestones.length === 0) return 0;
    const completed = milestones.filter(m => m.status === 'Completed').length;
    return Math.round((completed / milestones.length) * 100);
  };

  const calculatedProgress = getCalculatedProgress(formData.milestones || []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'number' ? parseFloat(value) || 0 : value 
    }));
  };

  const handleAddMilestone = () => {
    setFormData(prev => ({
      ...prev,
      milestones: [
        ...(prev.milestones || []),
        { id: `m-${Date.now()}`, title: '', dueDate: format(new Date(), 'yyyy-MM-dd'), status: 'Pending' }
      ]
    }));
  };

  const handleUpdateMilestone = (index: number, field: keyof GoalMilestone, value: string) => {
    const updatedMilestones = [...(formData.milestones || [])];
    updatedMilestones[index] = { ...updatedMilestones[index], [field]: value };
    setFormData(prev => ({ ...prev, milestones: updatedMilestones }));
  };

  const handleRemoveMilestone = (index: number) => {
    const updatedMilestones = [...(formData.milestones || [])];
    updatedMilestones.splice(index, 1);
    setFormData(prev => ({ ...prev, milestones: updatedMilestones }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.startDate || !formData.endDate) return;
    
    // Automatically include calculated progress
    onSave({
      ...formData,
      progress: calculatedProgress
    } as QualityGoalRecord);
  };

  return (
    <div className="max-w-4xl mx-auto w-full pb-12">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={onCancel} className="p-2 bg-slate-100 text-slate-500 hover:bg-slate-200 rounded-full transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-black text-slate-900">{initialData ? 'Edit Goal' : 'New Quality Goal'}</h1>
          <p className="text-sm font-medium text-slate-500">Define targets, metrics, and milestones</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 sm:p-6 space-y-8 flex-1">
          <div>
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest mb-4 border-b border-slate-100 pb-2">Goal Basics</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:p-6">
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Goal Title *</label>
                <input required type="text" name="title" value={formData.title || ''} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500" placeholder="e.g. Reduce Factory Defect Rate" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Description</label>
                <textarea name="description" value={formData.description || ''} onChange={handleChange} rows={3} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500" placeholder="Detailed description of the goal and intended impact..." />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Category</label>
                <select name="category" value={formData.category || ''} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500">
                  <option value="Defect Rate">Defect Rate</option>
                  <option value="Customer Satisfaction">Customer Satisfaction</option>
                  <option value="Compliance">Compliance</option>
                  <option value="Process Efficiency">Process Efficiency</option>
                  <option value="Safety">Safety</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Owner / Responsible</label>
                <input type="text" name="owner" value={formData.owner || ''} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500" placeholder="Person or team" />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest mb-4 border-b border-slate-100 pb-2">Metrics & Timeline</h3>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 sm:p-6 mb-6">
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Unit</label>
                <input type="text" name="unit" value={formData.unit || ''} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500" placeholder="%, ppm, etc." />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Target Value</label>
                <input type="number" step="0.01" name="targetValue" value={formData.targetValue || 0} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Current Value</label>
                <input type="number" step="0.01" name="currentValue" value={formData.currentValue || 0} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Status</label>
                <select name="status" value={formData.status || ''} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500">
                  <option value="On Track">On Track</option>
                  <option value="At Risk">At Risk</option>
                  <option value="Off Track">Off Track</option>
                  <option value="Achieved">Achieved</option>
                </select>
              </div>
              <div className="sm:col-span-4 mt-2">
                <div className="flex items-center justify-between mb-2">
                   <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider">Milestone Progress (Auto-calculated)</label>
                   <span className="text-sm font-bold text-indigo-600">{calculatedProgress}%</span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                   <div 
                     className="h-full bg-indigo-500 rounded-full transition-all duration-500" 
                     style={{ width: `${calculatedProgress}%` }}
                   ></div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:p-6">
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Start Date *</label>
                <input required type="date" name="startDate" value={formData.startDate || ''} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">End / Target Date *</label>
                <input required type="date" name="endDate" value={formData.endDate || ''} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500" />
              </div>
            </div>
          </div>

          <div>
             <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-2">
               <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest">Milestones & Action Items</h3>
               <button type="button" onClick={handleAddMilestone} className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1">
                 <Plus className="w-3 h-3" /> Add Milestone
               </button>
             </div>
             <div className="space-y-4">
               {formData.milestones && formData.milestones.length > 0 ? (
                 <div className="space-y-3">
                   {formData.milestones.map((milestone, index) => (
                     <div key={milestone.id} className="flex items-center gap-3 bg-slate-50 p-3 rounded-lg border border-slate-200">
                       <input 
                         type="text" 
                         value={milestone.title} 
                         onChange={(e) => handleUpdateMilestone(index, 'title', e.target.value)} 
                         placeholder="Milestone description"
                         className="flex-1 px-3 py-1.5 border border-slate-300 rounded text-sm focus:outline-none focus:border-indigo-500"
                       />
                       <input 
                         type="date" 
                         value={milestone.dueDate} 
                         onChange={(e) => handleUpdateMilestone(index, 'dueDate', e.target.value)} 
                         className="w-40 px-3 py-1.5 border border-slate-300 rounded text-sm focus:outline-none focus:border-indigo-500"
                       />
                       <select 
                         value={milestone.status} 
                         onChange={(e) => handleUpdateMilestone(index, 'status', e.target.value)} 
                         className="w-32 px-3 py-1.5 border border-slate-300 rounded text-sm focus:outline-none focus:border-indigo-500"
                       >
                         <option value="Pending">Pending</option>
                         <option value="Completed">Completed</option>
                       </select>
                       <button type="button" onClick={() => handleRemoveMilestone(index)} className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded">
                         <Trash2 className="w-4 h-4" />
                       </button>
                     </div>
                   ))}
                 </div>
               ) : (
                 <div className="text-center py-6 bg-slate-50 border border-dashed border-slate-300 rounded-lg">
                   <p className="text-sm text-slate-500">No milestones added. Break down the goal into smaller steps.</p>
                 </div>
               )}
             </div>
          </div>

        </div>

        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-3 rounded-b-xl">
          <button type="button" onClick={onCancel} className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg text-sm font-bold hover:bg-white transition-colors">Cancel</button>
          <button type="submit" className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold hover:bg-indigo-700 transition-colors shadow-sm">
            <Save className="w-4 h-4" /> {initialData ? 'Update Goal' : 'Save Goal'}
          </button>
        </div>
      </form>
    </div>
  );
}
