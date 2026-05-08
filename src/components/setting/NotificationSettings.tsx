import { apiStorage } from '../../utils/apiStorage';
import React, { useState, useEffect } from 'react';
import { Bell, Mail, Smartphone, AlertCircle, Clock, Save, ShieldAlert, FileCheck, MessageSquare } from 'lucide-react';
import { usePermissions } from '../../hooks/usePermissions';

export function NotificationSettings() {
  const { edit, manage } = usePermissions('Setting');
  const canEdit = edit || manage;
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  const [settings, setSettings] = useState({
    emailAlerts: true,
    pushNotifications: false,
    inAppPopups: true,
    weeklyDigest: true,
    
    // Categories
    qcFailures: true,
    systemAlerts: true,
    newMessages: true,
    roleChanges: true,
    
    // Custom requested categories
    upcomingInspections: true,
    newAuditFindings: true,
    overdueCapa: true,
    expiringCertificates: true,
    newComplaints: true,
    
    // Document categories
    documentUpdates: true,
    documentApprovals: true,
    documentPublished: true,
    
    // Do not disturb
    dndEnabled: false,
    dndStart: '22:00',
    dndEnd: '08:00',

    // SMTP Settings
    smtpHost: '',
    smtpPort: '587',
    smtpUser: '',
    smtpPass: '',
    smtpFrom: '',

    // WhatsApp Settings
    whatsappEnabled: false,
    whatsappNumber: '',
    whatsappApiKey: '',
  });

  const [testEmailStatus, setTestEmailStatus] = useState<string>('');
  const [testWhatsappStatus, setTestWhatsappStatus] = useState<string>('');

  useEffect(() => {
    try {
      const stored = apiStorage.getItem('aqm_notification_settings');
      if (stored) {
        setSettings(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to load notification settings', e);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!canEdit) return;
    const { name, type, checked, value } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSave = () => {
    if (!canEdit) return;
    setIsSaving(true);
    try {
      apiStorage.setItem('aqm_notification_settings', JSON.stringify(settings));
    } catch (e) {
      console.error('Failed to save notification settings', e);
    }
    setTimeout(() => {
      setIsSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }, 600);
  };

  const handleTestEmail = async () => {
    setTestEmailStatus('Sending...');
    try {
      const baseUrl = typeof window !== 'undefined' ? localStorage.getItem('global_api_url')?.replace(/\/$/, '') || '' : '';
      const res = await fetch(`${baseUrl}/api/notifications/test-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          host: settings.smtpHost,
          port: settings.smtpPort,
          user: settings.smtpUser,
          pass: settings.smtpPass,
          from: settings.smtpFrom,
          to: 'test@example.com' // Using a default test target
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setTestEmailStatus('Success! Email sent.');
      } else {
        setTestEmailStatus(`Failed: ${data.message || 'Unknown error'}`);
      }
    } catch (e: any) {
      setTestEmailStatus(`Error: ${e.message}`);
    }
  };

  const handleTestWhatsapp = async () => {
    setTestWhatsappStatus('Sending...');
    try {
      const baseUrl = typeof window !== 'undefined' ? localStorage.getItem('global_api_url')?.replace(/\/$/, '') || '' : '';
      const res = await fetch(`${baseUrl}/api/notifications/test-whatsapp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          number: settings.whatsappNumber,
          apiKey: settings.whatsappApiKey,
          message: 'Test message from QMS System'
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setTestWhatsappStatus('Success! WhatsApp sent.');
      } else {
        setTestWhatsappStatus(`Failed: ${data.message || 'Unknown error'}`);
      }
    } catch (e: any) {
      setTestWhatsappStatus(`Error: ${e.message}`);
    }
  };

  return (
    <div className="p-6 lg:p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900 mb-1">Notification Preferences</h2>
          <p className="text-sm text-slate-500">Control how and when you receive alerts and messages.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={isSaving || !canEdit || saveSuccess}
          className={`flex items-center gap-2 px-4 py-2 text-white rounded-lg text-sm font-semibold transition-colors shadow-sm disabled:opacity-50 ${!canEdit ? 'hidden' : ''} ${saveSuccess ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-indigo-600 hover:bg-indigo-700'}`}
        >
          {isSaving ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : saveSuccess ? (
            <FileCheck className="w-4 h-4" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {isSaving ? 'Saving...' : saveSuccess ? 'Saved!' : 'Save Preferences'}
        </button>
      </div>

      <div className="space-y-6">
        {/* Delivery Methods */}
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 p-4 border-b border-slate-200 bg-slate-50 flex items-center gap-2">
            <Bell className="w-4 h-4 text-slate-500" /> Delivery Methods & Integration
          </h3>
          <div className="divide-y divide-slate-100">
            <div className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-start gap-4">
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg shrink-0 mt-0.5 self-start">
                <Mail className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Email Alerts & SMTP Setup</h4>
                    <p className="text-sm text-slate-500 mt-1 max-w-md">Receive important updates and daily summaries delivered to your inbox.</p>
                  </div>
                  <label className={`relative inline-flex items-center cursor-pointer shrink-0 ${!canEdit ? 'opacity-50 pointer-events-none' : ''}`}>
                    <input type="checkbox" name="emailAlerts" checked={settings.emailAlerts} onChange={handleChange} disabled={!canEdit} className="sr-only peer" />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </div>
                
                {settings.emailAlerts && (
                  <div className="mt-4 p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-4">
                    <h5 className="text-xs font-semibold text-slate-700 uppercase tracking-wider">SMTP Configuration</h5>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">SMTP Host</label>
                        <input type="text" name="smtpHost" value={settings.smtpHost} onChange={handleChange} disabled={!canEdit} placeholder="smtp.gmail.com" className="w-full px-3 py-2 border border-slate-300 rounded focus:ring-indigo-500 focus:border-indigo-500 text-sm disabled:bg-slate-100" />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">SMTP Port</label>
                        <input type="text" name="smtpPort" value={settings.smtpPort} onChange={handleChange} disabled={!canEdit} placeholder="587" className="w-full px-3 py-2 border border-slate-300 rounded focus:ring-indigo-500 focus:border-indigo-500 text-sm disabled:bg-slate-100" />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">SMTP Username</label>
                        <input type="text" name="smtpUser" value={settings.smtpUser} onChange={handleChange} disabled={!canEdit} placeholder="user@example.com" className="w-full px-3 py-2 border border-slate-300 rounded focus:ring-indigo-500 focus:border-indigo-500 text-sm disabled:bg-slate-100" />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">SMTP Password</label>
                        <input type="password" name="smtpPass" value={settings.smtpPass} onChange={handleChange} disabled={!canEdit} placeholder="••••••••" className="w-full px-3 py-2 border border-slate-300 rounded focus:ring-indigo-500 focus:border-indigo-500 text-sm disabled:bg-slate-100" />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-semibold text-slate-600 mb-1">From Email Address</label>
                        <input type="email" name="smtpFrom" value={settings.smtpFrom} onChange={handleChange} disabled={!canEdit} placeholder="noreply@example.com" className="w-full px-3 py-2 border border-slate-300 rounded focus:ring-indigo-500 focus:border-indigo-500 text-sm disabled:bg-slate-100" />
                      </div>
                    </div>
                    <div className="flex items-center gap-4 mt-2">
                      <button onClick={handleTestEmail} disabled={!canEdit || !settings.smtpHost} className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded text-xs font-semibold transition-colors disabled:opacity-50">
                        Test Connection
                      </button>
                      {testEmailStatus && (
                        <span className={`text-xs ${testEmailStatus.includes('Success') ? 'text-emerald-600' : 'text-rose-600'}`}>
                          {testEmailStatus}
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-start gap-4">
              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg shrink-0 mt-0.5 self-start">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">WhatsApp Integrations</h4>
                    <p className="text-sm text-slate-500 mt-1 max-w-md">Send direct alert messages to WhatsApp numbers via API.</p>
                  </div>
                  <label className={`relative inline-flex items-center cursor-pointer shrink-0 ${!canEdit ? 'opacity-50 pointer-events-none' : ''}`}>
                    <input type="checkbox" name="whatsappEnabled" checked={settings.whatsappEnabled} onChange={handleChange} disabled={!canEdit} className="sr-only peer" />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                  </label>
                </div>

                {settings.whatsappEnabled && (
                  <div className="mt-4 p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-4">
                     <h5 className="text-xs font-semibold text-slate-700 uppercase tracking-wider">WhatsApp API Setup</h5>
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                       <div>
                         <label className="block text-xs font-semibold text-slate-600 mb-1">Target Phone Number</label>
                         <input type="text" name="whatsappNumber" value={settings.whatsappNumber} onChange={handleChange} disabled={!canEdit} placeholder="+1234567890" className="w-full px-3 py-2 border border-slate-300 rounded focus:ring-emerald-500 focus:border-emerald-500 text-sm disabled:bg-slate-100" />
                         <span className="text-[10px] text-slate-500">Number to send reports or notifications to. Include country code.</span>
                       </div>
                       <div>
                         <label className="block text-xs font-semibold text-slate-600 mb-1">API Key / Token</label>
                         <input type="password" name="whatsappApiKey" value={settings.whatsappApiKey} onChange={handleChange} disabled={!canEdit} placeholder="••••••••" className="w-full px-3 py-2 border border-slate-300 rounded focus:ring-emerald-500 focus:border-emerald-500 text-sm disabled:bg-slate-100" />
                       </div>
                     </div>
                     <div className="flex items-center gap-4 mt-2">
                      <button onClick={handleTestWhatsapp} disabled={!canEdit || !settings.whatsappNumber} className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded text-xs font-semibold transition-colors disabled:opacity-50">
                        Test WhatsApp
                      </button>
                      {testWhatsappStatus && (
                        <span className={`text-xs ${testWhatsappStatus.includes('Success') ? 'text-emerald-600' : 'text-rose-600'}`}>
                          {testWhatsappStatus}
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="p-4 sm:p-6 flex items-start gap-4">
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg shrink-0 mt-0.5">
                <Smartphone className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-bold text-slate-900">Push Notifications</h4>
                <p className="text-sm text-slate-500 mt-1 max-w-md">Get instant alerts sent directly to your device screen.</p>
              </div>
              <label className={`relative inline-flex items-center cursor-pointer shrink-0 ${!canEdit ? 'opacity-50 pointer-events-none' : ''}`}>
                <input type="checkbox" name="pushNotifications" checked={settings.pushNotifications} onChange={handleChange} disabled={!canEdit} className="sr-only peer" />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>

            <div className="p-4 sm:p-6 flex items-start gap-4">
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg shrink-0 mt-0.5">
                <Bell className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-bold text-slate-900">In-App Popups</h4>
                <p className="text-sm text-slate-500 mt-1 max-w-md">Show toast notifications inside the application while you are active.</p>
              </div>
              <label className={`relative inline-flex items-center cursor-pointer shrink-0 ${!canEdit ? 'opacity-50 pointer-events-none' : ''}`}>
                <input type="checkbox" name="inAppPopups" checked={settings.inAppPopups} onChange={handleChange} disabled={!canEdit} className="sr-only peer" />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Alert Categories */}
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 p-4 border-b border-slate-200 bg-slate-50 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-slate-500" /> Topic Preferences
          </h3>
          <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            <label className={`flex items-start gap-3 cursor-pointer group ${!canEdit ? 'opacity-50 pointer-events-none' : ''}`}>
              <input 
                type="checkbox" 
                name="upcomingInspections"
                checked={settings.upcomingInspections}
                onChange={handleChange}
                disabled={!canEdit}
                className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500 mt-0.5"
              />
              <div>
                 <span className="text-sm font-semibold text-slate-900 block group-hover:text-indigo-600 transition-colors">Upcoming Inspections</span>
                 <span className="text-xs text-slate-500">Alerts when quality inspections are scheduled or approaching.</span>
              </div>
            </label>

            <label className={`flex items-start gap-3 cursor-pointer group ${!canEdit ? 'opacity-50 pointer-events-none' : ''}`}>
              <input 
                type="checkbox" 
                name="newAuditFindings"
                checked={settings.newAuditFindings}
                onChange={handleChange}
                disabled={!canEdit}
                className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500 mt-0.5"
              />
              <div>
                 <span className="text-sm font-semibold text-slate-900 block group-hover:text-indigo-600 transition-colors">New Audit Findings</span>
                 <span className="text-xs text-slate-500">Alerts for new non-conformances or observations from external/internal audits.</span>
              </div>
            </label>

            <label className={`flex items-start gap-3 cursor-pointer group ${!canEdit ? 'opacity-50 pointer-events-none' : ''}`}>
              <input 
                type="checkbox" 
                name="overdueCapa"
                checked={settings.overdueCapa}
                onChange={handleChange}
                disabled={!canEdit}
                className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500 mt-0.5"
              />
              <div>
                 <span className="text-sm font-semibold text-slate-900 block group-hover:text-indigo-600 transition-colors">Overdue CAPA Actions</span>
                 <span className="text-xs text-slate-500">Reminders when Corrective/Preventive Actions exceed their deadlines.</span>
              </div>
            </label>

            <label className={`flex items-start gap-3 cursor-pointer group ${!canEdit ? 'opacity-50 pointer-events-none' : ''}`}>
              <input 
                type="checkbox" 
                name="expiringCertificates"
                checked={settings.expiringCertificates}
                onChange={handleChange}
                disabled={!canEdit}
                className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500 mt-0.5"
              />
              <div>
                 <span className="text-sm font-semibold text-slate-900 block group-hover:text-indigo-600 transition-colors">Expiring Certificates</span>
                 <span className="text-xs text-slate-500">Warnings when factory or quality certificates are nearing expiry (e.g., ISO, WRAP).</span>
              </div>
            </label>

            <label className={`flex items-start gap-3 cursor-pointer group ${!canEdit ? 'opacity-50 pointer-events-none' : ''}`}>
              <input 
                type="checkbox" 
                name="newComplaints"
                checked={settings.newComplaints}
                onChange={handleChange}
                disabled={!canEdit}
                className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500 mt-0.5"
              />
              <div>
                 <span className="text-sm font-semibold text-slate-900 block group-hover:text-indigo-600 transition-colors">New Customer Complaints</span>
                 <span className="text-xs text-slate-500">Immediate alerts when a buyer submits a new quality complaint or claim.</span>
              </div>
            </label>

            <label className={`flex items-start gap-3 cursor-pointer group ${!canEdit ? 'opacity-50 pointer-events-none' : ''}`}>
              <input 
                type="checkbox" 
                name="qcFailures"
                checked={settings.qcFailures}
                onChange={handleChange}
                disabled={!canEdit}
                className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500 mt-0.5"
              />
              <div>
                <span className="text-sm font-semibold text-slate-900 block group-hover:text-indigo-600 transition-colors">QC Failures & Critical Defects</span>
                <span className="text-xs text-slate-500">Get notified immediately when a QC inspection fails.</span>
              </div>
            </label>

            <label className={`flex items-start gap-3 cursor-pointer group ${!canEdit ? 'opacity-50 pointer-events-none' : ''}`}>
              <input 
                type="checkbox" 
                name="systemAlerts"
                checked={settings.systemAlerts}
                onChange={handleChange}
                disabled={!canEdit}
                className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500 mt-0.5"
              />
              <div>
                <span className="text-sm font-semibold text-slate-900 block group-hover:text-indigo-600 transition-colors">System Alerts</span>
                <span className="text-xs text-slate-500">Database backups, maintenance windows, and status updates.</span>
              </div>
            </label>

            <label className={`flex items-start gap-3 cursor-pointer group ${!canEdit ? 'opacity-50 pointer-events-none' : ''}`}>
              <input 
                type="checkbox" 
                name="newMessages"
                checked={settings.newMessages}
                onChange={handleChange}
                disabled={!canEdit}
                className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500 mt-0.5"
              />
              <div>
                <span className="text-sm font-semibold text-slate-900 block group-hover:text-indigo-600 transition-colors">Direct Messages</span>
                <span className="text-xs text-slate-500">Mentions and direct messages from other team members.</span>
              </div>
            </label>

            <label className={`flex items-start gap-3 cursor-pointer group ${!canEdit ? 'opacity-50 pointer-events-none' : ''}`}>
              <input 
                type="checkbox" 
                name="roleChanges"
                checked={settings.roleChanges}
                onChange={handleChange}
                disabled={!canEdit}
                className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500 mt-0.5"
              />
              <div>
                <span className="text-sm font-semibold text-slate-900 block group-hover:text-indigo-600 transition-colors">Role & Permission Changes</span>
                <span className="text-xs text-slate-500">Security-related events such as password resets and role assignment.</span>
              </div>
            </label>
            
            <label className={`flex items-start gap-3 cursor-pointer group ${!canEdit ? 'opacity-50 pointer-events-none' : ''}`}>
              <input 
                type="checkbox" 
                name="weeklyDigest"
                checked={settings.weeklyDigest}
                onChange={handleChange}
                disabled={!canEdit}
                className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500 mt-0.5"
              />
              <div>
                <span className="text-sm font-semibold text-slate-900 block group-hover:text-indigo-600 transition-colors">Weekly Digest</span>
                <span className="text-xs text-slate-500">A weekly summary of QC metrics and application activity.</span>
              </div>
            </label>

            <div className="col-span-1 md:col-span-2 pt-4 border-t border-slate-100">
               <h4 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2"><FileCheck className="w-4 h-4 text-slate-500" /> Document Control Notifications</h4>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                 <label className={`flex items-start gap-3 cursor-pointer group ${!canEdit ? 'opacity-50 pointer-events-none' : ''}`}>
                   <input 
                     type="checkbox" 
                     name="documentUpdates"
                     checked={settings.documentUpdates}
                     onChange={handleChange}
                     disabled={!canEdit}
                     className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500 mt-0.5"
                   />
                   <div>
                     <span className="text-sm font-semibold text-slate-900 block group-hover:text-indigo-600 transition-colors">Document Interactions</span>
                     <span className="text-xs text-slate-500">Get notified when a document you created or are associated with is updated or modified.</span>
                   </div>
                 </label>

                 <label className={`flex items-start gap-3 cursor-pointer group ${!canEdit ? 'opacity-50 pointer-events-none' : ''}`}>
                   <input 
                     type="checkbox" 
                     name="documentApprovals"
                     checked={settings.documentApprovals}
                     onChange={handleChange}
                     disabled={!canEdit}
                     className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500 mt-0.5"
                   />
                   <div>
                     <span className="text-sm font-semibold text-slate-900 block group-hover:text-indigo-600 transition-colors">Document Approvals</span>
                     <span className="text-xs text-slate-500">Receive alerts when your documents are approved or rejected.</span>
                   </div>
                 </label>

                 <label className={`flex items-start gap-3 cursor-pointer group ${!canEdit ? 'opacity-50 pointer-events-none' : ''}`}>
                   <input 
                     type="checkbox" 
                     name="documentPublished"
                     checked={settings.documentPublished}
                     onChange={handleChange}
                     disabled={!canEdit}
                     className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500 mt-0.5"
                   />
                   <div>
                     <span className="text-sm font-semibold text-slate-900 block group-hover:text-indigo-600 transition-colors">Document Published</span>
                     <span className="text-xs text-slate-500">Alerts when a document is officially published to the system.</span>
                   </div>
                 </label>
               </div>
            </div>
          </div>
        </div>

        {/* Do Not Disturb */}
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 p-4 border-b border-slate-200 bg-slate-50 flex items-center gap-2">
            <Clock className="w-4 h-4 text-slate-500" /> Do Not Disturb Schedule
          </h3>
          <div className="p-4 sm:p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h4 className="text-sm font-bold text-slate-900">Enable Do Not Disturb</h4>
                <p className="text-sm text-slate-500 mt-1">Pause all notifications during specified hours. Critical system alerts will still bypass this.</p>
              </div>
              <label className={`relative inline-flex items-center cursor-pointer shrink-0 ${!canEdit ? 'opacity-50 pointer-events-none' : ''}`}>
                <input type="checkbox" name="dndEnabled" checked={settings.dndEnabled} onChange={handleChange} disabled={!canEdit} className="sr-only peer" />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>

            <div className={`grid grid-cols-2 gap-6 p-4 rounded-xl border ${settings.dndEnabled ? 'border-indigo-100 bg-indigo-50/30' : 'border-slate-100 bg-slate-50 opacity-50 pointer-events-none transition-opacity'}`}>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Start Time</label>
                <input 
                  type="time" 
                  name="dndStart"
                  value={settings.dndStart}
                  onChange={handleChange}
                  disabled={!canEdit}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-indigo-500 text-sm bg-white disabled:bg-slate-100 disabled:text-slate-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">End Time</label>
                <input 
                  type="time" 
                  name="dndEnd"
                  value={settings.dndEnd}
                  onChange={handleChange}
                  disabled={!canEdit}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-indigo-500 text-sm bg-white disabled:bg-slate-100 disabled:text-slate-500"
                />
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
