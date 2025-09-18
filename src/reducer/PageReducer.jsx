export const actionTypes = {
  ADD_BLOCK: 'ADD_BLOCK',
  UPDATE_BLOCK: 'UPDATE_BLOCK',
  DELETE_BLOCK: 'DELETE_BLOCK',
  SELECT_BLOCK: 'SELECT_BLOCK',
  SET_EDITING: 'SET_EDITING',
};

export const pageReducer = (state, action) => {
  switch (action.type) {
    case actionTypes.ADD_BLOCK:
      return {
        ...state,
        blocks: [...state.blocks, action.payload],
      };

    case actionTypes.UPDATE_BLOCK:
      return {
        ...state,
        blocks: state.blocks.map((block) =>
          block.id === action.payload.id ? action.payload : block
        ),
      };

    case actionTypes.DELETE_BLOCK:
      return {
        ...state,
        blocks: state.blocks.filter((block) => block.id !== action.payload),
        selectedBlockId: state.selectedBlockId === action.payload ? null : state.selectedBlockId,
      };

    case actionTypes.SELECT_BLOCK:
      return {
        ...state,
        selectedBlockId: action.payload,
      };

    case actionTypes.SET_EDITING:
      return {
        ...state,
        isEditing: action.payload,
      };

    default:
      return state;
  }
};