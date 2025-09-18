import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Helper function to get default content based on block type
const getDefaultContent = (blockType) => {
  switch (blockType) {
    case 'text':
      return 'Click to edit text';
    case 'image':
      return { src: 'https://via.placeholder.com/400x200', alt: 'Placeholder image' };
    case 'video':
      return { embedUrl: 'https://www.youtube.com/watch?v=-p9LYH86AS8' };
    case 'list':
      return { items: ['Item 1', 'Item 2', 'Item 3'] };
    case 'chart':
      return {
        type: 'bar',
        data: {
          labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple'],
          datasets: [{
            label: 'Sample Data',
            data: [12, 19, 3, 5, 2],
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(153, 102, 255, 0.2)'
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)'
            ],
            borderWidth: 1
          }]
        }
      };
    case 'code':
      return { language: 'javascript', code: '// Write your code here\nconsole.log("Hello World");' };
    default:
      return '';
  }
};

// Create WebSocket connection for real-time collaboration
class CollaborationService {
  constructor() {
    this.socket = null;
    this.clientId = Math.random().toString(36).substr(2, 9);
    this.channel = new BroadcastChannel('page-builder-sync');
    this.onMessageCallback = null;
  }

  connect() {
    // Using BroadcastChannel for cross-tab communication as a WebSocket alternative
    this.channel.onmessage = (event) => {
      if (event.data.source !== this.clientId && this.onMessageCallback) {
        this.onMessageCallback(event.data);
      }
    };
    
    return Promise.resolve({ clientId: this.clientId });
  }

  disconnect() {
    this.channel.close();
  }

  onMessage(callback) {
    this.onMessageCallback = callback;
  }

  sendMessage(type, payload) {
    const message = {
      type,
      payload,
      timestamp: Date.now(),
      source: this.clientId
    };
    this.channel.postMessage(message);
  }
}

const collaborationService = new CollaborationService();

// Create Zustand store with persistence
export const useStore = create(
  persist(
    (set, get) => ({
      // Add clientId to the store state to fix React 19 infinite loop issue
      clientId: Math.random().toString(36).substr(2, 9),
      // State
      blocks: [],
      selectedBlockId: null,
      collaborators: [],
      darkMode: false,
      history: [],
      historyIndex: -1,
      isConnected: false,
      
      // Actions
      initializeCollaboration: async () => {
        try {
          const { clientId } = await collaborationService.connect();
          
          collaborationService.onMessage((message) => {
            const { type, payload } = message;
            
            switch (type) {
              case 'add':
                set((state) => ({
                  blocks: [...state.blocks, payload]
                }));
                break;
              case 'update':
                set((state) => ({
                  blocks: state.blocks.map(block =>
                    block.id === payload.blockId ? { ...block, ...payload.updates } : block
                  )
                }));
                break;
              case 'delete':
                set((state) => ({
                  blocks: state.blocks.filter(block => block.id !== payload.blockId)
                }));
                break;
              case 'reorder':
                set((state) => {
                  const blocks = [...state.blocks];
                  const [removed] = blocks.splice(payload.startIndex, 1);
                  blocks.splice(payload.endIndex, 0, removed);
                  return { blocks };
                });
                break;
              case 'cursor':
                // Handle cursor updates for collaborators
                set((state) => {
                  const updatedCollaborators = state.collaborators.map(c => 
                    c.id === payload.clientId ? { ...c, ...payload } : c
                  );
                  
                  if (!updatedCollaborators.some(c => c.id === payload.clientId)) {
                    updatedCollaborators.push(payload);
                  }
                  
                  return { collaborators: updatedCollaborators };
                });
                break;
              default:
                break;
            }
          });
          
          set({ isConnected: true });
          
          // Add this client to collaborators with a random color
          const getRandomColor = () => {
            const colors = [
              '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD',
              '#D4A5A5', '#9B59B6', '#3498DB', '#E74C3C', '#2ECC71'
            ];
            return colors[Math.floor(Math.random() * colors.length)];
          };

          // Add this client to collaborators
          set((state) => {
            const existingCollaborator = state.collaborators.find(c => c.id === clientId);
            if (!existingCollaborator) {
              return {
                collaborators: [...state.collaborators, { 
                  id: clientId, 
                  color: getRandomColor(),
                  lastActive: Date.now()
                }]
              };
            }
            return state;
          });

          return clientId;
        } catch (error) {
          console.error('Failed to connect:', error);
          return null;
        }
      },
      
      // Block management
      addBlock: (blockType) => {
        const newBlock = {
          id: `block_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          type: blockType,
          content: getDefaultContent(blockType),
          width: 'full',
          createdAt: Date.now()
        };
        
        set((state) => {
          const newBlocks = [...state.blocks, newBlock];
          return { blocks: newBlocks };
        });
        
        get().saveToHistory();
        collaborationService.sendMessage('add', newBlock);
      },
      
      updateBlock: (blockId, updates) => {
        set((state) => ({
          blocks: state.blocks.map(block =>
            block.id === blockId ? { ...block, ...updates } : block
          )
        }));
        
        collaborationService.sendMessage('update', { blockId, updates });
      },
      
      deleteBlock: (blockId) => {
        set((state) => ({
          blocks: state.blocks.filter(block => block.id !== blockId),
          selectedBlockId: state.selectedBlockId === blockId ? null : state.selectedBlockId
        }));
        
        get().saveToHistory();
        collaborationService.sendMessage('delete', { blockId });
      },
      
      reorderBlocks: (startIndex, endIndex) => {
        set((state) => {
          const blocks = [...state.blocks];
          const [removed] = blocks.splice(startIndex, 1);
          blocks.splice(endIndex, 0, removed);
          return { blocks };
        });
        
        get().saveToHistory();
        collaborationService.sendMessage('reorder', { startIndex, endIndex });
      },
      
      setSelectedBlock: (blockId) => {
        set({ selectedBlockId: blockId });
      },
      
      // UI state
      toggleDarkMode: () => {
        set((state) => {
          const newDarkMode = !state.darkMode;
          // Update darkMode in localStorage to persist the setting
          localStorage.setItem('darkMode', JSON.stringify(newDarkMode));
          return { darkMode: newDarkMode };
        });
      },
      
      // History management
      saveToHistory: () => {
        set((state) => {
          const currentState = { blocks: [...state.blocks] };
          const history = state.history.slice(0, state.historyIndex + 1);
          history.push(currentState);
          return { history, historyIndex: history.length - 1 };
        });
      },
      
      undo: () => {
        const { history, historyIndex } = get();
        if (historyIndex > 0) {
          const prevState = history[historyIndex - 1];
          set({ blocks: prevState.blocks, historyIndex: historyIndex - 1 });
        }
      },
      
      redo: () => {
        const { history, historyIndex } = get();
        if (historyIndex < history.length - 1) {
          const nextState = history[historyIndex + 1];
          set({ blocks: nextState.blocks, historyIndex: historyIndex + 1 });
        }
      },
      
      // Collaboration
      updateCursorPosition: (position) => {
        const clientId = get().clientId;
        if (!clientId) return;
        
        collaborationService.sendMessage('cursor', {
          clientId,
          position,
          timestamp: Date.now()
        });
      },
      
      // Export functionality
      exportAsHtml: () => {
        const { blocks } = get();
        let html = '<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Exported Page</title>';
        html += '<style>body{font-family:system-ui,-apple-system,sans-serif;max-width:1200px;margin:0 auto;padding:20px;}</style>';
        html += '</head><body>';
        
        blocks.forEach(block => {
          switch (block.type) {
            case 'text':
              html += `<div>${block.content}</div>`;
              break;
            case 'image':
              html += `<img src="${block.content.src}" alt="${block.content.alt || ''}" style="max-width:100%">`;
              break;
            case 'video':
              html += `<iframe width="560" height="315" src="${block.content.embedUrl}" frameborder="0" allowfullscreen></iframe>`;
              break;
            case 'list':
              html += '<ul>';
              block.content.items.forEach(item => {
                html += `<li>${item}</li>`;
              });
              html += '</ul>';
              break;
            case 'code':
              html += `<pre><code>${block.content.code}</code></pre>`;
              break;
            // Chart would require additional libraries in the exported HTML
            default:
              break;
          }
        });
        
        html += '</body></html>';
        return html;
      }
    }),
    {
      name: 'page-builder-storage',
      partialize: (state) => ({ blocks: state.blocks, darkMode: state.darkMode }),
      version: 1,
      onRehydrateStorage: () => (state) => {
        // Initialize dark mode from localStorage if available
        const storedDarkMode = localStorage.getItem('darkMode');
        if (storedDarkMode !== null) {
          state.darkMode = JSON.parse(storedDarkMode);
        }
        console.log('State rehydrated');
      }
    }
  )
);

