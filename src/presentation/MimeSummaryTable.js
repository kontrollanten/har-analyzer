import { h } from 'preact';
import SecondsFormat from './SecondsFormat';
import getStyleForEntry from '../lib/get-style-for-entry';

const MimeSummaryTable = ({
  entryPerMime,
  harJson,
}) => (
  <table style={{ width: '100%', marginBottom: '50px' }}>
    <thead>
      <tr>
        <th>MIME</th>
        <th>Initiator</th>
        <th>Amount</th>
        <th>Body size</th>
        <th>Start time</th>
        <th>End time</th>
      </tr>
    </thead>

    <tbody>
      {entryPerMime
          .map(({ contentSize, color, count, endTime, initiatorType, mimeType, startTime }) => (
            <tr
              key={mimeType+initiatorType}
              style={getStyleForEntry({ mimeType, initiator: initiatorType })}
            >
            <td>{mimeType}</td>
            <td>{initiatorType}</td>
            <td>{count}</td>
            <td>{contentSize / 1024} kb</td>
            <td><SecondsFormat time={startTime - new Date(harJson.log.pages[0].startedDateTime).getTime() } /></td>
            <td><SecondsFormat time={endTime - new Date(harJson.log.pages[0].startedDateTime).getTime() } /></td>
          </tr>
        ))}

        {entryPerMime
            .reduce(([acc], { contentSize }) => ([{
              contentSize: acc.contentSize + contentSize,
            }]), [{ contentSize: 0 }])
            .map(({ contentSize }) => (
              <tr
                key="total"
                style={{
                  fontWeight: 'bold',
                }}
              >
                <td>Total</td>
                <td></td>
                <td></td>
                <td>{contentSize / 1024} kb</td>
                <td></td>
                <td></td>
              </tr>
            ))}
    </tbody>
  </table>

);

export default MimeSummaryTable;
