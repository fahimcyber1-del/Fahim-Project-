import React, { useState } from 'react';
import { X, FileText, Download } from 'lucide-react';

export interface InspectionExportOptions {
  includeChecks: boolean;
  includeImages: boolean;
  includeSignature: boolean;
}

interface ExportModalProps {
  onClose: () => void;
  onExportPDF: (options: InspectionExportOptions) => void;
  onExportCSV: (options: InspectionExportOptions) => void;
}

export function ExportModal({ onClose, onExportPDF, onExportCSV }: ExportModalProps) {
  const [options, setOptions] = useState<InspectionExportOptions>({
    includeChecks: true,
    includeImages: false,
    includeSignature: true,
  });

  const handleToggle = (key: keyof InspectionExportOptions) => {
    setOptions(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-[110] p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden">
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
              checked={options.includeChecks} 
              onChange={() => handleToggle('includeChecks')}
              className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
            />
            <span className="text-sm font-medium text-slate-700">Include Checks</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input 
              type="checkbox" 
              checked={options.includeImages} 
              onChange={() => handleToggle('includeImages')}
              className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
            />
            <span className="text-sm font-medium text-slate-700">Images (PDF only)</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input 
              type="checkbox" 
              checked={options.includeSignature} 
              onChange={() => handleToggle('includeSignature')}
              className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
            />
            <span className="text-sm font-medium text-slate-700">E-Signature</span>
          </label>
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-100 flex gap-3">
          <button 
            onClick={() => { onExportPDF(options); onClose(); }} 
            className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 px-4 rounded transition-colors text-sm"
          >
            <FileText className="w-4 h-4" /> PDF
          </button>
          <button 
            onClick={() => { onExportCSV(options); onClose(); }} 
            className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded transition-colors text-sm"
          >
            <Download className="w-4 h-4" /> Excel/CSV
          </button>
        </div>
      </div>
    </div>
  );
}
