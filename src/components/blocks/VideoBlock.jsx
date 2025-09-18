import React, { useState } from 'react';
import { useStore } from '../../store/useStore';

const VideoBlock = ({ block, isSelected }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [embedUrl, setEmbedUrl] = useState(block.content.embedUrl);
  const updateBlock = useStore((state) => state.updateBlock);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    updateBlock(block.id, { 
      content: { 
        embedUrl: embedUrl 
      } 
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEmbedUrl(block.content.embedUrl);
    setIsEditing(false);
  };

  // Helper function to ensure URL is an embed URL
  const getEmbedUrl = (url) => {
    // Convert YouTube watch URLs to embed URLs
    if (url.includes('youtube.com/watch')) {
      const videoId = new URL(url).searchParams.get('v');
      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}`;
      }
    }
    // Convert YouTube short URLs
    if (url.includes('youtu.be/')) {
      const videoId = url.split('youtu.be/')[1]?.split('?')[0];
      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}`;
      }
    }
    // Return as is if it's already an embed URL or other format
    return url;
  };

  const handleUrlChange = (e) => {
    setEmbedUrl(e.target.value);
  };

  return (
    <div className={`p-4 rounded-md transition-all ${isSelected ? 'ring-2 ring-blue-500' : ''}`}>
      {isEditing ? (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Video URL (YouTube, Vimeo, etc.)</label>
            <input
              type="text"
              value={embedUrl}
              onChange={handleUrlChange}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
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
          <div className="relative pt-[56.25%] w-full overflow-hidden rounded-md">
            <iframe
              src={getEmbedUrl(block.content.embedUrl)}
              className="absolute top-0 left-0 w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title="Embedded video"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoBlock;