import db from './database';
import {
  FILE_LOADED_SUCCESS,
} from './types';

const dbMw = store => next => action => {
  next(action);

  switch (action.type) {
    case FILE_LOADED_SUCCESS: {
      const data = {...store.getState()};
      db.dispatchEvent(new CustomEvent('newFile', { detail: data }));
      break;
    }
  }
};

export default dbMw;
