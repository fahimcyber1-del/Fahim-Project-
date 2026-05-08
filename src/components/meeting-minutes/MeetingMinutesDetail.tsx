import React from 'react';
import { MeetingRecord } from './types';
import { ArrowLeft, Clock, Calendar, Users, CheckCircle, FileText, MapPin, CheckSquare, Edit3, Type } from 'lucide-react';
import Markdown from 'react-markdown';

interface MeetingMinutesDetailProps {
  record: MeetingRecord;
  onBack: () => void;
  onEdit: (id: string) => void;
}

export function MeetingMinutesDetail({ record, onBack, onEdit }: MeetingMinutesDetailProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Published': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Draft': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Archived': return 'bg-slate-200 text-slate-800 border-slate-300';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const getActionStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'text-emerald-600 bg-emerald-50';
      case 'In Progress': return 'text-amber-600 bg-amber-50';
      case 'Deferred': return 'text-slate-500 bg-slate-100';
      default: return 'text-indigo-600 bg-indigo-50';
    }
  };

  return (
    <div className="max-w-5xl mx-auto w-full pb-12">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button onClick={onBack} type="button" className="p-2 bg-slate-100 text-slate-500 hover:bg-slate-200 rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-3">
               <h1 className="text-2xl font-black text-slate-900">{record.title}</h1>
               <span className={`px-2 py-0.5 rounded-md text-xs font-bold uppercase tracking-wider border ${getStatusColor(record.status)}`}>
                 {record.status}
               </span>
            </div>
            <p className="text-sm font-medium text-slate-500 flex items-center gap-2 mt-1">
               <span className="bg-slate-200 px-2 py-0.5 rounded text-xs">{record.id}</span>
               {record.type}
            </p>
          </div>
        </div>
        <button 
           onClick={() => onEdit(record.id)}
           className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg text-sm font-bold hover:bg-slate-50 transition-colors shadow-sm"
        >
          <Edit3 className="w-4 h-4" /> Edit Minutes
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:p-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Objective */}
          {record.objective && (
            <div className="bg-white border border-indigo-100 rounded-xl p-5 shadow-sm border-l-4 border-l-indigo-500">
              <h3 className="text-xs font-bold text-indigo-800 uppercase tracking-widest mb-2 flex items-center gap-2">
                <TargetIcon className="w-4 h-4" /> Objective
              </h3>
              <p className="text-slate-700 font-medium text-sm leading-relaxed">{record.objective}</p>
            </div>
          )}

          {/* Minutes Content */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col">
            <div className="px-5 py-4 border-b border-slate-100 bg-slate-50">
               <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest flex items-center gap-2">
                 <FileText className="w-4 h-4 text-indigo-600" /> Minutes & Notes
               </h3>
            </div>
            <div className="p-4 sm:p-6">
               {record.minutes ? (
                 <div className="prose prose-sm prose-slate max-w-none prose-headings:font-bold prose-headings:text-slate-900">
                    <Markdown>{record.minutes}</Markdown>
                 </div>
               ) : (
                 <div className="flex items-center justify-center py-10 text-slate-400 italic text-sm">
                   No minutes recorded yet.
                 </div>
               )}
            </div>

            {(record.decision || record.followUpRequired) && (
              <div className="border-t border-slate-100 bg-slate-50 p-4 sm:p-6 flex flex-col gap-4">
                {record.decision && (
                  <div>
                    <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Decisions Made</h4>
                    <p className="text-sm text-slate-800 bg-white p-3 rounded-lg border border-slate-200 whitespace-pre-wrap">{record.decision}</p>
                  </div>
                )}
                {record.followUpRequired && (
                  <div className="flex items-center gap-2 text-sm font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 p-3 rounded-lg">
                    <Calendar className="w-4 h-4" />
                    <span>Follow-up Meeting Required</span>
                    {record.nextMeetingDate && <span className="font-medium text-indigo-600">({record.nextMeetingDate})</span>}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Agenda */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 bg-slate-50">
               <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest flex items-center gap-2">
                 <ListIcon className="w-4 h-4 text-indigo-600" /> Agenda Topics
               </h3>
            </div>
            <div className="p-0">
               {record.agenda.length > 0 ? (
                 <div className="divide-y divide-slate-100">
                   {record.agenda.map((item, index) => (
                     <div key={item.id} className="p-5 flex gap-4">
                       <div className="text-xl font-black text-slate-300">{(index + 1).toString().padStart(2, '0')}</div>
                       <div className="flex-1">
                          <h4 className="font-bold text-slate-900">{item.title}</h4>
                          {item.description && <p className="text-sm text-slate-600 mt-1">{item.description}</p>}
                          <div className="flex gap-4 mt-2 text-xs font-medium text-slate-500">
                             {item.presenter && <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5"/> {item.presenter}</span>}
                             <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5"/> {item.durationMinutes} min</span>
                          </div>
                       </div>
                     </div>
                   ))}
                 </div>
               ) : (
                 <div className="p-4 sm:p-6 text-center text-slate-500 text-sm italic">No agenda defined.</div>
               )}
            </div>
          </div>

          {/* Action Items */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
             <div className="px-5 py-4 border-b border-slate-100 bg-slate-50">
               <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest flex items-center gap-2">
                 <CheckSquare className="w-4 h-4 text-indigo-600" /> Action Items
               </h3>
             </div>
             <div className="p-5">
               {record.actionItems.length > 0 ? (
                 <div className="space-y-3">
                   {record.actionItems.map(action => (
                     <div key={action.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 border border-slate-200 rounded-lg gap-4">
                        <div className="flex items-start gap-3">
                           <div className="mt-0.5">
                             {action.status === 'Completed' ? <CheckCircle className="w-5 h-5 text-emerald-500" /> : <div className="w-5 h-5 rounded-full border-2 border-slate-300" />}
                           </div>
                           <div>
                             <p className={`text-sm font-bold ${action.status === 'Completed' ? 'text-slate-500 line-through' : 'text-slate-900'}`}>{action.description}</p>
                             <div className="flex gap-3 mt-1 text-xs text-slate-500 font-medium">
                               <span>Assignee: <span className="text-slate-700">{action.assignedTo}</span></span>
                               <span>Due: <span className={new Date(action.dueDate) < new Date() && action.status !== 'Completed' ? 'text-rose-600' : 'text-slate-700'}>{action.dueDate}</span></span>
                             </div>
                           </div>
                        </div>
                        <span className={`px-2.5 py-1 rounded text-xs font-bold whitespace-nowrap self-start sm:self-auto ${getActionStatusColor(action.status)}`}>
                          {action.status}
                        </span>
                     </div>
                   ))}
                 </div>
               ) : (
                 <div className="text-center text-slate-500 text-sm italic">No action items assigned.</div>
               )}
             </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-widest mb-4 border-b border-slate-100 pb-2">Logistics</h3>
            <div className="space-y-4">
               <div className="flex items-start gap-3">
                 <Calendar className="w-5 h-5 text-slate-400 mt-0.5 shrink-0" />
                 <div>
                   <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Date</p>
                   <p className="text-sm font-bold text-slate-900">{record.date}</p>
                 </div>
               </div>
               <div className="flex items-start gap-3">
                 <Clock className="w-5 h-5 text-slate-400 mt-0.5 shrink-0" />
                 <div>
                   <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Time</p>
                   <p className="text-sm font-bold text-slate-900">{record.time}</p>
                 </div>
               </div>
               <div className="flex items-start gap-3">
                 <MapPin className="w-5 h-5 text-slate-400 mt-0.5 shrink-0" />
                 <div>
                   <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Location</p>
                   <p className="text-sm font-bold text-slate-900">{record.location || 'Not specified'}</p>
                 </div>
               </div>
               <div className="flex items-start gap-3">
                 <Users className="w-5 h-5 text-slate-400 mt-0.5 shrink-0" />
                 <div>
                   <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Organizer</p>
                   <p className="text-sm font-bold text-slate-900">{record.organizer || 'Not specified'}</p>
                 </div>
               </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
               <h3 className="text-xs font-bold text-slate-800 uppercase tracking-widest">Attendees ({record.participants.filter(p => p.attended).length}/{record.participants.length})</h3>
            </div>
            <div className="p-0">
               {record.participants.length > 0 ? (
                 <div className="divide-y divide-slate-100 max-h-[300px] overflow-y-auto">
                   {record.participants.map(p => (
                     <div key={p.id} className="p-4 flex items-center justify-between">
                        <div>
                          <p className={`text-sm font-bold ${!p.attended ? 'text-slate-400 line-through' : 'text-slate-900'}`}>{p.name}</p>
                          <p className="text-xs text-slate-500">{p.role} {p.department && `• ${p.department}`}</p>
                        </div>
                        {p.attended ? (
                          <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded uppercase">Present</span>
                        ) : (
                          <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded uppercase">Absent</span>
                        )}
                     </div>
                   ))}
                 </div>
               ) : (
                 <div className="p-5 text-center text-slate-500 text-sm italic">No participants listed.</div>
               )}
            </div>
          </div>
          
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs font-medium text-slate-500 space-y-1">
             <p className="flex justify-between"><span>Created:</span> <span>{record.dateCreated}</span></p>
             <p className="flex justify-between"><span>Last Modified:</span> <span>{record.dateLastModified}</span></p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Small helper component for Target icon
function TargetIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  );
}

function ListIcon(props: any) {
    return (
        <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="8" y1="6" x2="21" y2="6" />
      <line x1="8" y1="12" x2="21" y2="12" />
      <line x1="8" y1="18" x2="21" y2="18" />
      <line x1="3" y1="6" x2="3.01" y2="6" />
      <line x1="3" y1="12" x2="3.01" y2="12" />
      <line x1="3" y1="18" x2="3.01" y2="18" />
    </svg>
    )
}
