import React from 'react';
import { RiskRecord, RiskLevel } from './types';
import { ArrowLeft, Edit3, ShieldAlert, CheckCircle, Activity, User, Calendar, Paperclip, Download, AlertTriangle } from 'lucide-react';

interface RiskAssessmentDetailProps {
  record: RiskRecord;
  onBack: () => void;
  onEdit: () => void;
}

export function RiskAssessmentDetail({ record, onBack, onEdit }: RiskAssessmentDetailProps) {
  const getLevelColor = (level: RiskLevel) => {
    switch (level) {
      case 'Critical': return 'bg-rose-100 text-rose-800 border-rose-200';
      case 'High': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Medium': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Low': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Mitigated': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Closed': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Active': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Draft': return 'bg-slate-100 text-slate-800 border-slate-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const handleDownload = (data: string, name: string) => {
    const a = document.createElement('a');
    a.href = data;
    a.download = name;
    a.click();
  };

  const isMultiple = record.category === 'Product';

  return (
    <div className="max-w-5xl mx-auto w-full pb-12">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
           <button onClick={onBack} className="p-2 bg-slate-100 text-slate-500 hover:bg-slate-200 rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-black text-slate-900">{record.title}</h1>
              <span className={`px-2.5 py-1 rounded-full text-xs font-bold border flex items-center justify-center ${getStatusColor(record.status)}`}>
                {record.status}
              </span>
            </div>
            <p className="text-sm font-medium text-slate-500">ID: {record.id} • Assessed: {record.dateAssessed}</p>
          </div>
        </div>
        <button onClick={onEdit} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-sm font-bold text-sm transition-colors">
          <Edit3 className="w-4 h-4" /> Edit Assessment
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:p-6 lg:p-0">
         <div className="lg:col-span-2 space-y-6">
            
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden auto-rows-max">
               <div className="flex flex-col sm:flex-row h-full">
                  <div className="flex-1">
                     <div className="border-b border-slate-100 px-6 py-4 flex items-center gap-2 bg-slate-50">
                       <ShieldAlert className="w-5 h-5 text-indigo-600" />
                       <h3 className="font-bold text-slate-800 uppercase tracking-widest text-sm">Context</h3>
                     </div>
                     <div className="p-4 sm:p-6 space-y-6">
                       <div className="grid grid-cols-2 gap-4 pb-4 border-b border-slate-100">
                          <div>
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Category</p>
                            <p className="text-sm font-medium text-slate-900">{record.category}</p>
                          </div>
                          {record.category === 'Product' && record.productDetails ? (
                            <>
                              <div>
                                 <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Item Category / Name</p>
                                 <p className="text-sm font-medium text-slate-900">{record.productDetails.itemCategory || record.productDetails.itemName || '-'}</p>
                              </div>
                              <div>
                                 <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Style Number</p>
                                 <p className="text-sm font-medium text-slate-900">{record.productDetails.styleNumber}</p>
                              </div>
                            </>
                          ) : (
                            <div>
                              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Process Name</p>
                              <p className="text-sm font-medium text-slate-900">{record.processName}</p>
                            </div>
                          )}
                       </div>

                       {(!isMultiple || record.description) && (
                         <div>
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Description</p>
                            <p className="text-sm text-slate-800 leading-relaxed whitespace-pre-wrap">{record.description || 'Not provided.'}</p>
                         </div>
                       )}
                     </div>
                  </div>
                  {record.productDetails?.productImage && (
                     <div className="sm:border-l border-t sm:border-t-0 border-slate-100 bg-slate-50 flex items-center justify-center p-4 w-full sm:w-64 shrink-0">
                       <img src={record.productDetails.productImage} alt="Product" className="w-full max-h-48 object-contain rounded-lg shadow-sm" />
                     </div>
                  )}
               </div>
            </div>

            {isMultiple && record.identifiedRisks ? (
              <div className="space-y-6">
                <h3 className="font-black text-slate-900 text-lg flex items-center gap-2">
                   <AlertTriangle className="w-5 h-5 text-rose-500" /> Identified Risks ({record.identifiedRisks.length})
                </h3>
                {record.identifiedRisks.map((risk, index) => (
                   <div key={risk.id} className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                     <div className="border-b border-slate-100 px-4 py-3 flex items-center justify-between bg-slate-50">
                       <h4 className="font-bold text-slate-800 text-sm">Risk #{index + 1}</h4>
                       <div className="flex gap-2">
                          <div className={`px-2 py-1 rounded text-xs font-bold border ${getLevelColor(risk.riskLevel)}`}>
                             Initial: {risk.riskLevel}
                          </div>
                          {risk.residualRiskLevel && (
                             <div className={`px-2 py-1 rounded text-xs font-bold border ${getLevelColor(risk.residualRiskLevel)}`}>
                               Residual: {risk.residualRiskLevel}
                             </div>
                          )}
                       </div>
                     </div>
                     <div className="p-4 sm:p-6 space-y-6">
                        <div>
                          <p className="text-[10px] font-bold text-rose-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                            <AlertTriangle className="w-3.5 h-3.5" /> Hazard
                          </p>
                          <p className="text-sm text-slate-800 leading-relaxed whitespace-pre-wrap">
                             {risk.hazardIdentified}
                          </p>
                        </div>
                        
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                           <div>
                             <p className="text-[10px] uppercase tracking-wider font-bold text-slate-500 mb-1">In. Severity</p>
                             <p className="text-lg font-black text-slate-900">{risk.severity}</p>
                           </div>
                           <div>
                             <p className="text-[10px] uppercase tracking-wider font-bold text-slate-500 mb-1">In. Likelihood</p>
                             <p className="text-lg font-black text-slate-900">{risk.likelihood}</p>
                           </div>
                           <div>
                             <p className="text-[10px] uppercase tracking-wider font-bold text-slate-500 mb-1">In. Score</p>
                             <p className="text-lg font-black text-slate-900">{risk.riskScore}</p>
                           </div>
                           <div>
                             <p className="text-[10px] uppercase tracking-wider font-bold text-slate-500 mb-1">Res. Score</p>
                             <p className="text-lg font-black text-slate-900">{risk.residualRiskScore || '-'}</p>
                           </div>
                        </div>

                        <div>
                          <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider mb-2 flex items-center gap-1">
                            <Activity className="w-3.5 h-3.5" /> Mitigation Plan
                          </p>
                          <p className="text-sm text-slate-800 leading-relaxed whitespace-pre-wrap pl-4 border-l-2 border-indigo-400">
                             {risk.mitigationPlan || 'None provided'}
                          </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-4">
                           <div className="flex gap-2">
                              <User className="w-4 h-4 text-slate-400 mt-0.5" />
                              <div>
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">Assigned To</p>
                                <p className="text-sm font-bold text-slate-900">{risk.mitigationOwner || 'Unassigned'}</p>
                              </div>
                           </div>
                           <div className="flex gap-2">
                              <Calendar className="w-4 h-4 text-slate-400 mt-0.5" />
                              <div>
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">Target Date</p>
                                <p className="text-sm font-bold text-slate-900">{risk.mitigationDueDate || '-'}</p>
                              </div>
                           </div>
                        </div>
                     </div>
                   </div>
                ))}
              </div>
            ) : (
               <>
                 <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                    <div className="border-b border-slate-100 px-6 py-4 flex items-center gap-2 bg-slate-50">
                      <AlertTriangle className="w-5 h-5 text-rose-600" />
                      <h3 className="font-bold text-slate-800 uppercase tracking-widest text-sm">Hazard</h3>
                    </div>
                    <div className="p-4 sm:p-6 text-sm text-slate-800 leading-relaxed whitespace-pre-wrap">
                       {record.hazardIdentified}
                    </div>
                 </div>

                 <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                    <div className="border-b border-slate-100 px-6 py-4 flex items-center gap-2 bg-slate-50">
                      <Activity className="w-5 h-5 text-indigo-600" />
                      <h3 className="font-bold text-slate-800 uppercase tracking-widest text-sm">Mitigation & Action Plan</h3>
                    </div>
                    <div className="p-4 sm:p-6 space-y-4">
                       {record.mitigationPlan ? (
                         <p className="text-sm text-slate-800 leading-relaxed whitespace-pre-wrap pl-4 border-l-2 border-indigo-500">
                           {record.mitigationPlan}
                         </p>
                       ) : (
                         <p className="text-sm text-slate-500 italic text-center p-4">No mitigation plan documented.</p>
                       )}
                    </div>
                 </div>
               </>
            )}

         </div>

         <div className="space-y-6">
            {!isMultiple && (
              <>
                <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4 sm:p-6">
                   <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest mb-4 border-b border-slate-100 pb-2">Initial Risk Score</h3>
                   
                   <div className="flex items-center justify-between mb-4">
                     <div className="text-center flex-1">
                        <p className="text-[10px] uppercase tracking-wider font-bold text-slate-500 mb-1">Severity</p>
                        <p className="text-xl font-black text-slate-900">{record.severity}</p>
                     </div>
                     <div className="text-slate-300 font-black text-xl">×</div>
                     <div className="text-center flex-1">
                        <p className="text-[10px] uppercase tracking-wider font-bold text-slate-500 mb-1">Likelihood</p>
                        <p className="text-xl font-black text-slate-900">{record.likelihood}</p>
                     </div>
                     <div className="text-slate-300 font-black text-xl">=</div>
                     <div className="text-center flex-1">
                        <p className="text-[10px] uppercase tracking-wider font-bold text-slate-500 mb-1">Score</p>
                        <p className="text-2xl font-black text-slate-900">{record.riskScore}</p>
                     </div>
                   </div>
                   
                   <div className={`p-3 rounded-lg text-center font-bold border ${getLevelColor(record.riskLevel || 'Low')}`}>
                      {record.riskLevel} Risk
                   </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4 sm:p-6">
                   <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest mb-4 border-b border-slate-100 pb-2">Residual Risk</h3>
                   
                   {record.residualRiskScore ? (
                     <>
                       <div className="flex items-center justify-between mb-4">
                         <div className="text-center flex-1">
                            <p className="text-[10px] uppercase tracking-wider font-bold text-slate-500 mb-1">Severity</p>
                            <p className="text-xl font-black text-slate-900">{record.residualSeverity}</p>
                         </div>
                         <div className="text-slate-300 font-black text-xl">×</div>
                         <div className="text-center flex-1">
                            <p className="text-[10px] uppercase tracking-wider font-bold text-slate-500 mb-1">Likelihood</p>
                            <p className="text-xl font-black text-slate-900">{record.residualLikelihood}</p>
                         </div>
                         <div className="text-slate-300 font-black text-xl">=</div>
                         <div className="text-center flex-1">
                            <p className="text-[10px] uppercase tracking-wider font-bold text-slate-500 mb-1">Score</p>
                            <p className="text-2xl font-black text-slate-900">{record.residualRiskScore}</p>
                         </div>
                       </div>
                       
                       <div className={`p-3 rounded-lg text-center font-bold border ${getLevelColor(record.residualRiskLevel || 'Low')}`}>
                          {record.residualRiskLevel} Risk
                       </div>
                     </>
                   ) : (
                     <p className="text-sm text-slate-500 italic text-center py-2">Residual risk not assessed.</p>
                   )}
                </div>

                <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4 sm:p-6">
                   <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest mb-4 border-b border-slate-100 pb-2">Mitigation Ownership</h3>
                   
                   <div className="space-y-4">
                     <div className="flex items-start gap-3">
                       <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                         <User className="w-4 h-4 text-indigo-600" />
                       </div>
                       <div>
                         <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">Owner</p>
                         <p className="text-sm font-bold text-slate-900">{record.mitigationOwner}</p>
                       </div>
                     </div>

                     <div className="flex items-start gap-3">
                       <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                         <Calendar className="w-4 h-4 text-slate-600" />
                       </div>
                       <div>
                         <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">Due Date</p>
                         <p className="text-sm font-bold text-slate-900">{record.mitigationDueDate}</p>
                       </div>
                     </div>
                   </div>
                </div>
              </>
            )}

            {record.attachments && record.attachments.length > 0 && (
              <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                <div className="border-b border-slate-100 px-6 py-4 flex items-center gap-2 bg-slate-50">
                  <Paperclip className="w-5 h-5 text-indigo-600" />
                  <h3 className="font-bold text-slate-800 uppercase tracking-widest text-sm">Attachments</h3>
                </div>
                <div className="p-2">
                  <div className="space-y-1">
                    {record.attachments.map((file, i) => (
                      <div key={i} className="flex items-center justify-between p-3 border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors group">
                        <div className="flex items-center gap-3 overflow-hidden">
                          <Paperclip className="w-4 h-4 text-slate-400 flex-shrink-0" />
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-slate-700 truncate">{file.name}</p>
                          </div>
                        </div>
                        <button 
                          onClick={() => handleDownload(file.data, file.name)}
                          className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all focus:opacity-100"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
         </div>
      </div>
    </div>
  );
}
