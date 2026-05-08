import { apiStorage } from '../../utils/apiStorage';
import React, { useState, useRef } from 'react';
import { User, Mail, Shield, Camera, Save, Briefcase, Phone, MapPin, Lock, AlertCircle, CheckCircle2 } from 'lucide-react';

export function ProfileSettings() {
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [profile, setProfile] = useState(() => {
    const stored = apiStorage.getItem('userProfile');
    let email = 'admin@example.com';
    let role = 'Super Admin';
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        email = parsed.email || email;
        role = parsed.role || role;
        const [firstName, ...lastNameArr] = (parsed.name || 'Admin User').split(' ');
        return {
          firstName: firstName || 'Admin',
          lastName: lastNameArr.join(' ') || 'User',
          username: parsed.username || 'admin',
          email,
          role,
          phone: parsed.phone || '+1 (555) 123-4567',
          department: parsed.department || 'Quality Assurance',
          location: parsed.location || 'New York, USA',
          bio: parsed.bio || 'Quality management specialist with 10 years of experience in continuous improvement.',
          profileImageUrl: parsed.imageUrl || 'https://i.pravatar.cc/150?u=admin'
        };
      } catch(e) {}
    }
    return {
      firstName: 'Admin',
      lastName: 'User',
      username: 'admin',
      email,
      role,
      phone: '+1 (555) 123-4567',
      department: 'Quality Assurance',
      location: 'New York, USA',
      bio: 'Quality management specialist with 10 years of experience in continuous improvement.',
      profileImageUrl: 'https://i.pravatar.cc/150?u=admin'
    };
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
    setPasswordError('');
  };

  const handleSave = () => {
    setIsSaving(true);
    setSaveSuccess(false);
    setPasswordError('');

    const profileToStore = {
      name: `${profile.firstName} ${profile.lastName}`.trim(),
      username: profile.username,
      email: profile.email,
      role: profile.role,
      imageUrl: profile.profileImageUrl,
      phone: profile.phone,
      department: profile.department,
      location: profile.location,
      bio: profile.bio
    };

    // Check if we need to update password
    if (passwordData.newPassword || passwordData.currentPassword || passwordData.confirmPassword) {
      if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
        setPasswordError('Please fill in all password fields.');
        setIsSaving(false);
        return;
      }
      if (passwordData.newPassword !== passwordData.confirmPassword) {
        setPasswordError('New passwords do not match.');
        setIsSaving(false);
        return;
      }
      
      const storedUsersRaw = apiStorage.getItem('aqm_users');
      const currentUserRaw = apiStorage.getItem('aqm_current_user');
      if (storedUsersRaw && currentUserRaw) {
         try {
           let users = JSON.parse(storedUsersRaw);
           let currentUser = JSON.parse(currentUserRaw);
           if (!Array.isArray(users)) users = [];
           
           if (currentUser.password !== passwordData.currentPassword) {
             setPasswordError('Current password is incorrect.');
             setIsSaving(false);
             return;
           }
           
           // Update user details in lists if username changed
           const userIndex = users.findIndex((u: any) => u.email === currentUser.email);
           if (userIndex !== -1) {
              users[userIndex].password = passwordData.newPassword;
              users[userIndex].username = profile.username;
              users[userIndex].name = profileToStore.name;
              users[userIndex].imageUrl = profileToStore.imageUrl;
              apiStorage.setItem('aqm_users', JSON.stringify(users));
           }
           
           currentUser.password = passwordData.newPassword;
           currentUser.username = profile.username;
           currentUser.name = profileToStore.name;
           currentUser.imageUrl = profileToStore.imageUrl;
           apiStorage.setItem('aqm_current_user', JSON.stringify(currentUser));
           
           setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
         } catch(e) { console.error('Invalid JSON in users list or current user', e); }
      }
    } else {
        // Just updating the profile, need to update the username in the users list
        const storedUsersRaw = apiStorage.getItem('aqm_users');
        const currentUserRaw = apiStorage.getItem('aqm_current_user');
        if (storedUsersRaw && currentUserRaw) {
            try {
              let users = JSON.parse(storedUsersRaw);
              let currentUser = JSON.parse(currentUserRaw);
              if (!Array.isArray(users)) users = [];
              
              const userIndex = users.findIndex((u: any) => u.email === currentUser.email);
              if (userIndex !== -1) {
                  users[userIndex].username = profile.username;
                  users[userIndex].name = profileToStore.name;
                  users[userIndex].imageUrl = profileToStore.imageUrl;
                  apiStorage.setItem('aqm_users', JSON.stringify(users));
              }
              
              currentUser.username = profile.username;
              currentUser.name = profileToStore.name;
              currentUser.imageUrl = profileToStore.imageUrl;
              apiStorage.setItem('aqm_current_user', JSON.stringify(currentUser));
            } catch(e) {}
        }
    }
    
    // Save to local storage
    apiStorage.setItem('userProfile', JSON.stringify(profileToStore));
    
    // Dispatch custom event to notify other components (like Header)
    window.dispatchEvent(new CustomEvent('profile-updated', { detail: profileToStore }));
    
    setTimeout(() => {
      setIsSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }, 600);
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile(prev => ({ ...prev, profileImageUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="p-6 lg:p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900 mb-1">My Profile</h2>
          <p className="text-sm text-slate-500">Manage your personal information and profile settings.</p>
        </div>
        <div className="flex items-center gap-4">
          {saveSuccess && (
            <span className="flex items-center gap-1.5 text-sm text-emerald-600 font-medium animate-in fade-in">
              <CheckCircle2 className="w-4 h-4" /> Saved
            </span>
          )}
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-colors shadow-sm disabled:opacity-50"
          >
            {isSaving ? <span className="animate-spin text-white">⍥</span> : <Save className="w-4 h-4" />}
            {isSaving ? 'Saving...' : 'Save Profile'}
          </button>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-200 flex flex-col md:flex-row gap-4 sm:p-6 lg:p-8 items-start md:items-center">
          <div className="relative group cursor-pointer" onClick={handleImageClick}>
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg bg-slate-100 flex items-center justify-center relative">
              {profile.profileImageUrl ? (
                <img src={profile.profileImageUrl} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <span className="text-3xl font-bold text-indigo-600">
                  {profile.firstName.charAt(0)}{profile.lastName.charAt(0)}
                </span>
              )}
              <div className="absolute inset-0 bg-slate-900/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="w-6 h-6 text-white" />
              </div>
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleImageChange} 
              accept="image/*" 
              className="hidden" 
            />
          </div>
          <div className="flex-1 space-y-1">
            <h3 className="text-xl font-bold text-slate-900">{profile.firstName} {profile.lastName}</h3>
            <p className="text-slate-500 font-medium flex items-center gap-2">
              <Shield className="w-4 h-4 text-indigo-500" /> {profile.role}
            </p>
          </div>
        </div>

        <div className="p-4 sm:p-6 space-y-8">
          {/* Profile Setup */}
          <div className="space-y-6">
            <h3 className="text-md font-bold text-slate-900 border-b border-slate-100 pb-2">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:p-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                  <User className="w-4 h-4 text-slate-400" /> First Name
                </label>
                <input 
                  type="text" 
                  name="firstName"
                  value={profile.firstName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-indigo-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                  <User className="w-4 h-4 text-slate-400" /> Last Name
                </label>
                <input 
                  type="text" 
                  name="lastName"
                  value={profile.lastName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-indigo-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                  <User className="w-4 h-4 text-slate-400" /> Username
                </label>
                <input 
                  type="text" 
                  name="username"
                  value={profile.username}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-indigo-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-slate-400" /> Email Address
                </label>
                <input 
                  type="email" 
                  name="email"
                  value={profile.email}
                  disabled
                  title="Email cannot be changed directly here"
                  className="w-full px-3 py-2 border border-slate-200 bg-slate-50 text-slate-500 rounded-lg focus:outline-none text-sm cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                  <Phone className="w-4 h-4 text-slate-400" /> Phone Number
                </label>
                <input 
                  type="tel" 
                  name="phone"
                  value={profile.phone}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-indigo-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-slate-400" /> Department
                </label>
                <input 
                  type="text" 
                  name="department"
                  value={profile.department}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-indigo-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-slate-400" /> Location
                </label>
                <input 
                  type="text" 
                  name="location"
                  value={profile.location}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-indigo-500 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Short Bio</label>
              <textarea 
                name="bio"
                value={profile.bio}
                onChange={handleChange}
                rows={4}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-indigo-500 text-sm resize-none"
                placeholder="Tell us a little bit about yourself..."
              />
            </div>
          </div>

          {/* Password Settings */}
          <div className="space-y-6 pt-6 border-t border-slate-100 mt-6">
            <h3 className="text-md font-bold text-slate-900 border-b border-slate-100 pb-2">Change Password</h3>
            
            {passwordError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-md flex items-start gap-2 text-rose-700 text-sm">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <p>{passwordError}</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:p-6">
              <div className="md:col-span-2 max-w-md">
                <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                  <Lock className="w-4 h-4 text-slate-400" /> Current Password
                </label>
                <input 
                  type="password" 
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  placeholder="Enter current password"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-indigo-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                  <Lock className="w-4 h-4 text-slate-400" /> New Password
                </label>
                <input 
                  type="password" 
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  placeholder="Enter new password"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-indigo-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                  <Lock className="w-4 h-4 text-slate-400" /> Confirm New Password
                </label>
                <input 
                  type="password" 
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  placeholder="Confirm new password"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-indigo-500 text-sm"
                />
              </div>
            </div>
            
            <p className="text-xs text-slate-500">Leaving the password fields empty will keep your current password.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
