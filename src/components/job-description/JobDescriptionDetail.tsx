import React from 'react';
import { JobDescriptionRecord } from './types';
import { ArrowLeft, Edit3, Building, MapPin, Briefcase, DollarSign, Calendar, TrendingUp } from 'lucide-react';

interface JobDescriptionDetailProps {
  record: JobDescriptionRecord;
  onBack: () => void;
  onEdit: () => void;
}

export function JobDescriptionDetail({ record, onBack, onEdit }: JobDescriptionDetailProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Draft': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Closed':
      case 'Archived': return 'bg-rose-100 text-rose-800 border-rose-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
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
            <p className="text-sm font-medium text-slate-500">ID: {record.id}</p>
          </div>
        </div>
        <button onClick={onEdit} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-sm font-bold text-sm transition-colors">
          <Edit3 className="w-4 h-4" /> Edit JD
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:p-6">
         <div className="lg:col-span-2 space-y-6">
            
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4 sm:p-6">
               <h3 className="font-bold text-slate-800 uppercase tracking-widest text-sm mb-4">Summary</h3>
               {record.summary ? (
                 <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{record.summary}</p>
               ) : (
                 <p className="text-sm text-slate-400 italic">No summary provided.</p>
               )}
            </div>

            <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4 sm:p-6">
               <h3 className="font-bold text-slate-800 uppercase tracking-widest text-sm mb-4">Responsibilities</h3>
               {record.responsibilities && record.responsibilities.length > 0 ? (
                 <ul className="list-disc pl-5 space-y-2 text-sm text-slate-700">
                   {record.responsibilities.map(item => (
                     <li key={item.id}>{item.value}</li>
                   ))}
                 </ul>
               ) : (
                 <p className="text-sm text-slate-400 italic">No responsibilities defined.</p>
               )}
            </div>

            <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4 sm:p-6">
               <h3 className="font-bold text-slate-800 uppercase tracking-widest text-sm mb-4">Requirements & Qualifications</h3>
               {record.requirements && record.requirements.length > 0 ? (
                 <ul className="list-disc pl-5 space-y-2 text-sm text-slate-700">
                   {record.requirements.map(item => (
                     <li key={item.id}>{item.value}</li>
                   ))}
                 </ul>
               ) : (
                 <p className="text-sm text-slate-400 italic">No requirements defined.</p>
               )}
            </div>

         </div>

         <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4 sm:p-6">
               <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest mb-4 border-b border-slate-100 pb-2">Role Details</h3>
               
               <div className="space-y-4">
                 <div className="flex items-start gap-3">
                   <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                     <Building className="w-4 h-4 text-indigo-600" />
                   </div>
                   <div>
                     <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">Department</p>
                     <p className="text-sm font-bold text-slate-900">{record.department}</p>
                   </div>
                 </div>
                 
                 <div className="flex items-start gap-3">
                   <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                     <MapPin className="w-4 h-4 text-blue-600" />
                   </div>
                   <div>
                     <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">Location</p>
                     <p className="text-sm font-bold text-slate-900">{record.location}</p>
                   </div>
                 </div>

                 <div className="flex items-start gap-3">
                   <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                     <Briefcase className="w-4 h-4 text-emerald-600" />
                   </div>
                   <div>
                     <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">Employment Type</p>
                     <p className="text-sm font-bold text-slate-900">{record.employmentType}</p>
                   </div>
                 </div>

                 <div className="flex items-start gap-3">
                   <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                     <TrendingUp className="w-4 h-4 text-amber-600" />
                   </div>
                   <div>
                     <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">Experience Level</p>
                     <p className="text-sm font-bold text-slate-900">{record.experienceLevel}</p>
                   </div>
                 </div>

                 <div className="flex items-start gap-3">
                   <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                     <DollarSign className="w-4 h-4 text-slate-600" />
                   </div>
                   <div>
                     <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">Salary Range</p>
                     <p className="text-sm font-bold text-slate-900">{record.salaryRange || 'Not specified'}</p>
                   </div>
                 </div>

                 <div className="flex items-start gap-3">
                   <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                     <Calendar className="w-4 h-4 text-slate-600" />
                   </div>
                   <div>
                     <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">Dates</p>
                     <p className="text-xs text-slate-700"><span className="font-medium">Created:</span> {record.dateCreated}</p>
                     <p className="text-xs text-slate-700"><span className="font-medium">Modified:</span> {record.dateLastModified}</p>
                   </div>
                 </div>

               </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4 sm:p-6">
               <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest mb-4 border-b border-slate-100 pb-2">Skills</h3>
               {record.skills && record.skills.length > 0 ? (
                 <div className="flex flex-wrap gap-2">
                   {record.skills.map(skill => (
                     <span key={skill.id} className="bg-indigo-50 border border-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-semibold">
                       {skill.value}
                     </span>
                   ))}
                 </div>
               ) : (
                 <p className="text-sm text-slate-400 italic">No skills defined.</p>
               )}
            </div>

         </div>
      </div>
    </div>
  );
}
