import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Users, Database, Shield, Activity, HardDrive, Cpu, Clock } from 'lucide-react';

export function OverviewSettings() {
  const [stats, setStats] = useState([
    { label: 'Active Users', value: '0', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Storage Used', value: '0 KB', icon: HardDrive, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'System Load', value: 'Normal', icon: Cpu, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Uptime', value: '100%', icon: Clock, color: 'text-violet-600', bg: 'bg-violet-50' },
  ]);

  const [securityData, setSecurityData] = useState({
    require2FA: 'Disabled',
    passwordPolicy: 'Standard',
    sessionTimeout: '30 Mins'
  });

  const [recentActivity, setRecentActivity] = useState<{action: string, time: string}[]>([]);

  useEffect(() => {
    // 1. Calculate Active Users
    let usersCount = 0;
    try {
      const storedUsers = localStorage.getItem('aqm_users');
      if (storedUsers) {
        const users = JSON.parse(storedUsers);
        usersCount = users.filter((u: any) => u.status === 'Active').length || users.length;
      }
    } catch (e) {
      console.error(e);
    }

    // 2. Estimate local storage size
    let totalBytes = 0;
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) {
            const item = localStorage.getItem(key);
            if (item) {
                totalBytes += key.length + item.length;
            }
        }
    }
    const kbSize = (totalBytes / 1024).toFixed(2);
    const mbSize = (totalBytes / (1024 * 1024)).toFixed(2);
    const storageDisplay = totalBytes > 1024 * 1024 ? `${mbSize} MB` : `${kbSize} KB`;

    setStats([
      { label: 'Active Users', value: usersCount.toString(), icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
      { label: 'Storage Used', value: storageDisplay, icon: HardDrive, color: 'text-indigo-600', bg: 'bg-indigo-50' },
      { label: 'System Load', value: 'Low', icon: Cpu, color: 'text-emerald-600', bg: 'bg-emerald-50' },
      { label: 'Uptime', value: '100%', icon: Clock, color: 'text-violet-600', bg: 'bg-violet-50' },
    ]);

    // 3. Security Posture
    try {
      // General Settings / Security
      const securityRaw = localStorage.getItem('aqm_security_settings');
      if (securityRaw) {
        const sec = JSON.parse(securityRaw);
        setSecurityData({
          require2FA: sec.require2FA ? 'Enabled' : 'Disabled',
          passwordPolicy: sec.minPasswordLength >= 12 && sec.requireSymbols ? 'Strict' : 'Standard',
          sessionTimeout: sec.sessionTimeout ? `${sec.sessionTimeout} Mins` : '30 Mins'
        });
      }
    } catch (e) {
      console.error(e);
    }
    
    // 4. Recent Activity
    try {
      const activityRaw = localStorage.getItem('aqm_activity_log');
      if (activityRaw) {
        const parsed = JSON.parse(activityRaw);
        setRecentActivity(parsed.slice(0, 4).map((a: any) => ({
          action: a.details || a.action,
          time: a.timestamp ? new Date(a.timestamp).toLocaleString(undefined, {
            month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
          }) : 'Recently'
        })));
      } else {
        setRecentActivity([
          { action: 'Admin logged in', time: 'Just now' },
          { action: 'User list updated', time: 'Recently' },
        ]);
      }
    } catch(e) {
      setRecentActivity([{ action: 'System Initialized', time: 'Recently' }]);
    }
  }, []);

  return (
    <div className="p-6 lg:p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-8">
      <div>
        <h2 className="text-lg font-bold text-slate-900 mb-1">Configuration Overview</h2>
        <p className="text-sm text-slate-500">A high-level summary of your system configuration and status.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex items-center gap-4">
              <div className={`p-3 rounded-lg ${stat.bg} ${stat.color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500">{stat.label}</p>
                <p className="text-lg font-black text-slate-900">{stat.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:p-6">
        <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-6 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-500" />
            Security Posture
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Two-Factor Authentication</span>
              <span className={`px-2 py-1 text-xs font-bold rounded ${securityData.require2FA === 'Enabled' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'}`}>{securityData.require2FA}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Password Policy</span>
              <span className={`px-2 py-1 text-xs font-bold rounded ${securityData.passwordPolicy === 'Strict' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}`}>{securityData.passwordPolicy}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Session Timeout</span>
              <span className="text-sm font-semibold text-slate-900">{securityData.sessionTimeout}</span>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-6 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Activity className="w-4 h-4 text-blue-500" />
            Recent Activity
          </h3>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex flex-col border-b border-slate-50 pb-2 last:border-0 last:pb-0">
                <span className="text-sm font-medium text-slate-900">{activity.action}</span>
                <span className="text-xs text-slate-500">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
