import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { useAppearance } from "../setting/AppearanceContext";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend,
  AreaChart,
  Area,
  ComposedChart,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis
} from "recharts";
import { AlertCircle, CheckCircle2, TrendingDown, TrendingUp, ShieldAlert, BadgeCheck, Package, LayoutList, Target, ClipboardCheck, Search, Filter } from "lucide-react";
import { INITIAL_CAPAS } from "../capa/mockData";
import { INITIAL_RECORDS as INITIAL_INSPECTIONS } from "../inspection/mockData";
import { INITIAL_RECORDS as INITIAL_PRODUCTION } from "../production-quality/mockData";
import { INITIAL_ORDERS } from "../orders-buyers/mockData";
import { format, parseISO, subMonths } from "date-fns";
import { useApiData, apiFetch, apiSave } from "../../hooks/useApiData";

export function Dashboard() {
  const { settings } = useAppearance();
  const paddingClass = (settings.uiSize === 'compact' || settings.uiSize === 'extra-compact') ? 'p-3' : 'p-4 sm:p-6';
  const headerPaddingClass = (settings.uiSize === 'compact' || settings.uiSize === 'extra-compact') ? 'p-2' : 'p-4 sm:p-6';
  
  const [dateRange, setDateRange] = useState<'7d' | '30d' | 'custom' | 'all'>('all');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');

  const rawCapas = useApiData('aqm_capa_records', INITIAL_CAPAS);
  const rawInspections = useApiData('aqm_inspection_records', INITIAL_INSPECTIONS);
  const rawProductions = useApiData('aqm_productionquality_records', INITIAL_PRODUCTION);
  const rawOrders = useApiData('aqm_ordersbuyers_orders', INITIAL_ORDERS);

  const filterByDate = (items: any[], dateField: string) => {
    if (dateRange === 'all') return items;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return items.filter(item => {
      if (!item[dateField]) return true;
      const itemDate = new Date(item[dateField]);
      if (isNaN(itemDate.getTime())) return true;
      
      if (dateRange === '7d') {
        const past = new Date(today);
        past.setDate(today.getDate() - 7);
        return itemDate >= past;
      }
      if (dateRange === '30d') {
        const past = new Date(today);
        past.setDate(today.getDate() - 30);
        return itemDate >= past;
      }
      if (dateRange === 'custom') {
        const start = customStartDate ? new Date(customStartDate) : null;
        const end = customEndDate ? new Date(customEndDate) : null;
        if (start && end) {
          end.setHours(23, 59, 59, 999);
          return itemDate >= start && itemDate <= end;
        } else if (start) {
          return itemDate >= start;
        } else if (end) {
          end.setHours(23, 59, 59, 999);
          return itemDate <= end;
        }
        return true;
      }
      return true;
    });
  };

  const capas = filterByDate(rawCapas, 'dateRaised');
  const inspections = filterByDate(rawInspections, 'date');
  const productions = filterByDate(rawProductions, 'date');
  const orders = filterByDate(rawOrders, 'orderDate');

  const data = { capas, inspections, productions, orders };

  // Compute Metrics
  let totalInspected = 0;
  let totalPassed = 0;
  let totalDefected = 0;
  
  data.productions.forEach((p: any) => {
    totalInspected += p.inspectedQuantity || 0;
    totalPassed += p.passedQuantity || 0;
    totalDefected += p.defectedQuantity || 0;
  });

  let totalOrderPcs = 0;
  data.orders.forEach((o: any) => {
    totalOrderPcs += o.quantity || 0;
  });

  let totalInspectionQty = 0;
  let totalInspectionPassQty = 0;
  let totalInspectionFailQty = 0;

  data.inspections.forEach((i: any) => {
    const qty = i.inspectedQuantity || 0;
    totalInspectionQty += qty;
    if (i.status === 'Pass') {
      totalInspectionPassQty += qty;
    } else if (i.status === 'Fail' || i.status === 'Recheck') {
      totalInspectionFailQty += qty;
    }
  });

  const qualityPassRate = totalInspected > 0 ? (totalPassed / totalInspected) * 100 : 0;
  const totalDHU = totalInspected > 0 ? (totalDefected / totalInspected) * 100 : 0;
  const activeCapas = data.capas.filter((c: any) => c.status !== 'Closed').length;

  const pendingInspections = data.inspections.filter((i: any) => i.status === 'Pending' || i.status === 'Recheck').length;
  const resolvedIssues = data.capas.filter((c: any) => c.status === 'Closed').length;

  const rftRateData = [
    { name: "RFT (Pass)", value: qualityPassRate, color: "#10b981" },
    { name: "Fail/Rework", value: 100 - qualityPassRate, color: "#ef4444" },
  ];

  // Compile defect types
  const defectCounts: Record<string, number> = {};
  data.productions.forEach((p: any) => {
    p.topDefects?.forEach((d: any) => {
      defectCounts[d.type] = (defectCounts[d.type] || 0) + d.count;
    });
  });

  const defectTypesData = Object.entries(defectCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5); // top 5

  // Compile defect trend (last 6 months)
  const today = new Date();
  const months = Array.from({ length: 6 }).map((_, i) => {
    const d = subMonths(today, 5 - i);
    return {
      monthStr: format(d, 'yyyy-MM'),
      label: format(d, 'MMM')
    };
  });

  const defectTrendData = months.map(m => {
    const matchingProductions = data.productions.filter((p: any) => p.date && p.date.startsWith(m.monthStr));
    const totalDefects = matchingProductions.reduce((sum: number, p: any) => sum + (p.defectedQuantity || 0), 0);
    return {
      month: m.label,
      defects: totalDefects
    };
  });

  // Quality Radar Data based on inspection categories
  const radarCategories = ['workmanship', 'measurement', 'productSafety', 'labeling', 'packing', 'shippingMark'];
  const radarData = radarCategories.map(cat => {
    let total = 0;
    let passed = 0;
    data.inspections.forEach((i: any) => {
      if (i[cat] && i[cat] !== 'N/A') {
        total++;
        if (i[cat] === 'Pass' || i[cat] === 'Accept') passed++;
      }
    });

    // Handle dummy or random initial data if calculations yield 0
    let rate = 0;
    if (total > 0) {
      rate = (passed / total) * 100;
    } else {
      const mockRates: Record<string, number> = {
        workmanship: 85,
        measurement: 92,
        productSafety: 100,
        labeling: 90,
        packing: 88,
        shippingMark: 94
      };
      rate = mockRates[cat] || 90;
    }

    const names: Record<string, string> = {
      workmanship: 'Workmanship',
      measurement: 'Measurement',
      productSafety: 'Safety',
      labeling: 'Labeling',
      packing: 'Packing',
      shippingMark: 'Shipping'
    };
    return {
      subject: names[cat] || cat,
      score: parseInt(rate.toFixed(0)),
      fullMark: 100,
    };
  });

  // Composed Volume vs Target Data
  const prodTrendData = months.map(m => {
    const matchingProductions = data.productions.filter((p: any) => p.date && p.date.startsWith(m.monthStr));
    const totalIns = matchingProductions.reduce((sum: number, p: any) => sum + (p.inspectedQuantity || 0), 0);
    const totalPass = matchingProductions.reduce((sum: number, p: any) => sum + (p.passedQuantity || 0), 0);
    const pRate = totalIns > 0 ? (totalPass / totalIns) * 100 : 0;
    
    return {
      month: m.label,
      inspected: totalIns,
      passed: totalPass,
      rftRate: parseFloat(pRate.toFixed(1))
    };
  });

  const handleNavigate = (module: string) => {
    window.dispatchEvent(new CustomEvent('app-navigate', { detail: { module } }));
  };

    const topMetrics = [
    { title: "Total Order Pcs", value: totalOrderPcs.toLocaleString(), icon: Package, color: "text-blue-600", bg: "bg-blue-50/50", border: 'border-blue-100', route: 'orders_and_buyers' },
    { title: "Total Checked", value: totalInspected.toLocaleString(), icon: LayoutList, color: "text-indigo-600", bg: "bg-indigo-50/50", border: 'border-indigo-100', route: 'production_quality' },
    { title: "Total DHU", value: `${totalDHU.toFixed(1)}%`, icon: Target, color: "text-rose-600", bg: "bg-rose-50/50", border: 'border-rose-100', route: 'production_quality' },
    { title: "Avg RFT Percentage", value: `${qualityPassRate.toFixed(1)}%`, icon: ClipboardCheck, color: "text-emerald-600", bg: "bg-emerald-50/50", border: 'border-emerald-100', route: 'production_quality' }
  ];

  const inspectionMetrics = [
    { title: "Total Inspected Qty", value: totalInspectionQty.toLocaleString(), icon: Search, color: "text-blue-600", border: "border-blue-200", route: 'inspection' },
    { title: "Total Pass Qty", value: totalInspectionPassQty.toLocaleString(), icon: CheckCircle2, color: "text-emerald-600", border: "border-emerald-200", route: 'inspection' },
    { title: "Total Fail/Recheck Qty", value: totalInspectionFailQty.toLocaleString(), icon: AlertCircle, color: "text-rose-600", border: "border-rose-200", route: 'inspection' }
  ];

  const secondaryMetrics = [
    { title: "Pending Inspections", value: pendingInspections, icon: ShieldAlert, color: "text-amber-600", bg: "bg-amber-50" },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 100, damping: 15 } }
  };

  return (
    <motion.div 
      className="flex flex-col gap-4 sm:p-6 lg:p-8 w-full pb-8"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {/* Dashboard Header & Filter */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 px-6 md:px-0">
        <div>
           <h1 className="text-2xl font-bold text-slate-800">Overview</h1>
           <p className="text-sm text-slate-500 text-muted-foreground">Monitor your key metrics and quality metrics.</p>
        </div>
        
        <div className="flex items-center gap-2 bg-white p-1 rounded-lg border border-slate-200 shadow-sm shrink-0">
           <Filter className="w-4 h-4 text-slate-400 ml-2" />
           <select 
             value={dateRange}
             onChange={(e) => setDateRange(e.target.value as any)}
             className="bg-transparent border-none text-sm font-medium text-slate-700 outline-none focus:ring-0 cursor-pointer pr-2"
           >
             <option value="all">All Time</option>
             <option value="7d">Last 7 Days</option>
             <option value="30d">Last 30 Days</option>
             <option value="custom">Custom Range</option>
           </select>
        </div>
      </div>

      {dateRange === 'custom' && (
        <div className="flex justify-end px-6 md:px-0">
           <div className="flex items-center gap-2 bg-white p-2 rounded-lg border border-slate-200 shadow-sm">
              <input type="date" value={customStartDate} onChange={e => setCustomStartDate(e.target.value)} className="text-sm border border-slate-200 rounded px-2 py-1 outline-none focus:border-indigo-500" />
              <span className="text-slate-400 text-sm">to</span>
              <input type="date" value={customEndDate} onChange={e => setCustomEndDate(e.target.value)} className="text-sm border border-slate-200 rounded px-2 py-1 outline-none focus:border-indigo-500" />
           </div>
        </div>
      )}

      {/* Top Main Metrics */}
      <div className="grid gap-4 sm:p-6 md:grid-cols-2 lg:grid-cols-4 shrink-0">
        {topMetrics.map((metric, i) => (
          <motion.div key={i} variants={itemVariants} whileHover={{ y: -4 }}>
            <Card onClick={() => handleNavigate(metric.route)} className={`relative overflow-hidden cursor-pointer shadow-sm border ${metric.border} ${metric.bg} hover:shadow-md transition-all duration-300`}>
              <div className="absolute top-0 right-0 -mr-4 -mt-4 opacity-10">
                 <metric.icon className="w-32 h-32" />
              </div>
              <CardContent className={`${paddingClass} relative z-10`}>
                <div className="flex items-center justify-between pb-2">
                  <p className="text-xs uppercase font-bold text-slate-600 tracking-wider">{metric.title}</p>
                  <div className={`p-2 rounded-lg bg-white/60 shadow-sm ${metric.color}`}>
                     <metric.icon className="h-5 w-5" />
                  </div>
                </div>
                <p className="text-4xl font-black text-slate-900 tracking-tight mt-2">{metric.value}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Inspection Metrics */}
      <div className="grid gap-4 sm:p-6 md:grid-cols-3 shrink-0">
        {inspectionMetrics.map((metric, i) => (
          <motion.div key={i} variants={itemVariants} whileHover={{ scale: 1.02 }}>
            <Card onClick={() => handleNavigate(metric.route)} className={`shadow-sm border-l-4 ${metric.border} cursor-pointer hover:bg-slate-50 transition-colors`}>
              <CardContent className={`${paddingClass} flex items-center justify-between`}>
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-500 mb-1">{metric.title}</p>
                  <p className="text-3xl font-black text-slate-950">{metric.value}</p>
                </div>
                <div className={`w-12 h-12 rounded-full flex items-center justify-center bg-slate-100 ${metric.color}`}>
                   <metric.icon className="h-6 w-6" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Secondary Metrics */}
      <div className="grid gap-4 sm:p-6 md:grid-cols-2 lg:grid-cols-4 shrink-0">
        {secondaryMetrics.map((metric, i) => (
          <motion.div key={i} variants={itemVariants}>
            <Card className="shadow-sm border-slate-200">
              <CardContent className={`${paddingClass} flex items-center gap-4`}>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${metric.bg} ${metric.color}`}>
                   <metric.icon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-500 mb-0.5">{metric.title}</p>
                  <p className="text-2xl font-black text-slate-950">{metric.value}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <motion.div variants={itemVariants} className="grid gap-4 sm:p-6 md:grid-cols-2 lg:grid-cols-7 flex-1 min-h-0">
        <Card className="col-span-1 lg:col-span-4 shadow-sm border-slate-200 flex flex-col">
          <CardHeader className={`${headerPaddingClass} flex justify-between items-center -mb-2`}>
            <CardTitle>Defect Volume Trend</CardTitle>
          </CardHeader>
          <CardContent className="flex-1">
            <div className="h-[280px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={defectTrendData} margin={{ top: 10, right: 20, bottom: 5, left: 0 }}>
                  <defs>
                    <linearGradient id="colorDefects" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 10, fontWeight: 'bold'}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 10, fontWeight: 'bold'}} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', backgroundColor: '#ffffff', color: '#0f172a', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    itemStyle={{ color: '#0f172a', fontWeight: 'bold' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="defects" 
                    stroke="#2563eb" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorDefects)" 
                    activeDot={{ r: 6, fill: "#2563eb", stroke: "#ffffff", strokeWidth: 2 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1 lg:col-span-3 shadow-sm border-slate-200 flex flex-col">
          <CardHeader className={`${headerPaddingClass} -mb-2`}>
            <CardTitle>Overall RFT Rate Status</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center flex-col items-center flex-1 relative">
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none mt-2">
               <div className="text-center">
                 <p className="text-3xl font-black text-slate-900">{qualityPassRate.toFixed(1)}%</p>
                 <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">Average RFT</p>
               </div>
            </div>
            <div className="h-[250px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={rftRateData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                    cornerRadius={4}
                  >
                    {rftRateData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', backgroundColor: '#ffffff', color: '#0f172a', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                     itemStyle={{ color: '#0f172a', fontWeight: 'bold' }}
                     formatter={(value: any) => `${Number(value).toFixed(1)}%`}
                  />
                  <Legend verticalAlign="bottom" height={36} formatter={(value) => <span style={{ color: '#64748b', fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase' }}>{value}</span>} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1 lg:col-span-4 shadow-sm border-slate-200 flex flex-col">
          <CardHeader className={`${headerPaddingClass} -mb-2`}>
            <CardTitle>Production Volume vs RFT Rate</CardTitle>
          </CardHeader>
          <CardContent className="flex-1">
            <div className="h-[300px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={prodTrendData} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 10, fontWeight: 'bold'}} dy={10} />
                  <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 10, fontWeight: 'bold'}} />
                  <YAxis yAxisId="right" orientation="right" domain={[0, 100]} axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 10, fontWeight: 'bold'}} tickFormatter={(val) => `${val}%`} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', backgroundColor: '#ffffff', color: '#0f172a', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    itemStyle={{ color: '#0f172a', fontWeight: 'bold' }}
                  />
                  <Legend verticalAlign="bottom" height={36} formatter={(value) => <span style={{ color: '#64748b', fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase' }}>{value}</span>} />
                  <Bar yAxisId="left" dataKey="inspected" name="Inspected" fill="#e2e8f0" radius={[4, 4, 0, 0]} maxBarSize={40} />
                  <Bar yAxisId="left" dataKey="passed" name="Passed" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={40} />
                  <Line yAxisId="right" type="monotone" name="RFT Rate (%)" dataKey="rftRate" stroke="#6366f1" strokeWidth={3} dot={{r: 4, strokeWidth: 0, fill: '#6366f1'}} activeDot={{ r: 6 }} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1 lg:col-span-3 shadow-sm border-slate-200 flex flex-col">
          <CardHeader className={`${headerPaddingClass} -mb-2`}>
            <CardTitle>Quality Categories Scan</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center flex-col items-center flex-1">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="65%" data={radarData}>
                  <PolarGrid stroke="#e2e8f0" />
                  <PolarAngleAxis dataKey="subject" tick={{fill: '#475569', fontSize: 10, fontWeight: 'bold'}} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{fontSize: 10, fill: '#94a3b8'}} />
                  <Radar name="Pass Score" dataKey="score" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.4} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', backgroundColor: '#ffffff', color: '#0f172a', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    itemStyle={{ color: '#0f172a', fontWeight: 'bold' }} 
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1 lg:col-span-7 shadow-sm border-slate-200 flex flex-col">
          <CardHeader className={`${headerPaddingClass} -mb-2`}>
            <CardTitle>Defect Distribution by Type</CardTitle>
          </CardHeader>
          <CardContent className="flex-1">
            <div className="h-[250px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={defectTypesData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e2e8f0" />
                  <XAxis type="number" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 10, fontWeight: 'bold'}} />
                  <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#475569', fontSize: 10, fontWeight: 'bold'}} width={120} />
                  <Tooltip cursor={{fill: '#f1f5f9'}} contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', backgroundColor: '#ffffff', color: '#0f172a', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} itemStyle={{ color: '#0f172a', fontWeight: 'bold' }} />
                  <Bar dataKey="count" fill="#ec4899" radius={[0, 4, 4, 0]} barSize={24} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
