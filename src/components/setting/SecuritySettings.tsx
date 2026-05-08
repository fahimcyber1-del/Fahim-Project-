import React, { useState } from 'react';
import { Shield, Key, Smartphone, Clock, Globe, Lock, AlertTriangle, Eye, EyeOff, Save, ShieldCheck } from 'lucide-react';

export function SecuritySettings() {
  const [isSaving, setIsSaving] = useState(false);
  
  const [settings, setSettings] = useState(() => {
    try {
      const stored = localStorage.getItem('aqm_security_settings');
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    return {
      require2FA: false,
      sessionTimeout: '30',
      minPasswordLength: 12,
      requireUppercase: true,
      requireNumbers: true,
      requireSymbols: true,
      maxLoginAttempts: 5,
      lockoutDuration: 15,
    };
  });

  const [activeSessions, setActiveSessions] = useState(() => {
    try {
      const stored = localStorage.getItem('aqm_active_sessions');
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    return [
      { id: 1, device: 'MacBook Pro - Safari', location: 'New York, USA', ip: '192.168.1.1', time: 'Active now', current: true },
      { id: 2, device: 'iPhone 13 - Safari', location: 'New York, USA', ip: '192.168.1.2', time: '2 hours ago', current: false },
      { id: 3, device: 'Windows Desktop - Chrome', location: 'London, UK', ip: '10.0.0.4', time: 'Yesterday', current: false },
    ];
  });

  const handleRevoke = (id: number) => {
    setActiveSessions((prev: any) => {
      const newSessions = prev.filter((s: any) => s.id !== id);
      localStorage.setItem('aqm_active_sessions', JSON.stringify(newSessions));
      return newSessions;
    });
  };

  const clearSessions = () => {
    setActiveSessions((prev: any) => {
      const newSessions = prev.filter((s: any) => s.current);
      localStorage.setItem('aqm_active_sessions', JSON.stringify(newSessions));
      return newSessions;
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setSettings((prev: any) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSave = () => {
    setIsSaving(true);
    localStorage.setItem('aqm_security_settings', JSON.stringify(settings));
    
    // Add activity log
    try {
      const activityRaw = localStorage.getItem('aqm_activity_log');
      let activities: any[] = [];
      if (activityRaw) {
        try {
          activities = JSON.parse(activityRaw);
          if (!Array.isArray(activities)) activities = [];
        } catch(e) {}
      }
      
      let currentUser = 'Unknown User';
      const userRaw = localStorage.getItem('aqm_current_user');
      if (userRaw) {
        try {
          currentUser = JSON.parse(userRaw)?.name || currentUser;
        } catch(e) {}
      }

      activities.unshift({ 
        id: `log-${Date.now()}`,
        timestamp: new Date().toISOString(),
        user: currentUser,
        action: 'UPDATE',
        module: 'Security Settings',
        details: 'Security settings updated',
        ipAddress: '192.168.1.1',
        status: 'Success'
      });
      localStorage.setItem('aqm_activity_log', JSON.stringify(activities.slice(0, 50)));
    } catch (e) {
      console.error(e);
    }

    setTimeout(() => {
      setIsSaving(false);
    }, 800);
  };

  return (
    <div className="p-6 lg:p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900 mb-1">Security & Authentication</h2>
          <p className="text-sm text-slate-500">Manage account security, authentication methods, and active sessions.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-colors shadow-sm disabled:opacity-50"
        >
          {isSaving ? <span className="animate-spin text-white">⍥</span> : <Save className="w-4 h-4" />}
          {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:p-6 lg:p-8">
        <div className="lg:col-span-2 space-y-6">
          
          {/* Password Policy */}
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
            <h3 className="text-sm font-bold text-slate-900 p-4 border-b border-slate-200 bg-slate-50 flex items-center gap-2">
              <Key className="w-4 h-4 text-slate-500" /> Password Policy
            </h3>
            <div className="p-4 sm:p-6 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:p-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Minimum Password Length</label>
                  <input 
                    type="number" 
                    name="minPasswordLength"
                    value={settings.minPasswordLength}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-indigo-500 text-sm"
                    min="8" max="64"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Max Login Attempts</label>
                  <input 
                    type="number" 
                    name="maxLoginAttempts"
                    value={settings.maxLoginAttempts}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-indigo-500 text-sm"
                    min="3" max="10"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Lockout Duration (Mins)</label>
                  <input 
                    type="number" 
                    name="lockoutDuration"
                    value={settings.lockoutDuration}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-indigo-500 text-sm"
                    min="1" max="1440"
                  />
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <label className="flex items-center gap-3">
                  <input 
                    type="checkbox" 
                    name="requireUppercase"
                    checked={settings.requireUppercase}
                    onChange={handleChange}
                    className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
                  />
                  <span className="text-sm text-slate-700">Require at least one uppercase letter (A-Z)</span>
                </label>
                <label className="flex items-center gap-3">
                  <input 
                    type="checkbox" 
                    name="requireNumbers"
                    checked={settings.requireNumbers}
                    onChange={handleChange}
                    className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
                  />
                  <span className="text-sm text-slate-700">Require at least one number (0-9)</span>
                </label>
                <label className="flex items-center gap-3">
                  <input 
                    type="checkbox" 
                    name="requireSymbols"
                    checked={settings.requireSymbols}
                    onChange={handleChange}
                    className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
                  />
                  <span className="text-sm text-slate-700">Require at least one special character (!@#$%^&*)</span>
                </label>
              </div>
            </div>
          </div>

          {/* Authentication & Sessions */}
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
            <h3 className="text-sm font-bold text-slate-900 p-4 border-b border-slate-200 bg-slate-50 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-slate-500" /> Authentication & Sessions
            </h3>
            <div className="p-4 sm:p-6 space-y-6">
              
              <div className="flex items-start justify-between p-4 border border-indigo-100 rounded-xl bg-indigo-50/50">
                <div className="flex gap-3">
                  <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600 mt-0.5">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Two-Factor Authentication (2FA)</h4>
                    <p className="text-sm text-slate-600 mt-1 max-w-md">Require all users to use two-factor authentication via Authenticator App or SMS when logging in.</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input type="checkbox" name="require2FA" checked={settings.require2FA} onChange={handleChange} className="sr-only peer" />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Idle Session Timeout</label>
                <select 
                  name="sessionTimeout"
                  value={settings.sessionTimeout}
                  onChange={handleChange}
                  className="w-full md:w-1/2 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-indigo-500 text-sm"
                >
                  <option value="15">15 Minutes</option>
                  <option value="30">30 Minutes</option>
                  <option value="60">1 Hour</option>
                  <option value="240">4 Hours</option>
                  <option value="480">8 Hours</option>
                  <option value="1440">24 Hours (Not Recommended)</option>
                </select>
                <p className="text-xs text-slate-500 mt-2">Automatically log users out after a period of inactivity.</p>
              </div>

            </div>
          </div>

        </div>

        <div className="space-y-6">
          
          {/* Active Sessions */}
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 p-4 border-b border-slate-200 bg-slate-50 flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-500" /> Current Active Sessions
            </h3>
            <div className="divide-y divide-slate-100">
              {activeSessions.map(session => (
                <div key={session.id} className="p-4 hover:bg-slate-50 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <p className="text-sm font-bold text-slate-900">{session.device}</p>
                    {session.current && (
                      <span className="text-[10px] uppercase tracking-wider font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">Current</span>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-xs text-slate-500 mb-2">
                    <span className="flex items-center gap-1"><Globe className="w-3 h-3" /> {session.location}</span>
                    <span className="flex items-center gap-1"><AlertTriangle className="w-3 h-3 text-slate-400" /> {session.ip}</span>
                  </div>
                  <div className="flex justify-between items-center mt-3">
                    <span className="text-xs text-slate-500">{session.time}</span>
                    {!session.current && (
                      <button onClick={() => handleRevoke(session.id)} className="text-xs font-semibold text-rose-600 hover:text-rose-700 hover:underline">Revoke</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 border-t border-slate-100 bg-slate-50 text-center">
              <button onClick={clearSessions} className="text-sm font-semibold text-slate-700 hover:text-slate-900">Sign Out of All Devices</button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
