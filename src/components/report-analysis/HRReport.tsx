import React from 'react';
import { TRAINING_STATS } from './mockData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell, ReferenceLine } from 'recharts';
import { exportToCsv } from './ExportUtils';
import { Download, Users, Target, BookOpen } from 'lucide-react';

export function HRReport() {
  const totalPlanned = TRAINING_STATS.reduce((a, b) => a + b.plannedHours, 0);
  const totalCompleted = TRAINING_STATS.reduce((a, b) => a + b.completedHours, 0);
  const completionRate = ((totalCompleted / totalPlanned) * 100).toFixed(1);

  return (
    <div className="space-y-6">
      
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col">
           <div className="flex items-center gap-3 mb-2 text-indigo-600">
             <Target className="w-5 h-5" />
             <h4 className="text-sm font-bold text-slate-700">Planned Training Hours</h4>
           </div>
           <p className="text-3xl font-black text-slate-900">{totalPlanned}</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col">
           <div className="flex items-center gap-3 mb-2 text-emerald-600">
             <BookOpen className="w-5 h-5" />
             <h4 className="text-sm font-bold text-slate-700">Completed Training Hours</h4>
           </div>
           <p className="text-3xl font-black text-slate-900">{totalCompleted}</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col">
           <div className="flex items-center gap-3 mb-2 text-blue-600">
             <Users className="w-5 h-5" />
             <h4 className="text-sm font-bold text-slate-700">Overall Completion Rate</h4>
           </div>
           <p className="text-3xl font-black text-slate-900">{completionRate}%</p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 p-4 sm:p-6 rounded-xl shadow-sm">
        <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-800">Training Hours by Department</h3>
            <button onClick={() => exportToCsv('training-stats', TRAINING_STATS)} className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors">
              <Download className="w-4 h-4" /> Export CSV
            </button>
        </div>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={TRAINING_STATS} layout="vertical" margin={{ top: 10, right: 30, left: 20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e2e8f0" />
              <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
              <YAxis type="category" dataKey="department" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#1e293b', fontWeight: 600 }} />
              <Tooltip 
                cursor={{ fill: '#f8fafc' }}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                itemStyle={{ fontSize: '13px', fontWeight: 500 }}
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }} />
              <Bar dataKey="plannedHours" name="Planned Hours" fill="#94a3b8" radius={[0, 4, 4, 0]} barSize={20} />
              <Bar dataKey="completedHours" name="Completed Hours" fill="#14b8a6" radius={[0, 4, 4, 0]} barSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
