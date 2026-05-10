import React, { useState } from 'react';
import { RiskRecord, RiskLevel } from './types';
import { Search, Filter, Trash2, Edit3, Eye, FileSpreadsheet, CheckSquare } from 'lucide-react';

interface RiskAssessmentManageProps {
  records: RiskRecord[];
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (ids: string | string[]) => void;
}

export function RiskAssessmentManage({ records, onView, onEdit, onDelete }: RiskAssessmentManageProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const filteredRecords = records.filter(record => {
    const matchesSearch = 
      record.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      record.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.mitigationOwner.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'All' || record.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(filteredRecords.map(r => r.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(selectedId => selectedId !== id) : [...prev, id]
    );
  };

  const handleBulkDelete = () => {
    if (selectedIds.length === 0) return;
    if (window.confirm('Are you sure you want to delete the selected records?')) {
      onDelete(selectedIds);
      setSelectedIds([]);
    }
  };

  const exportToCSV = () => {
    const headers = ['ID', 'Title', 'Date Assessed', 'Category', 'Risk Level', 'Score', 'Owner', 'Status'];
    const rows = filteredRecords.map(r => [
      r.id,
      `"${r.title.replace(/"/g, '""')}"`,
      r.dateAssessed,
      r.category,
      r.riskLevel,
      r.riskScore,
      `"${r.mitigationOwner.replace(/"/g, '""')}"`,
      r.status
    ]);
    
    const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `risk_assessments_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const getLevelColor = (level: RiskLevel) => {
    switch (level) {
      case 'Critical': return 'bg-rose-100 text-rose-800';
      case 'High': return 'bg-orange-100 text-orange-800';
      case 'Medium': return 'bg-amber-100 text-amber-800';
      case 'Low': return 'bg-emerald-100 text-emerald-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  return (
    <div className="flex flex-col h-full bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden min-h-0">
      <div className="p-4 border-b border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search ID, title, or owner..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500 w-full sm:w-64"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500"
            >
              <option value="All">All Statuses</option>
              <option value="Draft">Draft</option>
              <option value="Active">Active</option>
              <option value="Mitigated">Mitigated</option>
              <option value="Closed">Closed</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {selectedIds.length > 0 && (
            <button
              onClick={handleBulkDelete}
              className="flex items-center gap-2 px-3 py-2 bg-rose-50 text-rose-600 rounded-lg text-sm font-bold hover:bg-rose-100 transition-colors border border-rose-200"
            >
              <Trash2 className="w-4 h-4" /> Delete ({selectedIds.length})
            </button>
          )}
          <button
            onClick={exportToCSV}
            className="flex items-center gap-2 px-3 py-2 bg-emerald-50 text-emerald-700 rounded-lg text-sm font-bold hover:bg-emerald-100 transition-colors border border-emerald-200"
          >
            <FileSpreadsheet className="w-4 h-4" /> Export CSV
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto bg-white min-h-0">
        <table className="min-w-full text-left text-sm whitespace-nowrap">
          <thead className="sticky top-0 bg-slate-50 border-b border-slate-200 z-10">
            <tr>
              <th className="px-6 py-4 font-bold text-slate-600">
                <input 
                  type="checkbox" 
                  checked={selectedIds.length === filteredRecords.length && filteredRecords.length > 0}
                  onChange={handleSelectAll}
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
              </th>
              <th className="px-6 py-4 font-bold text-slate-600">Assessment Details</th>
              <th className="px-6 py-4 font-bold text-slate-600">Category</th>
              <th className="px-6 py-4 font-bold text-slate-600">Risk Level</th>
              <th className="px-6 py-4 font-bold text-slate-600">Owner</th>
              <th className="px-6 py-4 font-bold text-slate-600">Status</th>
              <th className="px-6 py-4 font-bold text-slate-600 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredRecords.length > 0 ? (
              filteredRecords.map((record) => (
                <tr key={record.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4">
                    <input 
                      type="checkbox" 
                      checked={selectedIds.includes(record.id)}
                      onChange={() => handleSelect(record.id)}
                      className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors cursor-pointer" onClick={() => onView(record.id)}>
                        {record.title}
                      </span>
                      <span className="text-xs text-slate-500">{record.id} • {record.dateAssessed}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-700 font-medium text-xs uppercase tracking-wider">
                    {record.category}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                       <span className={`px-2 py-0.5 rounded text-xs font-bold ${getLevelColor(record.riskLevel)}`}>
                         {record.riskLevel}
                       </span>
                       <span className="text-xs text-slate-500">({record.riskScore})</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-semibold text-slate-800">{record.mitigationOwner || '-'}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-md text-xs font-bold
                      ${record.status === 'Mitigated' ? 'bg-blue-100 text-blue-800' :
                        record.status === 'Closed' ? 'bg-emerald-100 text-emerald-800' :
                        record.status === 'Active' ? 'bg-amber-100 text-amber-800' :
                        'bg-slate-100 text-slate-800'}`}>
                      {record.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => onView(record.id)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" title="View">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button onClick={() => onEdit(record.id)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit">
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button onClick={() => { if(window.confirm('Are you sure you want to delete this record?')) onDelete(record.id); }} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors" title="Delete">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                  <div className="flex flex-col items-center justify-center">
                    <CheckSquare className="w-8 h-8 text-slate-300 mb-2" />
                    <p className="font-medium text-slate-900">No assessments found</p>
                    <p className="text-sm mt-1">Try adjusting your filters or search query.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
