import React from 'react';
import { TestRequest } from './types';
import { Clock, FileText, CheckCircle, Activity, ArrowRight } from 'lucide-react';
import { Area, AreaChart, ResponsiveContainer, XAxis, Tooltip, YAxis } from 'recharts';

interface TestingDashboardProps {
  records: TestRequest[];
  onViewList: () => void;
}

const trendData = [
  { time: '00:00', value: 30 },
  { time: '04:00', value: 15 },
  { time: '08:00', value: 45 },
  { time: '12:00', value: 100 },
  { time: '16:00', value: 40 },
  { time: '20:00', value: 75 },
  { time: '23:59', value: 50 },
];

export function TestingDashboard({ records, onViewList }: TestingDashboardProps) {

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:p-6">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-xs font-bold text-slate-500 tracking-wider">ACTIVE TESTS</h3>
            <Clock className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-4xl font-bold text-slate-800">142</p>
          <div className="mt-4 flex items-center gap-2 text-xs">
            <span className="font-bold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded">↗ 12%</span>
            <span className="text-slate-500 font-medium">vs last shift</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-xs font-bold text-slate-500 tracking-wider">PENDING REPORTS</h3>
            <FileText className="w-5 h-5 text-slate-400" />
          </div>
          <p className="text-4xl font-bold text-slate-800">28</p>
          <div className="mt-4 flex items-center gap-2 text-xs">
            <span className="font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">↘ 4</span>
            <span className="text-slate-500 font-medium">critical threshold: 10</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-xs font-bold text-slate-500 tracking-wider">PASS RATE</h3>
            <CheckCircle className="w-5 h-5 text-amber-700" />
          </div>
          <p className="text-4xl font-bold text-slate-800">98.4%</p>
          <div className="mt-4 w-full bg-slate-100 rounded-full h-1.5">
            <div className="bg-blue-800 h-1.5 rounded-full" style={{ width: '98.4%' }}></div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-xs font-bold text-slate-500 tracking-wider">LAB UTILIZATION</h3>
            <Activity className="w-5 h-5 text-slate-600" />
          </div>
          <p className="text-4xl font-bold text-slate-800">76%</p>
          <div className="mt-4 flex items-center gap-2 text-xs">
            <span className="font-bold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded">Optimal</span>
            <span className="text-slate-500 font-medium">4/6 machines active</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:p-6">
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-[0_1px_3px_rgba(0,0,0,0.05)] p-4 sm:p-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-slate-800">Testing Trends</h3>
                <p className="text-sm font-medium text-slate-500 mt-1">Volume of quality inspections over the last 24 hours</p>
              </div>
              <div className="flex bg-slate-100 p-1 rounded-md border border-slate-200">
                <button className="px-3 py-1 text-xs font-bold text-slate-800 bg-white rounded shadow-sm">24H</button>
                <button className="px-3 py-1 text-xs font-bold text-slate-500 hover:text-slate-700">7D</button>
                <button className="px-3 py-1 text-xs font-bold text-slate-500 hover:text-slate-700">30D</button>
              </div>
            </div>
            <div className="h-64 mt-4 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                   <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563EB" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    itemStyle={{ color: '#1e293b', fontWeight: 600 }}
                  />
                  <Area type="monotone" dataKey="value" stroke="#0033a0" strokeWidth={2} fillOpacity={1} fill="url(#colorValue)" />
                  <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} dy={10} />
                  <YAxis hide />
                </AreaChart>
              </ResponsiveContainer>
            </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-[0_1px_3px_rgba(0,0,0,0.05)] p-4 sm:p-6">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Defect Analysis</h3>
          <div className="space-y-5">
            {[
              { label: 'Fabric Strength Failure', value: 42 },
              { label: 'Color Fastness', value: 28 },
              { label: 'Seam Slippage', value: 15 },
              { label: 'pH Imbalance', value: 10 },
              { label: 'Others', value: 5 },
            ].map(item => (
              <div key={item.label}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="font-semibold text-slate-700">{item.label}</span>
                  <span className="font-bold text-slate-900">{item.value}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div className="bg-[#002f6c] h-2 rounded-full" style={{ width: `${item.value}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-[0_1px_3px_rgba(0,0,0,0.05)] overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-200 flex justify-between items-center">
           <h3 className="text-lg font-bold text-slate-800">Priority Test Queue</h3>
           <button onClick={onViewList} className="text-sm font-bold text-blue-700 hover:text-blue-800 flex items-center gap-1">
             View All Queue <ArrowRight className="w-4 h-4" />
           </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#F8FAFC] text-xs uppercase tracking-wider font-bold text-slate-500 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">TEST ID</th>
                <th className="px-6 py-4">FABRIC TYPE</th>
                <th className="px-6 py-4">BATCH #</th>
                <th className="px-6 py-4">TIME LOGGED</th>
                <th className="px-6 py-4">ASSIGNED LAB</th>
                <th className="px-6 py-4">STATUS</th>
                <th className="px-6 py-4">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 font-bold text-blue-800">#TR-88204</td>
                <td className="px-6 py-4 font-medium text-slate-700 max-w-[150px] truncate">100% Organic Cotton Twill</td>
                <td className="px-6 py-4 text-slate-600">PO-55912</td>
                <td className="px-6 py-4 text-slate-600">08:45 AM</td>
                <td className="px-6 py-4 text-slate-600 font-medium">L-Main Wet Lab</td>
                <td className="px-6 py-4"><span className="px-2.5 py-1 text-[10px] font-bold tracking-wider rounded-xl bg-rose-100 text-rose-700 uppercase">URGENT</span></td>
                <td className="px-6 py-4"></td>
              </tr>
               <tr className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 font-bold text-blue-800">#TR-88209</td>
                <td className="px-6 py-4 font-medium text-slate-700 max-w-[150px] truncate">Recycled Polyester Blend</td>
                <td className="px-6 py-4 text-slate-600">PO-55914</td>
                <td className="px-6 py-4 text-slate-600">09:12 AM</td>
                <td className="px-6 py-4 text-slate-600 font-medium">L-Dry Strength</td>
                <td className="px-6 py-4"><span className="px-2.5 py-1 text-[10px] font-bold tracking-wider rounded-xl bg-blue-100 text-blue-700 uppercase">ACTIVE</span></td>
                <td className="px-6 py-4"></td>
              </tr>
               <tr className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 font-bold text-blue-800">#TR-88212</td>
                <td className="px-6 py-4 font-medium text-slate-700 max-w-[150px] truncate">Indigo Dyed Denim</td>
                <td className="px-6 py-4 text-slate-600">PO-55880</td>
                <td className="px-6 py-4 text-slate-600">10:05 AM</td>
                <td className="px-6 py-4 text-slate-600 font-medium">L-Main Wet Lab</td>
                <td className="px-6 py-4"><span className="px-2.5 py-1 text-[10px] font-bold tracking-wider rounded-xl bg-orange-100 text-orange-700 uppercase">DELAYED</span></td>
                <td className="px-6 py-4"></td>
              </tr>
               <tr className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 font-bold text-blue-800">#TR-88215</td>
                <td className="px-6 py-4 font-medium text-slate-700 max-w-[150px] truncate">Wool-Synthetic Mix</td>
                <td className="px-6 py-4 text-slate-600">PO-55920</td>
                <td className="px-6 py-4 text-slate-600">11:30 AM</td>
                <td className="px-6 py-4 text-slate-600 font-medium">L-Chemical Testing</td>
                <td className="px-6 py-4"><span className="px-2.5 py-1 text-[10px] font-bold tracking-wider rounded-xl bg-slate-200 text-slate-700 uppercase">IN QUEUE</span></td>
                <td className="px-6 py-4"></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
