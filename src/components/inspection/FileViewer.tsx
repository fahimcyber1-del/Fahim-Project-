import React, { useState } from 'react';
import { DocumentViewerModal } from '../common/DocumentViewerModal';
import { Maximize2, Download } from 'lucide-react';

interface FileViewerProps {
  attachments?: { name: string; type: string; data: string }[];
}

export function FileViewer({ attachments }: FileViewerProps) {
  const [activeFile, setActiveFile] = useState<{ type: 'image' | 'pdf', content: string, name: string } | null>(null);

  if (!attachments || attachments.length === 0) return null;

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-2">Attachments</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {attachments.map((file, index) => {
          const isImage = file.type.startsWith('image/');
          const isPdf = file.type === 'application/pdf';
          
          return (
            <div key={index} className="group relative border border-slate-200 rounded-xl overflow-hidden bg-white hover:shadow-md transition-shadow">
              <div className="h-32 bg-slate-50 flex items-center justify-center border-b border-slate-100 overflow-hidden relative">
                {isImage ? (
                  <img src={file.data} alt={file.name} className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity" />
                ) : isPdf ? (
                  <div className="relative w-full h-full">
                     <div className="absolute inset-0 flex items-center justify-center bg-slate-100">
                        <span className="text-xs font-bold text-slate-400 uppercase">PDF Preview</span>
                     </div>
                     <embed src={`${file.data}#toolbar=0&navpanes=0&scrollbar=0`} type="application/pdf" className="w-full h-full relative z-10 pointer-events-none opacity-50" />
                  </div>
                ) : (
                  <div className="text-xs font-medium text-slate-400">Unsupported format</div>
                )}
                
                {/* Overlay actions */}
                <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 z-20 backdrop-blur-[2px]">
                   {(isImage || isPdf) && (
                     <button 
                       onClick={() => setActiveFile({ type: isImage ? 'image' : 'pdf', content: file.data, name: file.name })}
                       className="p-2 bg-white text-slate-700 hover:text-indigo-600 rounded-lg shadow-sm transition-colors"
                       title="Full View"
                     >
                       <Maximize2 className="w-4 h-4" />
                     </button>
                   )}
                   <a 
                     href={file.data} 
                     download={file.name} 
                     className="p-2 bg-indigo-600 text-white hover:bg-indigo-700 rounded-lg shadow-sm transition-colors"
                     title="Download"
                   >
                     <Download className="w-4 h-4" />
                   </a>
                </div>
              </div>
              <div className="p-2.5">
                 <p className="text-xs font-semibold text-slate-700 truncate w-full" title={file.name}>{file.name}</p>
                 <p className="text-[10px] text-slate-400 mt-0.5 uppercase tracking-wider">{isImage ? 'Image' : isPdf ? 'PDF Document' : 'File'}</p>
              </div>
            </div>
          );
        })}
      </div>

      {activeFile && (
        <DocumentViewerModal
          type={activeFile.type}
          content={activeFile.content}
          name={activeFile.name}
          onClose={() => setActiveFile(null)}
        />
      )}
    </div>
  );
}
