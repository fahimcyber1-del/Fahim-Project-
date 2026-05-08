import React from 'react';
import { FINANCIAL_METRICS } from './mockData';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { exportToCsv } from './ExportUtils';
import { Download, DollarSign, TrendingUp, TrendingDown } from 'lucide-react';

export function FinancialReport() {
  const currentMonth = FINANCIAL_METRICS[FINANCIAL_METRICS.length - 1];
  const previousMonth = FINANCIAL_METRICS[FINANCIAL_METRICS.length - 2];
  
  const profitGrowth = ((currentMonth.profit - previousMonth.profit) / previousMonth.profit) * 100;
  const revenueGrowth = ((currentMonth.revenue - previousMonth.revenue) / previousMonth.revenue) * 100;

  return (
    <div className="space-y-6">
      
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col">
           <div className="flex items-center gap-3 mb-2 text-emerald-600">
             <DollarSign className="w-5 h-5" />
             <h4 className="text-sm font-bold text-slate-700">Mtd Revenue</h4>
           </div>
           <p className="text-3xl font-black text-slate-900">${currentMonth.revenue.toLocaleString()}</p>
           <div className="mt-2 flex items-center gap-1 text-xs font-bold">
               {revenueGrowth >= 0 ? <TrendingUp className="w-3 h-3 text-emerald-500" /> : <TrendingDown className="w-3 h-3 text-rose-500" />}
               <span className={revenueGrowth >= 0 ? "text-emerald-600" : "text-rose-600"}>{Math.abs(revenueGrowth).toFixed(1)}% vs last month</span>
           </div>
        </div>
        
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col">
           <div className="flex items-center gap-3 mb-2 text-rose-600">
             <DollarSign className="w-5 h-5" />
             <h4 className="text-sm font-bold text-slate-700">Mtd Costs</h4>
           </div>
           <p className="text-3xl font-black text-slate-900">${currentMonth.cost.toLocaleString()}</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col">
           <div className="flex items-center gap-3 mb-2 text-indigo-600">
             <DollarSign className="w-5 h-5" />
             <h4 className="text-sm font-bold text-slate-700">Mtd Profit</h4>
           </div>
           <p className="text-3xl font-black text-slate-900">${currentMonth.profit.toLocaleString()}</p>
           <div className="mt-2 flex items-center gap-1 text-xs font-bold">
               {profitGrowth >= 0 ? <TrendingUp className="w-3 h-3 text-emerald-500" /> : <TrendingDown className="w-3 h-3 text-rose-500" />}
               <span className={profitGrowth >= 0 ? "text-emerald-600" : "text-rose-600"}>{Math.abs(profitGrowth).toFixed(1)}% vs last month</span>
           </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col">
           <div className="flex items-center gap-3 mb-2 text-blue-600">
             <DollarSign className="w-5 h-5" />
             <h4 className="text-sm font-bold text-slate-700">Profit Margin</h4>
           </div>
           <p className="text-3xl font-black text-slate-900">{((currentMonth.profit / currentMonth.revenue) * 100).toFixed(1)}%</p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 p-4 sm:p-6 rounded-xl shadow-sm">
        <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-800">Financial Growth Trend</h3>
            <button onClick={() => exportToCsv('financial-metrics', FINANCIAL_METRICS)} className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors">
              <Download className="w-4 h-4" /> Export CSV
            </button>
        </div>
        <div className="h-[450px] w-full">
          <ResponsiveContainer width="100%" height="100%">
             <AreaChart data={FINANCIAL_METRICS} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.6}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} tickFormatter={(val) => `$${val/1000}k`} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ fontSize: '13px', fontWeight: 500 }}
                  labelStyle={{ fontSize: '13px', color: '#64748b', marginBottom: '4px' }}
                  formatter={(value: number) => [`$${value.toLocaleString()}`, undefined]}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }} />
                <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" name="Revenue Tracker ($)" />
                <Area type="monotone" dataKey="profit" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorProfit)" name="Gross Profit ($)" />
              </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
