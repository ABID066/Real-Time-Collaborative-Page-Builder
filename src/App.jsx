import { useEffect } from 'react';
import Header from './components/Header';
import PageBuilder from './components/PageBuilder';
import { useStore } from './store/useStore';

const App = () => {
  const isDarkMode = useStore((state) => state.darkMode);

  // Initialize dark mode from localStorage on mount
  useEffect(() => {
    const storedDarkMode = localStorage.getItem('darkMode');
    if (storedDarkMode !== null) {
      useStore.getState().toggleDarkMode(JSON.parse(storedDarkMode));
    }
  }, []);

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <Header />
      <main className="py-8">
        <PageBuilder />
      </main>
    </div>
  );
};

export default App;