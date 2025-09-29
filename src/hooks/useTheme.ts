import { useLocalStorage } from './useLocalStorage';
import { useEffect, useCallback, useState } from 'react';

type Theme = 'light' | 'dark' | 'system';

export function useTheme() {
  const [storedTheme, setStoredTheme] = useLocalStorage<Theme>('theme', 'system');
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');

 
  useEffect(() => {
    const root = window.document.documentElement;

    const getPreferredTheme = () => {
      if (storedTheme === 'system') {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      }
      return storedTheme;
    };

    const theme = getPreferredTheme();
    setResolvedTheme(theme);

    root.classList.remove('light', 'dark');
    root.classList.add(theme);

    if (storedTheme === 'system') {
      const media = window.matchMedia('(prefers-color-scheme: dark)');
      const handler = () => {
        const sysTheme = media.matches ? 'dark' : 'light';
        setResolvedTheme(sysTheme);
        root.classList.remove('light', 'dark');
        root.classList.add(sysTheme);
      };
      media.addEventListener('change', handler);
      return () => media.removeEventListener('change', handler);
    }
  }, [storedTheme]);

  
  const toggleTheme = useCallback(() => {
    setStoredTheme(prev =>
      prev === 'light' ? 'dark' : prev === 'dark' ? 'system' : 'light'
    );
  }, [setStoredTheme]);

  return { theme: storedTheme, resolvedTheme, toggleTheme, setTheme: setStoredTheme };
}
