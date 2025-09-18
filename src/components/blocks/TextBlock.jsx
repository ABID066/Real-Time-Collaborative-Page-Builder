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

  const handleClick = (e) => {
    e.stopPropagation();
    if (!isEditing) {
      setIsEditing(true);
      useStore.getState().setSelectedBlock(block.id);
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
      className={`p-3 md:p-4 rounded-md transition-colors ${
        isSelected ? 'ring-2 ring-blue-600' : ''
      } ${
        isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
      }`}
      onClick={handleClick}
    >
      {isEditing ? (
        <textarea
          ref={textRef}
          value={text}
          onChange={handleChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className={`w-full p-2 rounded-md border min-h-[80px] md:min-h-[100px] text-sm md:text-base resize-none transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 ${
            isDarkMode 
            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
            : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500'
          }`}
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