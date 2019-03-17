import { h, Component } from 'preact';
import getStyleForEntry from '../lib/get-style-for-entry';
import getEntryPerMime from './get-entry-per-mime';
import MimeSummaryTable from './MimeSummaryTable';
import MimeTimeline from './MimeTimeline';
import SecondsFormat from './SecondsFormat';
import FileView from './FileView';

export default class App extends Component {
  constructor(props) {
    super(props);

    this.handleToggleExclude = this.handleToggleExclude.bind(this);

    if (this.props.harJson) {
      const entryPerMime = getEntryPerMime(this.props.harJson, []);

      this.setState({
        entryPerMime,
        excludedEntries: []
      });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.excludedEntries !== this.state.excludedEntries || prevProps.harJson !== this.props.harJson) {
      const entryPerMime = getEntryPerMime(this.props.harJson, this.state.excludedEntries);

      this.setState(() => ({
        entryPerMime,
      }));
    }
  }

  handleToggleExclude({ target }) {
    const index = +target.name;

    this.setState((state) => ({
      excludedEntries: state.excludedEntries.indexOf(index) === -1
        ? [...state.excludedEntries, index]
        : state.excludedEntries.filter((i) => i !== index)
    }));
  };

  render({ harJson }, { entryPerMime, excludedEntries }) {
    return (
      <div>
        <h1>HAR analyzer</h1>

        <ul>
          {harJson.log.pages.map(page => (
            <li>
              {page.title} timings:
              <ul>
                <li>
                  <a href="https://developer.mozilla.org/en-US/docs/Web/Events/DOMContentLoaded">
                    onContentLoad
                  </a>:&nbsp;
                  <SecondsFormat time={page.pageTimings.onContentLoad} />
                </li>
                <li>onLoad: <SecondsFormat time={page.pageTimings.onLoad} /></li>
              </ul>
            </li>
          ))}
        </ul>

        <FileView harJson={harJson} />

        {entryPerMime &&
          <MimeSummaryTable
            entryPerMime={entryPerMime}
          />
        }

        {entryPerMime && <MimeTimeline
          contentLoadTime={harJson.log.pages[0].pageTimings.onContentLoad}
          endTime={[...entryPerMime].sort((a, b) => a.endTime - b.endTime).pop().endTime}
          loadTime={harJson.log.pages[0].pageTimings.onLoad}
          mimeEntries={entryPerMime}
          startTime={[...entryPerMime].shift().startTime}
        />}

      {entryPerMime && <table
        style={{
          tableLayout: 'fixed',
          width: '100vw',
          wordBreak: 'break-word',
        }}
      >
          <tbody>
            {harJson.log.entries.map((entry, index) => (
              <tr style={getStyleForEntry({
                mimeType: entry.response.content.mimeType,
                initiator: entry._initiator.type,
              })}>
                <td>
                  <input
                    checked={excludedEntries.indexOf(index) === -1}
                    name={index}
                    onChange={this.handleToggleExclude}
                    type="checkbox"
                  />
                </td>
                <td><SecondsFormat time={entry.time} /></td>
                <td>{entry.response.content.mimeType}</td>
                <td>{entry._initiator.type}</td>
                <td>{entry.request.url}</td>
              </tr>
            ))}
          </tbody>
        </table>}
      </div>
    );
  }
}
