import React, { useState, useMemo } from 'react';
import { QualityRecord } from './types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, ComposedChart, Line, LineChart } from 'recharts';
import { CheckCircle2, AlertTriangle, XCircle, Activity, Filter, Calendar, BadgeCheck } from 'lucide-react';

interface DashboardProps {
  records: QualityRecord[];
  onLineClick?: (line: string) => void;
}

export function ProductionQualityDashboard({ records, onLineClick }: DashboardProps) {
  const [dateFilter, setDateFilter] = useState<'all' | 'weekly' | 'monthly' | 'yearly' | 'custom'>('all');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');

  const filteredRecords = useMemo(() => {
    if (dateFilter === 'all') return records;

    const now = new Date();
    let startDate = new Date();
    let endDate = now;

    if (dateFilter === 'weekly') {
      startDate.setDate(now.getDate() - 7);
    } else if (dateFilter === 'monthly') {
      startDate.setMonth(now.getMonth() - 1);
    } else if (dateFilter === 'yearly') {
      startDate.setFullYear(now.getFullYear() - 1);
    } else if (dateFilter === 'custom') {
      const s = customStartDate ? new Date(customStartDate) : new Date(0);
      const e = customEndDate ? new Date(customEndDate) : new Date();
      e.setHours(23, 59, 59, 999);
      
      return records.filter(r => {
        const recordDate = new Date(r.date);
        return recordDate >= s && recordDate <= e;
      });
    }

    startDate.setHours(0, 0, 0, 0);

    return records.filter(r => {
      const recordDate = new Date(r.date);
      return recordDate >= startDate && recordDate <= endDate;
    });
  }, [records, dateFilter, customStartDate, customEndDate]);

  const totalInspected = filteredRecords.reduce((sum, r) => sum + r.inspectedQuantity, 0);
  const totalPassed = filteredRecords.reduce((sum, r) => sum + r.passedQuantity, 0);
  const totalDefected = filteredRecords.reduce((sum, r) => sum + r.defectedQuantity, 0);
  const totalRejected = filteredRecords.reduce((sum, r) => sum + r.rejectedQuantity, 0);

  const passRate = totalInspected ? ((totalPassed / totalInspected) * 100).toFixed(1) : '0';
  const defectRate = totalInspected ? ((totalDefected / totalInspected) * 100).toFixed(1) : '0';
  const rftRate = totalInspected ? ((totalPassed / totalInspected) * 100).toFixed(1) : '0';

  // Group by line for bar chart
  const lineStats = filteredRecords.reduce((acc, curr) => {
    const existing = acc.find(item => item.line === curr.line);
    if (existing) {
      existing.inspected += curr.inspectedQuantity;
      existing.passed += curr.passedQuantity;
      existing.defects += curr.defectedQuantity;
    } else {
      acc.push({
        line: curr.line,
        inspected: curr.inspectedQuantity,
        passed: curr.passedQuantity,
        defects: curr.defectedQuantity,
      });
    }
    return acc;
  }, [] as {line: string, inspected: number, passed: number, defects: number}[]);

  const statusData = [
    { name: 'Passed', value: totalPassed, color: '#10b981' },
    { name: 'Reworked', value: filteredRecords.reduce((sum, r) => sum + r.reworkedQuantity, 0), color: '#f59e0b' },
    { name: 'Rejected', value: totalRejected, color: '#ef4444' },
  ];

  // Pareto Analysis Data
  const defectCounts = filteredRecords.reduce((acc, curr) => {
    curr.topDefects.forEach(defect => {
      if (acc[defect.type]) {
        acc[defect.type] += defect.count;
      } else {
        acc[defect.type] = defect.count;
      }
    });
    return acc;
  }, {} as Record<string, number>);

  const paretoDataRaw = Object.entries(defectCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);

  const totalDefectsCount = paretoDataRaw.reduce((sum, item) => sum + item.count, 0);

  let cumulativeCount = 0;
  const paretoData = paretoDataRaw.map(item => {
    cumulativeCount += item.count;
    return {
      name: item.name,
      count: item.count,
      cumulativePercent: totalDefectsCount > 0 ? parseFloat(((cumulativeCount / totalDefectsCount) * 100).toFixed(1)) : 0
    };
  });

  // Calculate Defect Rate Trend by Date
  const dateKeys = Array.from(new Set(filteredRecords.map(r => r.date))).sort();
  const trendData = dateKeys.map(date => {
    const dayRecords = filteredRecords.filter(r => r.date === date);
    const dayInspected = dayRecords.reduce((sum, r) => sum + r.inspectedQuantity, 0);
    const dayDefects = dayRecords.reduce((sum, r) => sum + r.defectedQuantity, 0);
    const rate = dayInspected ? parseFloat(((dayDefects / dayInspected) * 100).toFixed(1)) : 0;
    const dayPassed = dayRecords.reduce((sum, r) => sum + r.passedQuantity, 0);
    const rft = dayInspected ? parseFloat(((dayPassed / dayInspected) * 100).toFixed(1)) : 0;
    
    // Format date string for better display (e.g. "May 01" from "2026-05-01")
    let displayDate = date;
    try {
      const d = new Date(date);
      displayDate = d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    } catch(e) {}

    return {
      date: displayDate,
      fullDate: date,
      defectRate: rate,
      rftRate: rft,
      inspected: dayInspected,
      defects: dayDefects
    };
  });

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-slate-400" />
          <h2 className="text-sm font-bold text-slate-800">Date Range Filter</h2>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <select 
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value as any)}
            className="text-sm border border-slate-300 rounded-lg px-3 py-2 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Time</option>
            <option value="weekly">Last 7 Days</option>
            <option value="monthly">Last 30 Days</option>
            <option value="yearly">Last Year</option>
            <option value="custom">Custom Range...</option>
          </select>

          {dateFilter === 'custom' && (
            <div className="flex items-center gap-2">
              <input 
                type="date" 
                value={customStartDate} 
                onChange={e => setCustomStartDate(e.target.value)}
                className="text-sm border border-slate-300 rounded-lg px-3 py-2 bg-white"
              />
              <span className="text-slate-400 text-sm">to</span>
              <input 
                type="date" 
                value={customEndDate} 
                onChange={e => setCustomEndDate(e.target.value)}
                className="text-sm border border-slate-300 rounded-lg px-3 py-2 bg-white"
              />
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 sm:p-6">
        <div className="shadow-sm border border-slate-200 bg-white rounded-lg p-5">
            <div className="flex justify-between items-center pb-2">
              <p className="text-[10px] uppercase font-bold text-slate-500">Total Inspected</p>
              <Activity className="h-4 w-4 text-blue-600" />
            </div>
            <p className="text-3xl font-black text-slate-900">{totalInspected.toLocaleString()}</p>
            <p className="mt-1 text-xs text-slate-500 font-medium">Pieces</p>
        </div>
        <div className="shadow-sm border border-slate-200 bg-white rounded-lg p-5 bg-emerald-50/30 border-emerald-100">
            <div className="flex justify-between items-center pb-2">
              <p className="text-[10px] uppercase font-bold text-emerald-700 cursor-help" title="Right First Time Percentage">RFT Percentage</p>
              <BadgeCheck className="h-4 w-4 text-emerald-600" />
            </div>
            <div className="cursor-help inline-block" title="Passed Quantity / Total Inspected Quantity">
                <p className="text-3xl font-black text-emerald-600">{rftRate}%</p>
            </div>
            <p className="mt-1 text-xs text-emerald-600 font-medium">{totalPassed.toLocaleString()} passed</p>
        </div>
        <div className="shadow-sm border border-slate-200 bg-white rounded-lg p-5">
            <div className="flex justify-between items-center pb-2">
              <p className="text-[10px] uppercase font-bold text-slate-500 cursor-help" title="Passed Quantity / Total Inspected Quantity">Pass Rate</p>
              <CheckCircle2 className="h-4 w-4 text-blue-600" />
            </div>
            <div className="cursor-help inline-block" title="Passed Quantity / Total Inspected Quantity">
                <p className="text-3xl font-black text-slate-900">{passRate}%</p>
            </div>
            <p className="mt-1 text-xs text-slate-500 font-medium">{totalPassed.toLocaleString()} pass</p>
        </div>
        <div className="shadow-sm border border-slate-200 bg-white rounded-lg p-5">
            <div className="flex justify-between items-center pb-2">
              <p className="text-[10px] uppercase font-bold text-slate-500 cursor-help" title="Defected Quantity / Total Inspected Quantity">Defect Rate</p>
              <AlertTriangle className="h-4 w-4 text-amber-600" />
            </div>
            <div className="cursor-help inline-block" title="Defected Quantity / Total Inspected Quantity">
                <p className="text-3xl font-black text-slate-900">{defectRate}%</p>
            </div>
            <p className="mt-1 text-xs text-amber-600 font-medium">{totalDefected.toLocaleString()} defects</p>
        </div>
        <div className="shadow-sm border border-slate-200 bg-white rounded-lg p-5">
            <div className="flex justify-between items-center pb-2">
              <p className="text-[10px] uppercase font-bold text-slate-500">Total Rejected</p>
              <XCircle className="h-4 w-4 text-rose-600" />
            </div>
            <p className="text-3xl font-black text-slate-900">{totalRejected.toLocaleString()}</p>
            <p className="mt-1 text-xs text-rose-600 font-medium">Pieces</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:p-6">
        <div className="shadow-sm border border-slate-200 bg-white rounded-lg">
          <div className="border-b border-slate-100 p-4 font-bold text-sm flex justify-between items-center">
            <span>Pareto Analysis (80/20 Rule)</span>
            <span className="text-xs font-normal text-slate-500">Top Defects Occurrences</span>
          </div>
          <div className="p-4">
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={paretoData} margin={{ top: 20, right: 30, left: 0, bottom: 40 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 11, fontWeight: 500}} angle={-45} textAnchor="end" />
                  <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 11, fontWeight: 500}} />
                  <YAxis yAxisId="right" orientation="right" tickFormatter={(v) => `${v}%`} axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 11, fontWeight: 500}} domain={[0, 100]} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', backgroundColor: '#ffffff', color: '#0f172a', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', fontWeight: 500, color: '#64748b' }} verticalAlign="top" height={36} />
                  <Bar yAxisId="left" dataKey="count" name="Defect Count" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} />
                  <Line yAxisId="right" type="monotone" dataKey="cumulativePercent" name="Cumulative %" stroke="#ef4444" strokeWidth={3} dot={{ r: 4, fill: '#ef4444', strokeWidth: 2, stroke: '#ffffff' }} activeDot={{ r: 6 }} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:p-6">
        <div className="shadow-sm border border-slate-200 bg-white rounded-lg">
          <div className="border-b border-slate-100 p-4 font-bold text-sm">RFT & Defect Rate Trend</div>
          <div className="p-4">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 11, fontWeight: 500}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 11, fontWeight: 500}} tickFormatter={(value) => `${value}%`} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', backgroundColor: '#ffffff', color: '#0f172a', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    formatter={(value: number, name: string) => {
                      if (name === 'defectRate') return [`${value}%`, 'Defect Rate'];
                      if (name === 'rftRate') return [`${value}%`, 'RFT Rate'];
                      return [value, name];
                    }}
                    labelFormatter={(label, payload) => {
                      if (payload && payload.length > 0) {
                        return payload[0].payload.fullDate;
                      }
                      return label;
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', fontWeight: 500, color: '#64748b' }} verticalAlign="top" height={36} />
                  <Line type="monotone" dataKey="rftRate" name="RFT Rate" stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill: '#10b981', strokeWidth: 2, stroke: '#ffffff' }} activeDot={{ r: 6 }} />
                  <Line type="monotone" dataKey="defectRate" name="Defect Rate" stroke="#f59e0b" strokeWidth={3} dot={{ r: 4, fill: '#f59e0b', strokeWidth: 2, stroke: '#ffffff' }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="shadow-sm border border-slate-200 bg-white rounded-lg">
          <div className="border-b border-slate-100 p-4 font-bold text-sm">Production Line Performance <span className="text-xs font-normal text-slate-500 ml-2">(Click to filter)</span></div>
          <div className="p-4">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={lineStats} margin={{ top: 20, right: 30, left: 0, bottom: 5 }} onClick={(data) => {
                  if (data && data.activeLabel && onLineClick) {
                    onLineClick(String(data.activeLabel));
                  }
                }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="line" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 11, fontWeight: 500}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 11, fontWeight: 500}} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', backgroundColor: '#ffffff', color: '#0f172a', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    cursor={{fill: '#f1f5f9'}}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', fontWeight: 500, color: '#64748b' }} />
                  <Bar dataKey="passed" name="Passed" stackId="a" fill="#10b981" barSize={32} cursor={onLineClick ? 'pointer' : 'default'} />
                  <Bar dataKey="defects" name="Defects" stackId="a" fill="#f59e0b" radius={[4, 4, 0, 0]} barSize={32} cursor={onLineClick ? 'pointer' : 'default'} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:p-6">
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

