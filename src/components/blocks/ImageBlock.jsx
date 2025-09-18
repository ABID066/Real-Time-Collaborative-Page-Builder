import React, { useState } from 'react';
import { useStore } from '../../store/useStore';

const ImageBlock = ({ block, isSelected }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [imageUrl, setImageUrl] = useState(block.content.src);
  const [altText, setAltText] = useState(block.content.alt || '');
  const updateBlock = useStore((state) => state.updateBlock);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    updateBlock(block.id, { 
      content: { 
        src: imageUrl, 
        alt: altText 
      } 
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setImageUrl(block.content.src);
    setAltText(block.content.alt || '');
    setIsEditing(false);
  };

  return (
    <div className={`p-4 rounded-md transition-all ${isSelected ? 'ring-2 ring-blue-500' : ''}`}>
      {isEditing ? (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Image URL</label>
            <input
              type="text"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://example.com/image.jpg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Alt Text</label>
            <input
              type="text"
              value={altText}
              onChange={(e) => setAltText(e.target.value)}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Image description"
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
          <img 
            src={block.content.src} 
            alt={block.content.alt || ''} 
            className="max-w-full h-auto rounded-md"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://via.placeholder.com/400x200?text=Image+Not+Found';
            }}
          />
          {block.content.alt && (
            <p className="mt-1 text-sm text-gray-500">{block.content.alt}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default ImageBlock;