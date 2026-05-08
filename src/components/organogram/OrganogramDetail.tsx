import React from 'react';
import { OrganogramRecord, OrganogramNode } from './types';
import { ArrowLeft, Edit3, User, Building, Calendar, Users, Briefcase } from 'lucide-react';

interface OrganogramDetailProps {
  record: OrganogramRecord;
  onBack: () => void;
  onEdit: () => void;
}

export function OrganogramDetail({ record, onBack, onEdit }: OrganogramDetailProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Published': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Draft': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Archived': return 'bg-rose-100 text-rose-800 border-rose-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  // Build Hierarchy
  const buildTree = (parentId: string | null): OrganogramNode[] => {
    return record.nodes.filter(n => n.parentId === parentId);
  };

  const roots = buildTree(null);

  const renderNode = (node: OrganogramNode) => {
    const children = buildTree(node.id);
    
    return (
      <div key={node.id} className="flex flex-col items-center">
        {/* Node Box */}
        <div className="bg-white border-2 border-indigo-200 rounded-xl p-4 shadow-sm min-w-[200px] text-center z-10 relative">
           <div className="mx-auto w-10 h-10 bg-indigo-50 rounded-full flex items-center justify-center mb-2">
             <User className="w-5 h-5 text-indigo-600" />
           </div>
           <h4 className="font-black text-slate-800 text-sm">{node.role}</h4>
           {node.name && <p className="text-xs font-medium text-slate-500 mt-1">{node.name}</p>}
        </div>

        {/* Children */}
        {children.length > 0 && (
          <div className="relative flex flex-col items-center mt-6">
            {/* Vertical Line down from parent */}
            <div className="absolute -top-4 sm:p-6 left-1/2 w-0.5 h-6 bg-indigo-200 -translate-x-1/2"></div>
            
            <div className="flex gap-4 sm:p-6 lg:p-8 relative pt-6">
              {/* Horizontal Line connecting children */}
              {children.length > 1 && (
                <div className="absolute top-0 left-0 w-full h-0.5 bg-indigo-200" 
                     style={{ 
                       width: `calc(100% - ${100 / children.length}%)`, 
                       left: `calc(${50 / children.length}%)` 
                     }}></div>
              )}
              
              {children.map(child => (
                <div key={child.id} className="relative flex flex-col items-center">
                   {/* Vertical Line down to child */}
                   <div className="absolute top-0 left-1/2 w-0.5 h-6 bg-indigo-200 -translate-x-1/2 -mt-6"></div>
                   {renderNode(child)}
                </div>
              ))}
            </div>
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
          <Edit3 className="w-4 h-4" /> Edit Organogram
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:p-6">
         <div className="lg:col-span-3 space-y-6">
            
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4 sm:p-6 overflow-x-auto min-h-[400px]">
               {roots.length === 0 ? (
                 <div className="flex flex-col items-center justify-center h-full text-slate-500 py-12">
                   <Briefcase className="w-12 h-12 text-slate-300 mb-4" />
                   <p className="font-medium text-slate-900">No roles mapped</p>
                   <p className="text-sm mt-1 text-center max-w-md text-slate-500">Edit this organogram to add roles and build the hierarchy.</p>
                 </div>
               ) : (
                 <div className="flex flex-col items-center pt-4 pb-8 min-w-max">
                   <div className="flex gap-12">
                     {roots.map(root => renderNode(root))}
                   </div>
                 </div>
               )}
            </div>

            <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4 sm:p-6">
               <h3 className="font-bold text-slate-800 uppercase tracking-widest text-sm mb-4">Description</h3>
               {record.description ? (
                 <p className="text-sm text-slate-700 leading-relaxed">{record.description}</p>
               ) : (
                 <p className="text-sm text-slate-400 italic">No description provided.</p>
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
                   <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                     <Calendar className="w-4 h-4 text-slate-600" />
                   </div>
                   <div>
                     <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">Dates</p>
                     <p className="text-xs text-slate-700"><span className="font-medium">Created:</span> {record.dateCreated}</p>
                     <p className="text-xs text-slate-700"><span className="font-medium">Modified:</span> {record.dateLastModified}</p>
                   </div>
                 </div>

                 <div className="flex items-start gap-3">
                   <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                     <Users className="w-4 h-4 text-amber-600" />
                   </div>
                   <div>
                     <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">Total Mapping</p>
                     <p className="text-sm font-bold text-slate-900">{record.nodes.length} Roles Defined</p>
                   </div>
                 </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
