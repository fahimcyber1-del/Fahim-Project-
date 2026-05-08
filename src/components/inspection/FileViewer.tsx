import React from 'react';

interface FileViewerProps {
  attachments?: { name: string; type: string; data: string }[];
}

export function FileViewer({ attachments }: FileViewerProps) {
  if (!attachments || attachments.length === 0) return null;

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-2">Attachments</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {attachments.map((file, index) => (
          <div key={index} className="border border-slate-200 rounded-lg p-2 flex flex-col items-center">
            <p className="text-xs text-slate-700 truncate w-full mb-2" title={file.name}>{file.name}</p>
            {file.type.startsWith('image/') ? (
              <img src={file.data} alt={file.name} className="max-h-32 object-contain" />
            ) : file.type === 'application/pdf' ? (
              <embed src={file.data} type="application/pdf" className="w-full h-32" />
            ) : (
              <div className="h-32 flex items-center justify-center text-slate-400">Unsupported format</div>
            )}
            <a href={file.data} download={file.name} className="mt-2 text-xs text-blue-600 font-medium">Download</a>
          </div>
        ))}
      </div>
    </div>
  );
}
