import {
  FILE_LOADED_SUCCESS,
  DATABASE_LOAD_FAILED,
  DATABASE_LOAD_INIT,
  DATABASE_LOAD_SUCCESS,
  SELECT_FILE,
} from './types';

const initialState = {
  files: [],
  selectedFile: null,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case DATABASE_LOAD_SUCCESS:
      return {
        ...state,
        files: action.files,
        selectedFile: [...action.files].pop().id,
      };
    case FILE_LOADED_SUCCESS:
      return {
        ...state,
        files: [
          ...state.files,
          {
            fileName: action.fileName,
            fileLastModifiedDate: action.fileLastModifiedDate,
            harJson: action.harJson,
          },
        ],
        selectedFile: ([...state.files].pop() || { id: 0 }).id + 1,
      };

    case SELECT_FILE:
      return {
        ...state,
        selectedFile: action.id,
      };
    default:
      return state;
  }
};

export default reducer;
