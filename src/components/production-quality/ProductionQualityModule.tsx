import React, { useState } from 'react';
import { QualityRecord, ViewState } from './types';
import { INITIAL_RECORDS } from './mockData';
import { ProductionQualityDashboard } from './ProductionQualityDashboard';
import { ProductionQualitySummary } from './ProductionQualitySummary';
import { ProductionQualityForm } from './ProductionQualityForm';
import { ProductionQualityDetail } from './ProductionQualityDetail';
import { ProductionQualityManage } from './ProductionQualityManage';
import { LayoutDashboard, List, FileText, Settings } from 'lucide-react';

export function ProductionQualityModule() {
  const [records, setRecords] = useState<QualityRecord[]>(INITIAL_RECORDS);
  const [viewState, setViewState] = useState<ViewState>({ type: 'dashboard' });

  // Config State
  const [sections, setSections] = useState(['Cutting', 'Sewing', 'Finishing', 'Packing']);
  const [units, setUnits] = useState(['A', 'B', 'C']);
  const [lines, setLines] = useState(Array.from({length: 10}, (_, i) => `Line ${String(i + 1).padStart(2, '0')}`));
  const [shifts, setShifts] = useState(['Day', 'Night']);
  const [initialLineFilter, setInitialLineFilter] = useState<string>('All');

  const handleCreate = () => {
    setViewState({ type: 'form' });
  };

  const handleEdit = (id: string) => {
    setViewState({ type: 'form', recordId: id });
  };

  const handleView = (id: string) => {
    setViewState({ type: 'detail', recordId: id });
  };

  const handleDelete = (ids: string[]) => {
    setRecords(prev => prev.filter(r => !ids.includes(r.id)));
  };

  const handleSave = (record: QualityRecord) => {
    setRecords(prev => {
      const exists = prev.find(r => r.id === record.id);
      if (exists) {
        return prev.map(r => r.id === record.id ? record : r);
      }
      return [record, ...prev];
    });
    setViewState({ type: 'summary' });
  };

  const handleLineClick = (line: string) => {
    setInitialLineFilter(line);
    setViewState({ type: 'summary' });
  };

  // Internal Navigation
  const renderNav = () => (
    <div className="flex bg-white rounded-lg p-1 border border-slate-200 mb-6 shrink-0 w-fit">
      <button
        onClick={() => setViewState({ type: 'dashboard' })}
        className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-md transition-all ${viewState.type === 'dashboard' ? 'bg-slate-100 text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'}`}
      >
        <LayoutDashboard className="w-4 h-4" /> Dashboard
      </button>
      <button
        onClick={() => setViewState({ type: 'summary' })}
        className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-md transition-all ${viewState.type === 'summary' ? 'bg-slate-100 text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'}`}
      >
        <List className="w-4 h-4" /> Summary List
      </button>
      <button
        onClick={() => setViewState({ type: 'form' })}
        className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-md transition-all ${viewState.type === 'form' && !viewState.recordId ? 'bg-slate-100 text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'}`}
      >
        <FileText className="w-4 h-4" /> New Form
      </button>
      <button
        onClick={() => setViewState({ type: 'manage' })}
        className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-md transition-all ${viewState.type === 'manage' ? 'bg-slate-100 text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'}`}
      >
        <Settings className="w-4 h-4" /> Manage
      </button>
    </div>
  );

  return (
    <div className="w-full h-full flex flex-col">
      {renderNav()}
      
      <div className="flex-1 overflow-y-auto w-full">
        {viewState.type === 'dashboard' && (
          <ProductionQualityDashboard records={records} onLineClick={handleLineClick} />
        )}
        
        {viewState.type === 'summary' && (
          <ProductionQualitySummary 
            records={records} 
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onCreate={handleCreate}
            initialLineFilter={initialLineFilter}
            onClearInitialFilter={() => setInitialLineFilter('All')}
          />
        )}
        
        {viewState.type === 'form' && (
          <ProductionQualityForm 
            initialData={viewState.recordId ? records.find(r => r.id === viewState.recordId) : undefined}
            onSave={handleSave}
            onCancel={() => setViewState({ type: 'summary' })}
            sections={sections}
            lines={lines}
            units={units}
            shifts={shifts}
          />
        )}
        
        {viewState.type === 'detail' && viewState.recordId && (
          <ProductionQualityDetail 
            record={records.find(r => r.id === viewState.recordId)!}
            onEdit={handleEdit}
            onBack={() => setViewState({ type: 'summary' })}
          />
        )}
        
        {viewState.type === 'manage' && (
          <ProductionQualityManage 
            sections={sections} setSections={setSections}
            units={units} setUnits={setUnits}
            lines={lines} setLines={setLines}
            shifts={shifts} setShifts={setShifts}
          />
        )}
      </div>
    </div>
  );
}
