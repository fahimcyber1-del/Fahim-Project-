import { apiStorage } from '../../utils/apiStorage';
import React, { useState } from 'react';
import { GeneralSettings } from './GeneralSettings';
import { OverviewSettings } from './OverviewSettings';
import { AppearanceSettings } from './AppearanceSettings';
import { SystemStatusSettings } from './SystemStatusSettings';
import { SecuritySettings } from './SecuritySettings';
import { UsersAndRolesSettings } from './UsersAndRolesSettings';
import { ProfileSettings } from './ProfileSettings';
import { NotificationSettings } from './NotificationSettings';
import { AuditTrailSettings } from './AuditTrailSettings';
import { DatabaseSettings } from './DatabaseSettings';
import { SystemUpdateSettings } from './SystemUpdateSettings';
import { DeploymentSettings } from './DeploymentSettings';
import { LayoutDashboard, SlidersHorizontal, Users, Bell, Shield, Database, Webhook, Palette, Activity, User, History, DownloadCloud, Server } from 'lucide-react';

export function SettingModule({ navigationPayload, onNavigationHandled }: { navigationPayload?: any, onNavigationHandled?: () => void }) {
  const [activeTab, setActiveTab] = React.useState('overview');

  React.useEffect(() => {
    if (navigationPayload?.tab) {
      setActiveTab(navigationPayload.tab);
      if (onNavigationHandled) {
        onNavigationHandled();
      }
    }
  }, [navigationPayload, onNavigationHandled]);

  const [userRole, setUserRole] = React.useState<string>('User');

  React.useEffect(() => {
    const stored = apiStorage.getItem('userProfile');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setUserRole(parsed?.role || 'User');
      } catch (e) {}
    }
  }, []);

  const isSuperAdmin = userRole === 'Super Admin';

  const allTabs = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'profile', label: 'My Profile', icon: User },
    { id: 'general', label: 'General', icon: SlidersHorizontal },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'system_status', label: 'System Status', icon: Activity },
    { id: 'users', label: 'Users & Roles', icon: Users },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'audit_trail', label: 'Audit Trail', icon: History },
    { id: 'database', label: 'Database Backup', icon: Database },
    { id: 'system_update', label: 'System Update', icon: DownloadCloud },
    { id: 'deployment', label: 'Deployment & Network', icon: Server },
    { id: 'integrations', label: 'Integrations', icon: Webhook },
  ];

  const tabs = isSuperAdmin ? allTabs : allTabs.filter(t => t.id === 'profile' || t.id === 'appearance');

  React.useEffect(() => {
    if (!isSuperAdmin && activeTab !== 'profile' && activeTab !== 'appearance') {
      setActiveTab('profile');
    }
  }, [isSuperAdmin, activeTab]);

  return (
    <div className="flex flex-col h-full bg-slate-50">
      <div className="flex-none pt-2 px-4 sm:px-6">
        {/* Tab Navigation */}
        <div className="flex overflow-x-auto hide-scrollbar border-b border-slate-200">
          <div className="flex space-x-1 min-w-max pb-px">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center gap-2 px-4 py-2.5 text-sm font-semibold transition-colors relative
                    ${isActive ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-t-lg'}
                  `}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                  {isActive && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-t-full" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4 lg:px-6 lg:py-4 bg-slate-50">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 min-h-full">
          {activeTab === 'overview' && <OverviewSettings />}
          {activeTab === 'profile' && <ProfileSettings />}
          {activeTab === 'general' && <GeneralSettings />}
          {activeTab === 'appearance' && <AppearanceSettings />}
          {activeTab === 'system_status' && <SystemStatusSettings />}
          {activeTab === 'security' && <SecuritySettings />}
          {activeTab === 'users' && <UsersAndRolesSettings />}
          {activeTab === 'notifications' && <NotificationSettings />}
          {activeTab === 'audit_trail' && <AuditTrailSettings />}
          {activeTab === 'database' && <DatabaseSettings />}
          {activeTab === 'system_update' && <SystemUpdateSettings />}
          {activeTab === 'deployment' && <DeploymentSettings />}
          {activeTab !== 'overview' && activeTab !== 'profile' && activeTab !== 'general' && activeTab !== 'appearance' && activeTab !== 'system_status' && activeTab !== 'security' && activeTab !== 'users' && activeTab !== 'notifications' && activeTab !== 'audit_trail' && activeTab !== 'database' && activeTab !== 'system_update' && activeTab !== 'deployment' && (
            <div className="flex flex-col items-center justify-center p-12 text-slate-500 h-full border-2 border-dashed border-slate-100 rounded-xl m-6">
              <SlidersHorizontal className="w-12 h-12 text-slate-300 mb-4" />
              <p className="font-medium text-slate-900">Module Under Construction</p>
              <p className="text-sm mt-1 text-center max-w-md">This section is currently being developed.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
