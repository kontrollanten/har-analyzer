import { h } from 'preact';
import getStyleForEntry from '../lib/get-style-for-entry';
import formatSeconds from '../lib/format-seconds';

const MimeTimeline = ({ endTime, mimeEntries, startTime }) => {
  const totalTime = endTime - startTime;
  const stepSize = (totalTime/5);

  return (
    <div style={{ width: '100%' }}>
      <h2>MIME timeline</h2>

      <div
        style={{
          height: '20px',
          position: 'relative',
        }}
      >
      {Array.from(new Array(Math.round(5)))
          .map((_b, i) => Math.round((i * stepSize)))
          .map((n) => (
            <div
              style={{
                left: `${n*100/totalTime}%`,
                position: 'absolute',
              }}
            >{n/1000} s</div>
          ))}
      </div>

      {mimeEntries
        .map(entry => ({
          ...entry,
          relStartTime: entry.startTime - startTime,
          relEndTime: entry.endTime - startTime,
        }))
        .map(entry => (
        <div
          style={{
            ...getStyleForEntry({ ...entry, initiator: entry.initiatorType }),
            left: `${(entry.relStartTime)*100/totalTime}%`,
            height: '20px',
            position: 'relative',
            whiteSpace: 'nowrap',
            width: `${(entry.relEndTime-entry.relStartTime)*100/totalTime}%`,
          }}
          title={`${formatSeconds(entry.relStartTime)} - ${formatSeconds(entry.relEndTime)}`}
        >
          {entry.mimeType} from {entry.initiatorType}
        </div>
      ))}
    </div>
  )
};

export default MimeTimeline;
