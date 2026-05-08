import React, { useState } from 'react';
import { TraceabilityRecord, TraceabilityStage } from './types';
import { ArrowLeft, CheckCircle, XCircle, Clock, MapPin, Search, FileText, ArrowDown, Plus } from 'lucide-react';

interface TraceabilityDetailProps {
  record: TraceabilityRecord;
  onBack: () => void;
  onUpdate?: (record: TraceabilityRecord) => void;
}

export function TraceabilityDetail({ record, onBack, onUpdate }: TraceabilityDetailProps) {
  const [showStageModal, setShowStageModal] = useState(false);
  const [newStage, setNewStage] = useState<Partial<TraceabilityStage>>({
    stageName: '',
    facility: '',
    dateCompleted: new Date().toISOString().split('T')[0],
    inputBatchNo: '',
    outputBatchNo: '',
    verified: false
  });

  const handleStageChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const checked = (e.target as HTMLInputElement).checked;
    setNewStage(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const handleSaveStage = () => {
    if (!newStage.stageName || !newStage.facility || !newStage.dateCompleted) return;

    const StageToAdd: TraceabilityStage = {
      id: `STG-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      stageName: newStage.stageName || '',
      facility: newStage.facility || '',
      dateCompleted: newStage.dateCompleted || '',
      inputBatchNo: newStage.inputBatchNo,
      outputBatchNo: newStage.outputBatchNo,
      verified: newStage.verified || false,
    };

    if (onUpdate) {
      onUpdate({
        ...record,
        stages: [...(record.stages || []), StageToAdd]
      });
    }

    setShowStageModal(false);
    setNewStage({
      stageName: '',
      facility: '',
      dateCompleted: new Date().toISOString().split('T')[0],
      inputBatchNo: '',
      outputBatchNo: '',
      verified: false
    });
  };

  return (
    <div className="max-w-5xl mx-auto w-full pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 bg-slate-100 text-slate-500 hover:bg-slate-200 rounded-full">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-black text-slate-900">{record.productBatchNo}</h1>
            <p className="text-sm font-medium text-slate-500">Traceability Record: {record.id}</p>
          </div>
        </div>
        <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border ${
          record.status === 'VERIFIED' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 
          record.status === 'FAILED' ? 'bg-rose-50 text-rose-700 border-rose-200' :
          'bg-blue-50 text-blue-700 border-blue-200'
        }`}>
          {record.status === 'VERIFIED' ? <CheckCircle className="w-4 h-4 mr-1.5" /> : 
           record.status === 'FAILED' ? <XCircle className="w-4 h-4 mr-1.5" /> : 
           <Clock className="w-4 h-4 mr-1.5" />}
          {record.status.replace('_', ' ')}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:p-6">
        
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4 sm:p-6">
            <h3 className="text-sm font-bold text-slate-800 mb-4 uppercase tracking-wider">Record Details</h3>
            <div className="space-y-4">
              <div>
                <p className="text-[10px] font-bold text-slate-500 uppercase">Product Type</p>
                <p className="text-sm font-bold text-slate-800">{record.type}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-500 uppercase">Supplier / Producer</p>
                <p className="text-sm font-bold text-slate-800">{record.supplierName || 'N/A'}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-500 uppercase">Origin Country</p>
                <p className="text-sm font-bold text-slate-800">{record.originCountry || 'N/A'}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-500 uppercase">Initiation Date</p>
                <p className="text-sm font-bold text-slate-800">{record.date}</p>
              </div>
              {record.certifications && record.certifications.length > 0 && (
                <div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Certifications</p>
                  <div className="flex flex-wrap gap-1">
                    {record.certifications.map(cert => (
                      <span key={cert} className="text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                        {cert}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {record.notes && (
                 <div className="pt-4 border-t border-slate-100">
                   <p className="text-[10px] font-bold text-slate-500 uppercase">Notes</p>
                   <p className="text-sm text-slate-700 mt-1">{record.notes}</p>
                 </div>
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4 sm:p-6">
            <div className="flex justify-between items-center mb-6">
               <h3 className="text-lg font-bold text-slate-800">Supply Chain Genealogy</h3>
               <button onClick={() => setShowStageModal(true)} className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-blue-600 text-xs font-bold rounded transition-colors">
                  <Plus className="w-3.5 h-3.5" /> Add Stage
               </button>
            </div>
            
            <div className="relative">
              {(!record.stages || record.stages.length === 0) ? (
                 <p className="text-sm text-slate-500 text-center py-8">No supply chain stages recorded yet.</p>
              ) : (
                <div className="space-y-0">
                  {record.stages.map((stage, index) => (
                    <div key={stage.id} className="relative flex items-start gap-4 pb-8 group">
                      {index < record.stages.length - 1 && (
                         <div className="absolute top-4 sm:p-6 lg:p-8 left-3.5 w-0.5 h-full bg-slate-200 group-last:hidden"></div>
                      )}
                      
                      <div className={`relative z-10 w-7 h-7 rounded-full flex items-center justify-center shrink-0 border-2 ${
                        stage.verified ? 'bg-emerald-50 border-emerald-500 text-emerald-600' : 'bg-slate-50 border-slate-300 text-slate-400'
                      }`}>
                         {stage.verified ? <CheckCircle className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                      </div>

                      <div className="flex-1 bg-slate-50 border border-slate-200 rounded-lg p-4 shadow-sm group-hover:shadow-md transition-shadow">
                         <div className="flex justify-between items-start mb-2">
                            <div>
                               <h4 className="text-md font-bold text-slate-800">{stage.stageName}</h4>
                               <p className="text-xs font-medium text-slate-500 flex items-center gap-1 mt-0.5">
                                 <MapPin className="w-3 h-3" /> {stage.facility}
                               </p>
                            </div>
                            <span className="text-xs font-bold text-slate-400">{stage.dateCompleted}</span>
                         </div>
                         <div className="mt-3 pt-3 border-t border-slate-200 flex flex-wrap gap-4 text-xs">
                            {stage.inputBatchNo && (
                               <div>
                                  <span className="text-slate-500 block text-[10px] uppercase font-bold">Input Batch</span>
                                  <span className="font-mono font-medium text-slate-700">{stage.inputBatchNo}</span>
                               </div>
                            )}
                            {stage.outputBatchNo && (
                               <div>
                                  <span className="text-slate-500 block text-[10px] uppercase font-bold">Output Batch</span>
                                  <span className="font-mono font-medium text-slate-700">{stage.outputBatchNo}</span>
                               </div>
                            )}
                            <div className="ml-auto text-right text-slate-400">
                               {stage.verified ? (
                                  <span className="flex items-center gap-1 text-emerald-600 font-bold"><CheckCircle className="w-3 h-3"/> Documents Verified</span>
                               ) : (
                                  <span className="flex items-center gap-1"><Clock className="w-3 h-3"/> Pending Verification</span>
                               )}
                            </div>
                         </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {showStageModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="text-lg font-bold text-slate-800">Add Genealogy Stage</h3>
              <button 
                onClick={() => setShowStageModal(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
                title="Close"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 sm:p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-2">Stage Name</label>
                <input type="text" name="stageName" value={newStage.stageName || ''} onChange={handleStageChange} placeholder="e.g. Spinning, Dyeing" className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm outline-none focus:border-blue-500"/>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-2">Facility / Factory</label>
                <input type="text" name="facility" value={newStage.facility || ''} onChange={handleStageChange} className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm outline-none focus:border-blue-500"/>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-2">Date Completed</label>
                <input type="date" name="dateCompleted" value={newStage.dateCompleted || ''} onChange={handleStageChange} className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm outline-none focus:border-blue-500"/>
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <div>
                   <label className="block text-xs font-bold text-slate-600 uppercase mb-2">Input Batch No.</label>
                   <input type="text" name="inputBatchNo" value={newStage.inputBatchNo || ''} onChange={handleStageChange} className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm outline-none focus:border-blue-500"/>
                 </div>
                 <div>
                   <label className="block text-xs font-bold text-slate-600 uppercase mb-2">Output Batch No.</label>
                   <input type="text" name="outputBatchNo" value={newStage.outputBatchNo || ''} onChange={handleStageChange} className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm outline-none focus:border-blue-500"/>
                 </div>
              </div>
              <div className="flex items-center gap-2 mt-4">
                 <input type="checkbox" id="verified" name="verified" checked={newStage.verified || false} onChange={handleStageChange} className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                 <label htmlFor="verified" className="text-sm font-bold text-slate-700">Documents Verified</label>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
              <button 
                onClick={() => setShowStageModal(false)}
                className="px-4 py-2 border border-slate-300 rounded-md text-slate-700 text-sm font-bold hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleSaveStage}
                disabled={!newStage.stageName || !newStage.facility || !newStage.dateCompleted}
                className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-bold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add Stage
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
