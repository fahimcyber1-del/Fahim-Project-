import React, { useState } from 'react';
import { ViewState, TestRequest } from './types';
import { INITIAL_TESTS } from './mockData';
import { TestingDashboard } from './TestingDashboard';
import { TestList } from './TestList';
import { TestForm } from './TestForm';
import { TestDetail } from './TestDetail';
import { LayoutDashboard, List, FileText } from 'lucide-react';

export function TestingModule() {
  const [viewState, setViewState] = useState<ViewState>({ type: 'dashboard' });
  const [records, setRecords] = useState<TestRequest[]>(INITIAL_TESTS);

  const handleCreate = (test: Partial<TestRequest>) => {
    const newTest: TestRequest = {
      ...test,
      id: `#TR-${Math.floor(80000 + Math.random() * 10000)}`,
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      status: 'PENDING',
      technician: '-- Unassigned',
      technicianInitials: '--',
      buyer: test.supplierReference || 'Unknown',
      testCategory: test.selectedTests?.[0] || 'Quality Test',
      turnaroundTime: '-',
      complianceScore: '-',
      parameters: [],
      specimenImages: { preTest: '', postTest: '' },
      approval: { leadTechnician: '', leadTechnicianId: '', leadTechnicianDate: '', labManager: '', labManagerId: '', labManagerDate: '' },
      inspectorRemarks: '',
      overallResult: 'PENDING'
    } as TestRequest;
    setRecords((prev) => [newTest, ...prev]);
    setViewState({ type: 'list' });
  };

  const handleUpdate = (id: string, updates: Partial<TestRequest>) => {
    setRecords((prev) => prev.map((r) => (r.id === id ? { ...r, ...updates } : r)));
    setViewState({ type: 'list' });
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
        onClick={() => setViewState({ type: 'list' })}
        className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-md transition-all ${(viewState.type === 'list' || viewState.type === 'detail' || (viewState.type === 'form' && viewState.recordId)) ? 'bg-slate-100 text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'}`}
      >
        <List className="w-4 h-4" /> Test Requests
      </button>
      <button
        onClick={() => setViewState({ type: 'form' })}
        className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-md transition-all ${viewState.type === 'form' && !viewState.recordId ? 'bg-slate-100 text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'}`}
      >
        <FileText className="w-4 h-4" /> New Test
      </button>
    </div>
  );

  return (
    <div className="w-full h-full flex flex-col">
      {renderNav()}

      <div className="flex-1 overflow-y-auto w-full">
        {viewState.type === 'dashboard' && (
          <TestingDashboard 
            records={records}
            onViewList={() => setViewState({ type: 'list' })}
          />
        )}
        
        {viewState.type === 'list' && (
          <TestList 
            records={records}
            onCreate={() => setViewState({ type: 'form' })}
            onView={(id) => setViewState({ type: 'detail', recordId: id })}
          />
        )}

        {viewState.type === 'form' && (
          <TestForm 
            initialData={viewState.recordId ? records.find(r => r.id === viewState.recordId) : undefined}
            onSave={(data) => {
              if (viewState.recordId) {
                handleUpdate(viewState.recordId, data);
              } else {
                handleCreate(data);
              }
            }}
            onCancel={() => setViewState({ type: 'list' })}
          />
        )}

        {viewState.type === 'detail' && viewState.recordId && (
          <TestDetail 
            record={records.find(r => r.id === viewState.recordId)!}
            onBack={() => setViewState({ type: 'list' })}
            onEdit={() => setViewState({ type: 'form', recordId: viewState.recordId })}
          />
        )}
      </div>
    </div>
  );
}
