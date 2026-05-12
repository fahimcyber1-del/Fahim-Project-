import React, { useState, useMemo } from 'react';
import { Buyer, Order } from './types';
import { ShoppingCart, Users, DollarSign, Activity, Calendar, Filter } from 'lucide-react';

interface DashboardProps {
  buyers: Buyer[];
  orders: Order[];
}

export function Dashboard({ buyers, orders }: DashboardProps) {
  const [dateFilter, setDateFilter] = useState<string>('all');
  const [customRange, setCustomRange] = useState({ start: '', end: '' });

  const filteredOrders = useMemo(() => {
    if (dateFilter === 'all') return orders;

    const today = new Date();
    const pastDate = new Date();
    
    if (dateFilter === 'last30days') pastDate.setDate(today.getDate() - 30);
    if (dateFilter === 'last3months') pastDate.setMonth(today.getMonth() - 3);
    if (dateFilter === 'last6months') pastDate.setMonth(today.getMonth() - 6);
    if (dateFilter === 'lastyear') pastDate.setFullYear(today.getFullYear() - 1);

    return orders.filter(order => {
      const orderDate = new Date(order.orderDate);
      
      if (dateFilter === 'custom') {
        const start = customRange.start ? new Date(customRange.start) : new Date(0);
        const end = customRange.end ? new Date(customRange.end) : new Date(8640000000000000); // Max date
        // include end date
        end.setHours(23, 59, 59, 999);
        return orderDate >= start && orderDate <= end;
      }

      return orderDate >= pastDate;
    });
  }, [orders, dateFilter, customRange]);

  const totalOrders = filteredOrders.length;
  // Note: Only considering orders within date range, but active buyers computation might still reflect total if we only filter orders.
  // We'll keep activebuyers as global since buyers don't have a date filter right now. Or we can show buyers that have orders in this range.
  // I will just use the global buyers for activeBuyers, but for Top Buyers I will use filteredOrders.
  const parseNumber = (val: any) => {
    if (typeof val === 'number') return val;
    if (typeof val === 'string') return Number(val.replace(/,/g, '')) || 0;
    return 0;
  };

  const activeBuyers = buyers.filter(b => b.status === 'Active').length;
  const totalVolume = filteredOrders.reduce((sum, order) => sum + parseNumber(order.quantity), 0);
  const totalRevenue = filteredOrders.reduce((sum, order) => sum + parseNumber(order.totalAmount), 0);

  const pendingOrders = filteredOrders.filter(o => o.status === 'Pending').length;
  const inProductionOrders = filteredOrders.filter(o => o.status === 'In Production').length;
  const shippedOrders = filteredOrders.filter(o => o.status === 'Shipped').length;
  const completedOrders = filteredOrders.filter(o => o.status === 'Completed').length;

  return (
    <div className="space-y-6">
      {/* Filter Toolbar */}
      <div className="bg-white p-4 mx-4 sm:mx-6 sm:mt-6 rounded-lg border border-slate-200 shadow-sm flex flex-col sm:flex-row flex-wrap items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
           <Filter className="w-5 h-5 text-indigo-600" />
           <span className="text-sm font-bold text-slate-800">Date Range Filter</span>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <select 
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="border-slate-200 rounded-lg text-sm focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="all">All Time</option>
            <option value="last30days">Last 30 Days</option>
            <option value="last3months">Last 3 Months</option>
            <option value="last6months">Last 6 Months</option>
            <option value="lastyear">Last 1 Year</option>
            <option value="custom">Custom Range</option>
          </select>
          
          {dateFilter === 'custom' && (
            <div className="flex items-center gap-2">
              <input 
                type="date" 
                value={customRange.start}
                onChange={(e) => setCustomRange(prev => ({ ...prev, start: e.target.value }))}
                className="border-slate-200 rounded-lg text-sm focus:ring-indigo-500 focus:border-indigo-500 w-32 sm:w-auto"
              />
              <span className="text-slate-400 text-sm">to</span>
              <input 
                type="date" 
                value={customRange.end}
                onChange={(e) => setCustomRange(prev => ({ ...prev, end: e.target.value }))}
                className="border-slate-200 rounded-lg text-sm focus:ring-indigo-500 focus:border-indigo-500 w-32 sm:w-auto"
              />
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 px-4 sm:px-6">
        <div className="shadow-sm border border-slate-200 bg-white rounded-lg p-5">
            <div className="flex justify-between items-center pb-2">
              <p className="text-[10px] uppercase font-bold text-slate-500">Total Orders</p>
              <ShoppingCart className="h-4 w-4 text-blue-600" />
            </div>
            <p className="text-2xl font-black text-slate-900">{totalOrders.toLocaleString()}</p>
            <p className="mt-1 text-xs text-slate-500 font-medium">Filtered</p>
        </div>
        <div className="shadow-sm border border-slate-200 bg-white rounded-lg p-5">
            <div className="flex justify-between items-center pb-2">
              <p className="text-[10px] uppercase font-bold text-slate-500">Active Buyers</p>
              <Users className="h-4 w-4 text-indigo-600" />
            </div>
            <p className="text-2xl font-black text-slate-900">{activeBuyers}</p>
            <p className="mt-1 text-xs text-indigo-600 font-medium">Out of {buyers.length} total</p>
        </div>
        <div className="shadow-sm border border-slate-200 bg-white rounded-lg p-5">
            <div className="flex justify-between items-center pb-2">
              <p className="text-[10px] uppercase font-bold text-slate-500">Volume (Pcs)</p>
              <Activity className="h-4 w-4 text-emerald-600" />
            </div>
            <p className="text-2xl font-black text-slate-900">{totalVolume.toLocaleString()}</p>
            <p className="mt-1 text-xs text-emerald-600 font-medium">Filtered quantity</p>
        </div>
        <div className="shadow-sm border border-slate-200 bg-white rounded-lg p-5">
            <div className="flex justify-between items-center pb-2">
              <p className="text-[10px] uppercase font-bold text-slate-500">Total Value</p>
              <DollarSign className="h-4 w-4 text-amber-600" />
            </div>
            <p className="text-2xl font-black text-slate-900">${totalRevenue.toLocaleString()}</p>
            <p className="mt-1 text-xs text-amber-600 font-medium">Filtered revenue</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 px-4 sm:px-6">
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-4 sm:p-6 flex flex-col h-full">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 mb-6 flex items-center gap-2">
            <Activity className="w-4 h-4 text-blue-500" />
            Order Status Breakdown
          </h3>
          <div className="flex-1 space-y-4">
             <div className="flex justify-between items-center text-sm font-medium">
               <span className="text-slate-600">Pending</span>
               <span className="text-slate-900 bg-slate-100 px-2 py-0.5 rounded">{pendingOrders}</span>
             </div>
             <div className="w-full bg-slate-100 rounded-full h-2">
               <div className="bg-slate-400 h-2 rounded-full" style={{ width: `${totalOrders > 0 ? (pendingOrders/totalOrders)*100 : 0}%` }}></div>
             </div>

             <div className="flex justify-between items-center text-sm font-medium">
               <span className="text-slate-600">In Production</span>
               <span className="text-blue-900 bg-blue-100 px-2 py-0.5 rounded">{inProductionOrders}</span>
             </div>
             <div className="w-full bg-slate-100 rounded-full h-2">
               <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${totalOrders > 0 ? (inProductionOrders/totalOrders)*100 : 0}%` }}></div>
             </div>

             <div className="flex justify-between items-center text-sm font-medium">
               <span className="text-slate-600">Completed</span>
               <span className="text-emerald-900 bg-emerald-100 px-2 py-0.5 rounded">{completedOrders}</span>
             </div>
             <div className="w-full bg-slate-100 rounded-full h-2">
               <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${totalOrders > 0 ? (completedOrders/totalOrders)*100 : 0}%` }}></div>
             </div>

             <div className="flex justify-between items-center text-sm font-medium">
               <span className="text-slate-600">Shipped</span>
               <span className="text-indigo-900 bg-indigo-100 px-2 py-0.5 rounded">{shippedOrders}</span>
             </div>
             <div className="w-full bg-slate-100 rounded-full h-2">
               <div className="bg-indigo-500 h-2 rounded-full" style={{ width: `${totalOrders > 0 ? (shippedOrders/totalOrders)*100 : 0}%` }}></div>
             </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-4 sm:p-6 flex flex-col h-full">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 mb-6 flex items-center gap-2">
            <Users className="w-4 h-4 text-indigo-500" />
            Top Buyers
          </h3>
          <div className="flex-1 space-y-4">
            {buyers.slice(0, 5).map(buyer => {
              const buyerOrders = filteredOrders.filter(o => o.buyerId === buyer.id);
              const buyerVolume = buyerOrders.reduce((sum, o) => sum + parseNumber(o.quantity), 0);
              const volumePercentage = totalVolume > 0 ? ((buyerVolume / totalVolume) * 100).toFixed(1) : '0.0';

              if (buyerVolume === 0 && dateFilter !== 'all') return null; // Don't show buyers with 0 volume in the filtered range if there is a filter

              return (
              <div key={buyer.id} className="flex justify-between items-center p-3 border border-slate-100 rounded-lg hover:bg-slate-50 transition-colors">
                 <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs shrink-0">
                     {buyer.name.substring(0,2).toUpperCase()}
                   </div>
                   <div>
                     <p className="text-sm font-bold text-slate-900 line-clamp-1">{buyer.name}</p>
                     <p className="text-[10px] text-slate-500 truncate">{buyer.country}</p>
                   </div>
                 </div>
                 <div className="text-right shrink-0">
                    <p className="text-xs font-bold text-slate-700">{buyerVolume.toLocaleString()} Pcs ({volumePercentage}%)</p>
                    <span className={`inline-flex px-2 py-0.5 mt-1 rounded text-[10px] font-bold ${
                      buyer.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {buyer.status}
                    </span>
                 </div>
              </div>
            )})}
            {filteredOrders.length === 0 && <div className="text-sm text-slate-500 text-center py-4">No data available for the selected range.</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
