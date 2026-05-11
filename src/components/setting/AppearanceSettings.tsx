import { apiStorage } from '../../utils/apiStorage';
import React, { useState } from 'react';
import { Palette, Monitor, Moon, Sun, Layout, Save, Image as ImageIcon, Box, Type } from 'lucide-react';
import { useAppearance } from './AppearanceContext';
import { usePermissions } from '../../hooks/usePermissions';

export function AppearanceSettings() {
  const { edit, manage } = usePermissions('Setting');
  const canEdit = edit || manage;
  const { settings, updateSettings } = useAppearance();
  const [localSettings, setLocalSettings] = useState(settings);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    updateSettings(localSettings);
    
    // Log activity
    try {
      const activityRaw = apiStorage.getItem('aqm_activity_log');
      let activities: any[] = [];
      if (activityRaw) {
        try {
          activities = JSON.parse(activityRaw);
          if (!Array.isArray(activities)) activities = [];
        } catch(e) {}
      }
      
      let currentUser = 'Unknown User';
      const userRaw = apiStorage.getItem('aqm_current_user');
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
        module: 'Appearance Settings',
        details: 'Updated workspace appearance',
        ipAddress: '192.168.1.1',
        status: 'Success'
      });
      apiStorage.setItem('aqm_activity_log', JSON.stringify(activities.slice(0, 50)));
    } catch (e) {
      console.error(e);
    }
    
    setTimeout(() => {
      setIsSaving(false);
    }, 600);
  };

  const accents = [
    { id: 'indigo', name: 'Indigo', hex: '#4f46e5' },
    { id: 'blue', name: 'Blue', hex: '#2563eb' },
    { id: 'emerald', name: 'Emerald', hex: '#059669' },
    { id: 'rose', name: 'Rose', hex: '#e11d48' },
    { id: 'amber', name: 'Amber', hex: '#d97706' },
    { id: 'slate', name: 'Slate', hex: '#475569' },
  ];

  return (
    <div className="p-6 lg:p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto space-y-8">
      <div>
        <h2 className="text-lg font-bold text-slate-900 mb-1">Appearance</h2>
        <p className="text-sm text-slate-500">Customize the look and feel of your workspace.</p>
      </div>

      <div className="space-y-6">
        <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-6 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Palette className="w-4 h-4 text-slate-500" />
            Theme Preference
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <button
              onClick={() => setLocalSettings({...localSettings, theme: 'light'})}
              disabled={!canEdit}
              className={`flex flex-col items-center gap-3 p-4 rounded-xl border-2 transition-colors ${
                localSettings.theme === 'light' ? 'border-indigo-600 bg-indigo-50/50' : 'border-slate-200 hover:border-slate-300'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center border border-slate-200">
                <Sun className="w-6 h-6 text-amber-500" />
              </div>
              <span className="text-sm font-semibold text-slate-900">Light Mode</span>
            </button>
            <button
              onClick={() => setLocalSettings({...localSettings, theme: 'dark'})}
              disabled={!canEdit}
              className={`flex flex-col items-center gap-3 p-4 rounded-xl border-2 transition-colors ${
                localSettings.theme === 'dark' ? 'border-indigo-600 bg-indigo-50/50' : 'border-slate-200 hover:border-slate-300'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <div className="w-12 h-12 bg-slate-900 rounded-full shadow-sm flex items-center justify-center border border-slate-700">
                <Moon className="w-6 h-6 text-slate-300" />
              </div>
              <span className="text-sm font-semibold text-slate-900">Dark Mode</span>
            </button>
            <button
              onClick={() => setLocalSettings({...localSettings, theme: 'system'})}
              disabled={!canEdit}
              className={`flex flex-col items-center gap-3 p-4 rounded-xl border-2 transition-colors ${
                localSettings.theme === 'system' ? 'border-indigo-600 bg-indigo-50/50' : 'border-slate-200 hover:border-slate-300'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <div className="w-12 h-12 bg-gradient-to-br from-white to-slate-900 rounded-full shadow-sm flex items-center justify-center border border-slate-300">
                <Monitor className="w-6 h-6 text-slate-500 mix-blend-exclusion" />
              </div>
              <span className="text-sm font-semibold text-slate-900">System Sync</span>
            </button>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-6 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Palette className="w-4 h-4 text-slate-500" />
            Accent Color
          </h3>
          <div className="flex flex-wrap gap-4">
            {accents.map((a) => (
              <button
                key={a.id}
                onClick={() => setLocalSettings({...localSettings, accent: a.id})}
                disabled={!canEdit}
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-transform ${
                  localSettings.accent === a.id ? 'ring-4 ring-offset-2 ring-primary-200 scale-110' : 'hover:scale-105'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
                style={{ backgroundColor: a.hex }}
                title={a.name}
              />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:p-6">
          <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-6 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Layout className="w-4 h-4 text-slate-500" />
              Workspace Layout
            </h3>
            <div className="space-y-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="layout"
                  value="fluid"
                  checked={localSettings.layoutMode === 'fluid'}
                  onChange={() => setLocalSettings({...localSettings, layoutMode: 'fluid'})}
                  disabled={!canEdit}
                  className="w-4 h-4 text-primary-600 focus:ring-primary-500 border-slate-300 disabled:opacity-50"
                />
                <div>
                  <p className="text-sm font-semibold text-slate-900">Fluid</p>
                  <p className="text-xs text-slate-500">Expands to fill the screen.</p>
                </div>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="layout"
                  value="fixed"
                  checked={localSettings.layoutMode === 'fixed'}
                  onChange={() => setLocalSettings({...localSettings, layoutMode: 'fixed'})}
                  disabled={!canEdit}
                  className="w-4 h-4 text-primary-600 focus:ring-primary-500 border-slate-300 disabled:opacity-50"
                />
                <div>
                  <p className="text-sm font-semibold text-slate-900">Fixed Width</p>
                  <p className="text-xs text-slate-500">Constrains max width.</p>
                </div>
              </label>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-6 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-slate-500" />
              Background Wallpaper
            </h3>
            <div className="space-y-4">
              <select 
                value={localSettings.backgroundWallpaper}
                onChange={(e) => setLocalSettings({...localSettings, backgroundWallpaper: e.target.value})}
                disabled={!canEdit}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 disabled:bg-slate-50 disabled:text-slate-500"
              >
                <option value="none">None (Solid Color)</option>
                <option value="abstract">Abstract Shapes</option>
                <option value="geometric">Geometric Pattern</option>
                <option value="gradient">Soft Gradient</option>
                <option value="custom">Custom Image Upload...</option>
              </select>
              
              {localSettings.backgroundWallpaper === 'custom' && (
                <div className="mt-4">
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-2">Upload Image</label>
                  <input 
                    type="file" 
                    accept="image/*"
                    disabled={!canEdit}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setLocalSettings({...localSettings, customWallpaperUrl: reader.result as string});
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100 transition-colors"
                  />
                  {localSettings.customWallpaperUrl && (
                    <div className="mt-3 aspect-video rounded-lg bg-cover bg-center border border-slate-200 shadow-sm" style={{ backgroundImage: `url(${localSettings.customWallpaperUrl})` }}></div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-6 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Layout className="w-4 h-4 text-slate-500" />
              Component Styles
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-2">Sidebar Style</label>
                <select 
                  value={localSettings.sidebarStyle}
                  onChange={(e) => setLocalSettings({...localSettings, sidebarStyle: e.target.value})}
                  disabled={!canEdit}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 disabled:bg-slate-50 disabled:text-slate-500"
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="glass">Glassmorphism</option>
                  <option value="brutalist">Brutalist</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-2">Topbar Style</label>
                <div className="flex items-center gap-2 mb-2">
                  <select 
                    value={localSettings.topbarStyle}
                    onChange={(e) => setLocalSettings({...localSettings, topbarStyle: e.target.value})}
                    disabled={!canEdit || localSettings.hideTopbar}
                    className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 disabled:bg-slate-50 disabled:text-slate-500"
                  >
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                    <option value="glass">Glassmorphism</option>
                    <option value="brutalist">Brutalist</option>
                  </select>
                </div>
                <label className="flex items-center gap-2 cursor-pointer mt-3">
                  <input
                    type="checkbox"
                    checked={localSettings.hideTopbar}
                    onChange={(e) => setLocalSettings({...localSettings, hideTopbar: e.target.checked})}
                    disabled={!canEdit}
                    className="w-4 h-4 text-primary-600 focus:ring-primary-500 border-slate-300 rounded"
                  />
                  <span className="text-sm font-semibold text-slate-700">Hide Topbar Content Completely</span>
                </label>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-6 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Type className="w-4 h-4 text-slate-500" />
              Typography & Elements
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-2">Overall UI Size</label>
                <select 
                  value={localSettings.uiSize}
                  onChange={(e) => setLocalSettings({...localSettings, uiSize: e.target.value})}
                  disabled={!canEdit}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 disabled:bg-slate-50 disabled:text-slate-500"
                >
                  <option value="extra-compact">Extra Compact</option>
                  <option value="compact">Compact (Smaller padding/text)</option>
                  <option value="default">Default</option>
                  <option value="large">Large (More spacious)</option>
                  <option value="extra-large">Extra Large</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-2">Font Family</label>
                <select 
                  value={localSettings.fontStyle}
                  onChange={(e) => setLocalSettings({...localSettings, fontStyle: e.target.value})}
                  disabled={!canEdit}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 disabled:bg-slate-50 disabled:text-slate-500"
                >
                  <option value="inter">Inter (Default)</option>
                  <option value="roboto">Roboto</option>
                  <option value="space-grotesk">Space Grotesk</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-2">Card Style</label>
                <select 
                  value={localSettings.cardStyle}
                  onChange={(e) => setLocalSettings({...localSettings, cardStyle: e.target.value})}
                  disabled={!canEdit}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 disabled:bg-slate-50 disabled:text-slate-500"
                >
                  <option value="shadow">Soft Shadow</option>
                  <option value="flat">Flat (No Shadow)</option>
                  <option value="outline">Outline Only</option>
                  <option value="brutalist">Brutalist</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-2">Button Style</label>
                <select 
                  value={localSettings.buttonStyle}
                  onChange={(e) => setLocalSettings({...localSettings, buttonStyle: e.target.value})}
                  disabled={!canEdit}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 disabled:bg-slate-50 disabled:text-slate-500"
                >
                  <option value="rounded">Rounded</option>
                  <option value="pill">Pill</option>
                  <option value="square">Square</option>
                  <option value="brutalist">Brutalist</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-2">Overall UI Style</label>
                <select 
                  value={localSettings.uiStyle || 'default'}
                  onChange={(e) => setLocalSettings({...localSettings, uiStyle: e.target.value})}
                  disabled={!canEdit}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 disabled:bg-slate-50 disabled:text-slate-500"
                >
                  <option value="default">Default</option>
                  <option value="brutalist">Brutalist Overall</option>
                  <option value="neobrutalism">Neo-Brutalism</option>
                  <option value="glassmorphism">Glassmorphism</option>
                  <option value="cyberpunk">Cyberpunk</option>
                  <option value="neumorphism">Neumorphism</option>
                  <option value="claymorphism">Claymorphism</option>
                  <option value="aurora">Holographic Aurora</option>
                  <option value="terminal">Retro Terminal</option>
                  <option value="synthwave">Retro Synthwave</option>
                  <option value="blueprint">Technical Blueprint</option>
                  <option value="playful">Clean & Colorful</option>
                  <option value="vibrant">Vibrant Minimal</option>
                  <option value="industry">Industry Level (Live Animation)</option>
                </select>
              </div>
            </div>
          </div>
        </div>

      </div>

      <div className="flex items-center justify-end pt-6 border-t border-slate-200">
        <button
          onClick={handleSave}
          disabled={isSaving || !canEdit}
          className={`flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-bold hover:bg-indigo-700 transition-colors shadow-sm disabled:opacity-50 ${!canEdit ? 'hidden' : ''}`}
        >
          {isSaving ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {isSaving ? 'Saving...' : 'Save Appearance'}
        </button>
      </div>
    </div>
  );
}
