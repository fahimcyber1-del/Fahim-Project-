import React from 'react';
import { DocumentRecord, DocumentStatus, DocumentCategory } from './types';
import { Files, CheckCircle, Clock, AlertTriangle, BarChart2 } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface DocumentDashboardProps {
  records: DocumentRecord[];
}

export function DocumentDashboard({ records }: DocumentDashboardProps) {
  const statusCounts = records.reduce((acc, r) => {
    acc[r.status] = (acc[r.status] || 0) + 1;
    return acc;
  }, {} as Record<DocumentStatus, number>);

  const categoryCounts = records.reduce((acc, r) => {
    acc[r.category] = (acc[r.category] || 0) + 1;
    return acc;
  }, {} as Record<DocumentCategory, number>);

  const pieData = Object.entries(categoryCounts).map(([name, value]) => ({ name, value }));
  const COLORS = ['#6366f1', '#14b8a6', '#f59e0b', '#ec4899', '#8b5cf6', '#ef4444', '#64748b'];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 sm:p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-indigo-100 rounded-lg text-indigo-700">
               <Files className="w-5 h-5" />
            </div>
            <h3 className="text-slate-600 font-bold text-sm">Total Documents</h3>
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
            <h3 className="text-slate-600 font-bold text-sm">In Review</h3>
          </div>
          <p className="text-3xl font-black text-amber-700">{statusCounts['In Review'] || 0}</p>
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-xl border border-rose-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-rose-100 rounded-lg text-rose-700">
               <AlertTriangle className="w-5 h-5" />
            </div>
            <h3 className="text-slate-600 font-bold text-sm">Drafts & Obsolete</h3>
          </div>
          <div className="flex items-end gap-2">
             <p className="text-3xl font-black text-rose-700">{(statusCounts['Draft'] || 0) + (statusCounts['Obsolete'] || 0)}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:p-6">
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4 sm:p-6">
          <h3 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2">
            <BarChart2 className="w-5 h-5 text-indigo-600" /> Documents by Category
          </h3>
          <div className="h-[300px]">
             {pieData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      innerRadius={60}
                      fill="#8884d8"
                      dataKey="value"
                      paddingAngle={5}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Legend verticalAlign="bottom" height={36}/>
                  </PieChart>
                </ResponsiveContainer>
             ) : (
                <div className="flex items-center justify-center h-full text-slate-500 font-medium">No documents found</div>
             )}
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4 sm:p-6">
           <h3 className="text-lg font-black text-slate-900 mb-6">Recently Modified</h3>
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
                    <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-bold uppercase tracking-wider">{r.category}</span>
                    <span className="font-medium text-indigo-600">{r.status}</span>
                 </div>
               </div>
             ))}
             {records.length === 0 && (
                <p className="text-sm font-medium text-slate-500 text-center py-6">No recent documents found.</p>
             )}
           </div>
        </div>
      </div>
    </div>
  );
}
