import { useState } from 'react';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import css from 'react-syntax-highlighter/dist/esm/languages/hljs/css';
import js from 'react-syntax-highlighter/dist/esm/languages/hljs/javascript';
import python from 'react-syntax-highlighter/dist/esm/languages/hljs/python';
import html from 'react-syntax-highlighter/dist/esm/languages/hljs/xml';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { useStore } from '../../store/useStore';

// Register languages
SyntaxHighlighter.registerLanguage('javascript', js);
SyntaxHighlighter.registerLanguage('python', python);
SyntaxHighlighter.registerLanguage('css', css);
SyntaxHighlighter.registerLanguage('html', html);

const CodeBlock = ({ block, isSelected }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [code, setCode] = useState(block.content.code || '');
  const [language, setLanguage] = useState(block.content.language || 'javascript');
  const updateBlock = useStore((state) => state.updateBlock);
  const isDarkMode = useStore((state) => state.darkMode);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    updateBlock(block.id, { 
      content: { 
        code, 
        language 
      } 
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setCode(block.content.code || '');
    setLanguage(block.content.language || 'javascript');
    setIsEditing(false);
  };

  const languageOptions = [
    { value: 'javascript', label: 'JavaScript' },
    { value: 'python', label: 'Python' },
    { value: 'css', label: 'CSS' },
    { value: 'html', label: 'HTML' },
    { value: 'bash', label: 'Bash' },
    { value: 'json', label: 'JSON' },
  ];

  return (
    <div className={`p-4 rounded-md transition-all ${isSelected ? 'ring-2 ring-blue-500' : ''}`}>
      {isEditing ? (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Language</label>
                      <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className={`p-1 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              isDarkMode ? 'bg-gray-800 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'
            }`}
          >
              {languageOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Code</label>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full p-2 border rounded-md font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[200px]"
              placeholder="Enter your code here..."
            />
          </div>
          <div className="flex space-x-2">
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Save
            </button>
            <button
              onClick={handleCancel}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div onClick={handleEdit} className="cursor-pointer">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">{languageOptions.find(opt => opt.value === language)?.label || language}</span>
          </div>
          <SyntaxHighlighter 
            language={language} 
            style={docco}
            customStyle={{ borderRadius: '0.375rem' }}
          >
            {block.content.code}
          </SyntaxHighlighter>
        </div>
      )}
    </div>
  );
};

export default CodeBlock;