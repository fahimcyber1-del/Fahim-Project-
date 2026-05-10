import React, { useState } from 'react';
import { X, FileText, Download } from 'lucide-react';

export interface CalibrationExportOptions {
  includeEquipmentDetails: boolean;
  includeCalibrationHistory: boolean;
  includeCertificates: boolean;
  includeNotes: boolean;
  includeImages: boolean;
}

interface ExportModalProps {
  onClose: () => void;
  onExportPDF: (options: CalibrationExportOptions) => void;
  onExportCSV: (options: CalibrationExportOptions) => void;
}

export function ExportModal({ onClose, onExportPDF, onExportCSV }: ExportModalProps) {
  const [options, setOptions] = useState<CalibrationExportOptions>({
    includeEquipmentDetails: true,
    includeCalibrationHistory: true,
    includeCertificates: true,
    includeNotes: true,
    includeImages: false,
  });

  const handleToggle = (key: keyof CalibrationExportOptions) => {
    setOptions(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-[110] p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden border border-slate-200">
        <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50">
          <h3 className="font-bold text-slate-800">Export Options</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-4 space-y-4">
          <label className="flex items-center gap-3 cursor-pointer">
            <input 
              type="checkbox" 
              checked={options.includeEquipmentDetails} 
              onChange={() => handleToggle('includeEquipmentDetails')}
              className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
            />
            <span className="text-sm font-medium text-slate-700">Equipment Details</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input 
              type="checkbox" 
              checked={options.includeCalibrationHistory} 
              onChange={() => handleToggle('includeCalibrationHistory')}
              className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
            />
            <span className="text-sm font-medium text-slate-700">Calibration History</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input 
              type="checkbox" 
              checked={options.includeCertificates} 
              onChange={() => handleToggle('includeCertificates')}
              className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
            />
            <span className="text-sm font-medium text-slate-700">Certificate Status</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input 
              type="checkbox" 
              checked={options.includeNotes} 
              onChange={() => handleToggle('includeNotes')}
              className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
            />
            <span className="text-sm font-medium text-slate-700">Remarks & Notes</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input 
              type="checkbox" 
              checked={options.includeImages} 
              onChange={() => handleToggle('includeImages')}
              className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
            />
            <span className="text-sm font-medium text-slate-700">Include Images (PDF only)</span>
          </label>
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-100 flex gap-3">
          <button 
            onClick={() => { onExportPDF(options); onClose(); }} 
            className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded transition-colors text-sm shadow-sm border border-indigo-700"
          >
            <FileText className="w-4 h-4" /> PDF
          </button>
          <button 
            onClick={() => { onExportCSV(options); onClose(); }} 
            className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 px-4 rounded transition-colors text-sm shadow-sm border border-emerald-700"
          >
            <Download className="w-4 h-4" /> Excel/CSV
          </button>
        </div>
      </div>
    </div>
  );
}
