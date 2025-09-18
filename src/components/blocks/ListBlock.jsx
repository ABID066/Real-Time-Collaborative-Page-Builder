import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { Plus, Trash2 } from 'lucide-react';

const ListBlock = ({ block, isSelected }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [items, setItems] = useState(block.content.items || []);
  const updateBlock = useStore((state) => state.updateBlock);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    updateBlock(block.id, { 
      content: { 
        items: items.filter(item => item.trim() !== '') 
      } 
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setItems(block.content.items || []);
    setIsEditing(false);
  };

  const handleItemChange = (index, value) => {
    const newItems = [...items];
    newItems[index] = value;
    setItems(newItems);
  };

  const handleAddItem = () => {
    setItems([...items, '']);
  };

  const handleRemoveItem = (index) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    setItems(newItems);
  };

  return (
    <div className={`p-4 rounded-md transition-all ${isSelected ? 'ring-2 ring-blue-500' : ''}`}>
      {isEditing ? (
        <div className="space-y-4">
          <div className="space-y-2">
            {items.map((item, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="text"
                  value={item}
                  onChange={(e) => handleItemChange(index, e.target.value)}
                  className="flex-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="List item"
                />
                <button
                  onClick={() => handleRemoveItem(index)}
                  className="p-2 text-red-500 hover:bg-red-100 rounded-md focus:outline-none"
                  aria-label="Remove item"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
          <button
            onClick={handleAddItem}
            className="flex items-center space-x-1 text-blue-500 hover:text-blue-600 focus:outline-none"
          >
            <Plus size={16} />
            <span>Add item</span>
          </button>
          <div className="flex space-x-2 pt-2">
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
          <ul className="list-disc pl-5 space-y-1">
            {block.content.items.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ListBlock;