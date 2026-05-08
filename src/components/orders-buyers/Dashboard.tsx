import React from 'react';
import { Buyer, Order } from './types';
import { ShoppingCart, Users, DollarSign, Activity } from 'lucide-react';

interface DashboardProps {
  buyers: Buyer[];
  orders: Order[];
}

export function Dashboard({ buyers, orders }: DashboardProps) {
  const totalOrders = orders.length;
  const activeBuyers = buyers.filter(b => b.status === 'Active').length;
  const totalVolume = orders.reduce((sum, order) => sum + order.quantity, 0);
  const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);

  const pendingOrders = orders.filter(o => o.status === 'Pending').length;
  const inProductionOrders = orders.filter(o => o.status === 'In Production').length;
  const shippedOrders = orders.filter(o => o.status === 'Shipped').length;
  const completedOrders = orders.filter(o => o.status === 'Completed').length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:p-6">
        <div className="shadow-sm border border-slate-200 bg-white rounded-lg p-5">
            <div className="flex justify-between items-center pb-2">
              <p className="text-[10px] uppercase font-bold text-slate-500">Total Orders</p>
              <ShoppingCart className="h-4 w-4 text-blue-600" />
            </div>
            <p className="text-2xl font-black text-slate-900">{totalOrders.toLocaleString()}</p>
            <p className="mt-1 text-xs text-slate-500 font-medium">All time</p>
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
            <p className="mt-1 text-xs text-emerald-600 font-medium">Total quantity</p>
        </div>
        <div className="shadow-sm border border-slate-200 bg-white rounded-lg p-5">
            <div className="flex justify-between items-center pb-2">
              <p className="text-[10px] uppercase font-bold text-slate-500">Total Value</p>
              <DollarSign className="h-4 w-4 text-amber-600" />
            </div>
            <p className="text-2xl font-black text-slate-900">${totalRevenue.toLocaleString()}</p>
            <p className="mt-1 text-xs text-amber-600 font-medium">Estimated revenue</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:p-6">
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
               <div className="bg-slate-400 h-2 rounded-full" style={{ width: `${(pendingOrders/totalOrders)*100}%` }}></div>
             </div>

             <div className="flex justify-between items-center text-sm font-medium">
               <span className="text-slate-600">In Production</span>
               <span className="text-blue-900 bg-blue-100 px-2 py-0.5 rounded">{inProductionOrders}</span>
             </div>
             <div className="w-full bg-slate-100 rounded-full h-2">
               <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${(inProductionOrders/totalOrders)*100}%` }}></div>
             </div>

             <div className="flex justify-between items-center text-sm font-medium">
               <span className="text-slate-600">Completed</span>
               <span className="text-emerald-900 bg-emerald-100 px-2 py-0.5 rounded">{completedOrders}</span>
             </div>
             <div className="w-full bg-slate-100 rounded-full h-2">
               <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${(completedOrders/totalOrders)*100}%` }}></div>
             </div>

             <div className="flex justify-between items-center text-sm font-medium">
               <span className="text-slate-600">Shipped</span>
               <span className="text-indigo-900 bg-indigo-100 px-2 py-0.5 rounded">{shippedOrders}</span>
             </div>
             <div className="w-full bg-slate-100 rounded-full h-2">
               <div className="bg-indigo-500 h-2 rounded-full" style={{ width: `${(shippedOrders/totalOrders)*100}%` }}></div>
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
              const buyerOrders = orders.filter(o => o.buyerId === buyer.id);
              const buyerVolume = buyerOrders.reduce((sum, o) => sum + o.quantity, 0);
              const volumePercentage = totalVolume > 0 ? ((buyerVolume / totalVolume) * 100).toFixed(1) : '0.0';

              return (
              <div key={buyer.id} className="flex justify-between items-center p-3 border border-slate-100 rounded-lg hover:bg-slate-50 transition-colors">
                 <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">
                     {buyer.name.substring(0,2).toUpperCase()}
                   </div>
                   <div>
                     <p className="text-sm font-bold text-slate-900">{buyer.name}</p>
                     <p className="text-[10px] text-slate-500">{buyer.country}</p>
                   </div>
                 </div>
                 <div className="text-right">
                    <p className="text-xs font-bold text-slate-700">{buyerVolume.toLocaleString()} Pcs ({volumePercentage}%)</p>
                    <span className={`inline-flex px-2 py-0.5 mt-1 rounded text-[10px] font-bold ${
                      buyer.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {buyer.status}
                    </span>
                 </div>
              </div>
            )})}
          </div>
        </div>
      </div>
    </div>
  );
}
