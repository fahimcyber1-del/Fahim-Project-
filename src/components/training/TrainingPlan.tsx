import React, { useState } from 'react';
import { TrainingRecord } from './types';
import { Search, Filter, AlertTriangle, Eye, Edit3, Trash2, PlusCircle, Users, Clock } from 'lucide-react';

interface TrainingPlanProps {
  records: TrainingRecord[];
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onNew: () => void;
}

export function TrainingPlan({ records, onView, onEdit, onDelete, onNew }: TrainingPlanProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('All');

  const filteredRecords = records.filter(record => {
    const matchesSearch = record.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          record.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'All' || record.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-emerald-100 text-emerald-800';
      case 'In Progress': return 'bg-blue-100 text-blue-800';
      case 'Planned': return 'bg-slate-100 text-slate-800';
      case 'Cancelled': return 'bg-rose-100 text-rose-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  return (
    <div className="flex flex-col h-full bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden min-h-0">
      <div className="p-4 border-b border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search Trainings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500 w-full sm:w-64"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500"
            >
              <option value="All">All Statuses</option>
              <option value="Planned">Planned</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>
        <button
          onClick={onNew}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold hover:bg-indigo-700 transition-colors whitespace-nowrap shadow-sm"
        >
          <PlusCircle className="w-4 h-4" /> New Training
        </button>
      </div>

      <div className="flex-1 overflow-auto p-4 min-h-0">
        {filteredRecords.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-slate-500 h-full border-2 border-dashed border-slate-200 rounded-xl">
            <AlertTriangle className="w-12 h-12 text-slate-300 mb-4" />
            <p className="font-medium text-slate-900">No training plans found</p>
            <p className="text-sm mt-1 mb-4 text-center max-w-md">There are no records matching your search or filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredRecords.map((record) => (
              <div key={record.id} className="group bg-white border border-slate-200 hover:border-indigo-300 rounded-xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex flex-col">
                     <span className="text-xs font-bold text-slate-500">{record.id} • {record.type}</span>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => onView(record.id)} className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 rounded-md transition-colors" title="View Details">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button onClick={() => onEdit(record.id)} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-slate-100 rounded-md transition-colors" title="Edit">
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button onClick={() => onDelete(record.id)} className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-slate-100 rounded-md transition-colors" title="Delete">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="mb-4 flex-1">
                  <h3 className="font-bold text-slate-900 text-lg leading-tight mb-2 line-clamp-1" title={record.title}>
                    {record.title}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2">{record.description}</p>
                </div>

                <div className="flex items-center gap-4 mb-4 text-xs font-medium text-slate-600">
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {record.startDate}</span>
                  <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {record.attendees.length}/{record.maxAttendees}</span>
                </div>

                <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${getStatusColor(record.status)}`}>
                    {record.status}
                  </span>
                  <div className="text-[10px] font-bold text-slate-400">
                     {record.durationHours} Hours
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
