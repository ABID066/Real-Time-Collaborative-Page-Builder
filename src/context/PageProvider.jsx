import { useReducer } from 'react';
import { PageContext, initialState } from './PageContext';
import { pageReducer } from '../reducer/PageReducer.jsx';

export const PageProvider = ({ children }) => {
  const [state, dispatch] = useReducer(pageReducer, initialState);

  return (
    <PageContext.Provider value={{ state, dispatch }}>
      {children}
    </PageContext.Provider>
  );
};