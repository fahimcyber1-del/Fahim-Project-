import React, { useState, useRef, useEffect } from "react";
import { Bell, Menu, User, Settings, LogOut, FileText, CheckCircle2, Inbox } from "lucide-react";
import { useAppearance } from "../setting/AppearanceContext";
import { cn } from "../../lib/utils";

interface HeaderProps {
  title: string;
  onMenuToggle: () => void;
}

export function Header({ title, onMenuToggle }: HeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [userProfile, setUserProfile] = useState({
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'Super Admin',
    imageUrl: 'https://i.pravatar.cc/150?u=admin'
  });
  const [currentTime, setCurrentTime] = useState(new Date());
  const [userIp, setUserIp] = useState("Loading IP...");
  
  const notificationsRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const logoutRef = useRef<HTMLDivElement>(null);
  
  const { settings } = useAppearance();

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    
    fetch('https://api.ipify.org?format=json')
      .then(res => res.json())
      .then(data => setUserIp(data.ip))
      .catch(() => setUserIp("Unknown IP"));

    const stored = localStorage.getItem('userProfile');
    if (stored) {
      try {
        setUserProfile(JSON.parse(stored));
      } catch (e) {}
    }

    const handleProfileUpdate = (e: CustomEvent) => {
      setUserProfile(e.detail);
    };

    window.addEventListener('profile-updated', handleProfileUpdate as EventListener);

    function handleClickOutside(event: MouseEvent) {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
      if (logoutRef.current && !logoutRef.current.contains(event.target as Node)) {
        setShowLogoutConfirm(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      clearInterval(timer);
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener('profile-updated', handleProfileUpdate as EventListener);
    };
  }, []);

  const notifications = [
    { id: 1, title: 'Upcoming Inspection', desc: 'Final inspection scheduled for PO #8820 tomorrow.', time: '10 mins ago', icon: FileText, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { id: 2, title: 'New Audit Finding', desc: 'Critical non-conformance logged in Line 4 by external auditor.', time: '1 hour ago', icon: CheckCircle2, color: 'text-amber-600', bg: 'bg-amber-50' },
    { id: 3, title: 'Overdue CAPA Action', desc: 'Root cause analysis for Defect #329 is overdue by 2 days.', time: '3 hours ago', icon: Bell, color: 'text-rose-600', bg: 'bg-rose-50' },
  ];

  const getTopbarClass = () => {
    switch(settings.topbarStyle) {
      case 'dark': return 'bg-slate-900 border-slate-800 text-slate-100';
      case 'glass': return 'bg-white/60 backdrop-blur-md border-white/20';
      case 'light':
      default: return 'bg-white border-slate-200';
    }
  };

  const isDark = settings.topbarStyle === 'dark';

  return (
    <header className={cn("flex h-16 shrink-0 items-center justify-between border-b px-4 md:px-8 z-[9999] sticky top-0", getTopbarClass())}>
      <button
        onClick={onMenuToggle}
        className={cn("inline-flex items-center justify-center rounded-md p-2 md:hidden", isDark ? "text-slate-300 hover:bg-slate-800" : "text-slate-500 hover:bg-slate-100")}
      >
        <Menu className="h-5 w-5" />
        <span className="sr-only">Toggle menu</span>
      </button>
      
      <div className="flex flex-1 items-center gap-4">
        <h2 className={cn("text-xl font-black uppercase tracking-tighter hidden sm:block truncate", isDark ? "text-white" : "text-slate-950")}>
          {title}
        </h2>
      </div>

      <div className="flex items-center gap-3 md:gap-5">
        <button 
          title="Inbox"
          onClick={() => window.dispatchEvent(new CustomEvent('app-navigate', { detail: { module: 'communication_portal' } }))}
          className={cn("relative flex h-9 w-9 items-center justify-center rounded transition-colors", isDark ? "text-slate-300 hover:bg-slate-800" : "text-slate-500 hover:bg-slate-100")}
        >
          <Inbox className="h-4 w-4" />
        </button>
        
        <div className="relative" ref={notificationsRef}>
          <button 
            title="Notifications"
            onClick={() => { setShowNotifications(!showNotifications); setShowProfileMenu(false); }}
            className={cn("relative flex h-9 w-9 items-center justify-center rounded transition-colors", isDark ? "text-slate-300 hover:bg-slate-800" : "text-slate-500 hover:bg-slate-100")}
          >
            <Bell className="h-4 w-4" />
            <span className="absolute top-2 right-2 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
            </span>
          </button>
          
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 z-[10000] overflow-hidden">
              <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <span className="font-bold text-slate-900">Notifications</span>
                <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">2 New</span>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.map(notif => (
                  <div key={notif.id} className="px-4 py-3 border-b border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer flex gap-3 text-left">
                    <div className={`mt-0.5 p-2 rounded-lg shrink-0 ${notif.bg} ${notif.color}`}>
                      <notif.icon className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{notif.title}</p>
                      <p className="text-xs text-slate-500 mt-0.5 leading-snug">{notif.desc}</p>
                      <p className="text-xs font-medium text-slate-400 mt-1">{notif.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div 
                className="px-4 py-2 text-center border-t border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors cursor-pointer"
                onClick={() => {
                  window.dispatchEvent(new CustomEvent('app-navigate', { detail: { module: 'notifications' } }));
                  setShowNotifications(false);
                }}
              >
                <span className="text-xs font-bold text-indigo-600">View All Notifications</span>
              </div>
            </div>
          )}
        </div>
        
        <div className={cn("h-6 w-px", isDark ? "bg-slate-700" : "bg-slate-200")}></div>
        
        <div className="relative" ref={profileRef}>
          <button 
            onClick={() => { setShowProfileMenu(!showProfileMenu); setShowNotifications(false); }}
            className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 overflow-hidden border-2 flex-shrink-0 ${showProfileMenu ? 'border-primary-500' : 'border-transparent'} hover:border-primary-300 ${isDark ? 'focus:ring-offset-slate-900' : 'focus:ring-offset-white'}`}
          >
            {userProfile.imageUrl ? (
              <img src={userProfile.imageUrl} alt={userProfile.name} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-primary-50 text-primary-700">
                <User className="h-4 w-4" />
              </div>
            )}
          </button>
          
          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 z-[10000] overflow-hidden">
              <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/50 text-left">
                <p className="text-sm font-bold text-slate-900">{userProfile.name}</p>
                <p className="text-xs text-slate-500 truncate mt-0.5">{userProfile.email}</p>
                <div className="mt-1.5 inline-flex items-center rounded bg-primary-100 px-1.5 py-0.5 text-[10px] font-bold text-primary-700 uppercase tracking-wider">
                  {userProfile.role}
                </div>
              </div>
              <div className="p-1.5">
                <button 
                  onClick={() => { 
                    setShowProfileMenu(false); 
                    window.dispatchEvent(new CustomEvent('app-navigate', { detail: { module: 'setting', tab: 'profile' } }));
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-600 font-medium rounded-lg hover:bg-slate-50 hover:text-indigo-600 transition-colors text-left"
                >
                  <User className="w-4 h-4 shrink-0" /> Edit Profile
                </button>
                <button 
                  onClick={() => { 
                    setShowProfileMenu(false); 
                    window.dispatchEvent(new CustomEvent('app-navigate', { detail: { module: 'setting', tab: 'appearance' } }));
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-600 font-medium rounded-lg hover:bg-slate-50 hover:text-indigo-600 transition-colors text-left"
                >
                  <Settings className="w-4 h-4 shrink-0" /> Settings
                </button>
              </div>
              <div className="p-1.5 border-t border-slate-100">
                <button 
                  onClick={() => { 
                    setShowProfileMenu(false); 
                    window.dispatchEvent(new Event('app-logout')); 
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg text-rose-600 hover:bg-rose-50 transition-colors text-left"
                >
                  <LogOut className="w-4 h-4 shrink-0" /> Sign out
                </button>
              </div>
            </div>
          )}
        </div>

        <div className={cn("hidden md:flex items-center gap-3 pl-3 ml-1 border-l", isDark ? "border-slate-700" : "border-slate-200")}>
          <div className={cn("flex flex-col text-right", isDark ? "text-slate-400" : "text-slate-500")}>
            <div className={cn("flex gap-1.5 justify-end text-xs font-bold font-mono tracking-tight", isDark ? "text-slate-200" : "text-slate-800")}>
              <span>{currentTime.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</span>
              <span className="opacity-50">•</span>
              <span>{currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
            </div>
            <div className="text-[9px] uppercase tracking-widest font-semibold mt-0.5 opacity-70">IP: {userIp}</div>
          </div>

          <div className="relative" ref={logoutRef}>
            <button 
              title="Logout"
              onClick={() => setShowLogoutConfirm(!showLogoutConfirm)}
              className={cn("relative flex h-9 w-9 items-center justify-center rounded-lg transition-all border shadow-sm", isDark ? "bg-slate-800 border-slate-700 text-rose-400 hover:bg-slate-700" : "bg-white border-slate-200 text-rose-600 hover:bg-rose-50 hover:border-rose-200 hover:text-rose-700")}
            >
              <LogOut className="h-4 w-4" />
            </button>
            {showLogoutConfirm && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-200 z-[10000] overflow-hidden p-3 animate-in fade-in slide-in-from-top-2">
                <p className="text-xs font-bold text-slate-700 text-center mb-3">Are you sure you want to log out?</p>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setShowLogoutConfirm(false)}
                    className="flex-1 px-2 py-1.5 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={() => {
                      setShowLogoutConfirm(false);
                      window.dispatchEvent(new Event('app-logout'));
                    }}
                    className="flex-1 px-2 py-1.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-md transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
