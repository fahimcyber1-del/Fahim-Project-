import React from 'react';
import { PRODUCTION_TRENDS, SUPPLIER_PERFORMANCE } from './mockData';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { exportToCsv } from './ExportUtils';
import { Download, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';

export function ProductionReport() {
  const avgEfficiency = PRODUCTION_TRENDS.reduce((acc, curr) => acc + curr.efficiency, 0) / PRODUCTION_TRENDS.length;
  const maxActual = Math.max(...PRODUCTION_TRENDS.map(t => t.actual));

  return (
    <div className="space-y-6">
      
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col">
           <div className="flex items-center gap-3 mb-2 text-indigo-600">
             <TrendingUp className="w-5 h-5" />
             <h4 className="text-sm font-bold text-slate-700">Average Efficiency</h4>
           </div>
           <p className="text-3xl font-black text-slate-900">{avgEfficiency.toFixed(1)}%</p>
           <p className="text-xs text-slate-500 mt-2 font-medium">Over last 7 days</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col">
           <div className="flex items-center gap-3 mb-2 text-emerald-600">
             <CheckCircle className="w-5 h-5" />
             <h4 className="text-sm font-bold text-slate-700">Peak Daily Output</h4>
           </div>
           <p className="text-3xl font-black text-slate-900">{maxActual}</p>
           <p className="text-xs text-slate-500 mt-2 font-medium">Highest units produced</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col">
           <div className="flex items-center gap-3 mb-2 text-amber-600">
             <AlertCircle className="w-5 h-5" />
             <h4 className="text-sm font-bold text-slate-700">Target Attainment</h4>
           </div>
           <p className="text-3xl font-black text-slate-900">92%</p>
           <p className="text-xs text-slate-500 mt-2 font-medium">Days meeting plan</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:p-6">
        <div className="bg-white border border-slate-200 p-4 sm:p-6 rounded-xl shadow-sm">
          <div className="flex justify-between items-center mb-6">
             <h3 className="text-lg font-bold text-slate-800">Production Efficiency & Target</h3>
             <button onClick={() => exportToCsv('production-efficiency', PRODUCTION_TRENDS)} className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors">
               <Download className="w-4 h-4" /> Export
             </button>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={PRODUCTION_TRENDS} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} tickFormatter={(val) => `${val}%`}/>
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ fontSize: '13px', fontWeight: 500 }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }} />
                <Bar yAxisId="left" dataKey="actual" name="Actual Produced" fill="#818cf8" radius={[4, 4, 0, 0]} barSize={40} />
                <Line yAxisId="right" type="monotone" dataKey="efficiency" name="Efficiency %" stroke="#fbbf24" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-4 sm:p-6 rounded-xl shadow-sm">
           <div className="flex justify-between items-center mb-6">
             <h3 className="text-lg font-bold text-slate-800">Supplier Performance Index</h3>
             <button onClick={() => exportToCsv('supplier-performance', SUPPLIER_PERFORMANCE)} className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors">
               <Download className="w-4 h-4" /> Export
             </button>
          </div>
          <div className="h-[350px] w-full">
             <ResponsiveContainer width="100%" height="100%">
               <RadarChart cx="50%" cy="50%" outerRadius="70%" data={SUPPLIER_PERFORMANCE}>
                 <PolarGrid stroke="#e2e8f0" />
                 <PolarAngleAxis dataKey="supplier" tick={{ fontSize: 10, fill: '#475569', fontWeight: 600 }} />
                 <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10 }} />
                 <Radar name="Quality" dataKey="qualityScore" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
                 <Radar name="Delivery" dataKey="deliveryScore" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
                 <Tooltip 
                   contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                   itemStyle={{ fontSize: '13px', fontWeight: 500 }}
                 />
                 <Legend wrapperStyle={{ fontSize: '12px' }} />
               </RadarChart>
             </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
