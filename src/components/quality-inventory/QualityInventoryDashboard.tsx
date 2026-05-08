import React, { useMemo } from 'react';
import { InventoryItem, InventoryTransaction } from './types';
import { ResponsiveContainer, PieChart, Pie, Cell, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Package, AlertTriangle, ArrowDownLeft, ArrowUpRight } from 'lucide-react';

interface Props {
  items: InventoryItem[];
  transactions: InventoryTransaction[];
}

export function QualityInventoryDashboard({ items, transactions }: Props) {
  // Stats
  const totalItems = items.length;
  const lowStockItems = items.filter(r => r.currentStock <= r.reorderLevel).length;
  
  const entriesThisMonth = transactions.filter(t => t.type === 'Entry').length;
  const issuesThisMonth = transactions.filter(t => t.type === 'Issue').length;

  // Category data
  const categoryData = useMemo(() => {
    const acc: Record<string, number> = {};
    items.forEach(r => {
      acc[r.category] = (acc[r.category] || 0) + 1;
    });
    return Object.keys(acc).map(category => ({
      category,
      count: acc[category]
    })).sort((a, b) => b.count - a.count);
  }, [items]);

  const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#64748b'];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:p-6">
         <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
           <div className="flex items-center justify-between mb-3">
             <h3 className="font-semibold text-slate-600 text-sm">Total Supply Items</h3>
             <Package className="w-5 h-5 text-indigo-500" />
           </div>
           <p className="text-3xl font-bold text-slate-800">{totalItems}</p>
         </div>

         <div className="bg-white p-5 rounded-xl border-rose-200 shadow-sm bg-rose-50/30">
           <div className="flex items-center justify-between mb-3">
             <h3 className="font-semibold text-rose-700 text-sm">Low Stock Alerts</h3>
             <AlertTriangle className="w-5 h-5 text-rose-500" />
           </div>
           <div className="flex items-end gap-2">
             <p className="text-3xl font-bold text-rose-700">{lowStockItems}</p>
           </div>
         </div>

         <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
           <div className="flex items-center justify-between mb-3">
             <h3 className="font-semibold text-slate-600 text-sm">Recent Entries</h3>
             <ArrowDownLeft className="w-5 h-5 text-emerald-500" />
           </div>
           <p className="text-3xl font-bold text-slate-800">{entriesThisMonth}</p>
         </div>

         <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
           <div className="flex items-center justify-between mb-3">
             <h3 className="font-semibold text-slate-600 text-sm">Recent Issues</h3>
             <ArrowUpRight className="w-5 h-5 text-indigo-500" />
           </div>
           <p className="text-3xl font-bold text-slate-800">{issuesThisMonth}</p>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:p-6">
         <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
           <div className="border-b border-slate-100 p-4 font-bold text-sm text-slate-800">
             Items by Category
           </div>
           <div className="p-4 h-80">
              <ResponsiveContainer width="100%" height="100%">
                 <PieChart>
                    <Pie data={categoryData} cx="50%" cy="50%" innerRadius={70} outerRadius={100} paddingAngle={2} dataKey="count" nameKey="category">
                       {categoryData.map((entry, index) => (
                         <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                       ))}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                    <Legend iconType="circle" />
                 </PieChart>
              </ResponsiveContainer>
           </div>
         </div>

         <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col">
           <div className="border-b border-slate-100 p-4 font-bold text-sm text-slate-800">
             Low Stock Items
           </div>
           <div className="p-4 flex-1 overflow-auto">
             {lowStockItems > 0 ? (
               <div className="space-y-3">
                 {items.filter(i => i.currentStock <= i.reorderLevel).map(item => (
                   <div key={item.id} className="flex items-center justify-between p-3 bg-slate-50 border border-slate-100 rounded-lg">
                     <div>
                       <p className="font-semibold text-sm text-slate-800">{item.itemName}</p>
                       <p className="text-xs text-slate-500 truncate">{item.location}</p>
                     </div>
                     <div className="text-right">
                        <p className="text-sm font-bold text-rose-600">{item.currentStock} {item.unit}</p>
                        <p className="text-xs text-slate-500">Reorder: {item.reorderLevel}</p>
                     </div>
                   </div>
                 ))}
               </div>
             ) : (
               <div className="h-full flex items-center justify-center text-slate-500 text-sm">
                 All items are sufficiently stocked.
               </div>
             )}
           </div>
         </div>
      </div>
    </div>
  );
}
