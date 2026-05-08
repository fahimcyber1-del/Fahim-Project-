import React, { useState } from 'react';
import { ViewState, SubSupplierRecord } from './types';
import { useSubSuppliersState } from '../../store';
import { SubSuppliersDashboard } from './SubSuppliersDashboard';
import { SubSuppliersList } from './SubSuppliersList';
import { SubSupplierForm } from './SubSupplierForm';
import { SubSupplierDetail } from './SubSupplierDetail';
import { LayoutDashboard, Truck, PlusCircle } from 'lucide-react';

export function SubSuppliersModule() {
  const [viewState, setViewState] = useState<ViewState>({ type: 'dashboard' });
  const { suppliers: records, setSuppliers: setRecords } = useSubSuppliersState();

  const handleSave = (data: SubSupplierRecord) => {
    if (viewState.type === 'form' && viewState.recordId) {
      setRecords(records.map(r => r.id === data.id ? data : r));
    } else {
      setRecords([data, ...records]);
    }
    setViewState({ type: 'list' });
  };

  const handleDelete = (ids: string[]) => {
    setRecords(records.filter(r => !ids.includes(r.id)));
    if (viewState.type === 'detail' && ids.includes(viewState.recordId)) {
      setViewState({ type: 'list' });
    }
  };

  const currentRecord = viewState.type === 'detail' || (viewState.type === 'form' && viewState.recordId)
    ? records.find(r => r.id === viewState.recordId)
    : undefined;

  const renderNav = () => (
    <div className="flex bg-white rounded-lg p-1 border border-slate-200 mb-6 shrink-0 w-fit">
      <button
        onClick={() => setViewState({ type: 'dashboard' })}
        className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-md transition-all ${viewState.type === 'dashboard' ? 'bg-slate-100 text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'}`}
      >
        <LayoutDashboard className="w-4 h-4" /> Dashboard
      </button>
      <button
        onClick={() => setViewState({ type: 'list' })}
        className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-md transition-all ${viewState.type === 'list' || viewState.type === 'detail' ? 'bg-slate-100 text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'}`}
      >
        <Truck className="w-4 h-4" /> All Suppliers
      </button>
      <button
        onClick={() => setViewState({ type: 'form' })}
        className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-md transition-all ${viewState.type === 'form' && !viewState.recordId ? 'bg-slate-100 text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'}`}
      >
        <PlusCircle className="w-4 h-4" /> New Supplier
      </button>
    </div>
  );

  return (
    <div className="flex flex-col h-full w-full overflow-hidden">
      {renderNav()}

      <div className="flex-1 overflow-y-auto min-h-0 w-full">
        {viewState.type === 'dashboard' && <SubSuppliersDashboard records={records} />}
        {viewState.type === 'list' && (
          <SubSuppliersList 
            records={records}
            onView={(id) => setViewState({ type: 'detail', recordId: id })}
            onEdit={(id) => setViewState({ type: 'form', recordId: id })}
            onDelete={handleDelete}
            onNew={() => setViewState({ type: 'form' })}
          />
        )}
        {viewState.type === 'form' && (
          <div className="h-full">
            <SubSupplierForm 
              initialData={currentRecord}
              onSave={handleSave}
              onCancel={() => setViewState({ type: 'list' })}
            />
          </div>
        )}
        {viewState.type === 'detail' && currentRecord && (
          <div className="h-full">
            <SubSupplierDetail 
              record={currentRecord}
              onBack={() => setViewState({ type: 'list' })}
              onEdit={() => setViewState({ type: 'form', recordId: currentRecord.id })}
            />
          </div>
        )}
      </div>
    </div>
  );
}
