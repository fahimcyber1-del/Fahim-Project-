import React, { useState } from 'react';
import { Equipment, CalibrationRecord } from './types';
import { ArrowLeft, Edit3, CheckCircle, XCircle, Settings, FileText, Download, Calendar, Scale, MapPin, Tag, Plus, PlusCircle, Maximize2 } from 'lucide-react';
import { DocumentViewerModal } from '../common/DocumentViewerModal';
import { ExportModal, CalibrationExportOptions } from './ExportModal';

interface EquipmentDetailProps {
  record: Equipment;
  onBack: () => void;
  onEdit: (id: string) => void;
  onUpdate?: (record: Equipment) => void;
}

export function EquipmentDetail({ record, onBack, onEdit, onUpdate }: EquipmentDetailProps) {
  const [fullscreenImage, setFullscreenImage] = useState<{ content: string; name: string } | null>(null);
  const [showCalibrateModal, setShowCalibrateModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [newLog, setNewLog] = useState<Partial<CalibrationRecord>>({
    date: new Date().toISOString().split('T')[0],
    result: 'PASS',
    performedBy: '',
    notes: ''
  });

  const handleLogChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewLog(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveLog = () => {
    if (!newLog.date || !newLog.performedBy || !newLog.result) return;
    
    const recordToAdd: CalibrationRecord = {
      id: `CAL-${Date.now()}`,
      equipmentId: record.id,
      date: newLog.date!,
      result: newLog.result as any,
      performedBy: newLog.performedBy!,
      notes: newLog.notes
    };
    
    // If we have an onUpdate prop, we send the updated equipment object upward 
    if (onUpdate) {
      onUpdate({
        ...record,
        lastCalibrationDate: newLog.date!,
        calibrations: [recordToAdd, ...record.calibrations],
        status: newLog.result === 'FAIL' ? 'OUT_OF_SERVICE' : 'ACTIVE'
      });
    }

    setShowCalibrateModal(false);
    setNewLog({
      date: new Date().toISOString().split('T')[0],
      result: 'PASS',
      performedBy: '',
      notes: ''
    });
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'ACTIVE': return <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1"><CheckCircle className="w-3 h-3" /> ACTIVE</span>;
      case 'CALIBRATION_DUE': return <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1"><Calendar className="w-3 h-3" /> CALIBRATION DUE</span>;
      case 'OUT_OF_SERVICE': return <span className="bg-rose-100 text-rose-800 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1"><XCircle className="w-3 h-3" /> OUT OF SERVICE</span>;
      default: return <span className="bg-slate-100 text-slate-800 px-3 py-1 rounded-full text-xs font-bold">{status}</span>;
    }
  };

  return (
    <div className="max-w-6xl mx-auto w-full flex flex-col h-full space-y-6 pb-12">
      {fullscreenImage && (
        <DocumentViewerModal
          type="image"
          content={fullscreenImage.content}
          name={fullscreenImage.name}
          onClose={() => setFullscreenImage(null)}
        />
      )}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4 sm:p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 w-full sm:w-auto">
          <div className="flex items-center gap-4">
            <button 
              onClick={onBack}
              className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500 shrink-0"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            {record.imageUrl && (
              <div 
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden shrink-0 border border-slate-200 shadow-sm relative group cursor-pointer block sm:hidden"
                onClick={() => setFullscreenImage({ content: record.imageUrl!, name: record.name })}
              >
                  <img src={record.imageUrl} alt={record.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Maximize2 className="w-5 h-5 text-white" />
                  </div>
              </div>
            )}
          </div>
          
          {record.imageUrl && (
            <div 
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden shrink-0 border border-slate-200 shadow-sm relative group cursor-pointer hidden sm:block"
              onClick={() => setFullscreenImage({ content: record.imageUrl!, name: record.name })}
            >
                <img src={record.imageUrl} alt={record.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Maximize2 className="w-5 h-5 text-white" />
                </div>
            </div>
          )}

          <div>
            <div className="flex items-center gap-3 flex-wrap mb-1">
              <h1 className="text-2xl font-black text-slate-900">{record.name}</h1>
              {getStatusBadge(record.status)}
            </div>
            <p className="text-sm font-medium text-slate-500 mb-4">ID: {record.id} • {record.manufacturer} {record.model}</p>
            
            <div className="flex items-center gap-2">
                <button 
                  onClick={() => setShowExportModal(true)}
                  className="flex items-center gap-2 px-3 py-1.5 border border-slate-300 bg-white text-slate-700 rounded-md hover:bg-slate-50 transition-colors text-sm font-bold shadow-sm"
                >
                  <Download className="w-4 h-4" /> Export Report
                </button>
                <button 
                  onClick={() => onEdit(record.id)}
                  className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 text-white rounded-md hover:bg-slate-900 transition-colors text-sm font-bold shadow-sm"
                >
                  <Edit3 className="w-4 h-4" /> Edit Equipment
                </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:p-6">
        
        {/* Left Column - Details */}
        <div className="lg:col-span-2 space-y-6">
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4 sm:p-6">
                <h3 className="text-lg font-bold text-slate-800 mb-6 border-b border-slate-100 pb-2">Equipment Profile</h3>
                
                <div className="grid grid-cols-2 gap-y-6 gap-x-8">
                  <div>
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1.5"><Tag className="w-3 h-3"/> MANUFACTURER</p>
                      <p className="text-sm font-bold text-slate-800">{record.manufacturer}</p>
                  </div>
                  <div>
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">MODEL</p>
                      <p className="text-sm font-bold text-slate-800">{record.model}</p>
                  </div>
                  <div>
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">SERIAL NUMBER</p>
                      <p className="text-sm font-bold text-slate-800 font-mono bg-slate-50 px-2 py-0.5 rounded border border-slate-100 w-max">{record.serialNumber}</p>
                  </div>
                  <div>
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1.5"><MapPin className="w-3 h-3"/> LOCATION</p>
                      <p className="text-sm font-bold text-slate-800">{record.location}</p>
                  </div>
                  <div className="col-span-2">
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">TOLERANCE / CRITERIA</p>
                      <p className="text-sm font-bold text-slate-800 bg-slate-50 px-3 py-2 rounded-md border border-slate-100">{record.tolerance || 'N/A'}</p>
                  </div>
                </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4 sm:p-6">
               <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-2">
                 <h3 className="text-lg font-bold text-slate-800">Calibration History</h3>
                 <button 
                  onClick={() => setShowCalibrateModal(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-md text-xs font-bold transition-colors"
                 >
                   <PlusCircle className="w-4 h-4"/> Log Calibration
                 </button>
               </div>
               
               {record.calibrations && record.calibrations.length > 0 ? (
                 <div className="space-y-4">
                   {record.calibrations.map((cal, idx) => (
                      <div key={cal.id} className="flex gap-4 p-4 rounded-lg border border-slate-200 bg-slate-50/50">
                         <div className={`p-2 rounded-full h-fit ${cal.result === 'PASS' ? 'bg-emerald-100 text-emerald-600' : cal.result === 'FAIL' ? 'bg-rose-100 text-rose-600' : 'bg-amber-100 text-amber-600'}`}>
                           {cal.result === 'PASS' ? <CheckCircle className="w-5 h-5"/> : cal.result === 'FAIL' ? <XCircle className="w-5 h-5" /> : <Settings className="w-5 h-5"/>}
                         </div>
                         <div className="flex-1">
                           <div className="flex justify-between items-start">
                             <div>
                               <p className="text-sm font-bold text-slate-800">{cal.date}</p>
                               <p className="text-xs font-medium text-slate-500">By: {cal.performedBy}</p>
                             </div>
                             <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider border ${
                               cal.result === 'PASS' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 
                               cal.result === 'FAIL' ? 'bg-rose-50 text-rose-700 border-rose-200' : 
                               'bg-amber-50 text-amber-700 border-amber-200'
                             }`}>
                               {cal.result}
                             </span>
                           </div>
                           {cal.notes && (
                             <p className="mt-2 text-sm text-slate-600 bg-white p-2 rounded border border-slate-100">{cal.notes}</p>
                           )}
                           <div className="mt-3 flex items-center gap-3">
                             <a href="#" className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-800"><FileText className="w-3.5 h-3.5"/> View Certificate</a>
                           </div>
                         </div>
                      </div>
                   ))}
                 </div>
               ) : (
                 <div className="text-center py-8 bg-slate-50 rounded-lg border border-dashed border-slate-200">
                   <Scale className="w-8 h-8 text-slate-300 mx-auto mb-2"/>
                   <p className="text-sm font-medium text-slate-500">No calibration records found.</p>
                 </div>
               )}
            </div>
        </div>

        {/* Right Column - Schedule & Maintenance */}
        <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4 sm:p-6">
              <h3 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">Schedule</h3>
              
              <div className="space-y-4">
                 <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                       <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded flex items-center justify-center"><Calendar className="w-4 h-4"/></div>
                       <div>
                         <p className="text-[10px] font-bold text-slate-500 uppercase">LAST CALIBRATION</p>
                         <p className="text-sm font-bold text-slate-800">{record.lastCalibrationDate}</p>
                       </div>
                    </div>
                 </div>

                 <div className={`p-3 rounded-lg border flex items-center justify-between gap-4 ${
                   record.status === 'CALIBRATION_DUE' ? 'bg-amber-50 border-amber-200' : 'bg-slate-50 border-slate-100'
                 }`}>
                    <div className="flex items-center gap-3">
                       <div className={`w-8 h-8 rounded flex items-center justify-center ${
                         record.status === 'CALIBRATION_DUE' ? 'bg-amber-200 text-amber-700' : 'bg-emerald-100 text-emerald-600'
                       }`}><Calendar className="w-4 h-4"/></div>
                       <div>
                         <p className={`text-[10px] font-bold uppercase ${record.status === 'CALIBRATION_DUE' ? 'text-amber-700' : 'text-slate-500'}`}>NEXT DUE DATE</p>
                         <p className="text-sm font-bold text-slate-800">{record.nextCalibrationDate}</p>
                       </div>
                    </div>
                 </div>

                 <div className="pt-2">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">FREQUENCY & TYPE</p>
                    <p className="text-sm font-bold text-slate-800 flex items-center gap-2">
                       {record.calibrationFrequency} Months 
                       <span className="text-slate-300">•</span> 
                       {record.calibrationType}
                    </p>
                 </div>
                 {record.vendor && (
                   <div>
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">VENDOR</p>
                      <p className="text-sm font-bold text-slate-800">{record.vendor}</p>
                   </div>
                 )}
              </div>
            </div>

            {record.remarks && (
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4 sm:p-6 bg-gradient-to-br from-slate-50 to-slate-100">
               <div className="flex items-center gap-2 text-slate-700 mb-2">
                 <FileText className="w-5 h-5"/>
                 <h3 className="text-sm font-bold text-slate-800">Remarks / Notes</h3>
               </div>
               <p className="text-sm text-slate-600 mb-4">{record.remarks}</p>
            </div>
            )}
        </div>

      </div>

      {/* Log Calibration Modal */}
      {showCalibrateModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="text-lg font-bold text-slate-800">Log Calibration</h3>
              <button 
                onClick={() => setShowCalibrateModal(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
                title="Close"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 sm:p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-2">Calibration Date</label>
                <input 
                  type="date" 
                  name="date" 
                  value={newLog.date || ''} 
                  onChange={handleLogChange} 
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-2">Performed By</label>
                <input 
                  type="text" 
                  name="performedBy" 
                  value={newLog.performedBy || ''} 
                  onChange={handleLogChange} 
                  placeholder="e.g. John Doe or TUV SUD"
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-2">Result</label>
                <select 
                  name="result" 
                  value={newLog.result || 'PASS'} 
                  onChange={handleLogChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                >
                  <option value="PASS">Pass</option>
                  <option value="FAIL">Fail</option>
                  <option value="ADJUSTED">Adjusted</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-2">Notes / Findings</label>
                <textarea 
                  name="notes" 
                  value={newLog.notes || ''} 
                  onChange={handleLogChange} 
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none resize-none"
                  placeholder="Details of the calibration..."
                />
              </div>
            </div>
            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
              <button 
                onClick={() => setShowCalibrateModal(false)}
                className="px-4 py-2 border border-slate-300 rounded-md text-slate-700 text-sm font-bold hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleSaveLog}
                disabled={!newLog.date || !newLog.performedBy || !newLog.result}
                className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-bold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Save Record
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Export Modal */}
      {showExportModal && (
        <ExportModal 
          onClose={() => setShowExportModal(false)} 
          onExportPDF={(options) => console.log('Export PDF with options:', options)}
          onExportCSV={(options) => console.log('Export CSV with options:', options)}
        />
      )}
    </div>
  );
}
