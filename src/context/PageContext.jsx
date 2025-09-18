import { createContext } from 'react';

export const initialState = {
  blocks: [],
  selectedBlockId: null,
  isEditing: false,
};

export const PageContext = createContext();