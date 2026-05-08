import React from 'react';
import { OrganogramRecord, OrganogramStatus } from './types';
import { Users, FileText, CheckCircle, Clock } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface OrganogramDashboardProps {
  records: OrganogramRecord[];
}

export function OrganogramDashboard({ records }: OrganogramDashboardProps) {
  const statusCounts = records.reduce((acc, r) => {
    acc[r.status] = (acc[r.status] || 0) + 1;
    return acc;
  }, {} as Record<OrganogramStatus, number>);

  const deptCounts = records.reduce((acc, r) => {
    acc[r.department] = (acc[r.department] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const barData = Object.entries(deptCounts).map(([name, count]) => ({ name, count }));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 sm:p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-indigo-100 rounded-lg text-indigo-700">
               <Users className="w-5 h-5" />
            </div>
            <h3 className="text-slate-600 font-bold text-sm">Total Charts</h3>
          </div>
          <p className="text-3xl font-black text-slate-900">{records.length}</p>
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-xl border border-emerald-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-emerald-100 rounded-lg text-emerald-700">
               <CheckCircle className="w-5 h-5" />
            </div>
            <h3 className="text-slate-600 font-bold text-sm">Published</h3>
          </div>
          <p className="text-3xl font-black text-emerald-700">{statusCounts['Published'] || 0}</p>
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-xl border border-amber-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-amber-100 rounded-lg text-amber-700">
               <Clock className="w-5 h-5" />
            </div>
            <h3 className="text-slate-600 font-bold text-sm">Drafts</h3>
          </div>
          <p className="text-3xl font-black text-amber-700">{statusCounts['Draft'] || 0}</p>
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-slate-100 rounded-lg text-slate-700">
               <FileText className="w-5 h-5" />
            </div>
            <h3 className="text-slate-600 font-bold text-sm">Total Roles Mapped</h3>
          </div>
          <div className="flex items-end gap-2">
             <p className="text-3xl font-black text-slate-700">
               {records.reduce((sum, r) => sum + r.nodes.length, 0)}
             </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:p-6">
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4 sm:p-6">
          <h3 className="text-lg font-black text-slate-900 mb-6">Charts by Department</h3>
          <div className="h-[300px]">
             {barData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                    <YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                    <Tooltip 
                      cursor={{fill: '#f8fafc'}}
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={40} />
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
               <div key={r.id} className="border border-slate-200 rounded-lg p-3 hover:bg-slate-50 transition-colors flex justify-between items-center">
                 <div>
                   <p className="font-bold text-sm text-slate-900 line-clamp-1">{r.title}</p>
                   <p className="text-xs text-slate-500 mt-1">{r.department} • v{r.version}</p>
                 </div>
                 <span className={`px-2 py-1 rounded text-xs font-bold ${
                   r.status === 'Published' ? 'bg-emerald-100 text-emerald-800' : 
                   r.status === 'Draft' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-800'
                 }`}>
                   {r.status}
                 </span>
               </div>
             ))}
             {records.length === 0 && (
                <p className="text-sm font-medium text-slate-500 text-center py-6">No recent organograms found.</p>
             )}
           </div>
        </div>
      </div>
    </div>
  );
}
