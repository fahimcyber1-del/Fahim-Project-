import React from 'react';
import { JobDescriptionRecord, JDStatus } from './types';
import { Briefcase, CheckCircle, Clock, AlertTriangle, FileText, Users, MapPin } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Cell } from 'recharts';

interface JobDescriptionDashboardProps {
  records: JobDescriptionRecord[];
}

export function JobDescriptionDashboard({ records }: JobDescriptionDashboardProps) {
  const statusCounts = records.reduce((acc, r) => {
    acc[r.status] = (acc[r.status] || 0) + 1;
    return acc;
  }, {} as Record<JDStatus, number>);

  const deptCounts = records.reduce((acc, r) => {
    acc[r.department] = (acc[r.department] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const barData = Object.entries(deptCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5); // top 5 departments

  const COLORS = ['#6366f1', '#14b8a6', '#f59e0b', '#ec4899', '#8b5cf6'];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 sm:p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-indigo-100 rounded-lg text-indigo-700">
               <Briefcase className="w-5 h-5" />
            </div>
            <h3 className="text-slate-600 font-bold text-sm">Total JDs</h3>
          </div>
          <p className="text-3xl font-black text-slate-900">{records.length}</p>
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-xl border border-emerald-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-emerald-100 rounded-lg text-emerald-700">
               <CheckCircle className="w-5 h-5" />
            </div>
            <h3 className="text-slate-600 font-bold text-sm">Active</h3>
          </div>
          <p className="text-3xl font-black text-emerald-700">{statusCounts['Active'] || 0}</p>
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-xl border border-amber-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-amber-100 rounded-lg text-amber-700">
               <FileText className="w-5 h-5" />
            </div>
            <h3 className="text-slate-600 font-bold text-sm">Drafts</h3>
          </div>
          <p className="text-3xl font-black text-amber-700">{statusCounts['Draft'] || 0}</p>
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-xl border border-rose-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-rose-100 rounded-lg text-rose-700">
               <AlertTriangle className="w-5 h-5" />
            </div>
            <h3 className="text-slate-600 font-bold text-sm">Closed / Archived</h3>
          </div>
          <div className="flex items-end gap-2">
             <p className="text-3xl font-black text-rose-700">{(statusCounts['Closed'] || 0) + (statusCounts['Archived'] || 0)}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:p-6">
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4 sm:p-6">
          <h3 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-600" /> JDs by Department
          </h3>
          <div className="h-[300px]">
             {barData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} allowDecimals={false} />
                    <RechartsTooltip 
                      cursor={{ fill: '#f1f5f9' }}
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                      {barData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
             ) : (
                <div className="flex items-center justify-center h-full text-slate-500 font-medium">No records found</div>
             )}
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4 sm:p-6">
           <h3 className="text-lg font-black text-slate-900 mb-6">Recently Updated</h3>
           <div className="space-y-3">
             {[...records]
               .sort((a, b) => new Date(b.dateLastModified).getTime() - new Date(a.dateLastModified).getTime())
               .slice(0, 5)
               .map(r => (
               <div key={r.id} className="border border-slate-200 rounded-lg p-3 hover:bg-slate-50 transition-colors">
                 <div className="flex justify-between items-start mb-1">
                   <p className="font-bold text-sm text-slate-900 line-clamp-1 pr-4">{r.title}</p>
                 </div>
                 <div className="flex justify-between items-center text-xs text-slate-500 mt-2">
                    <span className="font-medium flex items-center gap-1"><MapPin className="w-3 h-3" />{r.location}</span>
                    <span className="font-medium text-indigo-600 px-2 py-0.5 rounded bg-indigo-50">{r.status}</span>
                 </div>
               </div>
             ))}
             {records.length === 0 && (
                <p className="text-sm font-medium text-slate-500 text-center py-6">No recent JD found.</p>
             )}
           </div>
        </div>
      </div>
    </div>
  );
}
