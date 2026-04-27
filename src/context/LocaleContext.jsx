import React, { createContext, useState } from 'react';
import en from '../i18n/en.json';
import fa from '../i18n/fa.json';

export const LocaleContext = createContext();

const LOCALES = {
  en: { ...en, dir: 'ltr' },
  fa: { ...fa, dir: 'rtl' }
};

export function LocaleProvider({ children }) {
  const [locale, setLocale] = useState('en');
  const t = (key, params = {}) => {
    const value = key
      .split('.')
      .reduce((acc, part) => (acc && acc[part] !== undefined ? acc[part] : undefined), LOCALES[locale]);
    const text = value !== undefined ? value : key;
    if (typeof text !== 'string') return text;
    return text.replace(/\$\{(\w+)\}/g, (match, p1) =>
      params[p1] !== undefined ? String(params[p1]) : match
    );
  };

  const changeLocale = lang => setLocale(lang);

  React.useEffect(() => {
    document.documentElement.dir = LOCALES[locale].dir;
    document.documentElement.lang = locale;
  }, [locale]);

  return (
    <LocaleContext.Provider value={{ locale, t, changeLocale }}>
      {children}
    </LocaleContext.Provider>
  );
}
