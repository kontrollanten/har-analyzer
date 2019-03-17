import { h, Component } from 'preact';
import getStyleForEntry from '../lib/get-style-for-entry';
import MimeSummaryTable from './MimeSummaryTable';
import MimeTimeline from './MimeTimeline';
import SecondsFormat from './SecondsFormat';
import FileView from './FileView';

const addTiming = ({ endTime, startTime }, timings) => {
  const match = timings.findIndex(t => {
    if (endTime >= t.startTime && endTime <= t.endTime) return true;
    if (startTime >= t.startTime && startTime <= t.endTime) return true;
  });

  if (match > -1) {
    timings[match] = {
      endTime: Math.max(endTime, timings[match].endTime),
      startTime: Math.min(startTime, timings[match].startTime),
    };

    return timings;
  }

  return [...timings, { endTime, startTime }];
};

const getEntryPerMime = (harJson, excludedEntries) => Object.values(harJson.log.entries.reduce((acc, entry, index) => {
  if (excludedEntries.indexOf(index) > -1) return acc;

  const { mimeType } = entry.response.content;
  const initiatorType = entry._initiator.type;

  const key = `${mimeType} ${initiatorType}`;

  const mimeStats = acc[key] || {
    contentSize: 0,
    count: 0,
    endTime: 0,
    startTime: new Date(entry.startedDateTime).getTime(),
    timings: [],
  };

  return ({
    ...acc,
    [key]: {
      ...mimeStats,
      contentSize: mimeStats.contentSize + entry.response._transferSize,
      count: mimeStats.count + 1,
      endTime: Math.max(mimeStats.endTime, new Date(entry.startedDateTime).getTime() + entry.time),
      initiatorType,
      mimeType,
      startTime: Math.min(mimeStats.startTime, new Date(entry.startedDateTime).getTime()),
      timings: addTiming({
        endTime: new Date(entry.startedDateTime).getTime() + entry.time,
        startTime: new Date(entry.startedDateTime).getTime(),
      }, mimeStats.timings),
    }
  });
}, {}))
  .sort((a, b) => a.startTime < b.startTime ? -1 : 1);


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
            harJson={harJson}
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
