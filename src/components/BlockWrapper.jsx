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
      className={`mb-6 ${block.width === 'half' ? 'md:w-1/2' : 'w-full'}`}
      onClick={isSelected ? undefined : handleClick}
    >
      {/* Controls Bar */}
      <div className={`mb-2 flex justify-between items-center p-2 rounded-md ${
        isDarkMode ? 'bg-gray-800/50 hover:bg-gray-800' : 'bg-gray-50/50 hover:bg-gray-50'
      } transition-colors group`}>
        <div className="flex items-center gap-2">
          <div 
            {...attributes} 
            {...listeners}
            className={`cursor-grab p-1.5 rounded-md transition-colors ${
              isDarkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-200 text-gray-500'
            }`}
            title="Drag to reorder"
          >
            <GripVertical size={18} />
          </div>
          <div className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            {block.type.charAt(0).toUpperCase() + block.type.slice(1)}
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <select 
            value={block.width} 
            onChange={(e) => handleWidthChange(e.target.value)}
            className={`text-xs border rounded-md py-1.5 px-2 transition-colors ${
              isDarkMode 
              ? 'bg-gray-700 text-white border-gray-600 hover:bg-gray-600 focus:ring-gray-500' 
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 focus:ring-gray-300'
            } focus:outline-none focus:ring-2`}
          >
            <option value="full">Full width</option>
            <option value="half">Half width</option>
          </select>
          <button 
            onClick={handleDelete}
            className={`p-1.5 rounded-md transition-all ${
              isDarkMode 
              ? 'text-gray-400 hover:bg-red-500/20 hover:text-red-400' 
              : 'text-gray-500 hover:bg-red-100 hover:text-red-500'
            }`}
            title="Delete block"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      {/* Block Content */}
      <div className={`border rounded-lg overflow-hidden ${isSelected ? 'ring-2 ring-blue-600' : ''}`}>
        {React.cloneElement(children, { isSelected })}
      </div>
    </div>
  );
};

export default BlockWrapper;