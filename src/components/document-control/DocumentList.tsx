import React, { useState } from 'react';
import { DocumentRecord } from './types';
import { Filter, Eye, Edit3, Trash2 } from 'lucide-react';
import { StandardListView } from '../layout/StandardListView';

interface DocumentListProps {
  records: DocumentRecord[];
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onNew: () => void;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Published': return 'bg-emerald-100 text-emerald-800';
    case 'Approved': return 'bg-blue-100 text-blue-800';
    case 'In Review': return 'bg-amber-100 text-amber-800';
    case 'Obsolete': return 'bg-rose-100 text-rose-800';
    default: return 'bg-slate-100 text-slate-800';
  }
};

const DocumentGridCard: React.FC<{ data: DocumentRecord, onAction: (action: string, id: string) => void }> = ({ data, onAction }) => (
  <div className="group bg-white border border-slate-200 hover:border-indigo-300 rounded-xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col h-full relative">
    <div className="flex justify-between items-start mb-3">
      <div className="flex flex-col">
          <span className="text-xs font-bold text-slate-500">{data.id} • V{data.version}</span>
      </div>
      <div className="flex gap-1 visible sm:invisible group-hover:visible transition-opacity absolute right-4 top-4 bg-white/90 backdrop-blur-sm p-1 rounded-lg border border-slate-100 shadow-sm">
        <button onClick={() => onAction('view', data.id)} className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 rounded-md transition-colors" title="View Details">
          <Eye className="w-4 h-4" />
        </button>
        <button onClick={() => onAction('edit', data.id)} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-slate-100 rounded-md transition-colors" title="Edit">
          <Edit3 className="w-4 h-4" />
        </button>
        <button onClick={() => onAction('delete', data.id)} className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-slate-100 rounded-md transition-colors" title="Delete">
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>

    <div className="mb-4 flex-1 mt-2">
      <h3 className="font-bold text-slate-900 text-lg leading-tight mb-2 line-clamp-2" title={data.title}>
        {data.title}
      </h3>
      <p className="text-xs text-slate-500 line-clamp-2">{data.description}</p>
    </div>

    <div className="mt-auto pt-4 border-t border-slate-100 grid grid-cols-2 gap-4">
      <div>
        <p className="text-[10px] uppercase tracking-wider font-bold text-slate-500 mb-1">Status & Category</p>
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${getStatusColor(data.status)}`}>
            {data.status}
          </span>
          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-600 uppercase tracking-wider truncate">
              {data.category}
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
  </div>
);

export function DocumentList({ records, onView, onEdit, onDelete, onNew }: DocumentListProps) {
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [filterCategory, setFilterCategory] = useState<string>('All');

  const filteredRecords = records.filter(record => {
    const matchesStatus = filterStatus === 'All' || record.status === filterStatus;
    const matchesCategory = filterCategory === 'All' || record.category === filterCategory;
    return matchesStatus && matchesCategory;
  });

  const columns = [
    { header: 'Document ID', accessor: 'id' as keyof DocumentRecord },
    { header: 'Title', accessor: 'title' as keyof DocumentRecord },
    { header: 'Version', accessor: (row: DocumentRecord) => `V${row.version}` },
    { header: 'Category', accessor: 'category' as keyof DocumentRecord },
    { 
      header: 'Status', 
      accessor: 'status' as keyof DocumentRecord,
      renderer: (row: DocumentRecord) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(row.status)}`}>
          {row.status}
        </span>
      )
    },
    { header: 'Author', accessor: 'author' as keyof DocumentRecord },
  ];

  const customFilters = (
    <div className="flex items-center gap-2">
      <Filter className="w-4 h-4 text-slate-400" />
      <select
        value={filterStatus}
        onChange={(e) => setFilterStatus(e.target.value)}
        className="px-3 py-1.5 border border-slate-300 bg-white rounded-lg text-sm focus:outline-none focus:border-indigo-500 hidden sm:block"
      >
        <option value="All">All Statuses</option>
        <option value="Draft">Draft</option>
        <option value="In Review">In Review</option>
        <option value="Approved">Approved</option>
        <option value="Published">Published</option>
        <option value="Obsolete">Obsolete</option>
      </select>
      <select
        value={filterCategory}
        onChange={(e) => setFilterCategory(e.target.value)}
        className="px-3 py-1.5 border border-slate-300 bg-white rounded-lg text-sm focus:outline-none focus:border-indigo-500 hidden sm:block"
      >
          <option value="All">All Categories</option>
          <option value="Policy">Policy</option>
          <option value="Procedure">Procedure</option>
          <option value="SOP">SOP</option>
          <option value="Form">Form</option>
          <option value="Manual">Manual</option>
          <option value="Guideline">Guideline</option>
          <option value="Other">Other</option>
      </select>
    </div>
  );

  return (
    <StandardListView
      title="Documents"
      description="List of all quality documents"
      data={filteredRecords}
      columns={columns}
      gridComponent={DocumentGridCard}
      idAccessor={(row) => row.id}
      onView={onView}
      onEdit={onEdit}
      onDelete={onDelete}
      onCreate={onNew}
      createButtonLabel="New Document"
      customFilters={customFilters}
    />
  );
}
