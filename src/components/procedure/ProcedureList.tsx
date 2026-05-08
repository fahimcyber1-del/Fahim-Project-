import React from 'react';
import { ProcedureRecord } from './types';
import { StandardListView } from '../layout/StandardListView';
import { FileText, Eye, Edit3, Trash2 } from 'lucide-react';

interface ProcedureListProps {
  records: ProcedureRecord[];
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onNew: () => void;
}

export function ProcedureList({ records, onView, onEdit, onDelete, onNew }: ProcedureListProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Published': return 'bg-emerald-100 text-emerald-800';
      case 'Approved': return 'bg-blue-100 text-blue-800';
      case 'Under Review': return 'bg-amber-100 text-amber-800';
      case 'Archived': return 'bg-rose-100 text-rose-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  const columns = [
    {
      header: 'Procedure ID',
      accessor: 'id' as keyof ProcedureRecord,
      renderer: (row: ProcedureRecord) => (
        <div className="font-semibold text-slate-900">{row.id} <span className="text-slate-500 text-xs ml-1">v{row.version}</span></div>
      )
    },
    {
      header: 'Title',
      accessor: 'title' as keyof ProcedureRecord,
      renderer: (row: ProcedureRecord) => (
         <div>
            <div className="font-semibold text-slate-900 line-clamp-1">{row.title}</div>
            <div className="text-xs text-slate-500 line-clamp-1 mt-0.5">{row.purpose}</div>
         </div>
      )
    },
    {
      header: 'Type',
      accessor: 'type' as keyof ProcedureRecord,
    },
    {
      header: 'Author',
      accessor: 'author' as keyof ProcedureRecord,
    },
    {
      header: 'Department',
      accessor: 'department' as keyof ProcedureRecord,
    },
    {
      header: 'Status',
      accessor: 'status' as keyof ProcedureRecord,
      renderer: (row: ProcedureRecord) => (
        <span className={`px-2 py-1 rounded-md text-xs font-bold ${getStatusColor(row.status)}`}>
          {row.status}
        </span>
      )
    }
  ];

  const GridCard = ({ data, onAction }: { data: ProcedureRecord, onAction: (action: string, id: string) => void }) => (
    <div className="group bg-white border border-slate-200 hover:border-indigo-300 rounded-xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col h-full">
      <div className="flex justify-between items-start mb-3">
        <div className="flex flex-col">
           <span className="text-xs font-bold text-slate-500">{data.id} • v{data.version}</span>
        </div>
      </div>

      <div className="mb-4 flex-1">
        <h3 className="font-bold text-slate-900 text-lg leading-tight mb-2 line-clamp-2" title={data.title}>
          {data.title}
        </h3>
        <p className="text-xs text-slate-500 line-clamp-2">{data.purpose}</p>
      </div>

      <div className="mt-auto pt-4 border-t border-slate-100 grid grid-cols-2 gap-4">
        <div>
          <p className="text-[10px] uppercase tracking-wider font-bold text-slate-500 mb-1">Status & Type</p>
          <div className="flex items-center gap-1.5">
            <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${getStatusColor(data.status)}`}>
              {data.status}
            </span>
            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-600 uppercase tracking-wider truncate">
               {data.type}
            </span>
          </div>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-wider font-bold text-slate-500 mb-1">Author</p>
          <div className="text-xs font-medium text-slate-700 truncate" title={data.author}>
            {data.author}
          </div>
        </div>
      </div>
      <div className="mt-4 flex gap-2 w-full">
         <button onClick={() => onAction('view', data.id)} className="flex-1 py-1.5 text-center bg-slate-50 hover:bg-indigo-50 text-slate-600 hover:text-indigo-600 rounded-lg text-sm font-semibold transition-colors">View</button>
         <button onClick={() => onAction('edit', data.id)} className="flex-1 py-1.5 text-center bg-slate-50 hover:bg-indigo-50 text-slate-600 hover:text-indigo-600 rounded-lg text-sm font-semibold transition-colors">Edit</button>
      </div>
    </div>
  );

  return (
    <StandardListView
      title="Procedures"
      description="List of all internal procedures"
      data={records}
      columns={columns}
      gridComponent={GridCard}
      idAccessor={(row) => row.id}
      onView={onView}
      onEdit={onEdit}
      onDelete={onDelete}
      onCreate={onNew}
      createButtonLabel="New Procedure"
    />
  );
}
