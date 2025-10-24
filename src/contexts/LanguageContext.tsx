import { createContext, useContext, useState, useRef, useEffect } from 'react';
import type { ReactNode } from 'react';
import { uiLabels } from '../data/stories';
import type { Language } from '../types';
import { useAnalytics } from './AnalyticsContext';

export type { Language };

export interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof typeof uiLabels.en) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('te');
  const langSwitchCount = useRef(0);
  const hasTrackedInitial = useRef(false);

  // Get analytics safely (may not be available yet on first render)
  let analytics;
  try {
    analytics = useAnalytics();
  } catch {
    // Analytics not available yet (still mounting), that's okay
    analytics = null;
  }

  // Track initial language on mount (once)
  useEffect(() => {
    if (analytics && !hasTrackedInitial.current) {
      analytics.trackLanguageSet(language);
      hasTrackedInitial.current = true;
    }
  }, [analytics]);

  const setLanguage = (newLang: Language) => {
    if (newLang !== language) {
      setLanguageState(newLang);
      langSwitchCount.current += 1;

      // Track language switch in analytics
      if (analytics) {
        analytics.trackLanguageSwitch(newLang, langSwitchCount.current);
      }
    }
  };

  const t = (key: keyof typeof uiLabels.en): string => {
    return uiLabels[language][key] || uiLabels.en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

// Re-export for clarity
export { LanguageContext };
