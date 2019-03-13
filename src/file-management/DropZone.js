import { h, Component } from 'preact';
import App from '../App';
import Header from './HeaderContainer';
import dropHandler from '../lib/drop-handler';

export default class DropZone extends Component {
  constructor(props) {
    super(props);

    const dh = dropHandler(document.body);

    dh.addEventListener('fileLoaded', ({ detail: { content, file } }) => {
      const harJson = JSON.parse(content);

      this.props.onFileLoaded({
        fileName: file.name,
        fileLastModifiedDate: file.lastModifiedDate.toString(),
        harJson,
      });
    });
  }

  render({ harJson }) {
    if (!harJson) {
      return (
        <div
          style={{
            height: '100vh',
            width: '100vw',
          }}
        >
          <h1>Drop your HAR!</h1>
        </div>
      );
    }

    return (
      <div>
        <Header />
        <App harJson={harJson} />
      </div>
    );
  }
}

