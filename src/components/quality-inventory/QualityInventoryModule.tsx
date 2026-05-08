import { useApiStorage } from '../../hooks/useApiData';
import React, { useState } from 'react';
import { ViewState, InventoryItem, InventoryTransaction } from './types';
import { INITIAL_INVENTORY, INITIAL_TRANSACTIONS } from './mockData';
import { QualityInventoryList } from './QualityInventoryList';
import { QualityInventoryForm } from './QualityInventoryForm';
import { QualityInventoryDashboard } from './QualityInventoryDashboard';
import { TransactionForm } from './TransactionForm';
import { TransactionList } from './TransactionList';
import { LayoutDashboard, List, PackageOpen, ArrowLeftRight } from 'lucide-react';

export function QualityInventoryModule() {
  const [viewState, setViewState] = useState<ViewState>({ type: 'dashboard' });
  const [items, setItems] = useApiStorage('aqm_qualityinventory_items', INITIAL_INVENTORY);
  const [transactions, setTransactions] = useState<InventoryTransaction[]>(INITIAL_TRANSACTIONS);

  const handleSaveItem = (data: InventoryItem) => {
    setItems(prev => {
      const exists = prev.find(r => r.id === data.id);
      if (exists) {
        return prev.map(r => r.id === data.id ? data : r);
      }
      return [data, ...prev];
    });
    setViewState({ type: 'list' });
  };

  const handleSaveTransaction = (data: InventoryTransaction) => {
    // 1. Add transaction
    setTransactions(prev => [data, ...prev]);
    
    // 2. Update stock count in items
    setItems(prev => prev.map(item => {
      if (item.id === data.itemId) {
        return {
          ...item,
          currentStock: data.type === 'Entry' ? item.currentStock + data.quantity : item.currentStock - data.quantity
        };
      }
      return item;
    }));
    
    setViewState({ type: 'tx_history' });
  };

  const handleDeleteItem = (id: string) => {
    setItems(prev => prev.filter(r => r.id !== id));
  };
  
  const handleInitiateTransaction = (itemId: string, txType: 'Entry' | 'Issue') => {
    setViewState({ type: 'transaction', itemId, txType });
  };

  const NavButton = ({ type, icon: Icon, label }: { type: ViewState['type'], icon: any, label: string }) => (
    <button
      onClick={() => setViewState({ type: type as any })}
      className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
        viewState.type === type
          ? 'bg-indigo-100 text-indigo-700'
          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
      }`}
    >
      <Icon className="w-4 h-4" />
      {label}
    </button>
  );

  return (
    <div className="h-full flex flex-col pt-3 sm:pt-6">
      <div className="px-4 sm:px-6 mb-6 shrink-0">
        <div className="flex items-center justify-between mb-4">
           <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                Stock & Supplies <PackageOpen className="w-6 h-6 text-indigo-500" />
              </h1>
              <p className="text-sm text-slate-500 font-medium mt-1">Manage office supplies, consumables, and stock entries/issues</p>
           </div>
        </div>

        <div className="flex bg-white rounded-lg p-1 border border-slate-200 w-fit shadow-sm overflow-x-auto">
          <NavButton type="dashboard" icon={LayoutDashboard} label="Dashboard" />
          <NavButton type="list" icon={List} label="Items Master" />
          <NavButton type="tx_history" icon={ArrowLeftRight} label="Transactions" />
        </div>
      </div>

      <div className="flex-1 overflow-auto px-4 sm:px-6 pb-6 w-full max-w-7xl mx-auto">
         {viewState.type === 'dashboard' && <QualityInventoryDashboard items={items} transactions={transactions} />}
         
         {viewState.type === 'list' && (
           <QualityInventoryList 
             items={items}
             onNew={() => setViewState({ type: 'form' })}
             onEdit={(id) => setViewState({ type: 'form', initialData: items.find(r => r.id === id) })}
             onDelete={handleDeleteItem}
             onTransaction={handleInitiateTransaction}
           />
         )}

         {viewState.type === 'form' && (
           <QualityInventoryForm 
             initialData={viewState.initialData}
             onSave={handleSaveItem}
             onCancel={() => setViewState({ type: 'list' })}
           />
         )}

         {viewState.type === 'transaction' && (
           <TransactionForm 
             item={items.find(i => i.id === viewState.itemId)!}
             txType={viewState.txType}
             onSave={handleSaveTransaction}
             onCancel={() => setViewState({ type: 'list' })}
           />
         )}
         
         {viewState.type === 'tx_history' && (
           <TransactionList transactions={transactions} />
         )}
      </div>
    </div>
  );
}
