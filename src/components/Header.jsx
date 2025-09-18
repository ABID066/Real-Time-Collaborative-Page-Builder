import { Download, Moon, Redo, Save, Sun, Undo } from 'lucide-react';
import { useStore } from '../store/useStore';

const Header = () => {
  const isDarkMode = useStore((state) => state.darkMode);
  
  const handleToggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    useStore.getState().toggleDarkMode();
    localStorage.setItem('darkMode', JSON.stringify(newDarkMode));
  };
  
  const handleUndo = () => {
    useStore.getState().undo();
  };
  
  const handleRedo = () => {
    useStore.getState().redo();
  };
  
  // Keep these as functions that return values
  const exportAsHtml = () => useStore.getState().exportAsHtml();
  const saveToStorage = () => useStore.getState().saveToStorage();

  const handleExport = () => {
    const html = exportAsHtml();
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'page-export.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleSave = () => {
    saveToStorage();
    alert('Page saved successfully!');
  };

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0 flex items-center">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Page Builder</h1>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={handleUndo}
              className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Undo"
            >
              <Undo size={20} className="text-gray-600 dark:text-gray-300" />
            </button>
            <button
              onClick={handleRedo}
              className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Redo"
            >
              <Redo size={20} className="text-gray-600 dark:text-gray-300" />
            </button>
            <button
              onClick={handleSave}
              className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Save"
            >
              <Save size={20} className="text-gray-600 dark:text-gray-300" />
            </button>
            <button
              onClick={handleExport}
              className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Export as HTML"
            >
              <Download size={20} className="text-gray-600 dark:text-gray-300" />
            </button>
            <button
              onClick={handleToggleDarkMode}
              className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? (
                <Sun className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              ) : (
                <Moon className="h-5 w-5 text-gray-500" />
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;