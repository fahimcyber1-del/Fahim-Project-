import React, { useState, useEffect } from 'react';
import { Server, Globe, Download, Wifi, HardDrive, Cpu, ExternalLink, Database, Link as LinkIcon, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';

export function DeploymentSettings() {
  const currentUrl = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
  const [apiUrl, setApiUrl] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('global_api_url');
      if (saved) {
        setApiUrl(saved);
      }
    }
  }, []);

  const handleSaveApiUrl = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('global_api_url', apiUrl.trim());
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2000);
      
      // Optionally reload the page so changes take effect
      if (confirm('Settings saved. Would you like to reload the app to apply the new API Server URL?')) {
        window.location.reload();
      }
    }
  };

  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto space-y-8">
      <div>
        <h2 className="text-xl font-bold text-slate-900 mb-1">Deployment & Network Options</h2>
        <p className="text-sm text-slate-500">Configure how the system runs (Offline, Local Network, or Cloud Centralized).</p>
      </div>

      <Card className="border-indigo-100 bg-indigo-50/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-indigo-800">
            <LinkIcon className="w-5 h-5 text-indigo-600" />
            Global API Server URL
          </CardTitle>
          <CardDescription className="text-indigo-600/80">
            Set a custom Backend API URL. By default, the app connects to the same URL it is hosted on.
            If you host the UI on one device and the Backend on another (e.g. your PC's IP), enter the Backend URL here (e.g., http://192.168.1.50:3000).
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            <input 
              type="text" 
              value={apiUrl}
              onChange={(e) => setApiUrl(e.target.value)}
              placeholder="e.g. http://192.168.1.50:3000 (leave blank for local/relative)"
              className="flex-1 px-4 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
            />
            <button 
              onClick={handleSaveApiUrl}
              className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
            >
              {isSaved ? <CheckCircle2 className="w-4 h-4" /> : <Database className="w-4 h-4" />}
              {isSaved ? 'Saved!' : 'Save & Apply'}
            </button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-slate-200">
           <CardHeader>
             <CardTitle className="flex items-center gap-2 text-indigo-700">
                <HardDrive className="w-5 h-5" />
                Offline / Standalone PC
             </CardTitle>
             <CardDescription>
                Install the application offline on a single machine.
             </CardDescription>
           </CardHeader>
           <CardContent className="space-y-4">
              <p className="text-sm text-slate-600">
                You can run the Express server and SQLite database locally without an internet connection. 
                Data will be stored physically on this machine's hard drive.
              </p>
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 font-mono text-xs text-slate-700">
                 npm install<br/>
                 npm run build<br/>
                 npm start
              </div>
              <p className="text-sm font-medium text-slate-900 flex items-center gap-2">
                 <Cpu className="w-4 h-4 text-emerald-500" /> Currently running on: {currentUrl}
              </p>
           </CardContent>
        </Card>

        <Card className="border-slate-200">
           <CardHeader>
             <CardTitle className="flex items-center gap-2 text-indigo-700">
                <Wifi className="w-5 h-5" />
                Office Hosted (LAN)
             </CardTitle>
             <CardDescription>
                Make this app accessible to anyone on your local office Wi-Fi or LAN.
             </CardDescription>
           </CardHeader>
           <CardContent className="space-y-4">
              <p className="text-sm text-slate-600">
                The Express server by default binds to <code className="bg-slate-100 px-1 py-0.5 rounded">0.0.0.0:3000</code>, ensuring anyone 
                connected to your local network can access it by navigating to your PC's IP address.
              </p>
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 text-sm text-blue-800">
                 Find your IP (e.g., <strong>192.168.1.50</strong>) and tell other users to visit:<br/><br/>
                 <code className="bg-white px-2 py-1 rounded shadow-sm">http://192.168.1.50:3000</code>
              </div>
           </CardContent>
        </Card>

        <Card className="border-slate-200 md:col-span-2 bg-indigo-50/50">
           <CardHeader>
             <CardTitle className="flex items-center gap-2 text-indigo-700">
                <Server className="w-5 h-5" />
                Centralized Cloud Data Service (Recommended)
             </CardTitle>
             <CardDescription>
                Deploy the backend and database to a secure cloud platform for fully centralized management.
             </CardDescription>
           </CardHeader>
           <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                 <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center flex flex-col items-center">
                    <Globe className="w-8 h-8 text-blue-500 mb-2" />
                    <h4 className="font-bold text-slate-800 text-sm">Google Cloud Run</h4>
                    <p className="text-xs text-slate-500 mt-2">Containerized auto-scaling deployment. Perfect for Express apps.</p>
                 </div>
                 <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center flex flex-col items-center">
                    <Database className="w-8 h-8 text-emerald-500 mb-2" />
                    <h4 className="font-bold text-slate-800 text-sm">Migrate to Postgres/MySQL</h4>
                    <p className="text-xs text-slate-500 mt-2">Move from SQLite to Cloud SQL for robust concurrent multi-user database.</p>
                 </div>
                 <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center flex flex-col items-center">
                    <Download className="w-8 h-8 text-purple-500 mb-2" />
                    <h4 className="font-bold text-slate-800 text-sm">PWA Install</h4>
                    <p className="text-xs text-slate-500 mt-2">End-users can "Install" the site as a Desktop app directly from Chrome/Edge.</p>
                 </div>
              </div>
           </CardContent>
        </Card>
      </div>
    </div>
  );
}
