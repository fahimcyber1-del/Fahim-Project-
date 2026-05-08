import React, { useState } from 'react';
import { QualityGoalRecord } from './types';
import { ArrowLeft, Edit3, Target, Calendar, User, CheckCircle2, Circle, Save, X } from 'lucide-react';

interface QualityGoalDetailProps {
  record: QualityGoalRecord;
  onBack: () => void;
  onEdit: () => void;
  onUpdate: (updatedRecord: QualityGoalRecord) => void;
}

export function QualityGoalDetail({ record, onBack, onEdit, onUpdate }: QualityGoalDetailProps) {
  const [isEditingValue, setIsEditingValue] = useState(false);
  const [editValue, setEditValue] = useState(record.currentValue.toString());

  const handleSaveValue = () => {
    const val = parseFloat(editValue);
    if (!isNaN(val)) {
      onUpdate({ ...record, currentValue: val });
    }
    setIsEditingValue(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Achieved': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'On Track': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'At Risk': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Off Track': return 'bg-rose-100 text-rose-800 border-rose-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const completedMilestones = record.milestones.filter(m => m.status === 'Completed').length;
  const totalMilestones = record.milestones.length;
  const progressPct = record.progress ?? (totalMilestones > 0 ? (completedMilestones / totalMilestones) * 100 : 0);
  const milestoneProgress = progressPct;

  return (
    <div className="max-w-5xl mx-auto w-full pb-12">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
           <button onClick={onBack} className="p-2 bg-slate-100 text-slate-500 hover:bg-slate-200 rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-black text-slate-900">{record.title}</h1>
              <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${getStatusColor(record.status)}`}>
                {record.status}
              </span>
            </div>
            <p className="text-sm font-medium text-slate-500">{record.id} | {record.category}</p>
          </div>
        </div>
        <button onClick={onEdit} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-sm font-bold text-sm transition-colors">
          <Edit3 className="w-4 h-4" /> Edit Goal
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:p-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4 sm:p-6 overflow-hidden relative">
             <div className="absolute top-0 right-0 p-4 sm:p-6 opacity-5 pointer-events-none">
                <Target className="w-32 h-32" />
             </div>
             
             <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest mb-6 border-b border-slate-100 pb-2 relative z-10">Progress Tracking</h3>
             
             <div className="grid grid-cols-2 gap-4 sm:p-6 lg:p-8 mb-8 relative z-10">
               <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Current Value</p>
                  {isEditingValue ? (
                    <div className="flex items-center gap-2 mt-1">
                      <input 
                        type="number" 
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="w-24 text-2xl font-black text-slate-800 border-b-2 border-indigo-500 focus:outline-none bg-indigo-50/50 px-1 py-0.5 rounded-t"
                        autoFocus
                      />
                      <span className="text-sm font-bold text-slate-500 mr-2">{record.unit}</span>
                      <button onClick={handleSaveValue} className="p-1.5 bg-emerald-100 text-emerald-700 hover:bg-emerald-200 rounded-md transition-colors">
                        <Save className="w-4 h-4" />
                      </button>
                      <button onClick={() => { setIsEditingValue(false); setEditValue(record.currentValue.toString()); }} className="p-1.5 bg-slate-100 text-slate-600 hover:bg-slate-200 rounded-md transition-colors">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-end gap-1 group">
                      <span className="text-4xl font-black text-slate-800">{record.currentValue}</span>
                      <span className="text-sm font-bold text-slate-500 mb-1">{record.unit}</span>
                      <button 
                        onClick={() => { setEditValue(record.currentValue.toString()); setIsEditingValue(true); }}
                        className="opacity-0 group-hover:opacity-100 p-1.5 ml-2 text-indigo-600 hover:bg-indigo-50 rounded-md transition-all mb-1"
                        title="Update current value"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
               </div>
               <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Target Value</p>
                  <div className="flex items-end gap-1">
                    <span className="text-4xl font-black text-slate-400">{record.targetValue}</span>
                    <span className="text-sm font-bold text-slate-400 mb-1">{record.unit}</span>
                  </div>
               </div>
             </div>

             <div className="relative z-10">
               <div className="flex justify-between items-end mb-2">
                 <span className="text-xs font-bold text-slate-700">Estimated Completion</span>
                 <span className="text-xs font-bold text-slate-500">{Math.round(progressPct)}%</span>
               </div>
               <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                 <div 
                   className={`h-full rounded-full transition-all duration-1000 ${record.status === 'Achieved' ? 'bg-blue-500' : record.status === 'On Track' ? 'bg-emerald-500' : record.status === 'At Risk' ? 'bg-amber-500' : 'bg-rose-500'}`}
                   style={{ width: `${progressPct}%` }}
                 ></div>
               </div>
             </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4 sm:p-6">
             <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest mb-4 border-b border-slate-100 pb-2">Description & Context</h3>
             <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">{record.description || 'No description provided.'}</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4 sm:p-6">
             <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-2">
               <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest">Milestones</h3>
               <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded">{completedMilestones} of {totalMilestones} Completed</span>
             </div>
             
             {record.milestones.length > 0 ? (
               <div className="space-y-4">
                 <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden mb-6">
                   <div className="bg-indigo-500 h-full rounded-full" style={{ width: `${milestoneProgress}%` }}></div>
                 </div>
                 
                 <div className="space-y-3">
                   {record.milestones.map((milestone) => (
                     <div key={milestone.id} className={`flex items-start gap-3 p-3 rounded-lg border ${milestone.status === 'Completed' ? 'bg-emerald-50 border-emerald-100' : 'bg-slate-50 border-slate-200'}`}>
                       {milestone.status === 'Completed' ? (
                         <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                       ) : (
                         <Circle className="w-5 h-5 text-slate-300 flex-shrink-0 mt-0.5" />
                       )}
                       <div className="flex-1">
                         <p className={`text-sm font-bold ${milestone.status === 'Completed' ? 'text-emerald-900 line-through opacity-70' : 'text-slate-800'}`}>
                           {milestone.title}
                         </p>
                         <p className="text-xs font-medium text-slate-500 mt-1">Due: {milestone.dueDate}</p>
                       </div>
                       <div>
                         <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                           milestone.status === 'Completed' ? 'bg-emerald-200 text-emerald-800' : 'bg-slate-200 text-slate-600'
                         }`}>
                           {milestone.status}
                         </span>
                       </div>
                     </div>
                   ))}
                 </div>
               </div>
             ) : (
               <p className="text-sm text-slate-500 italic">No milestones defined for this goal.</p>
             )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4 sm:p-6">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest mb-4 border-b border-slate-100 pb-2">Timeline</h3>
            <div className="space-y-5">
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-slate-400 mt-0.5" />
                <div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">Start Date</p>
                  <p className="text-sm font-semibold text-slate-800">{record.startDate}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Target className="w-5 h-5 text-indigo-500 mt-0.5" />
                <div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">Target / Due Date</p>
                  <p className="text-sm font-semibold text-slate-800">{record.endDate}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4 sm:p-6">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest mb-4 border-b border-slate-100 pb-2">Ownership</h3>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center flex-shrink-0">
                <User className="w-5 h-5 text-slate-400" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800">{record.owner || 'Unassigned'}</p>
                <p className="text-xs font-medium text-slate-500">Goal Owner</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
