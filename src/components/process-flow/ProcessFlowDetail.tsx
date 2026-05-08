import React, { useState } from 'react';
import { ProcessFlowRecord, FlowNode, NodeType } from './types';
import { ArrowLeft, Edit3, User, Building, Calendar, Workflow, ArrowRight, CheckCircle, Circle, Play } from 'lucide-react';

interface ProcessFlowDetailProps {
  record: ProcessFlowRecord;
  onBack: () => void;
  onEdit: () => void;
}

export function ProcessFlowDetail({ record, onBack, onEdit }: ProcessFlowDetailProps) {
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({});

  const toggleStepCompleted = (nodeId: string) => {
    setCompletedSteps(prev => ({
      ...prev,
      [nodeId]: !prev[nodeId]
    }));
  };

  const isStepActive = (node: FlowNode) => {
    if (!node.dependencies || node.dependencies.length === 0) return true; // Start steps or steps with no deps are naturally active
    return node.dependencies.every(depId => completedSteps[depId]);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Published': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Approved': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Under Review': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Archived': return 'bg-rose-100 text-rose-800 border-rose-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const getNodeStyle = (type: NodeType) => {
    switch(type) {
      case 'start': return 'bg-emerald-50 border-emerald-300 text-emerald-900 rounded-full';
      case 'end': return 'bg-rose-50 border-rose-300 text-rose-900 rounded-full';
      case 'decision': return 'bg-amber-50 border-amber-300 text-amber-900 transform rotate-45';
      case 'document': return 'bg-blue-50 border-blue-300 text-blue-900 rounded-b-lg border-b-4';
      default: return 'bg-white border-slate-300 text-slate-800 rounded-lg'; // process
    }
  };

  const getInnerStyle = (type: NodeType) => {
    if (type === 'decision') return 'transform -rotate-45';
    return '';
  };

  // Build a simple sequential view of the process based on connections, starting with start nodes
  const startNodes = record.nodes.filter(n => n.type === 'start' || !record.nodes.some(parent => parent.nextNodes.includes(n.id)));
  
  // A simple recursive component to render connected nodes as a tree/list
  const renderConnectedNodes = (nodeId: string, depth: number = 0, visited: Set<string> = new Set()) => {
    if (visited.has(nodeId)) {
      return (
         <div className="text-xs text-indigo-500 ml-8 font-medium mt-2 flex items-center gap-1">
           <ArrowRight className="w-3 h-3"/> Loops back to: {record.nodes.find(n => n.id === nodeId)?.label}
         </div>
      );
    }
    
    const node = record.nodes.find(n => n.id === nodeId);
    if (!node) return null;

    const newVisited = new Set(visited).add(nodeId);
    
    const isCompleted = completedSteps[node.id];
    const active = isStepActive(node);

    return (
      <div className={`flex flex-col mt-4 relative`} style={{ marginLeft: depth > 0 ? '2rem' : '0' }}>
         {depth > 0 && (
            <div className="absolute -left-6 top-4 sm:p-6 bottom-0 w-px bg-slate-200"></div>
         )}
         {depth > 0 && (
            <div className="absolute -left-6 top-4 sm:p-6 w-5 h-px bg-slate-200"></div>
         )}
         <div className="flex items-start gap-4 z-10 transition-all duration-300">
            <div className={`w-12 flex justify-center mt-1 transition-opacity ${active ? 'opacity-100' : 'opacity-40 grayscale'}`}>
               <div className={`w-10 h-10 border-2 flex items-center justify-center p-1 font-bold text-[8px] text-center uppercase ${getNodeStyle(node.type)} ${isCompleted ? 'ring-2 ring-emerald-500 ring-offset-2' : ''}`}>
                  <span className={getInnerStyle(node.type)}>{node.type}</span>
               </div>
            </div>
            <div className={`bg-white border rounded-lg p-3 shadow-sm min-w-[300px] max-w-sm flex-1 transition-all ${
              isCompleted ? 'border-emerald-500 bg-emerald-50/30' :
              active ? 'border-indigo-400 ring-1 ring-indigo-400' : 'border-slate-200 opacity-60'
            }`}>
               <div className="flex items-start justify-between">
                 <div>
                   <div className="flex items-center gap-2 mb-1">
                     <h4 className="font-bold text-slate-800 text-sm">{node.label}</h4>
                     {active && !isCompleted && (
                       <span className="px-1.5 py-0.5 rounded-full bg-indigo-100 text-indigo-700 text-[9px] font-bold uppercase tracking-wider flex items-center gap-0.5">
                         <Play className="w-2.5 h-2.5" /> Active
                       </span>
                     )}
                   </div>
                   {node.description && <p className={`text-xs ${isCompleted ? 'text-emerald-700' : 'text-slate-500'}`}>{node.description}</p>}
                   
                   {node.dependencies && node.dependencies.length > 0 && (
                     <div className="mt-2 flex flex-wrap gap-1">
                       <span className="text-[9px] uppercase font-bold text-slate-400 mr-1">Dependencies:</span>
                       {node.dependencies.map(depId => {
                         const depNode = record.nodes.find(n => n.id === depId);
                         const depCompleted = completedSteps[depId];
                         return (
                           <span key={depId} className={`text-[9px] px-1.5 py-0.5 rounded border ${depCompleted ? 'border-emerald-300 bg-emerald-100 text-emerald-700' : 'border-slate-200 bg-slate-100 text-slate-600'}`}>
                             {depNode ? depNode.label : depId}
                           </span>
                         );
                       })}
                     </div>
                   )}
                 </div>
                 
                 <button 
                  onClick={() => toggleStepCompleted(node.id)}
                  disabled={!active && !isCompleted}
                  className={`flex-shrink-0 p-1 rounded-full transition-colors ${
                    isCompleted ? 'text-emerald-500 hover:bg-emerald-100' : 
                    active ? 'text-slate-300 hover:text-indigo-500 hover:bg-indigo-50' : 'text-slate-200 cursor-not-allowed'
                  }`}
                  title={isCompleted ? "Mark Uncompleted" : "Mark Completed"}
                 >
                   {isCompleted ? <CheckCircle className="w-6 h-6" /> : <Circle className="w-6 h-6" />}
                 </button>
               </div>
            </div>
         </div>
         {node.nextNodes.length > 0 && (
           <div className={`flex flex-col border-l ml-6 pb-2 ${isCompleted ? 'border-indigo-300' : 'border-slate-200'}`}>
             {node.nextNodes.map(nextId => (
               <div key={`${node.id}-${nextId}`}>
                 {renderConnectedNodes(nextId, depth + 1, newVisited)}
               </div>
             ))}
           </div>
         )}
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto w-full pb-12">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
           <button onClick={onBack} className="p-2 bg-slate-100 text-slate-500 hover:bg-slate-200 rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-black text-slate-900">{record.title}</h1>
              <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${getStatusColor(record.status)}`}>
                {record.status}
              </span>
            </div>
            <p className="text-sm font-medium text-slate-500">ID: {record.id} • Version: {record.version}</p>
          </div>
        </div>
        <button onClick={onEdit} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-sm font-bold text-sm transition-colors">
          <Edit3 className="w-4 h-4" /> Edit Flowchart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:p-6">
         <div className="lg:col-span-3 space-y-6">
            
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4 sm:p-6">
               <h3 className="font-bold text-slate-800 uppercase tracking-widest text-sm mb-4">Description</h3>
               {record.description ? (
                 <p className="text-sm text-slate-700 leading-relaxed">{record.description}</p>
               ) : (
                 <p className="text-sm text-slate-400 italic">No description provided.</p>
               )}
            </div>

            <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4 sm:p-6 overflow-x-auto">
               <h3 className="font-bold text-slate-800 uppercase tracking-widest text-sm mb-6 flex items-center gap-2">
                 <Workflow className="w-4 h-4 text-indigo-600" /> Process Steps
               </h3>
               {record.nodes.length === 0 ? (
                 <div className="text-center py-12 text-slate-500">
                   <p className="font-medium text-slate-900 mb-1">No steps maped yet.</p>
                   <p className="text-sm">Edit the flow to add steps and connections.</p>
                 </div>
               ) : (
                 <div className="min-w-max pb-4 pl-4 pr-12">
                   {startNodes.map(node => (
                     <div key={node.id} className="mb-12 last:mb-0">
                       {renderConnectedNodes(node.id)}
                     </div>
                   ))}
                 </div>
               )}
            </div>

         </div>

         <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4 sm:p-6">
               <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest mb-4 border-b border-slate-100 pb-2">Record Info</h3>
               
               <div className="space-y-4">
                 <div className="flex items-start gap-3">
                   <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                     <Building className="w-4 h-4 text-indigo-600" />
                   </div>
                   <div>
                     <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">Department</p>
                     <p className="text-sm font-bold text-slate-900">{record.department}</p>
                   </div>
                 </div>
                 
                 <div className="flex items-start gap-3">
                   <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                     <User className="w-4 h-4 text-blue-600" />
                   </div>
                   <div>
                     <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">Author</p>
                     <p className="text-sm font-bold text-slate-900">{record.author}</p>
                   </div>
                 </div>

                 <div className="flex items-start gap-3">
                   <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                     <Calendar className="w-4 h-4 text-slate-600" />
                   </div>
                   <div>
                     <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">Dates</p>
                     <p className="text-xs text-slate-700"><span className="font-medium">Created:</span> {record.dateCreated}</p>
                     <p className="text-xs text-slate-700"><span className="font-medium">Modified:</span> {record.dateLastModified}</p>
                   </div>
                 </div>

               </div>
            </div>
            
            <div className="bg-slate-50 border border-slate-200 rounded-xl shadow-sm p-4">
              <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-3">Legend</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className={`w-6 h-6 border flex items-center justify-center p-0.5 text-[6px] ${getNodeStyle('start')}`}><span className={getInnerStyle('start')}>ST</span></div>
                  <span className="text-xs text-slate-600">Start Step</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-6 h-6 border flex items-center justify-center p-0.5 text-[6px] ${getNodeStyle('process')}`}><span className={getInnerStyle('process')}>PR</span></div>
                  <span className="text-xs text-slate-600">Process</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-6 h-6 border flex items-center justify-center p-0.5 text-[6px] ${getNodeStyle('decision')} ml-[4px]`} style={{ width: '18px', height: '18px' }}><span className={getInnerStyle('decision')}>?</span></div>
                  <span className="text-xs text-slate-600 ml-[4px]">Decision</span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <div className={`w-6 h-6 border flex items-center justify-center p-0.5 text-[6px] ${getNodeStyle('document')}`}><span className={getInnerStyle('document')}>DC</span></div>
                  <span className="text-xs text-slate-600">Document</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-6 h-6 border flex items-center justify-center p-0.5 text-[6px] ${getNodeStyle('end')}`}><span className={getInnerStyle('end')}>EN</span></div>
                  <span className="text-xs text-slate-600">End Step</span>
                </div>
              </div>
            </div>
         </div>
      </div>
    </div>
  );
}
