import { useApiStorage } from '../../hooks/useApiData';
import React, { useState } from 'react';
import { ViewState, Equipment } from './types';
import { mockEquipment } from './mockData';
import { CalibrationDashboard } from './CalibrationDashboard';
import { EquipmentList } from './EquipmentList';
import { CalibrationForm } from './CalibrationForm';
import { EquipmentDetail } from './EquipmentDetail';
import { LayoutDashboard, List, PlusCircle } from 'lucide-react';

export function CalibrationModule() {
  const [viewState, setViewState] = useState<ViewState>({ type: 'dashboard' });
  const [records, setRecords] = useApiStorage<Equipment>('aqm_calibration_equipment', mockEquipment);

  const handleSave = (data: Equipment) => {
    setRecords(prev => {
      const exists = prev.findIndex(r => r.id === data.id);
      if (exists >= 0) {
        const newRecords = [...prev];
        newRecords[exists] = data;
        return newRecords;
      }
      return [data, ...prev];
    });
    setViewState({ type: 'list' });
  };

  const getRecord = (id: string) => records.find(r => r.id === id);

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
        className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-md transition-all ${(viewState.type === 'list' || viewState.type === 'detail' || (viewState.type === 'form' && viewState.recordId)) ? 'bg-slate-100 text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'}`}
      >
        <List className="w-4 h-4" /> Equipment
      </button>
      <button
        onClick={() => setViewState({ type: 'form' })}
        className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-md transition-all ${viewState.type === 'form' && !viewState.recordId ? 'bg-slate-100 text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'}`}
      >
        <PlusCircle className="w-4 h-4" /> Add Equipment
      </button>
    </div>
  );

  return (
    <div className="w-full h-full flex flex-col p-4 sm:p-6 lg:p-8">
      {renderNav()}

      <div className="flex-1 overflow-y-auto w-full">
        {viewState.type === 'dashboard' && (
          <CalibrationDashboard 
            equipmentList={records}
            onViewList={() => setViewState({ type: 'list' })}
          />
        )}
        {viewState.type === 'list' && (
           <EquipmentList 
             equipmentList={records}
             onView={(id) => setViewState({ type: 'detail', recordId: id })}
             onCreate={() => setViewState({ type: 'form' })}
             onEdit={(id) => setViewState({ type: 'form', recordId: id })}
           />
        )}
        {viewState.type === 'form' && (
          <CalibrationForm 
            initialData={viewState.recordId ? getRecord(viewState.recordId) : undefined}
            onSave={handleSave}
            onCancel={() => setViewState({ type: 'list' })}
          />
        )}
        {viewState.type === 'detail' && viewState.recordId && (
          <EquipmentDetail 
            record={getRecord(viewState.recordId)!}
            onBack={() => setViewState({ type: 'list' })}
            onEdit={(id) => setViewState({ type: 'form', recordId: id })}
            onUpdate={(updatedRecord) => {
              setRecords(prev => prev.map(r => r.id === updatedRecord.id ? updatedRecord : r));
            }}
          />
        )}
      </div>
    </div>
  );
}
