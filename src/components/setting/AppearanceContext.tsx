import { apiStorage } from '../../utils/apiStorage';
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
  buttonStyle: string;
  fontStyle: string;
  uiStyle: string;
  hideTopbar: boolean;
  uiSize: string;
  spacingMode: string;
}

const defaultState: AppearanceState = {
  theme: 'light',
  accent: 'indigo',
  layoutMode: 'fluid',
  backgroundWallpaper: 'none',
  sidebarStyle: 'light',
  topbarStyle: 'light',
  cardStyle: 'shadow',
  buttonStyle: 'rounded',
  fontStyle: 'inter',
  uiStyle: 'default',
  hideTopbar: false,
  uiSize: 'default',
  spacingMode: 'default'
};

interface AppearanceContextType {
  settings: AppearanceState;
  updateSettings: (newSettings: Partial<AppearanceState>) => void;
}

const AppearanceContext = createContext<AppearanceContextType | undefined>(undefined);

export function AppearanceProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<AppearanceState>(() => {
    try {
      const stored = apiStorage.getItem('aqm_appearance');
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
      apiStorage.setItem('aqm_appearance', JSON.stringify(updated));
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

    if (settings.uiStyle === 'brutalist') {
      document.documentElement.classList.add('brutalist-ui');
    } else {
      document.documentElement.classList.remove('brutalist-ui');
    }
    
    // Apply accent color modifier
    document.documentElement.setAttribute('data-accent', settings.accent);
    document.documentElement.setAttribute('data-button-style', settings.buttonStyle);
    document.documentElement.setAttribute('data-sidebar-style', settings.sidebarStyle);
    document.documentElement.setAttribute('data-topbar-style', settings.topbarStyle);
    document.documentElement.setAttribute('data-card-style', settings.cardStyle);
    document.documentElement.setAttribute('data-ui-style', settings.uiStyle);
    document.documentElement.setAttribute('data-spacing-mode', settings.spacingMode);
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
