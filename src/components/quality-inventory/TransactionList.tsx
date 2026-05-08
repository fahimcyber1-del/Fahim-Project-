import React, { useState } from 'react';
import { InventoryTransaction } from './types';
import { Search, ArrowDownLeft, ArrowUpRight, ArrowLeftRight } from 'lucide-react';

export function TransactionList({ transactions }: { transactions: InventoryTransaction[] }) {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = transactions.filter(t => 
    t.itemNameSnapshot.toLowerCase().includes(searchTerm.toLowerCase()) || 
    t.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col h-full overflow-hidden">
      <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
           <div className="w-10 h-10 bg-indigo-50 border border-indigo-100 rounded-lg flex items-center justify-center text-indigo-600">
             <ArrowLeftRight className="w-5 h-5" />
           </div>
           <div>
              <h2 className="text-lg font-bold text-slate-800">Transaction History</h2>
              <p className="text-sm text-slate-500">View recent entries and issues</p>
           </div>
        </div>
      </div>

      <div className="p-4 bg-slate-50/50 border-b border-slate-100">
         <div className="relative max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by item, reference, or TXN Ref..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            />
         </div>
      </div>

      <div className="flex-1 overflow-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 font-bold sticky top-0 z-10">
              <th className="p-4">Transaction</th>
              <th className="p-4">Item details</th>
              <th className="p-4">Reference</th>
              <th className="p-4">Notes</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.length > 0 ? (
              filtered.map((txn) => (
                <tr key={txn.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${txn.type === 'Entry' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                        {txn.type === 'Entry' ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                      </div>
                      <div>
                        <div className={`text-sm font-bold ${txn.type === 'Entry' ? 'text-emerald-700' : 'text-rose-700'}`}>
                           {txn.type === 'Entry' ? '+' : '-'}{txn.quantity}
                        </div>
                        <div className="text-xs text-slate-500">{txn.date}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="font-bold text-slate-800 text-sm">{txn.itemNameSnapshot}</div>
                    <div className="text-xs text-slate-500 font-mono mt-0.5">{txn.id}</div>
                  </td>
                  <td className="p-4">
                    <div className="text-sm font-medium text-slate-700">{txn.reference}</div>
                  </td>
                  <td className="p-4">
                    <div className="text-sm text-slate-600 truncate max-w-xs" title={txn.notes}>{txn.notes || '-'}</div>
                  </td>
                </tr>
              ))
            ) : (
                <tr>
                   <td colSpan={4} className="p-4 sm:p-6 lg:p-8 text-center text-slate-500">
                      No transactions found matching your search.
                   </td>
                </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
