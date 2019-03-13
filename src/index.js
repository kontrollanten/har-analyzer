import { h, render } from 'preact';
import { Provider } from 'preact-redux';
import 'preact/devtools';
import store from './store';
import DropZoneContainer from './file-management/DropZoneContainer';

render((
  <Provider store={store}>
    <DropZoneContainer />
  </Provider>
), document.body);
