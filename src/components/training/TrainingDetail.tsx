import React from 'react';
import { TrainingRecord } from './types';
import { ArrowLeft, Edit3, Calendar, Clock, MapPin, User, Users, CheckCircle, XCircle } from 'lucide-react';

interface TrainingDetailProps {
  record: TrainingRecord;
  onBack: () => void;
  onEdit: () => void;
}

export function TrainingDetail({ record, onBack, onEdit }: TrainingDetailProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'In Progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Planned': return 'bg-slate-100 text-slate-800 border-slate-200';
      case 'Cancelled': return 'bg-rose-100 text-rose-800 border-rose-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const getAttendeeStatusBadge = (status: string) => {
    switch(status) {
       case 'Attended': return <span className="flex items-center gap-1 text-emerald-600 text-xs font-bold"><CheckCircle className="w-3 h-3" /> Attended</span>;
       case 'Absent': return <span className="flex items-center gap-1 text-rose-600 text-xs font-bold"><XCircle className="w-3 h-3" /> Absent</span>;
       default: return <span className="text-slate-500 text-xs font-bold px-2 py-0.5 bg-slate-100 rounded">Registered</span>;
    }
  };

  return (
    <div className="max-w-6xl mx-auto w-full pb-12">
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
            <p className="text-sm font-medium text-slate-500">ID: {record.id} • Type: {record.type}</p>
          </div>
        </div>
        <button onClick={onEdit} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-sm font-bold text-sm transition-colors">
          <Edit3 className="w-4 h-4" /> Edit Training
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:p-6">
         <div className="lg:col-span-2 space-y-6">
            
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4 sm:p-6">
               <h3 className="font-bold text-slate-800 uppercase tracking-widest text-sm mb-4">Description</h3>
               {record.description ? (
                 <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{record.description}</p>
               ) : (
                 <p className="text-sm text-slate-400 italic">No description provided.</p>
               )}
            </div>

            <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4 sm:p-6">
               <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-slate-800 uppercase tracking-widest text-sm">Attendance List</h3>
                  <div className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                     {record.attendees.length} / {record.maxAttendees} Attendees
                  </div>
               </div>
               
               {record.attendees.length > 0 ? (
                 <div className="overflow-x-auto">
                   <table className="w-full text-left border-collapse">
                      <thead>
                         <tr className="border-b border-slate-200">
                            <th className="px-3 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Name</th>
                            <th className="px-3 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Department</th>
                            <th className="px-3 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Status</th>
                            <th className="px-3 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right">Score</th>
                         </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                         {record.attendees.map(attendee => (
                           <tr key={attendee.id} className="hover:bg-slate-50">
                              <td className="px-3 py-3 text-sm font-semibold text-slate-900">{attendee.name}</td>
                              <td className="px-3 py-3 text-sm text-slate-600">{attendee.department}</td>
                              <td className="px-3 py-3">{getAttendeeStatusBadge(attendee.status)}</td>
                              <td className="px-3 py-3 text-sm font-medium text-slate-900 text-right">{attendee.score !== undefined ? `${attendee.score}%` : '-'}</td>
                           </tr>
                         ))}
                      </tbody>
                   </table>
                 </div>
               ) : (
                 <p className="text-sm text-slate-400 italic text-center py-4 border-2 border-dashed border-slate-100 rounded-lg">No attendees registered.</p>
               )}
            </div>

         </div>

         <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4 sm:p-6">
               <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest mb-4 border-b border-slate-100 pb-2">Training Details</h3>
               
               <div className="space-y-4">
                 <div className="flex items-start gap-3">
                   <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                     <User className="w-4 h-4 text-indigo-600" />
                   </div>
                   <div>
                     <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">Trainer / Provider</p>
                     <p className="text-sm font-bold text-slate-900">{record.trainer}</p>
                   </div>
                 </div>
                 
                 <div className="flex items-start gap-3">
                   <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                     <MapPin className="w-4 h-4 text-blue-600" />
                   </div>
                   <div>
                     <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">Location</p>
                     <p className="text-sm font-bold text-slate-900">{record.location || 'Not specified'}</p>
                   </div>
                 </div>

                 <div className="flex items-start gap-3">
                   <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                     <Calendar className="w-4 h-4 text-emerald-600" />
                   </div>
                   <div>
                     <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">Dates</p>
                     <p className="text-sm font-bold text-slate-900">{record.startDate} {record.endDate !== record.startDate && `to ${record.endDate}`}</p>
                   </div>
                 </div>

                 <div className="flex items-start gap-3">
                   <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                     <Clock className="w-4 h-4 text-amber-600" />
                   </div>
                   <div>
                     <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">Duration</p>
                     <p className="text-sm font-bold text-slate-900">{record.durationHours} Hours</p>
                   </div>
                 </div>

                 <div className="flex items-start gap-3">
                   <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                     <Users className="w-4 h-4 text-slate-600" />
                   </div>
                   <div>
                     <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">Max Attendees</p>
                     <p className="text-sm font-bold text-slate-900">{record.maxAttendees}</p>
                   </div>
                 </div>
               </div>
            </div>
            
            <div className="bg-slate-50 border border-slate-200 rounded-xl shadow-sm p-4">
               <h3 className="text-xs font-bold text-slate-800 uppercase tracking-widest mb-2">Record Info</h3>
               <div className="flex justify-between items-center text-xs mb-1">
                 <span className="text-slate-500">Created:</span>
                 <span className="font-semibold text-slate-700">{record.dateCreated}</span>
               </div>
               <div className="flex justify-between items-center text-xs">
                 <span className="text-slate-500">Last Modified:</span>
                 <span className="font-semibold text-slate-700">{record.dateLastModified}</span>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
