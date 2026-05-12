import React from 'react';
import { InspectionRecord } from './types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { CheckCircle2, AlertTriangle, XCircle, Activity } from 'lucide-react';

interface DashboardProps {
  records: InspectionRecord[];
}

export function InspectionDashboard({ records }: DashboardProps) {
  const parseNumber = (val: any) => {
    if (typeof val === 'number') return val;
    if (typeof val === 'string') return Number(val.replace(/,/g, '')) || 0;
    return 0;
  };

  const totalInspected = records.reduce((sum, r) => sum + parseNumber(r.inspectedQuantity), 0);
  const totalCritical = records.reduce((sum, r) => sum + parseNumber(r.criticalDefects), 0);
  const totalMajor = records.reduce((sum, r) => sum + parseNumber(r.majorDefects), 0);
  const totalMinor = records.reduce((sum, r) => sum + parseNumber(r.minorDefects), 0);
  const totalShortage = records.reduce((sum, r) => sum + parseNumber(r.shortage), 0);
  const totalExcess = records.reduce((sum, r) => sum + parseNumber(r.excess), 0);
  const totalDefected = totalCritical + totalMajor + totalMinor;
  const totalPassed = Math.max(0, totalInspected - totalDefected);
  const totalFailed = records.filter(r => r.status === 'Fail').length;

  const passRate = totalInspected ? ((totalPassed / totalInspected) * 100).toFixed(1) : '0';
  const defectRate = totalInspected ? ((totalDefected / totalInspected) * 100).toFixed(1) : '0';

  const categoryStats = records.reduce((acc, curr) => {
    const existing = acc.find(item => item.category === curr.category);
    const currDefects = parseNumber(curr.criticalDefects) + parseNumber(curr.majorDefects) + parseNumber(curr.minorDefects);
    const currInspected = parseNumber(curr.inspectedQuantity);
    const currPassed = Math.max(0, currInspected - currDefects);
    
    if (existing) {
      existing.inspected += currInspected;
      existing.passed += currPassed;
      existing.defects += currDefects;
    } else {
      acc.push({
        category: curr.category,
        inspected: currInspected,
        passed: currPassed,
        defects: currDefects,
      });
    }
    return acc;
  }, [] as {category: string, inspected: number, passed: number, defects: number}[]);

  const statusData = [
    { name: 'Pass', value: totalPassed, color: '#10b981' },
    { name: 'Recheck', value: records.filter(r => r.status === 'Recheck').length, color: '#f59e0b' },
    { name: 'Fail', value: totalFailed, color: '#ef4444' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:p-6">
        <div className="shadow-sm border border-slate-200 bg-white rounded-lg p-5">
            <div className="flex justify-between items-center pb-2">
              <p className="text-[10px] uppercase font-bold text-slate-500">Total Inspected</p>
              <Activity className="h-4 w-4 text-blue-600" />
            </div>
            <p className="text-2xl font-black text-slate-900">{totalInspected.toLocaleString()}</p>
            <p className="mt-1 text-xs text-slate-500 font-medium">Pieces</p>
        </div>
        <div className="shadow-sm border border-slate-200 bg-white rounded-lg p-5">
            <div className="flex justify-between items-center pb-2">
              <p className="text-[10px] uppercase font-bold text-slate-500">Pass Rate</p>
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            </div>
            <p className="text-2xl font-black text-slate-900">{passRate}%</p>
            <p className="mt-1 text-xs text-emerald-600 font-medium">{totalPassed.toLocaleString()} passed</p>
        </div>
        <div className="shadow-sm border border-slate-200 bg-white rounded-lg p-5">
            <div className="flex justify-between items-center pb-2">
              <p className="text-[10px] uppercase font-bold text-slate-500">Defect Rate</p>
              <AlertTriangle className="h-4 w-4 text-amber-600" />
            </div>
            <p className="text-2xl font-black text-slate-900">{defectRate}%</p>
            <p className="mt-1 text-xs text-amber-600 font-medium">{totalDefected.toLocaleString()} defects</p>
        </div>
        <div className="shadow-sm border border-slate-200 bg-white rounded-lg p-5">
            <div className="flex justify-between items-center pb-2">
              <p className="text-[10px] uppercase font-bold text-slate-500">Total Failed</p>
              <XCircle className="h-4 w-4 text-rose-600" />
            </div>
            <p className="text-2xl font-black text-slate-900">{totalFailed.toLocaleString()}</p>
            <p className="mt-1 text-xs text-rose-600 font-medium">Records</p>
        </div>
        <div className="shadow-sm border border-slate-200 bg-white rounded-lg p-5">
            <div className="flex justify-between items-center pb-2">
              <p className="text-[10px] uppercase font-bold text-slate-500">Total Shortage</p>
              <AlertTriangle className="h-4 w-4 text-slate-600" />
            </div>
            <p className="text-2xl font-black text-slate-900">{totalShortage.toLocaleString()}</p>
            <p className="mt-1 text-xs text-slate-500 font-medium">Pieces</p>
        </div>
        <div className="shadow-sm border border-slate-200 bg-white rounded-lg p-5">
            <div className="flex justify-between items-center pb-2">
              <p className="text-[10px] uppercase font-bold text-slate-500">Total Excess</p>
              <Activity className="h-4 w-4 text-slate-600" />
            </div>
            <p className="text-2xl font-black text-slate-900">{totalExcess.toLocaleString()}</p>
            <p className="mt-1 text-xs text-slate-500 font-medium">Pieces</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:p-6">
        <div className="shadow-sm border border-slate-200 bg-white rounded-lg lg:col-span-2">
          <div className="border-b border-slate-100 p-4 font-bold text-sm">Inspection Category Performance</div>
          <div className="p-4">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryStats} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="category" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 11, fontWeight: 500}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 11, fontWeight: 500}} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', backgroundColor: '#ffffff', color: '#0f172a', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', fontWeight: 500, color: '#64748b' }} />
                  <Bar dataKey="passed" name="Passed" stackId="a" fill="#10b981" radius={[0, 0, 4, 4]} barSize={32} />
                  <Bar dataKey="defects" name="Defects" stackId="a" fill="#f59e0b" radius={[4, 4, 0, 0]} barSize={32} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="shadow-sm border border-slate-200 bg-white rounded-lg">
          <div className="border-b border-slate-100 p-4 font-bold text-sm">Quality Breakdown</div>
          <div className="p-4">
            <div className="h-[300px] flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={2}
                    dataKey="value"
                    stroke="none"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', backgroundColor: '#ffffff', color: '#0f172a', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: '11px', fontWeight: 500, color: '#64748b' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
