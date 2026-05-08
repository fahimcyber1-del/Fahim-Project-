import React, { useState, useEffect } from "react";
import { cn } from "../../lib/utils";
import { APP_MODULES, MODULE_GROUPS } from "../../config/modules";
import { ChevronLeft, ChevronRight, ChevronDown, ChevronRight as ChevronRightIcon, Layers, Package, ShieldCheck, Target, ClipboardList, BookOpen, Users, MessageCircle, Settings, Zap } from "lucide-react";
import { useAppearance } from "../setting/AppearanceContext";

interface SidebarProps {
  activeModuleId: string;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onModuleSelect: (id: string) => void;
  className?: string;
}

const GROUP_ICONS: Record<string, { icon: React.ElementType, color: string, bg: string, hoverColor: string, animation: string }> = {
  "Core Operations": { icon: Zap, color: "text-amber-500", bg: "bg-amber-100/50", hoverColor: "group-hover:text-amber-600", animation: "group-hover:-translate-y-0.5 group-hover:scale-105" },
  "Supply & Orders": { icon: Package, color: "text-blue-500", bg: "bg-blue-100/50", hoverColor: "group-hover:text-blue-600", animation: "group-hover:-translate-y-0.5 group-hover:scale-105" },
  "Quality & Inspection": { icon: ShieldCheck, color: "text-emerald-500", bg: "bg-emerald-100/50", hoverColor: "group-hover:text-emerald-600", animation: "group-hover:-translate-y-0.5 group-hover:scale-105" },
  "Goals & Performance": { icon: Target, color: "text-rose-500", bg: "bg-rose-100/50", hoverColor: "group-hover:text-rose-600", animation: "group-hover:-translate-y-0.5 group-hover:scale-105" },
  "Audit & Compliance": { icon: ClipboardList, color: "text-indigo-500", bg: "bg-indigo-100/50", hoverColor: "group-hover:text-indigo-600", animation: "group-hover:-translate-y-0.5 group-hover:scale-105" },
  "Docs & Processes": { icon: BookOpen, color: "text-cyan-500", bg: "bg-cyan-100/50", hoverColor: "group-hover:text-cyan-600", animation: "group-hover:-translate-y-0.5 group-hover:scale-105" },
  "HR & Management": { icon: Users, color: "text-purple-500", bg: "bg-purple-100/50", hoverColor: "group-hover:text-purple-600", animation: "group-hover:-translate-y-0.5 group-hover:scale-105" },
  "Communication": { icon: MessageCircle, color: "text-pink-500", bg: "bg-pink-100/50", hoverColor: "group-hover:text-pink-600", animation: "group-hover:-translate-y-0.5 group-hover:scale-105" },
  "System & Reports": { icon: Settings, color: "text-slate-500", bg: "bg-slate-100/50", hoverColor: "group-hover:text-slate-600", animation: "group-hover:rotate-90 group-hover:scale-105" },
};

export function Sidebar({ activeModuleId, isExpanded, onToggleExpand, onModuleSelect, className }: SidebarProps) {
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    MODULE_GROUPS.forEach(g => {
      // Find if active module is in this group
      const hasActive = APP_MODULES.some(m => m.group === g && m.id === activeModuleId);
      initial[g] = hasActive; // only string true if it contains active module
    });
    return initial;
  });

  const [userProfile, setUserProfile] = useState({
    name: 'Admin User',
    role: 'Super Admin',
    imageUrl: 'https://i.pravatar.cc/150?u=admin'
  });
  
  const { settings } = useAppearance();

  const [roles, setRoles] = useState<any[]>([]);
  
  useEffect(() => {
    const stored = localStorage.getItem('userProfile');
    if (stored) {
      try {
        setUserProfile(JSON.parse(stored));
      } catch (e) {}
    }

    const storedRoles = localStorage.getItem('aqm_roles');
    if (storedRoles) {
      try {
        setRoles(JSON.parse(storedRoles));
      } catch (e) {}
    }

    const handleProfileUpdate = (e: CustomEvent) => {
      setUserProfile(e.detail);
    };

    window.addEventListener('profile-updated', handleProfileUpdate as EventListener);
    return () => window.removeEventListener('profile-updated', handleProfileUpdate as EventListener);
  }, []);

  // Update expanded group if active module changes from outside
  useEffect(() => {
    const activeModule = APP_MODULES.find(m => m.id === activeModuleId);
    if (activeModule) {
      setExpandedGroups(prev => ({ ...prev, [activeModule.group]: true }));
    }
  }, [activeModuleId]);

  const userRoleData = Array.isArray(roles) && userProfile ? roles.find(r => r.name === userProfile?.role) : null;
  const isSuperAdmin = userProfile?.role === 'Super Admin';

  const hasModulePermission = (moduleLabel: string) => {
    if (isSuperAdmin) return true;
    if (!userRoleData?.permissions) return true; // Default allow if no permissions set
    return userRoleData.permissions[moduleLabel]?.view === true;
  };

  const toggleGroup = (group: string) => {
    if (!isExpanded) {
      onToggleExpand();
      setExpandedGroups(prev => ({ ...prev, [group]: true }));
    } else {
      setExpandedGroups(prev => ({ ...prev, [group]: !prev[group] }));
    }
  };

  const isDark = settings.sidebarStyle === 'dark';

  const getSidebarClass = () => {
    switch(settings.sidebarStyle) {
      case 'dark': return 'bg-slate-900 border-slate-800 text-slate-300';
      case 'glass': return 'bg-white/60 backdrop-blur-md border-r-white/20 text-slate-700';
      case 'light':
      default: return 'bg-white border-slate-200 text-slate-700';
    }
  };

  const getHoverClass = () => {
    if (isDark) return 'hover:bg-slate-800 text-slate-300';
    return 'hover:bg-slate-50 text-slate-500';
  };

  const getActiveItemClass = () => {
    if (isDark) return 'bg-slate-800 text-primary-400 shadow-sm ring-1 ring-slate-700';
    return 'bg-primary-50 text-primary-600 shadow-sm ring-1 ring-primary-200';
  };

  return (
    <div className={cn("flex flex-col border-r h-screen shrink-0 transition-all duration-300 ease-in-out", isExpanded ? "w-64" : "w-20", getSidebarClass(), className)}>
      <div className={cn("p-6 border-b mb-2 sticky top-0 z-10 w-full flex items-center justify-between", isDark ? "border-slate-800 bg-slate-900" : "border-slate-100 bg-transparent", !isExpanded && "px-2 py-4")}>
        {isExpanded ? (
          <>
            <h1 className={cn("text-xl font-black tracking-tighter", isDark ? "text-primary-400" : "text-primary-600")}>GQMS<span className={isDark ? "text-white" : "text-slate-950"}>.ERP</span></h1>
            <button onClick={onToggleExpand} className={cn("p-1 rounded", isDark ? "hover:bg-slate-800 text-slate-400" : "hover:bg-slate-100 text-slate-500")}>
              <ChevronLeft className="w-5 h-5" />
            </button>
          </>
        ) : (
          <button onClick={onToggleExpand} className={cn("w-full flex justify-center p-2 rounded-lg transition-colors", isDark ? "hover:bg-slate-800 text-slate-400 hover:text-primary-400" : "hover:bg-slate-100 text-slate-700 hover:text-primary-600 bg-slate-50")}>
            <ChevronRight className="w-5 h-5" />
          </button>
        )}
      </div>
      
      {isExpanded && (
        <p className={cn("text-[10px] uppercase tracking-widest font-bold px-6 mb-4", isDark ? "text-slate-500" : "text-slate-500")}>Garment Quality</p>
      )}
      
      <div className={cn("flex-1 w-full space-y-1 overflow-y-auto scrollbar-thin text-xs font-medium tracking-wide pb-4", isExpanded ? "px-4" : "px-2")}>
        {MODULE_GROUPS.map((group) => {
          const groupModulesRaw = APP_MODULES.filter((m) => m.group === group);
          const groupModules = groupModulesRaw.filter(m => hasModulePermission(m.label));
          
          if (groupModules.length === 0) return null; // Hide empty groups

          const isGroupExpanded = expandedGroups[group];
          const showItems = isGroupExpanded; // Show items if group is expanded, even when sidebar is collapsed
          const GroupIconWrapper = GROUP_ICONS[group] || { icon: Layers, color: "text-slate-500", bg: "bg-slate-100", hoverColor: "group-hover:text-slate-500", animation: "group-hover:scale-110" };
          const GIcon = GroupIconWrapper.icon;

          return (
            <div key={group} className="mb-2 w-full">
              {isExpanded ? (
                <button 
                  onClick={() => toggleGroup(group)}
                  className={cn("flex items-center justify-between w-full px-2 py-2 mb-1 rounded-md transition-colors group/header", isDark ? "hover:bg-slate-800" : "hover:bg-slate-50")}
                >
                  <div className="flex items-center gap-2">
                    <div className={cn("p-1.5 rounded-md flex items-center justify-center transition-all duration-300 shadow-sm", isDark ? "opacity-90" : "", GroupIconWrapper.bg, GroupIconWrapper.color, "group-hover/header:rotate-6 group-hover/header:scale-110")}>
                      <GIcon className="w-3.5 h-3.5" strokeWidth={1.5} />
                    </div>
                    <h3 className={cn("text-[11px] font-bold uppercase tracking-wider transition-colors", isDark ? "text-slate-400 group-hover/header:text-slate-200" : "text-slate-500 group-hover/header:text-slate-700")}>
                      {group}
                    </h3>
                  </div>
                  {isGroupExpanded ? (
                    <ChevronDown className={cn("w-3.5 h-3.5", isDark ? "text-slate-500 group-hover/header:text-slate-300" : "text-slate-400 group-hover/header:text-slate-600")} />
                  ) : (
                    <ChevronRightIcon className={cn("w-3.5 h-3.5", isDark ? "text-slate-500 group-hover/header:text-slate-300" : "text-slate-400 group-hover/header:text-slate-600")} />
                  )}
                </button>
              ) : (
                <button 
                  onClick={() => toggleGroup(group)}
                  className={cn("w-full flex items-center justify-center p-3 mb-1 rounded-xl transition-all duration-300 group/header relative", isGroupExpanded && isExpanded ? (isDark ? "bg-slate-800 shadow-inner" : "bg-slate-100 shadow-inner") : (isDark ? "hover:bg-slate-800" : "hover:bg-slate-50"))}
                >
                  <div className={cn("p-2 rounded-lg flex items-center justify-center transition-all duration-300 shadow-sm", isDark ? "opacity-90" : "", GroupIconWrapper.bg, GroupIconWrapper.color, "group-hover/header:rotate-6 group-hover/header:scale-110")}>
                    <GIcon className="w-5 h-5" strokeWidth={1.5} />
                  </div>
                  {/* Indicator dot if active */}
                  {groupModules.some(m => m.id === activeModuleId) && (
                    <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-blue-500 border-2 border-white ring-1 ring-white shadow-sm"></div>
                  )}
                  {/* Custom Tooltip */}
                  <div className={cn(
                    "absolute left-full ml-4 px-2 py-1.5 text-xs font-semibold rounded shadow-md opacity-0 invisible group-hover/header:opacity-100 group-hover/header:visible transition-all duration-200 z-50 whitespace-nowrap",
                    isDark ? "bg-slate-700 text-white" : "bg-slate-800 text-white"
                  )}>
                    {group}
                    <div className="absolute left-0 top-1/2 -translate-x-1 -translate-y-1/2 w-2 h-2 bg-inherit transform rotate-45"></div>
                  </div>
                </button>
              )}
              {showItems && (
                <div className={cn("flex flex-col space-y-1 w-full", !isExpanded && "items-center mt-1")}>
                  {groupModules.map((module) => {
                    const isActive = activeModuleId === module.id;
                    const Icon = module.icon;
                    return (
                      <button
                        key={module.id}
                        onClick={() => onModuleSelect(module.id)}
                        className={cn(
                          "group flex items-center gap-3 py-2 rounded-md transition-all duration-300 relative",
                          isExpanded ? "w-full px-2" : "w-12 justify-center",
                          isActive
                            ? getActiveItemClass()
                            : cn(getHoverClass(), isDark ? "hover:text-slate-200" : "hover:text-slate-800")
                        )}
                      >
                        <div className={cn("flex items-center justify-center rounded-md transition-all duration-300", isActive ? "scale-110" : "group-hover:scale-110 group-hover:-translate-y-0.5", !isExpanded && isActive && cn("p-1 shadow-sm", isDark ? "bg-slate-800" : "bg-white"))}>
                          <Icon
                            strokeWidth={isActive ? 2 : 1.5}
                            className={cn(
                              "h-4 w-4 shrink-0 transition-all duration-500",
                              isActive ? (isDark ? "text-blue-400" : GroupIconWrapper.color) : cn(GroupIconWrapper.color, "opacity-75 group-hover:opacity-100"),
                              isActive ? "drop-shadow-sm" : ""
                            )}
                          />
                        </div>
                        {isExpanded && <span className={cn("truncate transition-colors font-semibold", isActive ? (isDark ? "text-white" : "text-slate-900") : "")}>{module.label}</span>}
                        {/* Custom Tooltip for Items */}
                        {!isExpanded && (
                          <div className={cn(
                            "absolute left-full ml-4 px-2 py-1.5 text-xs font-semibold rounded shadow-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 whitespace-nowrap",
                            isDark ? "bg-slate-700 text-white" : "bg-slate-800 text-white"
                          )}>
                            {module.label}
                            <div className="absolute left-0 top-1/2 -translate-x-1 -translate-y-1/2 w-2 h-2 bg-inherit transform rotate-45"></div>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      <div className={cn("p-4 border-t cursor-pointer transition-colors relative group/profile", isDark ? "border-slate-800 hover:bg-slate-800" : "border-slate-100 hover:bg-slate-50", !isExpanded && "p-2")} onClick={() => {
        window.dispatchEvent(new CustomEvent('app-navigate', { detail: { module: 'setting', tab: 'profile' } }));
      }}>
        <div className={cn("rounded flex items-center gap-3", isExpanded ? (isDark ? "p-3 bg-slate-800/50" : "p-3 bg-slate-50") : "justify-center p-2 transition-colors")}>
          <div className="w-10 h-10 rounded-full bg-primary-100 border border-primary-200 flex items-center justify-center font-black text-primary-600 text-sm shrink-0 shadow-sm overflow-hidden">
            {userProfile.imageUrl ? (
              <img src={userProfile.imageUrl} alt={userProfile.name} className="w-full h-full object-cover" />
            ) : (
              (userProfile.name || 'A').charAt(0).toUpperCase()
            )}
          </div>
          {isExpanded && (
            <div className="min-w-0">
              <p className={cn("text-[13px] font-bold truncate", isDark ? "text-slate-200" : "text-slate-900")}>{userProfile.name}</p>
              <p className={cn("text-[11px] truncate mt-0.5", isDark ? "text-slate-400" : "text-slate-500")}>{userProfile.role}</p>
            </div>
          )}
          {/* Custom Tooltip for Profile */}
          {!isExpanded && (
            <div className={cn(
              "absolute left-full ml-4 px-3 py-2 text-xs font-semibold rounded shadow-md opacity-0 invisible group-hover/profile:opacity-100 group-hover/profile:visible transition-all duration-200 z-50 whitespace-nowrap",
              isDark ? "bg-slate-700 text-white" : "bg-slate-800 text-white"
            )}>
              <div className="font-bold text-sm mb-0.5">{userProfile.name}</div>
              <div className="text-slate-300 font-medium">{userProfile.role}</div>
              <div className="absolute left-0 top-1/2 -translate-x-1 -translate-y-1/2 w-2 h-2 bg-inherit transform rotate-45"></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
