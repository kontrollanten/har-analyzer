import { applyMiddleware, compose, createStore } from 'redux';
import {
  FILE_LOAD_INIT,
  DATABASE_LOAD_FAILED,
  DATABASE_LOAD_INIT,
  DATABASE_LOAD_SUCCESS,
} from './file-management/types';
import dbMw from './file-management/database-middleware';
import db from './file-management/database';
import reducer from './file-management/reducer';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(reducer, composeEnhancers(applyMiddleware(dbMw)));

store.dispatch({
  type: DATABASE_LOAD_INIT,
});

db.addEventListener('open', () => {
  db.getFiles()
    .then((files) => {
      console.log({files});
      store.dispatch({
        type: DATABASE_LOAD_SUCCESS,
        files,
      });
    })
    .catch(err => {
      console.error(err);

      store.dispatch({
        type: DATABASE_LOAD_FAILED,
        error: err,
      });
    });
});

export default store;
