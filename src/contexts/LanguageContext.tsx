import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import { uiLabels } from '../data/stories';
import type { Language } from '../types';

export type { Language };

export interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof typeof uiLabels.en) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('te');

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
