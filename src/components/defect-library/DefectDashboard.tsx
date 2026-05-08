import React from 'react';
import { DefectItem } from './types';
import { Book, CheckCircle, FileWarning, AlertTriangle, FileText, ArrowRight, Activity, TrendingUp } from 'lucide-react';

interface DefectDashboardProps {
  records: DefectItem[];
  onViewList: () => void;
}

export function DefectDashboard({ records, onViewList }: DefectDashboardProps) {
  // Compute real statistics
  const totalItems = records.length;
  
  // Calculate items modified in the last 30 days
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  let recentlyAdded = 0;
  records.forEach(r => {
    if (r.lastUpdatedDate) {
      if (new Date(r.lastUpdatedDate) >= thirtyDaysAgo) {
        recentlyAdded++;
      }
    }
  });

  const pendingStandards = records.filter(r => r.status === 'Draft').length;
  const highSeverity = records.filter(r => r.severity === 'Critical').length;

  const stats = [
    { label: 'Total Library Items', value: totalItems.toString(), icon: Book, color: 'text-blue-600', bg: 'bg-blue-100', trend: 'Total', trendStatus: 'positive' },
    { label: 'Recently Modified', value: recentlyAdded.toString(), icon: CheckCircle, color: 'text-blue-600', bg: 'bg-blue-100', trend: 'Last 30 Days', trendStatus: 'neutral' },
    { label: 'Pending Standards', value: pendingStandards.toString(), icon: FileWarning, color: 'text-amber-600', bg: 'bg-amber-100', trend: 'Drafts', trendStatus: 'warning' },
    { label: 'Critical Defects', value: highSeverity.toString(), icon: AlertTriangle, color: 'text-rose-600', bg: 'bg-rose-100', trend: 'High Alert', trendStatus: 'critical' },
  ];

  // Top Defect Categories
  const categoryCounts = records.reduce((acc, current) => {
    acc[current.category] = (acc[current.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const sortedCategories = Object.entries(categoryCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const maxCategoryCount = sortedCategories.length > 0 ? sortedCategories[0][1] : 1;

  const categories = sortedCategories.map(([name, count]) => {
    const percentage = totalItems > 0 ? Math.round((count / totalItems) * 100) : 0;
    const heightPercentage = Math.round((count / maxCategoryCount) * 100);
    return { name, value: percentage, count, heightPercentage };
  });

  // Recent Updates
  const sortedRecords = [...records].sort((a, b) => {
    const dateA = a.lastUpdatedDate ? new Date(a.lastUpdatedDate).getTime() : 0;
    const dateB = b.lastUpdatedDate ? new Date(b.lastUpdatedDate).getTime() : 0;
    return dateB - dateA;
  }).slice(0, Math.min(3, records.length));

  const recentUpdates = sortedRecords.map((r, i) => {
    const colors = [
      { icon: Book, color: 'bg-blue-100 text-blue-600' },
      { icon: Activity, color: 'bg-orange-100 text-orange-600' },
      { icon: TrendingUp, color: 'bg-rose-100 text-rose-600' }
    ];
    return {
      title: `${r.name} (${r.code})`,
      desc: `Modified by ${r.lastUpdatedBy || 'System'}`,
      time: r.lastUpdatedDate ? new Date(r.lastUpdatedDate).toLocaleDateString() : 'Unknown',
      icon: colors[i % colors.length].icon,
      color: colors[i % colors.length].color
    };
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-black text-slate-800">Defect Library</h2>
          <p className="text-slate-500 font-medium">Manage global defect standards and severity thresholds across manufacturing units.</p>
        </div>
        <button onClick={onViewList} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 hover:bg-blue-700 rounded-md font-semibold text-sm transition-colors shadow-sm">
          <span>View Library</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <div key={i} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-2 rounded-lg ${s.bg}`}>
                <s.icon className={`w-5 h-5 ${s.color}`} />
              </div>
              <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full ${s.trendStatus === 'positive' ? 'bg-emerald-100 text-emerald-700' : s.trendStatus === 'warning' ? 'bg-amber-100 text-amber-700' : s.trendStatus === 'critical' ? 'bg-rose-100 text-rose-700' : 'bg-blue-100 text-blue-700'}`}>
                {s.trend}
              </span>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">{s.label}</p>
              <h3 className="text-3xl font-black text-slate-800 tracking-tight">{s.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:p-6">
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm p-4 sm:p-6 flex flex-col">
          <div className="flex justify-between items-center mb-12">
            <h3 className="text-lg font-bold text-slate-800">Top Defect Categories</h3>
            <select className="text-sm font-medium border border-slate-200 rounded-md px-3 py-1.5 bg-slate-50 text-slate-700 outline-none">
              <option>Last 90 Days</option>
              <option>Last 30 Days</option>
              <option>This Year</option>
            </select>
          </div>
          
          <div className="flex-1 flex items-end justify-between px-4 pb-4 gap-4">
            {categories.map((cat, i) => (
              <div key={i} className="flex flex-col items-center gap-3 w-full group">
                <div className="text-sm font-bold text-blue-600 transition-all opacity-0 group-hover:opacity-100 -translate-y-2 group-hover:translate-y-0">{cat.value}%</div>
                <div className="w-full bg-slate-100 rounded-t-md relative flex justify-center group-hover:bg-blue-50 transition-colors" style={{ height: '140px' }}>
                  <div 
                    className="absolute bottom-0 w-full bg-blue-100 rounded-t-sm group-hover:bg-blue-200 transition-all delay-75 duration-300 shadow-[inset_0_-2px_0_rgba(37,99,235,0.2)]" 
                    style={{ height: `${cat.heightPercentage}%` }} 
                  />
                  <div 
                    className="absolute bottom-0 w-[40%] bg-blue-600 rounded-t-sm transition-all duration-500 shadow-sm" 
                    style={{ height: `${cat.heightPercentage}%` }} 
                  />
                </div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{cat.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 sm:p-6 overflow-hidden flex flex-col">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Recent Library Updates</h3>
          <div className="flex-1 space-y-6">
            {recentUpdates.map((update, i) => (
              <div key={i} className="flex gap-4 group">
                <div className={`shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${update.color}`}>
                   <update.icon className="w-5 h-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="text-sm font-bold text-slate-800 truncate group-hover:text-blue-600 transition-colors">{update.title}</h4>
                  <p className="text-xs text-slate-500 mt-0.5">{update.desc}</p>
                  <p className="text-[10px] font-bold text-slate-400 mt-2 uppercase tracking-wider">{update.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
