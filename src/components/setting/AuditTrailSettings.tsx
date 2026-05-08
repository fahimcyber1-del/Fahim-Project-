import React, { useState, useEffect, useMemo } from 'react';
import { History, Search, Filter, ArrowLeft, ArrowRight, FileText, UserPlus, Trash2, Edit, RefreshCw } from 'lucide-react';

// Mock Audit Log Data
const MOCK_AUDIT_LOGS = Array.from({ length: 156 }, (_, i) => {
  const actions = ['CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT', 'EXPORT'];
  const modules = ['Task Management', 'Incoming QC', 'Users & Roles', 'System Settings', 'Defect Library', 'Cutting QC'];
  const users = ['Admin User', 'John Doe', 'Jane Smith', 'Mike Johnson'];
  
  const date = new Date();
  date.setHours(date.getHours() - Math.floor(Math.random() * 720)); // Up to 30 days ago
  
  const action = actions[Math.floor(Math.random() * actions.length)];
  const status = Math.random() > 0.1 ? 'Success' : 'Failed';
  
  return {
    id: `log-${i + 1}`,
    timestamp: date.toISOString(),
    user: users[Math.floor(Math.random() * users.length)],
    action: action,
    module: modules[Math.floor(Math.random() * modules.length)],
    details: `${action} operation performed on ${modules[Math.floor(Math.random() * modules.length)]} module`,
    ipAddress: `192.168.1.${Math.floor(Math.random() * 255)}`,
    status: status
  };
}).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

export function AuditTrailSettings() {
  const [logs, setLogs] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  useEffect(() => {
    try {
      const storedLogs = localStorage.getItem('aqm_activity_log');
      if (storedLogs) {
        const parsed = JSON.parse(storedLogs);
        
        // Map older simple formats if any
        const formattedLogs = parsed.map((log: any, idx: number) => {
          if (log.action && !log.id) {
            return {
               id: `log-migrated-${idx}`,
               timestamp: new Date().toISOString(),
               user: 'System',
               action: 'UPDATE',
               module: 'System',
               details: log.action || 'Unknown action',
               ipAddress: '127.0.0.1',
               status: 'Success'
            };
          }
          return log;
        });
        
        setLogs(formattedLogs.sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
      } else {
        setLogs(MOCK_AUDIT_LOGS);
        localStorage.setItem('aqm_activity_log', JSON.stringify(MOCK_AUDIT_LOGS));
      }
    } catch (error) {
      setLogs(MOCK_AUDIT_LOGS);
    }
  }, []);

  // Filtering
  const filteredLogs = useMemo(() => {
    return logs.filter(log => {
      const matchesSearch = 
        log.user.toLowerCase().includes(searchTerm.toLowerCase()) || 
        log.module.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.details.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesAction = actionFilter === 'ALL' || log.action === actionFilter;
      
      return matchesSearch && matchesAction;
    });
  }, [logs, searchTerm, actionFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);
  const paginatedLogs = filteredLogs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'CREATE': return <UserPlus className="w-4 h-4 text-emerald-500" />;
      case 'UPDATE': return <Edit className="w-4 h-4 text-blue-500" />;
      case 'DELETE': return <Trash2 className="w-4 h-4 text-rose-500" />;
      case 'LOGIN': return <ArrowRight className="w-4 h-4 text-indigo-500" />;
      case 'LOGOUT': return <ArrowLeft className="w-4 h-4 text-slate-500" />;
      case 'EXPORT': return <FileText className="w-4 h-4 text-amber-500" />;
      default: return <History className="w-4 h-4 text-slate-500" />;
    }
  };

  const formatDate = (isoString: string) => {
    const d = new Date(isoString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit', second: '2-digit'
    }).format(d);
  };

  const exportCSV = () => {
    const headers = ['Timestamp', 'User', 'Action', 'Module', 'Status', 'Details', 'IP Address'];
    const csvContent = [
      headers.join(','),
      ...filteredLogs.map(log => 
        [
          log.timestamp,
          `"${log.user}"`,
          log.action,
          `"${log.module}"`,
          log.status,
          `"${log.details}"`,
          log.ipAddress
        ].join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `audit_logs_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-6 lg:p-4 sm:p-6 lg:p-8 space-y-6 flex flex-col h-full min-h-0 bg-white rounded-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
        <div>
          <h2 className="text-xl font-bold text-slate-900 mb-1">Audit Trail</h2>
          <p className="text-sm text-slate-500">Track and monitor all user activities across the application.</p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={exportCSV}
            className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <FileText className="w-4 h-4" /> Export CSV
          </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 shrink-0 bg-slate-50 p-4 rounded-xl border border-slate-200">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            type="text" 
            placeholder="Search users, modules, or details..." 
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500 bg-white"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select 
            value={actionFilter}
            onChange={(e) => { setActionFilter(e.target.value); setCurrentPage(1); }}
            className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500 bg-white"
          >
            <option value="ALL">All Actions</option>
            <option value="CREATE">Create</option>
            <option value="UPDATE">Update</option>
            <option value="DELETE">Delete</option>
            <option value="LOGIN">Login</option>
            <option value="LOGOUT">Logout</option>
            <option value="EXPORT">Export</option>
          </select>
        </div>
      </div>

      <div className="flex-1 min-h-0 border border-slate-200 rounded-xl overflow-hidden flex flex-col">
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 border-b border-slate-200 sticky top-0 z-10 shadow-sm">
              <tr>
                <th className="px-4 py-3 font-bold text-slate-600">Timestamp</th>
                <th className="px-4 py-3 font-bold text-slate-600">User</th>
                <th className="px-4 py-3 font-bold text-slate-600">Action</th>
                <th className="px-4 py-3 font-bold text-slate-600">Module</th>
                <th className="px-4 py-3 font-bold text-slate-600">Status</th>
                <th className="px-4 py-3 font-bold text-slate-600">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {paginatedLogs.map(log => (
                <tr key={log.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 text-slate-500 text-xs font-mono">{formatDate(log.timestamp)}</td>
                  <td className="px-4 py-3 font-medium text-slate-900">{log.user}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      {getActionIcon(log.action)}
                      <span className="font-semibold text-slate-700 text-xs">{log.action}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{log.module}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      log.status === 'Success' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                    }`}>
                      {log.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-500 truncate max-w-[200px]" title={log.details}>
                    {log.details}
                  </td>
                </tr>
              ))}
              {paginatedLogs.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-slate-500">
                    <History className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                    No audit logs found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */ }
        <div className="px-4 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between mt-auto">
          <div className="text-sm text-slate-500 shrink-0">
            Showing <span className="font-bold text-slate-900">{filteredLogs.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}</span> to <span className="font-bold text-slate-900">{Math.min(currentPage * itemsPerPage, filteredLogs.length)}</span> of <span className="font-bold text-slate-900">{filteredLogs.length}</span> entries
          </div>
          <div className="flex gap-1 shrink-0 overflow-x-auto">
            <button 
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1.5 rounded-md border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium transition-colors"
            >
              Prev
            </button>
            
            {/* Simple pagination logic for demo */}
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              // Calculate logic to show nearby pages
              let pageNum = i + 1;
              if (totalPages > 5 && currentPage > 3) {
                pageNum = currentPage - 2 + i;
                if (pageNum > totalPages) pageNum = totalPages - (4 - i);
              }
              
              if (pageNum > totalPages) return null;

              return (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`min-w-[32px] px-2 py-1.5 rounded-md text-sm font-semibold transition-colors
                    ${currentPage === pageNum 
                      ? 'bg-indigo-600 text-white border border-indigo-600' 
                      : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50'}`}
                >
                  {pageNum}
                </button>
              );
            })}
            
            <button 
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages || totalPages === 0}
              className="px-3 py-1.5 rounded-md border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
