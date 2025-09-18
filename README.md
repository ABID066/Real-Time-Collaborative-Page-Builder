# Real-Time Collaborative Page Builder 🚀

A **real-time collaborative page builder** (Notion / Framer - style) built with React.  
Create, edit, reorder, resize, persist, and collaborate on dynamic content blocks.


---

## Demo / Repo
https://real-time-collaborative-page-builde.vercel.app

---

## Features

- **Dynamic Block Types**
   - Text (inline editable)
   - Image
   - Video embed (YouTube)
   - List / Table
   - Chart
   - Code Snippet (syntax highlighting)

- **Drag & Drop Layout**
   - Reorder blocks using drag-and-drop (DnD Kit)
   - Resize blocks (full-width / half-width)

- **Real-Time Collaboration**
   - Basic multi-window synchronization via WebSockets / BroadcastChannel (last-write-wins)

- **State & Persistence**
   - Global state with **Zustand**
   - Page stored as a JSON schema and persisted to `localStorage`
   - Reload will reconstruct the page from JSON

- **Extras**
   - Dark / Light mode toggle
   - Undo / Redo history
   - Export the page as a static HTML file

---

## ✨ Implemented / Not Implemented

**Implemented**
- Dynamic blocks (Text, Image, Video, List, Chart, Code)
- Inline editing
- Reordering & resizing
- JSON state + persistence
- Drag & drop (DnD Kit)
- WebSocket / BroadcastChannel basic sync
- Dark/Light mode, Undo/Redo, Export HTML

**Not Implemented**
- **Show online collaborators (cursor or presence indicator)** — *This feature was not completed.*

---

## Project Structure

```
src/
├── components/
│   ├── blocks/              # Individual block types (Text, Image, Video, List, Chart, Code)
│   │   ├── ChartBlock.jsx
│   │   ├── CodeBlock.jsx
│   │   ├── ImageBlock.jsx
│   │   ├── ListBlock.jsx
│   │   ├── TextBlock.jsx
│   │   └── VideoBlock.jsx
│   ├── BlockRenderer.jsx    # Renders the correct block type
│   ├── BlockWrapper.jsx     # Wrapper for drag/drop + styling
│   ├── Header.jsx           # App header with controls
│   └── PageBuilder.jsx      # Main builder interface
│
├── context/
│   ├── PageContext.jsx      # Context for managing page state
│   └── PageProvider.jsx     # Provider wrapper
│
├── hooks/
│   ├── useDarkMode.js       # Dark/light mode hook
│   └── usePageContext.js    # Custom hook for page context
│
├── reducer/
│   └── PageReducer.jsx      # Reducer for page actions
│
├── store/
│   └── useStore.js          # Zustand store for global state
│
├── Page.jsx   
├── App.jsx                  # Main app entry
└── main.jsx                 # React DOM entry

```
# ⚡ Tech Stack

- **React** – Component-based UI
- **Zustand** – Lightweight state management
- **DnD Kit** – Drag-and-drop interaction
- **Chart.js** – Chart visualization
- **React Syntax Highlighter** – Code block syntax highlighting
- **WebSockets / BroadcastChannel API** – Real-time collaboration
- **Tailwind CSS** – Styling

---

# 🛠️ Setup Instructions

## Prerequisites
- Node.js (v16+)
- npm (comes with Node.js)

## Installation


# Clone the repository

```bash
git clone https://github.com/ABID066/Real-Time-Collaborative-Page-Builder

cd collaborative-page-builder
```

# Install dependencies
```bash
npm install

npm run dev
```
## 🎮 Usage

- **Add a block** → Select from toolbar
- **Edit a block** → Click to edit inline
- **Reorder blocks** → Drag and drop
- **Resize blocks** → Toggle between full / half width
- **Delete blocks** → Use delete button on selection
- **Collaborate** → Open in multiple browser windows, edits sync instantly
- **Dark / Light mode** → Toggle in header
- **Export** → Download static HTML version

---

## ✅ Deliverables

- Full source code (structured & documented)
- Setup & usage instructions (this README)

### Core Requirements Implemented
- Dynamic blocks
- State management (**Zustand**)
- Drag-and-drop layout
- Real-time WebSocket collaboration
- Persistence (**LocalStorage**)

### Bonus Features
- Dark mode
- Undo/Redo
- Export HTML

### Not Implemented
- Online collaborators presence (**cursor/indicator**)






