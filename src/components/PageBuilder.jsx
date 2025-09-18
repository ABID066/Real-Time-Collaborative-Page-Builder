import { closestCenter, DndContext, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Plus, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useStore } from '../store/useStore';
import BlockRenderer from './BlockRenderer';

const PageBuilder = () => {
  // Use local state to prevent infinite loop with Zustand and React 19
  const [blocks, setBlocks] = useState([]);
  const [collaborators, setCollaborators] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  
  // Define handler functions that call the store actions
  const handleAddBlock = (blockType) => {
    useStore.getState().addBlock(blockType);
  };
  
  const handleReorderBlocks = (oldIndex, newIndex) => {
    useStore.getState().reorderBlocks(oldIndex, newIndex);
  };
  
  useEffect(() => {
    // Initialize collaboration when component mounts
    useStore.getState().initializeCollaboration();
    
    // Get initial state
    const state = useStore.getState();
    setBlocks(state.blocks || []);
    setCollaborators(state.collaborators || []);
    setIsConnected(state.isConnected || false);
    
    // Subscribe to changes
    const unsubscribe = useStore.subscribe((state) => {
      setBlocks(state.blocks || []);
      setCollaborators(state.collaborators || []);
      setIsConnected(state.isConnected || false);
    });
    
    return () => {
      unsubscribe();
    };
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    
    if (active.id !== over.id) {
      const oldIndex = blocks.findIndex(block => block.id === active.id);
      const newIndex = blocks.findIndex(block => block.id === over.id);
      
      if (oldIndex !== -1 && newIndex !== -1) {
        handleReorderBlocks(oldIndex, newIndex);
        // Force update the local state to ensure immediate UI update
        const newBlocks = [...blocks];
        const [removed] = newBlocks.splice(oldIndex, 1);
        newBlocks.splice(newIndex, 0, removed);
        setBlocks(newBlocks);
      }
    }
  };

  const blockTypes = [
    { type: 'text', label: 'Text' },
    { type: 'image', label: 'Image' },
    { type: 'video', label: 'Video' },
    { type: 'list', label: 'List' },
    { type: 'chart', label: 'Chart' },
    { type: 'code', label: 'Code' },
  ];

  return (
    <div className="max-w-5xl mx-auto p-4">
      {/* Toolbar */}
      <div className="mb-6 flex justify-between items-center">
        <div className="flex space-x-2">
          {blockTypes.map((blockType) => (
            <button
              key={blockType.type}
              onClick={() => handleAddBlock(blockType.type)}
              className="px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center space-x-1"
            >
              <Plus size={16} />
              <span>{blockType.label}</span>
            </button>
          ))}
        </div>
        
        {/* Collaborators indicator */}
        <div className="flex items-center">
          <div className="flex items-center mr-2">
            <Users size={16} className={isConnected ? 'text-green-500' : 'text-gray-400'} />
            <span className="ml-1 text-sm font-medium">
              {collaborators.length} active {collaborators.length === 1 ? 'user' : 'users'}
            </span>
          </div>
          <div className="flex -space-x-2">
            {collaborators.map((collaborator) => (
              <div 
                key={collaborator.id} 
                className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center shadow-sm" 
                style={{ backgroundColor: collaborator.color }}
                title={`User ${collaborator.id.slice(0, 4)}`}
              >
                <span className="text-white font-semibold">
                  {collaborator.id.slice(0, 2).toUpperCase()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Page content */}
      <div className="min-h-[70vh] bg-white rounded-lg shadow p-6">
        {blocks.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-400">
            <p className="text-lg mb-4">Your page is empty</p>
            <p className="text-sm">Add blocks using the buttons above</p>
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
            modifiers={[restrictToVerticalAxis]}
          >
            <SortableContext
              items={blocks.map(block => block.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="flex flex-wrap">
                {blocks.map((block) => (
                  <BlockRenderer key={block.id} block={block} />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </div>
    </div>
  );
};

export default PageBuilder;