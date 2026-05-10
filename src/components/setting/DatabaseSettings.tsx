import React, { useState } from 'react';
import { Database, Download, UploadCloud, Clock, HardDrive, AlertTriangle, CheckCircle2, ShieldAlert, Trash2, Calendar, FileJson, FileText, Settings, Play } from 'lucide-react';

const MOCK_BACKUPS = [
  { id: 'b1', name: 'auto_backup_2026-05-04.zip', type: 'Automated', size: '142 MB', date: '2026-05-04 02:00:00', status: 'Completed' },
  { id: 'b2', name: 'manual_backup_2026-05-03.zip', type: 'Manual', size: '140 MB', date: '2026-05-03 14:30:00', status: 'Completed' },
  { id: 'b3', name: 'auto_backup_2026-05-03.zip', type: 'Automated', size: '140 MB', date: '2026-05-03 02:00:00', status: 'Completed' },
  { id: 'b4', name: 'auto_backup_2026-05-02.zip', type: 'Automated', size: '138 MB', date: '2026-05-02 02:00:00', status: 'Completed' },
  { id: 'b5', name: 'auto_backup_2026-05-01.zip', type: 'Automated', size: '135 MB', date: '2026-05-01 02:00:00', status: 'Completed' },
];

export function DatabaseSettings() {
  const [backups, setBackups] = useState(MOCK_BACKUPS);
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [isRestoring, setIsRestoring] = useState<string | null>(null);
  
  const [settings, setSettings] = useState({
    autoBackup: true,
    backupFrequency: 'daily',
    backupTime: '02:00',
    retentionDays: '30',
    compression: true,
    includeFiles: true,
  });

  const handleSettingChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const startManualBackup = () => {
    setIsBackingUp(true);
    setTimeout(() => {
      const newBackup = {
        id: `b${Date.now()}`,
        name: `manual_backup_${new Date().toISOString().split('T')[0]}.zip`,
        type: 'Manual',
        size: '145 MB',
        date: new Date().toISOString().replace('T', ' ').substring(0, 19),
        status: 'Completed'
      };
      setBackups([newBackup, ...backups]);
      setIsBackingUp(false);
    }, 2000);
  };

  const handleRestore = (id: string) => {
    if (window.confirm('Are you sure you want to restore this backup? This will overwrite your current database and all recent changes will be lost.')) {
      setIsRestoring(id);
      setTimeout(() => {
        setIsRestoring(null);
        alert('Database restored successfully.');
      }, 3000);
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this backup file? This action cannot be undone.')) {
      setBackups(backups.filter(b => b.id !== id));
    }
  };

  return (
    <div className="p-6 lg:p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 mb-1">Database & Backup</h2>
          <p className="text-sm text-slate-500">Manage database backups, automated schedules, and data restoration.</p>
        </div>
        <button 
          onClick={startManualBackup}
          disabled={isBackingUp}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-colors shadow-sm disabled:opacity-50"
        >
          {isBackingUp ? <span className="animate-spin text-white">⍥</span> : <Database className="w-4 h-4" />}
          {isBackingUp ? 'Creating Backup...' : 'Backup Now'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:p-6">
        
        {/* Settings Panel */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 p-4 border-b border-slate-200 bg-slate-50 flex items-center gap-2">
              <Settings className="w-4 h-4 text-slate-500" /> Automated Schedule
            </h3>
            <div className="p-5 space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-semibold text-slate-900">Enable Auto-Backup</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Run backups automatically</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" name="autoBackup" checked={settings.autoBackup} onChange={handleSettingChange} className="sr-only peer" />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
              </div>

              <div className={`space-y-4 pt-4 border-t border-slate-100 ${!settings.autoBackup ? 'opacity-50 pointer-events-none' : ''}`}>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Frequency</label>
                  <select name="backupFrequency" value={settings.backupFrequency} onChange={handleSettingChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500 bg-white">
                    <option value="hourly">Every Hour</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Time of Day</label>
                  <input type="time" name="backupTime" value={settings.backupTime} onChange={handleSettingChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500 bg-white" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Retention Policy</label>
                  <select name="retentionDays" value={settings.retentionDays} onChange={handleSettingChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500 bg-white">
                    <option value="7">Keep for 7 days</option>
                    <option value="14">Keep for 14 days</option>
                    <option value="30">Keep for 30 days</option>
                    <option value="90">Keep for 90 days</option>
                    <option value="365">Keep for 1 year</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="p-4 bg-slate-50 border-t border-slate-200">
               <button className="w-full py-2 bg-white border border-slate-300 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors">Save Settings</button>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 p-4 border-b border-slate-200 bg-slate-50 flex items-center gap-2">
               <HardDrive className="w-4 h-4 text-slate-500" /> Storage Usage
            </h3>
            <div className="p-5 space-y-4">
               <div>
                  <div className="flex justify-between text-sm mb-1">
                     <span className="font-semibold text-slate-700">Database Size</span>
                     <span className="text-slate-500">2.4 GB</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                     <div className="h-full bg-indigo-500 w-[15%]"></div>
                  </div>
               </div>
               <div>
                  <div className="flex justify-between text-sm mb-1">
                     <span className="font-semibold text-slate-700">Backup Storage</span>
                     <span className="text-slate-500">18.5 GB / 50 GB</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden flex">
                     <div className="h-full bg-blue-400 w-[20%]"></div>
                     <div className="h-full bg-blue-500 w-[15%]"></div>
                  </div>
               </div>
               <div className="pt-2">
                  <p className="text-xs text-slate-500 flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Storage health is good</p>
               </div>
            </div>
          </div>
        </div>

        {/* Action History & Main View */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
             <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm text-center">
                <div className="w-10 h-10 mx-auto bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mb-2">
                   <Clock className="w-5 h-5" />
                </div>
                <p className="text-xs text-slate-500 font-semibold mb-1 uppercase tracking-wider">Last Backup</p>
                <p className="font-bold text-slate-900 text-sm">Today, 02:00 AM</p>
             </div>
             <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm text-center">
                <div className="w-10 h-10 mx-auto bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mb-2">
                   <CheckCircle2 className="w-5 h-5" />
                </div>
                <p className="text-xs text-slate-500 font-semibold mb-1 uppercase tracking-wider">Status</p>
                <p className="font-bold text-slate-900 text-sm">Healthy</p>
             </div>
             <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm text-center">
                <div className="w-10 h-10 mx-auto bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-2">
                   <Calendar className="w-5 h-5" />
                </div>
                <p className="text-xs text-slate-500 font-semibold mb-1 uppercase tracking-wider">Next Backup</p>
                <p className="font-bold text-slate-900 text-sm">Tomorrow, 02:00 AM</p>
             </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
               <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                 <FileJson className="w-4 h-4 text-slate-500" /> Recent Backups
               </h3>
               <button className="text-xs font-semibold text-indigo-600 flex items-center gap-1 hover:underline">
                  <UploadCloud className="w-3.5 h-3.5" /> Upload Backup
               </button>
            </div>
            <div className="overflow-x-auto">
               <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-slate-50 border-b border-slate-200">
                     <tr>
                        <th className="px-4 py-3 font-bold text-slate-600">File Name</th>
                        <th className="px-4 py-3 font-bold text-slate-600">Type</th>
                        <th className="px-4 py-3 font-bold text-slate-600">Size</th>
                        <th className="px-4 py-3 font-bold text-slate-600">Date & Time</th>
                        <th className="px-4 py-3 font-bold text-slate-600 text-right">Actions</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                     {backups.map(backup => (
                        <tr key={backup.id} className="hover:bg-slate-50">
                           <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                 <FileText className="w-4 h-4 text-slate-400" />
                                 <span className="font-semibold text-slate-700">{backup.name}</span>
                              </div>
                           </td>
                           <td className="px-4 py-3">
                              <span className={`inline-flex px-2 py-0.5 rounded text-xs font-semibold ${backup.type === 'Manual' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'}`}>
                                 {backup.type}
                              </span>
                           </td>
                           <td className="px-4 py-3 text-slate-500">{backup.size}</td>
                           <td className="px-4 py-3 text-slate-500">{backup.date}</td>
                           <td className="px-4 py-3 text-right">
                              <div className="flex items-center justify-end gap-2">
                                 <button className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors" title="Download Backup">
                                    <Download className="w-4 h-4" />
                                 </button>
                                 <button 
                                    onClick={() => handleRestore(backup.id)} 
                                    disabled={isRestoring === backup.id}
                                    className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded transition-colors disabled:opacity-50" 
                                    title="Restore from Backup"
                                 >
                                    {isRestoring === backup.id ? <Play className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" fill="currentColor" />}
                                 </button>
                                 <button onClick={() => { if (window.confirm('Are you sure you want to delete this backup?')) handleDelete(backup.id); }} className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors" title="Delete Backup">
                                    <Trash2 className="w-4 h-4" />
                                 </button>
                              </div>
                           </td>
                        </tr>
                     ))}
                     {backups.length === 0 && (
                        <tr>
                           <td colSpan={5} className="px-4 py-12 text-center text-slate-500">
                              <HardDrive className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                              <p>No backups available.</p>
                           </td>
                        </tr>
                     )}
                  </tbody>
               </table>
            </div>
            
            {backups.length > 0 && (
               <div className="p-4 bg-slate-50 border-t border-slate-200 text-center">
                  <button className="text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors">View All History</button>
               </div>
            )}
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3">
             <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
             <div>
                <h4 className="text-sm font-bold text-amber-800">Database Restoration Warning</h4>
                <p className="text-sm text-amber-700 mt-1">Restoring a database will overwrite current data. This action cannot be paused or reverted once started. Ensure no users are actively submitting data during the restoration process.</p>
             </div>
          </div>
        </div>

      </div>
    </div>
  );
}
