import React, { useMemo, useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Cell 
} from 'recharts';
import { 
  ShoppingCart, Truck, CheckSquare, Percent, TrendingDown, 
  Search, RefreshCw, XCircle, CalendarClock, Filter 
} from 'lucide-react';
import { INITIAL_ORDERS } from "../orders-buyers/mockData";
import { INITIAL_RECORDS as PROD_QA_RECORDS } from "../production-quality/mockData";
import { INITIAL_RECORDS as INSP_RECORDS } from "../inspection/mockData";
import { useAppearance } from '../setting/AppearanceContext';
import { useApiStorage } from '../../hooks/useApiData';

const isWithinDateRange = (dateStr: string | undefined, filter: string, customStart: string, customEnd: string) => {
  if (!dateStr) return true;
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return true;

  const now = new Date();
  
  if (filter === 'last_month') {
    const threshold = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
    return date >= threshold;
  }
  if (filter === 'last_3_months') {
    const threshold = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate());
    return date >= threshold;
  }
  if (filter === 'last_6_months') {
    const threshold = new Date(now.getFullYear(), now.getMonth() - 6, now.getDate());
    return date >= threshold;
  }
  if (filter === 'last_year') {
    const threshold = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
    return date >= threshold;
  }
  if (filter === 'custom' && customStart && customEnd) {
    return date >= new Date(customStart) && date <= new Date(customEnd);
  }
  return true;
};

export function Dashboard() {
  const { settings } = useAppearance();

  const [dateRangeFilter, setDateRangeFilter] = useState<string>('all');
  const [customStart, setCustomStart] = useState<string>('');
  const [customEnd, setCustomEnd] = useState<string>('');

  const [orders] = useApiStorage('aqm_ordersbuyers_orders', INITIAL_ORDERS);
  const [productionRecords] = useApiStorage('aqm_productionquality_records', PROD_QA_RECORDS);
  const [inspectionRecords] = useApiStorage('aqm_inspection_records', INSP_RECORDS);

  const stats = useMemo(() => {
    const filteredOrders = orders.filter(o => isWithinDateRange(o.orderDate, dateRangeFilter, customStart, customEnd));
    const filteredProduction = productionRecords.filter(r => isWithinDateRange(r.date, dateRangeFilter, customStart, customEnd));
    const filteredInspections = inspectionRecords.filter(r => isWithinDateRange(r.date, dateRangeFilter, customStart, customEnd));

    // Orders
    const totalOrderQty = filteredOrders.reduce((sum, order) => sum + (order.quantity || 0), 0);
    const totalShippedQty = filteredOrders.filter(o => o.status === 'Completed' || o.status === 'Shipped')
      .reduce((sum, order) => sum + (order.quantity || 0), 0);

    // Prod QA
    const totalProdCheckQty = filteredProduction.reduce((sum, r) => sum + (r.inspectedQuantity || 0), 0);
    const totalProdPassedQty = filteredProduction.reduce((sum, r) => sum + (r.passedQuantity || 0), 0);
    const totalProdDefectsQty = filteredProduction.reduce((sum, r) => sum + (r.defectedQuantity || 0), 0);
    const rftPercentage = totalProdCheckQty > 0 ? (totalProdPassedQty / totalProdCheckQty) * 100 : 0;
    const dhuPercentage = totalProdCheckQty > 0 ? (totalProdDefectsQty / totalProdCheckQty) * 100 : 0;

    // Top 5 Defects
    const defectMap: Record<string, number> = {};
    filteredProduction.forEach(record => {
      if (record.topDefects) {
        record.topDefects.forEach(defect => {
          defectMap[defect.type] = (defectMap[defect.type] || 0) + defect.count;
        });
      }
    });
    const topDefects = Object.keys(defectMap)
      .map(key => ({ name: key, count: defectMap[key] }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Inspections (Final Only for Check Qty, Recheck, Fail)
    const finalInspections = filteredInspections.filter(r => r.category === 'Final');
    const totalInspCheckQty = finalInspections.reduce((sum, r) => sum + (r.inspectedQuantity || 0), 0);
    const totalInspRecheckQty = finalInspections.filter(r => r.status === 'Recheck')
      .reduce((sum, r) => sum + (r.inspectedQuantity || 0), 0);
    const totalInspFailQty = finalInspections.filter(r => r.status === 'Fail')
      .reduce((sum, r) => sum + (r.inspectedQuantity || 0), 0);

    const recentInspections = [...filteredInspections]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);

    const upcomingDeliveries = [...filteredOrders]
      .filter(o => o.status !== 'Completed' && o.status !== 'Shipped')
      .filter(o => o.deliveryDate)
      .sort((a, b) => new Date(a.deliveryDate).getTime() - new Date(b.deliveryDate).getTime())
      .slice(0, 5);

    return {
      totalOrderQty,
      totalShippedQty,
      totalProdCheckQty,
      rftPercentage,
      dhuPercentage,
      topDefects,
      totalInspCheckQty,
      totalInspRecheckQty,
      totalInspFailQty,
      recentInspections: recentInspections.length > 0 ? recentInspections : filteredInspections.slice(0, 5),
      upcomingDeliveries,
    };
  }, [orders, productionRecords, inspectionRecords, dateRangeFilter, customStart, customEnd]);

  const getAccentHex = (accent: string) => {
    switch(accent) {
      case 'rose': return '#f43f5e';
      case 'purple': return '#a855f7';
      case 'blue': return '#3b82f6';
      case 'emerald': return '#10b981';
      case 'amber': return '#f59e0b';
      case 'indigo': 
      default: return '#6366f1';
    }
  };
  const accentHex = getAccentHex(settings.accent);

  // Apply Appearance Settings to layout classes
  const spacingClass = settings.spacingMode === 'compact' ? 'gap-2' : settings.spacingMode === 'dense' ? 'gap-3' : 'gap-6';
  const paddingClass = settings.spacingMode === 'compact' ? 'p-2' : settings.spacingMode === 'dense' ? 'p-4' : 'p-6';
  
  let baseCardClass = "bg-white rounded-xl border border-slate-200 overflow-hidden";
  if (settings.cardStyle === 'flat') {
    baseCardClass = "bg-white rounded-xl";
  } else if (settings.cardStyle === 'shadow') {
    baseCardClass = "bg-white rounded-xl shadow-sm border border-slate-200";
  } else if (settings.cardStyle === 'outline') {
    baseCardClass = "bg-white rounded-xl border-2 border-slate-200";
  } else if (settings.cardStyle === 'brutalist') {
    baseCardClass = "bg-white rounded-none border-2 border-slate-900 shadow-[4px_4px_0_0_#0f172a]";
  }

  const metricCards = [
    { title: "Total Order Qty", value: stats.totalOrderQty.toLocaleString(), icon: ShoppingCart, color: "text-blue-600", bg: "bg-blue-50", border: 'border-blue-200' },
    { title: "Shipped Qty", value: stats.totalShippedQty.toLocaleString(), icon: Truck, color: "text-emerald-600", bg: "bg-emerald-50", border: 'border-emerald-200' },
    { title: "Total Check Qty", value: stats.totalProdCheckQty.toLocaleString(), icon: CheckSquare, color: "text-indigo-600", bg: "bg-indigo-50", border: 'border-indigo-200' },
    { title: "DHU %", value: stats.dhuPercentage.toFixed(2) + "%", icon: TrendingDown, color: "text-rose-600", bg: "bg-rose-50", border: 'border-rose-200' },
    { title: "RFT %", value: stats.rftPercentage.toFixed(2) + "%", icon: Percent, color: "text-emerald-600", bg: "bg-emerald-50", border: 'border-emerald-200' },
    { title: "Final Insp Qty", value: stats.totalInspCheckQty.toLocaleString(), icon: Search, color: "text-amber-600", bg: "bg-amber-50", border: 'border-amber-200' },
    { title: "Total Recheck", value: stats.totalInspRecheckQty.toLocaleString(), icon: RefreshCw, color: "text-purple-600", bg: "bg-purple-50", border: 'border-purple-200' },
    { title: "Total Fail", value: stats.totalInspFailQty.toLocaleString(), icon: XCircle, color: "text-rose-600", bg: "bg-rose-50", border: 'border-rose-200' },
  ];

  return (
    <div className={`w-full max-w-7xl mx-auto ${paddingClass}`}>
      <div className="flex flex-row flex-wrap justify-end items-center mb-4 gap-2">
        <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-slate-200 shadow-sm">
          <Filter className="w-4 h-4 text-slate-500" />
          <select 
            value={dateRangeFilter} 
            onChange={e => setDateRangeFilter(e.target.value)}
            className="text-sm bg-transparent border-none focus:ring-0 text-slate-700 font-medium cursor-pointer outline-none"
          >
            <option value="all">All Time</option>
            <option value="last_month">Last Month</option>
            <option value="last_3_months">Last 3 Months</option>
            <option value="last_6_months">Last 6 Months</option>
            <option value="last_year">Last Year</option>
            <option value="custom">Custom Range</option>
          </select>
        </div>
        {dateRangeFilter === 'custom' && (
          <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm">
            <input type="date" value={customStart} onChange={e => setCustomStart(e.target.value)} className="text-sm border-none bg-transparent focus:ring-0 outline-none text-slate-700" />
            <span className="text-slate-400 text-sm">to</span>
            <input type="date" value={customEnd} onChange={e => setCustomEnd(e.target.value)} className="text-sm border-none bg-transparent focus:ring-0 outline-none text-slate-700" />
          </div>
        )}
      </div>

      <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 ${spacingClass} mb-6`}>
        {metricCards.map((metric, idx) => (
          <div key={idx} className={`${baseCardClass} p-5 flex items-center justify-between`}>
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">{metric.title}</p>
              <h3 className="text-2xl font-bold text-slate-800">{metric.value}</h3>
            </div>
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${metric.bg} ${metric.color}`}>
              <metric.icon className="w-6 h-6" />
            </div>
          </div>
        ))}
      </div>

      <div className={`grid grid-cols-1 lg:grid-cols-3 ${spacingClass}`}>
        {/* Top 5 Defect Chart */}
        <div className={`${baseCardClass} flex flex-col`}>
          <div className="p-5 border-b border-slate-100">
            <h3 className="font-semibold text-slate-800">Top 5 Defects</h3>
          </div>
          <div className="p-5 flex-1 min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.topDefects} layout="vertical" margin={{ top: 0, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e2e8f0" />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} width={120} />
                <RechartsTooltip cursor={{fill: '#f8fafc'}} contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={24}>
                  {stats.topDefects.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={accentHex} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Upcoming Deliveries */}
        <div className={`${baseCardClass} flex flex-col`}>
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-semibold text-slate-800">Near CRD Orders</h3>
            <button onClick={() => window.dispatchEvent(new CustomEvent('app-navigate', { detail: { module: 'orders' } }))} className="text-sm font-medium text-indigo-600 hover:text-indigo-700">
              View All
            </button>
          </div>
          <div className="p-0 flex-1">
            <ul className="divide-y divide-slate-100">
              {stats.upcomingDeliveries.map((delivery, idx) => (
                <li key={idx} className="p-4 hover:bg-slate-50 transition-colors flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="font-medium text-slate-800 text-sm">{delivery.buyerName} - {delivery.poArticleNumber}</span>
                    <span className="text-slate-500 text-xs mt-0.5">Style: {delivery.styleNumber}</span>
                  </div>
                  <div className="text-right flex flex-col items-end">
                    <span className="text-xs font-semibold px-2 py-1 bg-rose-50 text-rose-600 rounded-md">
                      {delivery.deliveryDate}
                    </span>
                    <span className="text-slate-500 text-xs mt-1">Qty: {delivery.quantity?.toLocaleString() || '-'}</span>
                  </div>
                </li>
              ))}
              {stats.upcomingDeliveries.length === 0 && (
                <li className="p-8 text-center text-slate-500 text-sm">No upcoming deliveries</li>
              )}
            </ul>
          </div>
        </div>

        {/* Recent Inspections List */}
        <div className={`${baseCardClass} flex flex-col`}>
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-semibold text-slate-800">Recent Inspections</h3>
            <button onClick={() => window.dispatchEvent(new CustomEvent('app-navigate', { detail: { module: 'inspection' } }))} className="text-sm font-medium text-indigo-600 hover:text-indigo-700">
              View All
            </button>
          </div>
          <div className="p-0 flex-1">
            <ul className="divide-y divide-slate-100">
              {stats.recentInspections.map((insp, idx) => (
                <li key={idx} className="p-4 hover:bg-slate-50 transition-colors flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="font-medium text-slate-800 text-sm">{insp.buyer} - {insp.poNumber}</span>
                    <span className="text-slate-500 text-xs mt-0.5">Style: {insp.styleNumber}</span>
                  </div>
                  <div className="text-right flex flex-col items-end">
                    <span className="text-xs font-semibold px-2 py-1 bg-slate-100 text-slate-600 rounded-md">
                      {insp.crdDate || insp.date}
                    </span>
                    <span className="text-slate-500 text-xs mt-1">Qty: {insp.inspectedQuantity}</span>
                  </div>
                </li>
              ))}
              {stats.recentInspections.length === 0 && (
                <li className="p-8 text-center text-slate-500 text-sm">No recent inspections</li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
