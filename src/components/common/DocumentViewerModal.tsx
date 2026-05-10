import React, { useState, useRef, useEffect } from 'react';
import { X, ZoomIn, ZoomOut, Download, Maximize, FileText, Bookmark, RotateCw } from 'lucide-react';

export interface DocumentViewerModalProps {
  type: 'image' | 'pdf';
  content: string;
  name?: string;
  onClose: () => void;
}

export function DocumentViewerModal({ type, content, name, onClose }: DocumentViewerModalProps) {
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  
  const containerRef = useRef<HTMLDivElement>(null);

  const handleZoomIn = () => setScale(prev => Math.min(prev + 0.25, 4));
  const handleZoomOut = () => setScale(prev => Math.max(prev - 0.25, 0.25));
  const handleReset = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
    setRotation(0);
  };
  const handleRotate = () => setRotation(prev => (prev + 90) % 360);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (type !== 'image') return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-6 bg-slate-900/90 backdrop-blur-sm">
      <div className="relative w-full max-w-6xl h-full max-h-[95vh] bg-slate-50 flex flex-col overflow-hidden rounded-2xl shadow-2xl ring-1 ring-white/10">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 px-6 border-b border-slate-200 bg-white shrink-0 shadow-sm z-10">
          <h3 className="font-extrabold text-slate-900 flex items-center gap-3">
            {type === 'image' ? (
              <div className="p-2 bg-indigo-50 rounded-lg"><Bookmark className="w-5 h-5 text-indigo-600" /></div>
            ) : (
              <div className="p-2 bg-rose-50 rounded-lg"><FileText className="w-5 h-5 text-rose-600" /></div>
            )}
            <span className="truncate max-w-[200px] sm:max-w-md">{name || (type === 'image' ? 'Image Preview' : 'PDF Document')}</span>
          </h3>
          
          <div className="flex items-center gap-2">
            {type === 'image' && (
              <div className="flex items-center gap-1 mr-4 bg-slate-100 p-1 rounded-lg">
                <button onClick={handleZoomOut} className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-white rounded shadow-sm transition-all" title="Zoom Out"><ZoomOut className="w-4 h-4" /></button>
                <span className="text-xs font-bold text-slate-700 w-12 text-center">{Math.round(scale * 100)}%</span>
                <button onClick={handleZoomIn} className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-white rounded shadow-sm transition-all" title="Zoom In"><ZoomIn className="w-4 h-4" /></button>
                <div className="w-px h-4 bg-slate-300 mx-1"></div>
                <button onClick={handleRotate} className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-white rounded shadow-sm transition-all" title="Rotate"><RotateCw className="w-4 h-4" /></button>
                <button onClick={handleReset} className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-white rounded shadow-sm transition-all" title="Reset"><Maximize className="w-4 h-4" /></button>
              </div>
            )}

            {content && (
              <a 
                href={content} 
                download={name || (type === 'image' ? 'image.png' : 'document.pdf')} 
                className="hidden sm:flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-lg transition-colors shadow-sm"
              >
                <Download className="w-4 h-4" /> Download
              </a>
            )}

            <button onClick={onClose} className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-200 rounded-lg transition-colors bg-white border border-slate-200 shadow-sm ml-2">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div 
          ref={containerRef}
          className="flex-1 overflow-hidden flex items-center justify-center bg-slate-200/50 relative"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {type === 'image' ? (
            <div 
              style={{
                transform: `translate(${position.x}px, ${position.y}px) scale(${scale}) rotate(${rotation}deg)`,
                cursor: isDragging ? 'grabbing' : 'grab',
                transition: isDragging ? 'none' : 'transform 0.2s ease-out'
              }}
              className="flex items-center justify-center p-4 min-h-full min-w-full"
            >
               <img 
                 src={content} 
                 alt={name || "Preview"} 
                 className="max-w-[90vw] max-h-[80vh] object-contain shadow-2xl rounded"
                 draggable="false"
               />
            </div>
          ) : (
            <div className="w-full h-full p-2 sm:p-6 flex flex-col">
              {content.startsWith('data:application/pdf') || content.startsWith('http') || content.startsWith('blob:') ? (
                <object data={content} type="application/pdf" className="flex-1 w-full h-full rounded-xl bg-white shadow-lg overflow-hidden border border-slate-200/60">
                   <embed src={content} type="application/pdf" className="w-full h-full" />
                   <p className="p-8 text-center text-slate-500">Your browser does not support PDFs. <a href={content} download className="text-indigo-600 underline">Download the PDF</a>.</p>
                </object>
              ) : (
                 <div className="flex-1 flex flex-col items-center justify-center text-center p-12 bg-white rounded-2xl shadow-sm border border-slate-200">
                    <div className="w-24 h-24 bg-rose-50 rounded-full flex items-center justify-center mb-6">
                       <FileText className="w-12 h-12 text-rose-500" />
                    </div>
                    <p className="text-xl font-black text-slate-900 mb-3">Preview unavailable</p>
                    <p className="text-slate-500 mb-8 max-w-md">This document format may not be supported for direct in-browser previewing.</p>
                    <a href={content} download={name || 'document'} className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-colors font-bold shadow-sm">
                      <Download className="w-5 h-5" /> Download File
                    </a>
                 </div>
              )}
            </div>
          )}
        </div>
        
        {/* Mobile Download Bar */}
        <div className="sm:hidden p-4 bg-white border-t border-slate-200 shrink-0">
          <a
            href={content} 
            download={name || (type === 'image' ? 'image.png' : 'document.pdf')} 
            className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-indigo-600 active:bg-indigo-700 text-white font-bold rounded-xl transition-colors shadow-sm"
          >
            <Download className="w-5 h-5" /> Download {type === 'image' ? 'Image' : 'Document'}
          </a>
        </div>

      </div>
    </div>
  );
}
