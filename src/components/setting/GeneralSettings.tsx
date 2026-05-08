import React, { useState, useEffect, useRef } from 'react';
import { Save, Upload, Building2, Globe2, Mail, Phone, MapPin, Monitor, CheckCircle2 } from 'lucide-react';
import { usePermissions } from '../../hooks/usePermissions';

export function GeneralSettings() {
  const { edit, manage } = usePermissions('Setting');
  const canEdit = edit || manage;
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    companyName: 'Acme Corp Quality Management',
    contactEmail: 'admin@acmecorp.com',
    contactPhone: '+1 (555) 123-4567',
    address: '123 Quality Street, Manufacturing District',
    language: 'en',
    timezone: 'UTC',
    dateFormat: 'YYYY-MM-DD',
    currency: 'USD',
    itemsPerPage: '25',
    exportFormat: 'PDF',
    firstDayOfWeek: 'monday',
  });
  
  const [logoBase64, setLogoBase64] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Load from localStorage on mount
    const savedData = localStorage.getItem('aqm_general_settings');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setFormData(prev => ({ ...prev, ...parsed }));
      } catch (e) {
        console.error('Failed to parse general settings', e);
      }
    }
    
    const savedLogo = localStorage.getItem('aqm_company_logo');
    if (savedLogo) {
      setLogoBase64(savedLogo);
    }
  }, []);

  const handleSave = () => {
    setIsSaving(true);
    setSaveSuccess(false);
    
    // Save to localStorage
    setTimeout(() => {
      localStorage.setItem('aqm_general_settings', JSON.stringify(formData));
      if (logoBase64) {
        localStorage.setItem('aqm_company_logo', logoBase64);
      } else {
        localStorage.removeItem('aqm_company_logo');
      }
      setIsSaving(false);
      setSaveSuccess(true);
      
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
      
      // Log activity
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
          module: 'General Settings',
          details: 'Updated global preferences',
          ipAddress: '192.168.1.1',
          status: 'Success'
        });
        localStorage.setItem('aqm_activity_log', JSON.stringify(activities.slice(0, 50)));
      } catch (e) {
        console.error(e);
      }
    }, 600);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setSaveSuccess(false);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert("File size exceeds 2MB limit.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setLogoBase64(event.target?.result as string);
      setSaveSuccess(false);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveLogo = () => {
    setLogoBase64(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setSaveSuccess(false);
  };

  return (
    <div className="p-6 lg:p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto space-y-8">
      <div>
        <h2 className="text-lg font-bold text-slate-900 mb-1">General Preferences</h2>
        <p className="text-sm text-slate-500">Update your company details and global display settings.</p>
      </div>

      <div className="space-y-6">
        {/* Company Logo Section */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 sm:p-6">
          <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-slate-500" />
            Company Logo
          </h3>
          <div className="flex items-center gap-4 sm:p-6">
            <div className="w-20 h-20 bg-white border border-slate-200 rounded-lg flex items-center justify-center shadow-sm overflow-hidden flex-shrink-0">
              {logoBase64 ? (
                <img src={logoBase64} alt="Company Logo" className="w-full h-full object-contain" />
              ) : (
                <span className="text-2xl font-black text-indigo-600">AQM</span>
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <input 
                  type="file" 
                  ref={fileInputRef}
                  className="hidden" 
                  accept="image/png, image/jpeg" 
                  onChange={handleLogoUpload}
                />
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  disabled={!canEdit}
                  className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Upload className="w-4 h-4" />
                  Upload New
                </button>
                <button 
                  onClick={handleRemoveLogo}
                  disabled={!logoBase64 || !canEdit}
                  className="px-4 py-2 text-sm font-semibold text-rose-600 hover:bg-rose-50 rounded-lg transition-colors disabled:opacity-50 disabled:hover:bg-transparent"
                >
                  Remove
                </button>
              </div>
              <p className="text-xs text-slate-500 mt-2 font-medium">Recommended size: 256x256px, PNG or JPG max 2MB.</p>
            </div>
          </div>
        </div>

        {/* Company Details */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-6 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-slate-500" />
            Company Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:p-6">
            <div className="col-span-full">
              <label className="block text-xs font-semibold text-slate-700 mb-1">Company Name</label>
              <input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                disabled={!canEdit}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors disabled:bg-slate-50 disabled:text-slate-500"
                placeholder="Enter company name"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Contact Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  name="contactEmail"
                  value={formData.contactEmail}
                  onChange={handleChange}
                  disabled={!canEdit}
                  className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors disabled:bg-slate-50 disabled:text-slate-500"
                  placeholder="contact@company.com"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  name="contactPhone"
                  value={formData.contactPhone}
                  onChange={handleChange}
                  disabled={!canEdit}
                  className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors disabled:bg-slate-50 disabled:text-slate-500"
                  placeholder="+1 (555) 000-0000"
                />
              </div>
            </div>
            <div className="col-span-full">
              <label className="block text-xs font-semibold text-slate-700 mb-1">Primary Address</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  disabled={!canEdit}
                  className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors disabled:bg-slate-50 disabled:text-slate-500"
                  placeholder="Street, City, Country"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Localization */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-6 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Globe2 className="w-4 h-4 text-slate-500" />
            Localization & Formatting
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:p-6">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">System Language</label>
              <select
                name="language"
                value={formData.language}
                onChange={handleChange}
                disabled={!canEdit}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors bg-white disabled:bg-slate-50 disabled:text-slate-500"
              >
                <option value="en">English (US)</option>
                <option value="en-gb">English (UK)</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Timezone</label>
              <select
                name="timezone"
                value={formData.timezone}
                onChange={handleChange}
                disabled={!canEdit}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors bg-white disabled:bg-slate-50 disabled:text-slate-500"
              >
                <option value="UTC">UTC (Universal Coordinated Time)</option>
                <option value="America/New_York">Eastern Time (US & Canada)</option>
                <option value="Europe/London">London</option>
                <option value="Asia/Tokyo">Tokyo</option>
                <option value="Asia/Dhaka">Dhaka (GMT+6)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Date Format</label>
              <select
                name="dateFormat"
                value={formData.dateFormat}
                onChange={handleChange}
                disabled={!canEdit}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors bg-white disabled:bg-slate-50 disabled:text-slate-500"
              >
                <option value="YYYY-MM-DD">YYYY-MM-DD (2026-05-03)</option>
                <option value="MM/DD/YYYY">MM/DD/YYYY (05/03/2026)</option>
                <option value="DD/MM/YYYY">DD/MM/YYYY (03/05/2026)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Base Currency</label>
              <select
                name="currency"
                value={formData.currency}
                onChange={handleChange}
                disabled={!canEdit}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors bg-white disabled:bg-slate-50 disabled:text-slate-500"
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="JPY">JPY (¥)</option>
                <option value="BDT">BDT (৳)</option>
              </select>
            </div>
          </div>
        </div>

        {/* System Preferences */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-6 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Monitor className="w-4 h-4 text-slate-500" />
            System Preferences
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:p-6">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Default Items Per Page</label>
              <select
                name="itemsPerPage"
                value={formData.itemsPerPage}
                onChange={handleChange}
                disabled={!canEdit}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors bg-white disabled:bg-slate-50 disabled:text-slate-500"
              >
                <option value="10">10 items</option>
                <option value="25">25 items</option>
                <option value="50">50 items</option>
                <option value="100">100 items</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Default Export Format</label>
              <select
                name="exportFormat"
                value={formData.exportFormat}
                onChange={handleChange}
                disabled={!canEdit}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors bg-white disabled:bg-slate-50 disabled:text-slate-500"
              >
                <option value="PDF">PDF Document (.pdf)</option>
                <option value="CSV">Comma Separated Values (.csv)</option>
                <option value="XLSX">Excel Spreadsheet (.xlsx)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">First Day of the Week</label>
              <select
                name="firstDayOfWeek"
                value={formData.firstDayOfWeek}
                onChange={handleChange}
                disabled={!canEdit}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors bg-white disabled:bg-slate-50 disabled:text-slate-500"
              >
                <option value="sunday">Sunday</option>
                <option value="monday">Monday</option>
                <option value="saturday">Saturday</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-6 border-t border-slate-200">
        <div className="text-sm font-medium">
          {saveSuccess && (
            <span className="flex items-center gap-1.5 text-emerald-600 animate-in fade-in slide-in-from-bottom-2">
              <CheckCircle2 className="w-5 h-5" />
              Settings saved successfully
            </span>
          )}
        </div>
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
          {isSaving ? 'Saving Changes...' : 'Save Preferences'}
        </button>
      </div>
    </div>
  );
}
