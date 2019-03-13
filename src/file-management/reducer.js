import {
  FILE_LOADED_SUCCESS,
  DATABASE_LOAD_FAILED,
  DATABASE_LOAD_INIT,
  DATABASE_LOAD_SUCCESS,
} from './types';

const reducer = (state = {}, action) => {
  switch (action.type) {
    case DATABASE_LOAD_SUCCESS:
      return {
        ...action.files.pop()
      };
    case FILE_LOADED_SUCCESS:
      return {
        fileName: action.fileName,
        fileLastModifiedDate: action.fileLastModifiedDate,
        harJson: action.harJson,
      };
    default:
      return state;
  }
};

export default reducer;
