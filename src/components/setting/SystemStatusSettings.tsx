import React, { useState, useEffect } from 'react';
import { Activity, Server, Database, HardDrive, RefreshCw, CheckCircle2, AlertTriangle, Network, Users } from 'lucide-react';

export function SystemStatusSettings() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  
  // System metrics state
  const [metrics, setMetrics] = useState({
    cpu: 24,
    memory: { used: 12.4, total: 32 },
    dbConnections: 142,
    dbLatency: 12,
    diskSpace: { used: 850, total: 1000 },
    ioWait: 2.4,
    usersOnline: 1248,
    activeSessions: 1450,
    apiRequests: 450,
    uptime: 0
  });

  const [services, setServices] = useState([
    { name: 'Core Application', status: 'operational', uptime: '99.99%', latency: 45 },
    { name: 'Database (Primary)', status: 'operational', uptime: '99.99%', latency: 12 },
    { name: 'Storage Backend', status: 'operational', uptime: '99.95%', latency: 85 },
    { name: 'Authentication Service', status: 'degraded', uptime: '98.50%', latency: 210 },
    { name: 'Email Gateway', status: 'operational', uptime: '99.90%', latency: 150 },
  ]);

  const refreshAction = async () => {
    setIsRefreshing(true);
    
    try {
      const response = await fetch('/api/system');
      if (response.ok) {
        const data = await response.json();
        setMetrics({
          cpu: data.cpu,
          memory: data.memory,
          dbConnections: data.dbConnections,
          dbLatency: data.dbLatency,
          diskSpace: data.diskSpace,
          ioWait: data.ioWait,
          usersOnline: data.usersOnline,
          activeSessions: data.activeSessions,
          apiRequests: data.apiRequests,
          uptime: data.uptime || 0
        });
        if (data.services) {
          setServices(data.services);
        }
        setLastUpdated(new Date());
      }
    } catch (error) {
      console.error("Failed to fetch system metrics", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    refreshAction();
    // Auto refresh every 10 seconds to make it look alive
    const interval = setInterval(refreshAction, 10000);
    return () => clearInterval(interval);
  }, []);

  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / (3600 * 24));
    const hours = Math.floor((seconds % (3600 * 24)) / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    if (days > 0) return `${days}d ${hours}h ${mins}m`;
    if (hours > 0) return `${hours}h ${mins}m`;
    return `${mins}m ${Math.floor(seconds % 60)}s`;
  };

  return (
    <div className="p-6 lg:p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 mb-1">System Status</h2>
          <p className="text-sm text-slate-500">Real-time health and performance metrics for your infrastructure. Last updated: {lastUpdated.toLocaleTimeString()}</p>
        </div>
        <button 
          onClick={refreshAction}
          disabled={isRefreshing}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-indigo-600' : ''}`} />
          {isRefreshing ? 'Refreshing...' : 'Refresh Status'}
        </button>
      </div>

      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-start gap-3">
        <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
        <div>
          <h3 className="text-sm font-bold text-emerald-900">All Systems Operational</h3>
          <p className="text-sm text-emerald-700 mt-1">Except for Authentication Service experiencing minor degradation. Next scheduled maintenance in 14 days.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Server Load Card */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Server className="w-4 h-4 text-indigo-500" />
              Server Load
            </h3>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-medium whitespace-nowrap hidden sm:block">Up: {formatUptime(metrics.uptime)}</span>
              <span className={`text-xs font-bold px-2 py-1 rounded ${metrics.cpu > 80 ? 'text-rose-600 bg-rose-50' : 'text-indigo-600 bg-indigo-50'}`}>
                {metrics.cpu > 80 ? 'High' : 'Normal'}
              </span>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-semibold text-slate-600">CPU Usage</span>
                <span className="text-slate-900">{metrics.cpu}%</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className={`h-full rounded-full transition-all duration-500 ${metrics.cpu > 80 ? 'bg-rose-500' : 'bg-indigo-500'}`} style={{ width: `${Math.min(100, Math.max(0, metrics.cpu))}%` }} />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-semibold text-slate-600">Memory</span>
                <span className="text-slate-900">{metrics.memory.used} GB / {metrics.memory.total} GB</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-500 rounded-full transition-all duration-500" style={{ width: `${(metrics.memory.used / metrics.memory.total) * 100}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* Database Card */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Database className="w-4 h-4 text-emerald-500" />
              Database
            </h3>
            <span className={`text-xs font-bold px-2 py-1 rounded ${metrics.dbLatency > 50 ? 'text-amber-600 bg-amber-50' : 'text-emerald-600 bg-emerald-50'}`}>
              {metrics.dbLatency > 50 ? 'Slow' : 'Healthy'}
            </span>
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-semibold text-slate-600">Active Connections</span>
                <span className="text-slate-900">{metrics.dbConnections}</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full transition-all duration-500" style={{ width: `${Math.min(100, (metrics.dbConnections / 500) * 100)}%` }} />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-semibold text-slate-600">Query Latency (Avg)</span>
                <span className="text-slate-900">{metrics.dbLatency}ms</span>
              </div>
            </div>
          </div>
        </div>

        {/* Storage Card */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <HardDrive className="w-4 h-4 text-amber-500" />
              Storage
            </h3>
            <span className={`text-xs font-bold px-2 py-1 rounded ${metrics.diskSpace.used / metrics.diskSpace.total > 0.9 ? 'text-amber-600 bg-amber-50' : 'text-slate-600 bg-slate-50'}`}>
              {metrics.diskSpace.used / metrics.diskSpace.total > 0.9 ? 'Warning' : 'Normal'}
            </span>
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-semibold text-slate-600">Disk Space</span>
                <span className="text-slate-900">{metrics.diskSpace.used.toFixed(0)} GB / {metrics.diskSpace.total} GB</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className={`h-full rounded-full transition-all duration-500 ${metrics.diskSpace.used / metrics.diskSpace.total > 0.9 ? 'bg-amber-500' : 'bg-slate-500'}`} style={{ width: `${(metrics.diskSpace.used / metrics.diskSpace.total) * 100}%` }} />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-semibold text-slate-600">I/O Wait</span>
                <span className="text-slate-900">{metrics.ioWait.toFixed(1)}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Traffic / Users Card */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Users className="w-4 h-4 text-sky-500" />
              Traffic
            </h3>
            <span className="text-xs font-bold text-sky-600 bg-sky-50 px-2 py-1 rounded flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-pulse"></span>
              Live
            </span>
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-semibold text-slate-600">Users Online</span>
                <span className="text-slate-900 font-bold">{metrics.usersOnline}</span>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Active Sessions: {metrics.activeSessions}</span>
              </div>
            </div>
            <div className="pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-semibold text-slate-600">API Requests/sec</span>
                <span className="text-slate-900">{metrics.apiRequests}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Network className="w-4 h-4 text-slate-500" />
            Service Status
          </h3>
          <span className="text-xs text-slate-500">Checking every 10s</span>
        </div>
        <div className="divide-y divide-slate-100">
          {services.map((service, index) => (
            <div key={index} className="px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-3">
                {service.status === 'operational' ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-amber-500" />
                )}
                <div>
                  <p className="text-sm font-bold text-slate-900">{service.name}</p>
                  <p className="text-xs text-slate-500 lg:hidden">
                    Uptime: {service.uptime} • Latency: {service.latency}ms
                  </p>
                </div>
              </div>
              
              <div className="hidden lg:flex items-center gap-4 sm:p-6 lg:p-8">
                <div className="text-right">
                  <p className="text-xs font-semibold text-slate-500">Uptime (30d)</p>
                  <p className="text-sm font-medium text-slate-900">{service.uptime}</p>
                </div>
                <div className="text-right w-24">
                  <p className="text-xs font-semibold text-slate-500">Latency</p>
                  <p className={`text-sm font-medium transition-colors ${service.latency > 150 ? 'text-amber-600' : 'text-slate-900'}`}>{service.latency}ms</p>
                </div>
                <div className="w-24 text-right">
                  {service.status === 'operational' ? (
                    <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded">Operational</span>
                  ) : (
                    <span className="px-2 py-1 bg-amber-100 text-amber-700 text-xs font-bold rounded">Degraded</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
