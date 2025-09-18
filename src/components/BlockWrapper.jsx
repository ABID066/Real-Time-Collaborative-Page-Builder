import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Trash2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useStore } from '../store/useStore';

const BlockWrapper = ({ block, children }) => {
  const isDarkMode = useStore((state) => state.darkMode);
  const [selectedBlockId, setSelectedBlockId] = useState(null);
  
  // Subscribe to selectedBlockId changes
  useEffect(() => {
    // Get initial state
    const initialSelectedBlockId = useStore.getState().selectedBlockId;
    setSelectedBlockId(initialSelectedBlockId);
    
    // Subscribe to changes
    const unsubscribe = useStore.subscribe(
      (state) => state.selectedBlockId,
      (selectedBlockId) => setSelectedBlockId(selectedBlockId)
    );
    
    return unsubscribe;
  }, []);
  
  // Define handler functions that call the store actions
  const handleSetSelectedBlock = (blockId) => {
    useStore.getState().setSelectedBlock(blockId);
  };
  
  const handleDeleteBlock = (blockId) => {
    useStore.getState().deleteBlock(blockId);
  };
  
  const handleUpdateBlock = (blockId, data) => {
    useStore.getState().updateBlock(blockId, data);
  };

  const isSelected = selectedBlockId === block.id;

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: block.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    border: isSelected ? '2px solid transparent' : `2px solid ${isDarkMode ? '#374151' : '#e5e7eb'}`,
    backgroundColor: isDarkMode ? '#1f2937' : '#fff',
    color: isDarkMode ? '#fff' : '#111827',
  };

  const handleClick = (e) => {
    e.stopPropagation();
    handleSetSelectedBlock(block.id);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    handleDeleteBlock(block.id);
  };

  const handleWidthChange = (width) => {
    handleUpdateBlock(block.id, { width });
  };

  return (
    <div 
      ref={setNodeRef}
      style={style}
      className={`mb-4 ${block.width === 'half' ? 'md:w-1/2' : 'w-full'}`}
      onClick={handleClick}
    >
      <div className={`border rounded-lg overflow-hidden group relative ${isSelected ? 'ring-2 ring-blue-500' : ''}`}>
        <div className={`p-2 flex justify-between items-center ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'} opacity-0 group-hover:opacity-100 transition-opacity absolute top-0 right-0 left-0 z-10`}>
          <div className="flex items-center">
            <div 
              {...attributes} 
              {...listeners}
              className={`cursor-grab p-1 mr-2 rounded transition-colors ${
                isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
              }`}
            >
              <GripVertical size={16} className={isDarkMode ? 'text-gray-300' : 'text-gray-600'} />
            </div>
            <div className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              {block.type.charAt(0).toUpperCase() + block.type.slice(1)}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <select 
              value={block.width} 
              onChange={(e) => handleWidthChange(e.target.value)}
              className={`text-xs border rounded p-1 transition-colors ${
                isDarkMode 
                ? 'bg-gray-700 text-white border-gray-600 hover:bg-gray-600' 
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              <option value="full">Full width</option>
              <option value="half">Half width</option>
            </select>
            <button 
              onClick={handleDelete}
              className={`p-1 rounded transition-colors ${
                isDarkMode 
                ? 'text-red-400 hover:bg-red-900/50' 
                : 'text-red-500 hover:bg-red-100'
              }`}
              aria-label="Delete block"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
        <div>
          {React.cloneElement(children, { isSelected })}
        </div>
      </div>
    </div>
  );
};

export default BlockWrapper;