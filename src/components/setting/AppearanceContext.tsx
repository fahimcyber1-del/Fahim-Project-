import React, { createContext, useContext, useState, useEffect } from 'react';

export interface AppearanceState {
  theme: string;
  accent: string;
  layoutMode: string;
  backgroundWallpaper: string;
  customWallpaperUrl?: string;
  sidebarStyle: string;
  topbarStyle: string;
  cardStyle: string;
  fontStyle: string;
}

const defaultState: AppearanceState = {
  theme: 'light',
  accent: 'indigo',
  layoutMode: 'fluid',
  backgroundWallpaper: 'none',
  sidebarStyle: 'light',
  topbarStyle: 'light',
  cardStyle: 'shadow',
  fontStyle: 'inter'
};

interface AppearanceContextType {
  settings: AppearanceState;
  updateSettings: (newSettings: Partial<AppearanceState>) => void;
}

const AppearanceContext = createContext<AppearanceContextType | undefined>(undefined);

export function AppearanceProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<AppearanceState>(() => {
    try {
      const stored = localStorage.getItem('aqm_appearance');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (typeof parsed === 'object' && parsed !== null) {
          return { ...defaultState, ...parsed };
        }
      }
    } catch (e) {
      console.error(e);
    }
    return defaultState;
  });

  const updateSettings = (newSettings: Partial<AppearanceState>) => {
    setSettings(prev => {
      const updated = { ...prev, ...newSettings };
      localStorage.setItem('aqm_appearance', JSON.stringify(updated));
      return updated;
    });
  };

  useEffect(() => {
    // Apply dark mode at root
    if (settings.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // Apply accent color modifier
    document.documentElement.setAttribute('data-accent', settings.accent);
  }, [settings]);

  const getFontClass = () => {
    switch (settings.fontStyle) {
      case 'roboto': return 'font-roboto';
      case 'space-grotesk': return 'font-space-grotesk';
      case 'inter':
      default: return 'font-inter';
    }
  };

  return (
    <AppearanceContext.Provider value={{ settings, updateSettings }}>
      <div 
        className={`w-full min-h-screen relative ${getFontClass()}`}
      >
        {children}
      </div>
    </AppearanceContext.Provider>
  );
}

export function useAppearance() {
  const context = useContext(AppearanceContext);
  if (context === undefined) {
    throw new Error('useAppearance must be used within an AppearanceProvider');
  }
  return context;
}
