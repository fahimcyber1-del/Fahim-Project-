import React from 'react';
import { QUALITY_TRENDS, DEFECTS_DATA, MONTHLY_DEFECT_RATES } from './mockData';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell, ReferenceLine } from 'recharts';
import { exportToCsv } from './ExportUtils';
import { Download } from 'lucide-react';

export function QualityReport() {
  const COLORS = ['#ef4444', '#f97316', '#f59e0b', '#eab308', '#84cc16', '#22c55e'];

  // Calculate pareto cumulative percentage
  let cumulative = 0;
  const totalDefects = DEFECTS_DATA.reduce((sum, item) => sum + item.count, 0);
  const paretoData = [...DEFECTS_DATA].sort((a, b) => b.count - a.count).map(item => {
    cumulative += item.count;
    return {
      ...item,
      cumulativePercent: Number(((cumulative / totalDefects) * 100).toFixed(1))
    };
  });


  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 p-4 sm:p-6 rounded-xl shadow-sm">
        <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-800">Pareto Analysis (80/20 Rule)</h3>
            <button onClick={() => exportToCsv('pareto-defects', paretoData)} className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors">
              <Download className="w-4 h-4" /> Export CSV
            </button>
        </div>
        <p className="text-sm text-slate-500 mb-6 max-w-2xl">
          The Pareto chart helps identify the most frequent defects to prioritize quality improvement efforts. Focus on the bars that contribute to the first 80% of total defects.
        </p>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={paretoData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} dy={10} angle={-45} textAnchor="end" />
              <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
              <YAxis yAxisId="right" orientation="right" domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} tickFormatter={val => `${val}%`} />
              <Tooltip 
                cursor={{ fill: '#f8fafc' }}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                itemStyle={{ fontSize: '13px', fontWeight: 500 }}
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '30px' }} />
              <Bar yAxisId="left" dataKey="count" name="Frequency" fill="#3b82f6" radius={[4, 4, 0, 0]}>
                 {paretoData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length] || '#3b82f6'} />
                  ))}
              </Bar>
              <Line yAxisId="right" type="monotone" dataKey="cumulativePercent" name="Cumulative %" stroke="#1e293b" strokeWidth={2} dot={{ r: 4 }} />
              <ReferenceLine yAxisId="right" y={80} stroke="#ef4444" strokeDasharray="3 3" label={{ position: 'top', value: '80% Threshold', fill: '#ef4444', fontSize: 10, fontWeight: 'bold' }} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white border border-slate-200 p-4 sm:p-6 rounded-xl shadow-sm">
        <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-800">Defect & Rework Trend</h3>
            <button onClick={() => exportToCsv('quality-trends-detailed', QUALITY_TRENDS)} className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors">
              <Download className="w-4 h-4" /> Export CSV
            </button>
        </div>
        <div className="h-[350px] w-full">
           <ResponsiveContainer width="100%" height="100%">
             <LineChart data={QUALITY_TRENDS} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
               <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
               <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
               <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} tickFormatter={val => `${val}%`} />
               <Tooltip 
                 contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                 itemStyle={{ fontSize: '13px', fontWeight: 500 }}
               />
               <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }} />
               <Line type="monotone" dataKey="defectRate" name="Defect Rate %" stroke="#ef4444" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
               <Line type="monotone" dataKey="reworkRate" name="Rework Rate %" stroke="#f59e0b" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
             </LineChart>
           </ResponsiveContainer>
        </div>
      </div>
      <div className="bg-white border border-slate-200 p-4 sm:p-6 rounded-xl shadow-sm">
        <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-800">Monthly Defect Rates by Garment Type & Line</h3>
            <button onClick={() => exportToCsv('monthly-defect-rates', MONTHLY_DEFECT_RATES)} className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors">
              <Download className="w-4 h-4" /> Export CSV
            </button>
        </div>
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-y border-slate-200">
                <th className="py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Garment Type</th>
                <th className="py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Production Line</th>
                <th className="py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider text-right">Total Inspected</th>
                <th className="py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider text-right">Defect Count</th>
                <th className="py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider text-right">Defect Rate (%)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {MONTHLY_DEFECT_RATES.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4 text-sm font-medium text-slate-800">{item.garmentType}</td>
                  <td className="py-3 px-4 text-sm text-slate-600">{item.line}</td>
                  <td className="py-3 px-4 text-sm font-medium text-slate-700 text-right">{item.totalInspected.toLocaleString()}</td>
                  <td className="py-3 px-4 text-sm font-medium text-slate-700 text-right">{item.defectCount.toLocaleString()}</td>
                  <td className="py-3 px-4 text-sm font-bold text-rose-600 text-right">{item.defectRate.toFixed(2)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
