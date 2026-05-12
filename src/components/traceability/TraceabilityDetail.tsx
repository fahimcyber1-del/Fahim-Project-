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
    <div className="max-w-5xl mx-auto w-full pb-12 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div className="flex items-center gap-5">
          <button 
            onClick={onBack} 
            className="p-2.5 bg-white border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-800 rounded-full shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-slate-300"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">{record.productBatchNo}</h1>
            <div className="flex items-center gap-3 mt-1.5">
              <span className="text-[11px] font-bold text-slate-500 tracking-wider uppercase">Record ID: <span className="text-slate-700">{record.id}</span></span>
              <span className="w-1 h-1 rounded-full bg-slate-300"></span>
              <span className={`inline-flex items-center text-[10px] font-bold uppercase tracking-widest ${
                record.status === 'VERIFIED' ? 'text-emerald-600' : 
                record.status === 'FAILED' ? 'text-rose-600' :
                'text-amber-600'
              }`}>
                {record.status === 'VERIFIED' ? <CheckCircle className="w-3.5 h-3.5 mr-1" /> : 
                 record.status === 'FAILED' ? <XCircle className="w-3.5 h-3.5 mr-1" /> : 
                 <Clock className="w-3.5 h-3.5 mr-1" />}
                {record.status.replace('_', ' ')}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Record details & Order Summary (Narrower) */}
        <div className="lg:col-span-4 space-y-6">
          {(record.styleNumber || record.orderQuantity || record.poNumber || record.productImage) && (
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
              {record.productImage && (
                <div className="h-56 w-full bg-slate-100 border-b border-slate-200 relative">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-10 block"></div>
                  <img src={record.productImage} alt="Product" className="w-full h-full object-cover" />
                </div>
              )}
              <div className="p-5 sm:p-6 space-y-4">
                <div className="flex items-center gap-2 mb-2">
                   <div className="w-1 h-4 bg-slate-800 rounded-full"></div>
                   <h3 className="text-xs font-bold text-slate-800 uppercase tracking-widest">Order Source</h3>
                </div>
                
                <div className="space-y-4 pt-2">
                  {record.poNumber && (
                    <div className="flex justify-between items-center pb-3 border-b border-slate-100 last:border-0 last:pb-0">
                      <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">PO / Article</p>
                      <p className="text-sm font-bold text-slate-900">{record.poNumber}</p>
                    </div>
                  )}
                  {record.styleNumber && (
                    <div className="flex justify-between items-center pb-3 border-b border-slate-100 last:border-0 last:pb-0">
                      <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Style Number</p>
                      <p className="text-sm font-bold text-slate-900">{record.styleNumber}</p>
                    </div>
                  )}
                  {record.orderQuantity ? (
                    <div className="flex justify-between items-center pb-3 border-b border-slate-100 last:border-0 last:pb-0">
                      <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Order Qty</p>
                      <p className="text-sm font-bold text-slate-900">{record.orderQuantity.toLocaleString()}</p>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          )}

          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5 sm:p-6">
            <div className="flex items-center gap-2 mb-6">
               <div className="w-1 h-4 bg-slate-400 rounded-full"></div>
               <h3 className="text-xs font-bold text-slate-800 uppercase tracking-widest">Master Data</h3>
            </div>
            
            <div className="space-y-5">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Product Type</p>
                <p className="text-sm font-bold text-slate-800 bg-slate-50 px-3 py-2 rounded-md border border-slate-100">{record.type}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Supplier / Producer</p>
                <p className="text-sm font-medium text-slate-800">{record.supplierName || 'N/A'}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Origin Country</p>
                <p className="text-sm font-medium text-slate-800">{record.originCountry || 'N/A'}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Initiation Date</p>
                <p className="text-sm font-medium text-slate-800">{record.date}</p>
              </div>
              
              {record.certifications && record.certifications.length > 0 && (
                <div className="pt-2">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Verified Certifications</p>
                  <div className="flex flex-wrap gap-2">
                    {record.certifications.map(cert => (
                      <span key={cert} className="text-[11px] font-bold px-2.5 py-1 rounded bg-slate-100 text-slate-700 border border-slate-200">
                        {cert}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {record.notes && (
                 <div className="pt-5 mt-2 border-t border-slate-100">
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Internal Notes</p>
                   <p className="text-sm text-slate-600 leading-relaxed bg-slate-50/50 p-3 rounded-lg border border-slate-100">{record.notes}</p>
                 </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Genealogy Graph (Wider) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10 pb-6 border-b border-slate-100">
               <div>
                 <h2 className="text-xl font-bold text-slate-800 tracking-tight">Supply Chain Genealogy</h2>
                 <p className="text-sm text-slate-500 mt-1">Lifecycle tracking and material transformations</p>
               </div>
               <button 
                 onClick={() => setShowStageModal(true)} 
                 className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold rounded-lg transition-colors ring-offset-2 focus:ring-2 focus:ring-slate-900"
               >
                  <Plus className="w-4 h-4" /> Add Lifecycle Stage
               </button>
            </div>
            
            <div className="relative pl-2 sm:pl-4">
              {(!record.stages || record.stages.length === 0) ? (
                 <div className="py-16 text-center bg-slate-50 rounded-xl border border-dashed border-slate-300">
                   <p className="text-slate-500 font-medium">No lifecycle stages recorded yet.</p>
                   <button onClick={() => setShowStageModal(true)} className="mt-3 text-sm text-blue-600 font-bold hover:text-blue-700">Add the first stage</button>
                 </div>
              ) : (
                <div className="space-y-0 relative">
                  {record.stages.map((stage, index) => (
                    <div key={stage.id} className="relative flex items-stretch gap-6 pb-12 group last:pb-4">
                      {/* Vertical line connecting nodes */}
                      {index < record.stages.length - 1 && (
                         <div className="absolute top-[32px] left-[15px] w-[2px] h-[calc(100%-8px)] bg-slate-200 group-hover:bg-slate-300 transition-colors"></div>
                      )}
                      
                      {/* Node Icon */}
                      <div className="pt-0.5 shrink-0 relative z-10">
                        <div className={`w-8 h-8 rounded-full border-[3px] flex items-center justify-center shrink-0 ring-4 ring-white shadow-sm transition-transform group-hover:scale-110 duration-300 ${
                          stage.verified ? 'bg-emerald-50 border-emerald-500 text-emerald-600' : 'bg-amber-50 border-amber-500 text-amber-600'
                        }`}>
                           {stage.verified ? <CheckCircle className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                        </div>
                      </div>

                      {/* Content Card */}
                      <div className="flex-1 -mt-1 group-hover:translate-x-1 transition-transform duration-300">
                        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] group-hover:shadow-[0_8px_16px_-4px_rgba(0,0,0,0.05)] transition-all group-hover:border-slate-300 relative overflow-hidden">
                           
                           {/* Status banner in background */}
                           <div className={`absolute top-0 right-0 bottom-0 w-1 ${stage.verified ? 'bg-emerald-500' : 'bg-amber-400'}`}></div>

                           <div className="flex flex-col sm:flex-row justify-between items-start gap-3 mb-4">
                              <div>
                                 <h4 className="text-lg font-bold text-slate-800 tracking-tight">{stage.stageName}</h4>
                                 <p className="text-sm font-medium text-slate-500 flex items-center gap-1.5 mt-1">
                                   <MapPin className="w-3.5 h-3.5 text-slate-400" /> {stage.facility}
                                 </p>
                              </div>
                              <span className="inline-flex items-center px-2.5 py-1 rounded bg-slate-100 text-xs font-bold text-slate-600 border border-slate-200">
                                {stage.dateCompleted}
                              </span>
                           </div>
                           
                           <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col sm:flex-row flex-wrap sm:items-center gap-4 sm:gap-6 text-sm">
                              {stage.inputBatchNo && (
                                 <div className="flex flex-col bg-slate-50 px-3 py-1.5 rounded border border-slate-100">
                                    <span className="text-slate-400 text-[10px] uppercase font-bold tracking-widest mb-0.5">Input Batch</span>
                                    <span className="font-mono font-bold text-slate-700">{stage.inputBatchNo}</span>
                                 </div>
                              )}
                              
                              {(stage.inputBatchNo && stage.outputBatchNo) && (
                                <ArrowLeft className="w-4 h-4 text-slate-300 hidden sm:block rotate-180" />
                              )}

                              {stage.outputBatchNo && (
                                 <div className="flex flex-col bg-blue-50/50 px-3 py-1.5 rounded border border-blue-100/50">
                                    <span className="text-blue-400 text-[10px] uppercase font-bold tracking-widest mb-0.5">Output Batch</span>
                                    <span className="font-mono font-bold text-blue-700">{stage.outputBatchNo}</span>
                                 </div>
                              )}
                              
                              <div className="sm:ml-auto flex items-center">
                                 {stage.verified ? (
                                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-md border border-emerald-100">
                                      <CheckCircle className="w-3.5 h-3.5"/> Verified
                                    </div>
                                 ) : (
                                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-700 text-xs font-bold rounded-md border border-amber-100">
                                      <Clock className="w-3.5 h-3.5"/> Pending Review
                                    </div>
                                 )}
                              </div>
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
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200 border border-slate-200">
            <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="text-lg font-bold text-slate-800 tracking-tight">Add Lifecycle Stage</h3>
              <button 
                onClick={() => setShowStageModal(false)}
                className="w-8 h-8 flex flex-col items-center justify-center bg-white border border-slate-200 rounded-full text-slate-400 hover:text-slate-800 hover:border-slate-300 transition-all shadow-sm"
              >
                <XCircle className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4 sm:p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-2 tracking-wider">Stage Name</label>
                <input type="text" name="stageName" value={newStage.stageName || ''} onChange={handleStageChange} placeholder="e.g. Spinning, Dyeing" className="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:border-slate-800 focus:ring-1 focus:ring-slate-800 transition-shadow"/>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-2 tracking-wider">Facility / Factory</label>
                <input type="text" name="facility" value={newStage.facility || ''} onChange={handleStageChange} className="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:border-slate-800 focus:ring-1 focus:ring-slate-800 transition-shadow"/>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-2 tracking-wider">Date Completed</label>
                <input type="date" name="dateCompleted" value={newStage.dateCompleted || ''} onChange={handleStageChange} className="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:border-slate-800 focus:ring-1 focus:ring-slate-800 transition-shadow"/>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-2">
                 <div>
                   <label className="block text-xs font-bold text-slate-600 uppercase mb-2 tracking-wider">Input Batch No.</label>
                   <input type="text" name="inputBatchNo" value={newStage.inputBatchNo || ''} onChange={handleStageChange} className="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm font-mono outline-none focus:border-slate-800 focus:ring-1 focus:ring-slate-800 transition-shadow"/>
                 </div>
                 <div>
                   <label className="block text-xs font-bold text-slate-600 uppercase mb-2 tracking-wider">Output Batch No.</label>
                   <input type="text" name="outputBatchNo" value={newStage.outputBatchNo || ''} onChange={handleStageChange} className="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm font-mono outline-none focus:border-slate-800 focus:ring-1 focus:ring-slate-800 transition-shadow"/>
                 </div>
              </div>
              <div className="flex items-center gap-2 mt-6 p-4 rounded-lg bg-slate-50 border border-slate-100">
                 <input type="checkbox" id="verified" name="verified" checked={newStage.verified || false} onChange={handleStageChange} className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500" />
                 <label htmlFor="verified" className="text-sm font-bold text-slate-700 cursor-pointer select-none">Mark Documents as Verified</label>
              </div>
            </div>
            <div className="px-6 py-5 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-3">
              <button 
                onClick={() => setShowStageModal(false)}
                className="px-5 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-700 text-sm font-bold hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-sm"
              >
                Cancel
              </button>
              <button 
                onClick={handleSaveStage}
                disabled={!newStage.stageName || !newStage.facility || !newStage.dateCompleted}
                className="px-5 py-2.5 bg-slate-900 text-white rounded-lg text-sm font-bold hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm ring-offset-2 focus:ring-2 focus:ring-slate-900"
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
