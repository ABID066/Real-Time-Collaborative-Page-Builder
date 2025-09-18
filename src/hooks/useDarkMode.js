import { useEffect } from 'react';
import { useStore } from '../store/useStore';

export const useDarkMode = () => {
  const isDarkMode = useStore((state) => state.darkMode);

  useEffect(() => {
    const storedDarkMode = localStorage.getItem('darkMode');
    if (storedDarkMode !== null) {
      useStore.getState().toggleDarkMode(JSON.parse(storedDarkMode));
    }
  }, []);

  return isDarkMode;
};