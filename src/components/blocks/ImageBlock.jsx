import { useEffect, useState } from 'react';
import { useStore } from '../../store/useStore';

const ImageBlock = ({ block, isSelected }) => {
  const isDarkMode = useStore((state) => state.darkMode);
  const [isEditing, setIsEditing] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [altText, setAltText] = useState('');
  const [isValidUrl, setIsValidUrl] = useState(true);
  const updateBlock = useStore((state) => state.updateBlock);

  useEffect(() => {
    if (block.content) {
      setImageUrl(block.content.src || '');
      setAltText(block.content.alt || '');
    }
  }, [block.content]);

  const validateUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    if (!imageUrl.trim()) {
      setIsValidUrl(false);
      return;
    }

    const isValid = validateUrl(imageUrl);
    setIsValidUrl(isValid);
    
    if (isValid) {
      updateBlock(block.id, { 
        content: { 
          src: imageUrl.trim(), 
          alt: altText.trim() 
        } 
      });
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setImageUrl(block.content.src);
    setAltText(block.content.alt || '');
    setIsEditing(false);
  };

  return (
    <div className={`p-3 md:p-4 rounded-md transition-colors ${
      isSelected ? 'ring-2 ring-blue-600' : ''
    } ${
      isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
    }`}>
      {isEditing ? (
        <div className="space-y-4">
          <div>
            <label className={`block text-sm font-medium mb-1 ${
              isDarkMode ? 'text-gray-200' : 'text-gray-700'
            }`}>
              Image URL
            </label>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => {
                setImageUrl(e.target.value);
                setIsValidUrl(true);
              }}
              className={`w-full p-2 rounded-md border transition-colors ${
                !isValidUrl ? 'border-red-500 ring-1 ring-red-500' :
                isDarkMode 
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500' 
                  : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500 focus:border-blue-600'
              } focus:outline-none focus:ring-2 focus:ring-offset-1 ${
                isDarkMode ? 'focus:ring-blue-500/50' : 'focus:ring-blue-600/50'
              }`}
              placeholder="https://example.com/image.jpg"
            />
            {!isValidUrl && (
              <p className="mt-1 text-sm text-red-500">
                Please enter a valid image URL
              </p>
            )}
          </div>
          <div>
            <label className={`block text-sm font-medium mb-1 ${
              isDarkMode ? 'text-gray-200' : 'text-gray-700'
            }`}>
              Alt Text
            </label>
            <input
              type="text"
              value={altText}
              onChange={(e) => setAltText(e.target.value)}
              className={`w-full p-2 rounded-md border transition-colors ${
                isDarkMode 
                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500' 
                : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500 focus:border-blue-600'
              } focus:outline-none focus:ring-2 focus:ring-offset-1 ${
                isDarkMode ? 'focus:ring-blue-500/50' : 'focus:ring-blue-600/50'
              }`}
              placeholder="Describe the image for accessibility"
            />
          </div>
          <div className="flex space-x-2">
            <button
              onClick={handleSave}
              className={`px-4 py-2 rounded-md transition-colors ${
                isDarkMode
                ? 'bg-blue-600 hover:bg-blue-500 text-white' 
                : 'bg-blue-600 hover:bg-blue-700 text-white'
              } focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500`}
            >
              Save
            </button>
            <button
              onClick={handleCancel}
              className={`px-4 py-2 rounded-md transition-colors ${
                isDarkMode
                ? 'bg-gray-700 hover:bg-gray-600 text-gray-200 border border-gray-600' 
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              } focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-gray-500`}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div onClick={handleEdit} className="group cursor-pointer relative">
          {block.content?.src ? (
            <>
              <img 
                src={block.content.src} 
                alt={block.content.alt || ''} 
                className={`w-full h-auto rounded-md transition-opacity ${
                  isDarkMode ? 'opacity-90 group-hover:opacity-100' : 'group-hover:opacity-90'
                }`}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"%3E%3Crect width="400" height="300" fill="%23f3f4f6"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="system-ui" font-size="16" fill="%236b7280"%3EImage Not Found%3C/text%3E%3C/svg%3E';
                }}
              />
              {block.content.alt && (
                <p className={`mt-1 text-sm ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  {block.content.alt}
                </p>
              )}
            </>
          ) : (
            <div className={`flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-md space-y-2 transition-colors ${
              isDarkMode 
              ? 'border-gray-700 hover:border-gray-600 bg-gray-800/50' 
              : 'border-gray-200 hover:border-gray-300 bg-gray-50/50'
            }`}>
              <Image size={48} className={isDarkMode ? 'text-gray-600' : 'text-gray-400'} />
              <p className={`text-sm ${
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                Click to add an image
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ImageBlock;