import React from 'react';
import { TrainingRecord, TrainingStatus } from './types';
import { BookOpen, CheckCircle, Clock, AlertCircle, Users, BarChart2 } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from 'recharts';

interface TrainingDashboardProps {
  records: TrainingRecord[];
}

export function TrainingDashboard({ records }: TrainingDashboardProps) {
  const statusCounts = records.reduce((acc, r) => {
    acc[r.status] = (acc[r.status] || 0) + 1;
    return acc;
  }, {} as Record<TrainingStatus, number>);

  const typeCounts = records.reduce((acc, r) => {
    acc[r.type] = (acc[r.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const totalAttendees = records.reduce((acc, r) => acc + r.attendees.length, 0);

  const pieData = Object.entries(typeCounts).map(([name, value]) => ({ name, value }));
  const COLORS = ['#6366f1', '#14b8a6', '#f59e0b', '#ec4899'];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 sm:p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-indigo-100 rounded-lg text-indigo-700">
               <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="text-slate-600 font-bold text-sm">Total Trainings</h3>
          </div>
          <p className="text-3xl font-black text-slate-900">{records.length}</p>
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-xl border border-emerald-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-emerald-100 rounded-lg text-emerald-700">
               <CheckCircle className="w-5 h-5" />
            </div>
            <h3 className="text-slate-600 font-bold text-sm">Completed</h3>
          </div>
          <p className="text-3xl font-black text-emerald-700">{statusCounts['Completed'] || 0}</p>
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-xl border border-amber-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-amber-100 rounded-lg text-amber-700">
               <Clock className="w-5 h-5" />
            </div>
            <h3 className="text-slate-600 font-bold text-sm">Planned/In Progress</h3>
          </div>
          <p className="text-3xl font-black text-amber-700">{(statusCounts['Planned'] || 0) + (statusCounts['In Progress'] || 0)}</p>
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-xl border border-blue-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-100 rounded-lg text-blue-700">
               <Users className="w-5 h-5" />
            </div>
            <h3 className="text-slate-600 font-bold text-sm">Total Attendees</h3>
          </div>
          <div className="flex items-end gap-2">
             <p className="text-3xl font-black text-blue-700">{totalAttendees}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:p-6">
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4 sm:p-6">
          <h3 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2">
            <BarChart2 className="w-5 h-5 text-indigo-600" /> Trainings by Type
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
           <h3 className="text-lg font-black text-slate-900 mb-6">Upcoming Trainings</h3>
           <div className="space-y-3">
             {[...records]
               .filter(r => r.status === 'Planned' || r.status === 'In Progress')
               .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
               .slice(0, 5)
               .map(r => (
               <div key={r.id} className="border border-slate-200 rounded-lg p-3 hover:bg-slate-50 transition-colors">
                 <div className="flex justify-between items-start mb-1">
                   <p className="font-bold text-sm text-slate-900 line-clamp-1 pr-4">{r.title}</p>
                 </div>
                 <div className="flex justify-between items-center text-xs text-slate-500 mt-2">
                    <span className="font-medium flex items-center gap-1"><Clock className="w-3 h-3" />{r.startDate}</span>
                    <span className={`font-medium px-2 py-0.5 rounded ${r.status === 'In Progress' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-800'}`}>{r.status}</span>
                 </div>
               </div>
             ))}
             {records.filter(r => r.status === 'Planned' || r.status === 'In Progress').length === 0 && (
                <p className="text-sm font-medium text-slate-500 text-center py-6">No upcoming trainings found.</p>
             )}
           </div>
        </div>
      </div>
    </div>
  );
}
