import React from 'react';
import { DEFECTS_DATA, PRODUCTION_TRENDS, QUALITY_TRENDS, FINANCIAL_METRICS, TOP_DEFECTS_LAST_QUARTER } from './mockData';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { exportToCsv } from './ExportUtils';
import { Download } from 'lucide-react';

export function OverviewReport() {
  const COLORS = ['#6366f1', '#14b8a6', '#f59e0b', '#ec4899', '#8b5cf6', '#64748b'];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:p-6">
        {/* Production Trends Area Chart */}
        <div className="bg-white border border-slate-200 p-4 sm:p-6 rounded-xl shadow-sm">
          <div className="flex justify-between items-center mb-6">
             <h3 className="text-lg font-bold text-slate-800">Production vs Expected</h3>
             <button onClick={() => exportToCsv('production-overview', PRODUCTION_TRENDS)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 rounded-md transition-colors" title="Export CSV">
               <Download className="w-4 h-4" />
             </button>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={PRODUCTION_TRENDS} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0.1}/>
                  </linearGradient>
                  <linearGradient id="colorPlanned" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#94a3b8" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ fontSize: '13px', fontWeight: 500 }}
                  labelStyle={{ fontSize: '13px', color: '#64748b', marginBottom: '4px' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }} />
                <Area type="monotone" dataKey="planned" stroke="#94a3b8" strokeWidth={2} fillOpacity={1} fill="url(#colorPlanned)" name="Planned Output" />
                <Area type="monotone" dataKey="actual" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#colorActual)" name="Actual Output" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quality Defect Breakdown */}
        <div className="bg-white border border-slate-200 p-4 sm:p-6 rounded-xl shadow-sm">
          <div className="flex justify-between items-center mb-6">
             <h3 className="text-lg font-bold text-slate-800">Top Defects Breakdown</h3>
             <button onClick={() => exportToCsv('defects-overview', DEFECTS_DATA)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 rounded-md transition-colors" title="Export CSV">
               <Download className="w-4 h-4" />
             </button>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={DEFECTS_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="count"
                >
                  {DEFECTS_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                   contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                   itemStyle={{ fontSize: '13px', fontWeight: 700, color: '#1e293b' }}
                />
                <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quality Defect Rates vs Target */}
        <div className="bg-white border border-slate-200 p-4 sm:p-6 rounded-xl shadow-sm">
           <div className="flex justify-between items-center mb-6">
             <h3 className="text-lg font-bold text-slate-800">Quality Defect Rates (6 Mo)</h3>
             <button onClick={() => exportToCsv('quality-trends-overview', QUALITY_TRENDS)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 rounded-md transition-colors" title="Export CSV">
               <Download className="w-4 h-4" />
             </button>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={QUALITY_TRENDS} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ fontSize: '13px', fontWeight: 500 }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }} />
                <Line type="monotone" dataKey="defectRate" name="Defect Rate %" stroke="#ef4444" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="targetRate" name="Target Max %" stroke="#10b981" strokeWidth={2} strokeDasharray="5 5" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Financial Profit Margin */}
        <div className="bg-white border border-slate-200 p-4 sm:p-6 rounded-xl shadow-sm">
           <div className="flex justify-between items-center mb-6">
             <h3 className="text-lg font-bold text-slate-800">Financial Performance</h3>
             <button onClick={() => exportToCsv('financial-overview', FINANCIAL_METRICS)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 rounded-md transition-colors" title="Export CSV">
               <Download className="w-4 h-4" />
             </button>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={FINANCIAL_METRICS} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                <YAxis hide />
                <Tooltip 
                  cursor={{ fill: '#f1f5f9' }}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  formatter={(value: number) => [`$${value.toLocaleString()}`, undefined]}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }} />
                <Bar dataKey="revenue" name="Revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="cost" name="Cost" fill="#f43f5e" radius={[4, 4, 0, 0]} />
                <Bar dataKey="profit" name="Profit" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        {/* Top Defects Last Quarter Dashboard Widget */}
        <div className="bg-white border border-slate-200 p-4 sm:p-6 rounded-xl shadow-sm md:col-span-2">
          <div className="flex justify-between items-center mb-6">
             <h3 className="text-lg font-bold text-slate-800">Top 5 Most Frequent Defects (Last Quarter)</h3>
             <button onClick={() => exportToCsv('top-defects-quarter', TOP_DEFECTS_LAST_QUARTER)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 rounded-md transition-colors" title="Export CSV">
               <Download className="w-4 h-4" />
             </button>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={TOP_DEFECTS_LAST_QUARTER} layout="vertical" margin={{ top: 10, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e2e8f0" />
                <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b', fontWeight: 600 }} width={120} />
                <Tooltip 
                  cursor={{ fill: '#f1f5f9' }}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ fontSize: '13px', fontWeight: 700, color: '#1e293b' }}
                />
                <Bar dataKey="count" name="Defect Count" fill="#ec4899" radius={[0, 4, 4, 0]} barSize={32}>
                  {TOP_DEFECTS_LAST_QUARTER.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
