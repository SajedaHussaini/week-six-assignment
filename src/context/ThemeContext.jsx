import React, { createContext, useState, useMemo, useContext } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { LocaleContext } from './LocaleContext';

export const ThemeContext = createContext();

export function ThemeProviderCustom({ children }) {
  const [mode, setMode] = useState('light');

  // const locale = LocaleContext?.locale || "en";
  const { locale } = useContext(LocaleContext);

  const theme = useMemo(() =>
    createTheme({
      direction: locale === 'fa' ? 'rtl' : 'ltr',
      palette: {
        mode,
        primary: { main: '#1976d2' }
      },
      typography: { fontFamily: locale === 'fa' ? 'Vazirmatn, Roboto, Helvetica, Arial, sans-serif' : 'Roboto, Arial, sans-serif' }
    }), [mode, locale]);

  const toggleTheme = () => setMode(m => (m === 'light' ? 'dark' : 'light'));

  React.useEffect(() => {
    document.body.setAttribute('data-theme', mode);
  }, [mode]);

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
}
