import db from './database';
import {
  FILE_LOAD_FAILED,
  FILE_LOAD_INIT,
  FILE_LOAD_SUCCESS,
} from './types';

const dbMw = store => next => action => {
  switch (action.type) {
    case FILE_LOAD_INIT: {
      const data = [...store.getState().files].pop();
      db.addFile({
        fileName: action.fileName,
        fileLastModifiedDate: action.fileLastModifiedDate,
        harJson: action.harJson,
      })
        .then(file => {
          store.dispatch({
            type: FILE_LOAD_SUCCESS,
            file,
          });
        })
        .catch(error => {
          store.dispatch({
            type: FILE_LOAD_FAILED,
            error,
          });
        });
      db.dispatchEvent(new CustomEvent('newFile', { detail: data }));
      break;
    }
  }

  next(action);
};

export default dbMw;
