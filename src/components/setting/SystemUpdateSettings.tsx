import React, { useState, useEffect } from 'react';
import { RefreshCw, Download, AlertTriangle, CheckCircle2, Server, Clock, FileText, ChevronRight, Activity } from 'lucide-react';

export function SystemUpdateSettings() {
  const [checkingForUpdates, setCheckingForUpdates] = useState(false);
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [updateProgress, setUpdateProgress] = useState(0);
  const [updateStatus, setUpdateStatus] = useState<string>('');
  
  const currentVersion = 'v2.1.4';
  const latestVersion = 'v2.2.0';

  const checkForUpdates = () => {
    setCheckingForUpdates(true);
    setUpdateAvailable(false);
    setTimeout(() => {
      setCheckingForUpdates(false);
      setUpdateAvailable(true);
    }, 2000);
  };

  const startUpdate = () => {
    setUpdating(true);
    setUpdateProgress(0);
    setUpdateStatus('Downloading update packages...');
    
    // Simulate update process
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 10) + 5;
      
      if (progress >= 30 && progress < 60) {
        setUpdateStatus('Applying database migrations...');
      } else if (progress >= 60 && progress < 90) {
        setUpdateStatus('Updating core system files...');
      } else if (progress >= 90) {
        setUpdateStatus('Restarting services...');
      }

      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setTimeout(() => {
          setUpdating(false);
          setUpdateAvailable(false);
          alert('System updated successfully to ' + latestVersion);
          window.location.reload(); // Simulate restart
        }, 1000);
      }
      setUpdateProgress(progress);
    }, 800);
  };

  return (
    <div className="p-6 lg:p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto space-y-8">
      <div>
        <h2 className="text-xl font-bold text-slate-900 mb-1">System Updates</h2>
        <p className="text-sm text-slate-500">Check for software updates, view release notes, and install new versions.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:p-6">
        {/* Current Version */}
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          <div className="p-4 sm:p-6 border-b border-slate-100 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-500 mb-1">Current Version</p>
              <h3 className="text-2xl font-black text-slate-900">{currentVersion}</h3>
            </div>
            <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600">
              <Server className="w-6 h-6" />
            </div>
          </div>
          <div className="p-4 bg-slate-50 flex items-center justify-between">
            <span className="text-sm font-medium text-slate-600 flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-400" /> Last checked: 2 hours ago
            </span>
            <button 
              onClick={checkForUpdates}
              disabled={checkingForUpdates || updating}
              className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-2 disabled:opacity-50 shadow-sm"
            >
              <RefreshCw className={`w-4 h-4 ${checkingForUpdates ? 'animate-spin text-indigo-500' : ''}`} />
              {checkingForUpdates ? 'Checking...' : 'Check for Updates'}
            </button>
          </div>
        </div>

        {/* Update Status / Action */}
        {checkingForUpdates ? (
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 sm:p-6 flex flex-col items-center justify-center text-slate-500 min-h-[160px]">
             <RefreshCw className="w-8 h-8 animate-spin text-indigo-500 mb-3" />
             <p className="font-semibold text-slate-700">Communicating with update server...</p>
          </div>
        ) : updateAvailable ? (
          <div className="bg-white border-2 border-indigo-200 rounded-xl overflow-hidden shadow-sm relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-indigo-500"></div>
            <div className="p-4 sm:p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-indigo-100 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-2">
                    Update Available
                  </span>
                  <h3 className="text-xl font-bold text-slate-900">Version {latestVersion}</h3>
                  <p className="text-sm text-slate-600 mt-1">This update contains important security patches and new features.</p>
                </div>
                {!updating && (
                  <button 
                    onClick={startUpdate}
                    className="shrink-0 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-colors shadow-sm flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" /> Install Now
                  </button>
                )}
              </div>

              {updating && (
                <div className="space-y-3 pt-2">
                   <div className="flex justify-between text-sm font-semibold mb-1">
                      <span className="text-indigo-600">{updateStatus}</span>
                      <span className="text-slate-700">{updateProgress}%</span>
                   </div>
                   <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-indigo-500 transition-all duration-300"
                        style={{ width: `${updateProgress}%` }}
                      ></div>
                   </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-6 flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mb-3">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Your system is up to date</h3>
            <p className="text-sm text-slate-500 mt-1 max-w-xs">You are currently running the latest version of the QMS ERP platform.</p>
          </div>
        )}
      </div>

      {/* Release Notes */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <h3 className="text-sm font-bold text-slate-900 p-4 border-b border-slate-200 bg-slate-50 flex items-center gap-2">
          <FileText className="w-4 h-4 text-slate-500" /> Release Notes: Version {latestVersion}
        </h3>
        <div className="p-0">
          <ul className="divide-y divide-slate-100">
             <li className="p-4 sm:p-5 hover:bg-slate-50 transition-colors flex items-start gap-3">
               <div className="mt-0.5 p-1.5 bg-emerald-100 text-emerald-700 rounded text-xs font-bold shrink-0">NEW</div>
               <div>
                 <h4 className="font-semibold text-slate-900 text-sm">Advanced Audit Trail Filtering</h4>
                 <p className="text-sm text-slate-600 mt-1">Users can now filter audit logs by specific date ranges, action types, and user roles simultaneously.</p>
               </div>
             </li>
             <li className="p-4 sm:p-5 hover:bg-slate-50 transition-colors flex items-start gap-3">
               <div className="mt-0.5 p-1.5 bg-blue-100 text-blue-700 rounded text-xs font-bold shrink-0">IMPROVED</div>
               <div>
                 <h4 className="font-semibold text-slate-900 text-sm">Automated Backup Performance</h4>
                 <p className="text-sm text-slate-600 mt-1">Reduced memory consumption during large database backups by optimizing the compression algorithm.</p>
               </div>
             </li>
             <li className="p-4 sm:p-5 hover:bg-slate-50 transition-colors flex items-start gap-3">
               <div className="mt-0.5 p-1.5 bg-rose-100 text-rose-700 rounded text-xs font-bold shrink-0">FIXED</div>
               <div>
                 <h4 className="font-semibold text-slate-900 text-sm">Notification State Persistence</h4>
                 <p className="text-sm text-slate-600 mt-1">Resolved an issue where users sporadically stopped receiving in-app toasts after extended sessions.</p>
               </div>
             </li>
             <li className="p-4 sm:p-5 hover:bg-slate-50 transition-colors flex items-start gap-3">
               <div className="mt-0.5 p-1.5 bg-indigo-100 text-indigo-700 rounded text-xs font-bold shrink-0">SECURITY</div>
               <div>
                 <h4 className="font-semibold text-slate-900 text-sm">Session Validation Enhancements</h4>
                 <p className="text-sm text-slate-600 mt-1">Strengthened session validation mechanisms for Super Admin privileges.</p>
               </div>
             </li>
          </ul>
        </div>
      </div>

    </div>
  );
}
