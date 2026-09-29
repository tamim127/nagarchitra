'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { DICTIONARY, BN_TO_EN_FALLBACK, Language } from '@/data/translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  isBn: boolean;
  isEn: boolean;
  t: (keyOrEn: string, bnText?: string) => string;
  formatNumber: (num: number | string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const BN_NUMERALS = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
const EN_NUMERALS_MAP: Record<string, string> = {
  '০': '0',
  '১': '1',
  '২': '2',
  '৩': '3',
  '৪': '4',
  '৫': '5',
  '৬': '6',
  '৭': '7',
  '৮': '8',
  '৯': '9',
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('bn');

  useEffect(() => {
    const saved = localStorage.getItem('nagarchitra_lang') as Language;
    if (saved && (saved === 'en' || saved === 'bn')) {
      setLanguageState(saved);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('nagarchitra_lang', lang);
  };

  const toggleLanguage = () => {
    const next = language === 'en' ? 'bn' : 'en';
    setLanguage(next);
  };

  const t = (keyOrEn: string, bnText?: string): string => {
    // 1. Explicit bilingual call: t("English Text", "বাংলা টেক্সট")
    if (bnText !== undefined) {
      return language === 'bn' ? bnText : keyOrEn;
    }

    // 2. Dictionary key lookup (e.g. 'nav.home', 'footer.tagline')
    const dict = DICTIONARY[language];
    if (dict && dict[keyOrEn]) {
      return dict[keyOrEn];
    }

    // 3. If in English mode, check if the string passed was a common Bengali phrase and auto-translate
    if (language === 'en') {
      const trimmed = keyOrEn.trim();
      if (BN_TO_EN_FALLBACK[trimmed]) {
        return BN_TO_EN_FALLBACK[trimmed];
      }
      // Also check dictionary reverse fallback
      for (const [k, v] of Object.entries(DICTIONARY.bn)) {
        if (v === trimmed && DICTIONARY.en[k]) {
          return DICTIONARY.en[k];
        }
      }
    }

    // 4. Default return keyOrEn
    return keyOrEn;
  };

  const formatNumber = (num: number | string): string => {
    const str = String(num);
    if (language === 'en') {
      // Convert any Bengali numerals to English
      return str.replace(/[০-৯]/g, (d) => EN_NUMERALS_MAP[d] || d);
    }
    // Convert English numerals to Bengali
    return str.replace(/\d/g, (d) => BN_NUMERALS[parseInt(d, 10)]);
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        toggleLanguage,
        isBn: language === 'bn',
        isEn: language === 'en',
        t,
        formatNumber,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
