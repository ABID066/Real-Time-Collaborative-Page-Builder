import React, { useEffect, useRef, useState } from 'react';
import { useStore } from '../../store/useStore';

const TextBlock = ({ block, isSelected }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(block.content);
  const isDarkMode = useStore((state) => state.darkMode);
  const textRef = useRef(null);

  // Update local state when block content changes
  useEffect(() => {
    setText(block.content);
  }, [block.content]);
  
  const handleUpdateBlock = (blockId, data) => {
    useStore.getState().updateBlock(blockId, data);
  };

  useEffect(() => {
    if (isEditing && textRef.current) {
      textRef.current.focus();
    }
  }, [isEditing]);

  const handleClick = () => {
    if (!isEditing) {
      setIsEditing(true);
    }
  };

  const handleBlur = () => {
    setIsEditing(false);
    handleUpdateBlock(block.id, { content: text });
  };

  const handleChange = (e) => {
    setText(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && e.shiftKey) {
      // Allow shift+enter for new lines
      return;
    }
    if (e.key === 'Enter') {
      e.preventDefault();
      handleBlur();
    }
  };

  return (
    <div 
      className={`p-4 rounded-md transition-all ${isSelected ? 'ring-2 ring-blue-500' : ''} ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}
      onClick={handleClick}
    >
      {isEditing ? (
        <textarea
          ref={textRef}
          value={text}
          onChange={handleChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px] resize-none ${isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'}`}
          autoFocus
        />
      ) : (
        <div className={`prose max-w-none ${isDarkMode ? 'prose-invert' : ''}`}>
          {text.split('\n').map((line, i) => (
            <React.Fragment key={i}>
              {line}
              {i < text.split('\n').length - 1 && <br />}
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
  );
};

export default TextBlock;