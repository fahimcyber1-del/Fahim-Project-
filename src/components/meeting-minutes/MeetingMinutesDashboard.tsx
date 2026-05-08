import React from 'react';
import { MeetingRecord, MeetingStatus } from './types';
import { Clock, CheckCircle, FileText, AlertCircle, Users, BarChart2, Calendar } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from 'recharts';

interface MeetingMinutesDashboardProps {
  records: MeetingRecord[];
}

export function MeetingMinutesDashboard({ records }: MeetingMinutesDashboardProps) {
  const statusCounts = records.reduce((acc, r) => {
    acc[r.status] = (acc[r.status] || 0) + 1;
    return acc;
  }, {} as Record<MeetingStatus, number>);

  const typeCounts = records.reduce((acc, r) => {
    acc[r.type] = (acc[r.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  let totalActionItems = 0;
  let completedActionItems = 0;

  records.forEach(r => {
    totalActionItems += r.actionItems.length;
    completedActionItems += r.actionItems.filter(a => a.status === 'Completed').length;
  });

  const pieData = Object.entries(typeCounts).map(([name, value]) => ({ name, value }));
  const COLORS = ['#6366f1', '#14b8a6', '#f59e0b', '#ec4899', '#8b5cf6'];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 sm:p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-indigo-100 rounded-lg text-indigo-700">
               <Clock className="w-5 h-5" />
            </div>
            <h3 className="text-slate-600 font-bold text-sm">Total Meetings</h3>
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
               <FileText className="w-5 h-5" />
            </div>
            <h3 className="text-slate-600 font-bold text-sm">Drafts</h3>
          </div>
          <p className="text-3xl font-black text-amber-700">{statusCounts['Draft'] || 0}</p>
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-xl border border-blue-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-100 rounded-lg text-blue-700">
               <CheckCircle className="w-5 h-5" />
            </div>
            <h3 className="text-slate-600 font-bold text-sm">Action Items Done</h3>
          </div>
          <div className="flex items-end gap-2">
             <p className="text-3xl font-black text-blue-700">{completedActionItems} / {totalActionItems}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:p-6">
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4 sm:p-6">
          <h3 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2">
            <BarChart2 className="w-5 h-5 text-indigo-600" /> Meetings by Type
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
                    <RechartsTooltip 
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Legend verticalAlign="bottom" height={36}/>
                  </PieChart>
                </ResponsiveContainer>
             ) : (
                <div className="flex items-center justify-center h-full text-slate-500 font-medium">No records found</div>
             )}
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4 sm:p-6">
           <h3 className="text-lg font-black text-slate-900 mb-6">Recent Meetings</h3>
           <div className="space-y-3">
             {[...records]
               .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
               .slice(0, 5)
               .map(r => (
               <div key={r.id} className="border border-slate-200 rounded-lg p-3 hover:bg-slate-50 transition-colors">
                 <div className="flex justify-between items-start mb-1">
                   <p className="font-bold text-sm text-slate-900 line-clamp-1 pr-4">{r.title}</p>
                   <span className={`font-medium px-2 py-0.5 rounded text-xs whitespace-nowrap ${r.status === 'Draft' ? 'bg-amber-100 text-amber-800' : r.status === 'Published' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-800'}`}>{r.status}</span>
                 </div>
                 <div className="flex justify-between items-center text-xs text-slate-500 mt-2">
                    <span className="font-medium flex items-center gap-1"><Calendar className="w-3 h-3" />{r.date} at {r.time}</span>
                    <span className="font-medium flex items-center gap-1"><Users className="w-3 h-3" />{r.participants.length}</span>
                 </div>
               </div>
             ))}
             {records.length === 0 && (
                <p className="text-sm font-medium text-slate-500 text-center py-6">No meetings found.</p>
             )}
           </div>
        </div>
      </div>
    </div>
  );
}
