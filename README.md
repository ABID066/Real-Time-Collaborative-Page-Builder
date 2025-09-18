# Collaborative Page Builder

A real-time collaborative page builder application that allows multiple users to create and edit content blocks simultaneously. Built with React, Zustand for state management, and DnD Kit for drag-and-drop functionality.

## Features

- **Dynamic Block Types**: Create and edit various content blocks including text, images, videos, lists, charts, and code snippets
- **Drag and Drop**: Easily reorder blocks with intuitive drag-and-drop functionality
- **Real-time Collaboration**: See changes from other users in real-time
- **Undo/Redo**: Full history management with undo and redo capabilities
- **Dark/Light Mode**: Toggle between dark and light themes
- **Local Storage**: Automatically saves your work to browser storage
- **Export to HTML**: Export your page as a standalone HTML file

## Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository
   ```bash
   git clone <repository-url>
   cd collaborative-page-builder
   ```

2. Install dependencies
   ```bash
   npm install
   ```
   
   Note: If you encounter peer dependency issues with React 19, you may need to use the `--force` flag:
   ```bash
   npm install --force
   ```

3. Start the development server
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to the URL shown in the terminal (typically http://localhost:5173/)

## Usage

- **Adding Blocks**: Click on the block type buttons in the toolbar to add new blocks
- **Editing Blocks**: Click on any block to edit its content
- **Reordering Blocks**: Drag blocks using the handle on the left side to reorder them
- **Resizing Blocks**: Use the width toggle button to switch between full and half width
- **Deleting Blocks**: Select a block and click the delete button
- **Collaboration**: Changes are automatically synchronized between users
- **Dark/Light Mode**: Toggle the theme using the sun/moon icon in the header
- **Exporting**: Click the download icon to export your page as HTML

## Technologies Used

- **React**: UI framework
- **Zustand**: State management
- **DnD Kit**: Drag-and-drop functionality
- **Chart.js**: Chart rendering
- **React Syntax Highlighter**: Code block syntax highlighting
- **BroadcastChannel API**: Real-time collaboration

## Project Structure

```
src/
├── components/
│   ├── blocks/         # Individual block type components
│   ├── BlockRenderer.jsx  # Renders the appropriate block based on type
│   ├── BlockWrapper.jsx   # Wrapper for blocks with selection and drag functionality
│   ├── Header.jsx         # App header with controls
│   └── PageBuilder.jsx    # Main page builder component
├── store/
│   └── useStore.js     # Zustand store for state management
├── App.jsx            # Main application component
└── main.jsx           # Entry point
```

## License

MIT
