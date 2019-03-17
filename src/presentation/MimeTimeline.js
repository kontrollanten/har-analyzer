import { h } from 'preact';
import getStyleForEntry from '../lib/get-style-for-entry';
import formatSeconds from '../lib/format-seconds';

const MimeTimeline = ({ contentLoadTime, endTime, loadTime, mimeEntries, startTime }) => {
  const totalDuration = endTime - startTime;
  const stepSize = (totalDuration/5);

  return (
    <div style={{ position: 'relative', width: '100%' }}>
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
                left: `${n*100/totalDuration}%`,
                position: 'absolute',
              }}
            >{n/1000} s</div>
          ))}
      </div>

      <div style={{
        position: 'relative',
      }}>
        <div
          style={{
            position: "absolute",
            width: "3px",
            backgroundColor: "green",
            top: 0,
            bottom: 0,
            left:
              (loadTime / totalDuration) *
                100 +
              "%"
          }}
          title={`onLoad ${loadTime/1000} s`}
        />

        <div
          style={{
            position: "absolute",
            width: "3px",
            backgroundColor: "red",
            top: 0,
            bottom: 0,
            left:
              (contentLoadTime / totalDuration) *
                100 +
              "%"
          }}
          title={`onContentLoad ${contentLoadTime/1000} s`}
        />

        {mimeEntries
            .map(entry => (
              <div
                style={{
                  height: 20,
                  position: 'relative',
                }}
              >
                {entry.timings
                .map(entry => ({
                  ...entry,
                  relStartTime: entry.startTime - startTime,
                  relEndTime: entry.endTime - startTime,
                }))
                .map((time, index) => (
                  <div
                    style={{
                      ...getStyleForEntry({ ...entry, initiator: entry.initiatorType }),
                      left: `${(time.relStartTime)*100/totalDuration}%`,
                      height: '20px',
                      position: 'absolute',
                      whiteSpace: 'nowrap',
                      width: `${(time.relEndTime-time.relStartTime)*100/totalDuration}%`,
                    }}
                    title={`${formatSeconds(time.relStartTime)} - ${formatSeconds(time.relEndTime)}\n${time.urls.length} requests:\n${time.urls.join('\n')}`}
                  >
                    {index === 0 && (
                      `${entry.mimeType} from ${entry.initiatorType}`
                    )}
                  </div>
                ))}
              </div>
            ))
        }
      </div>
    </div>
  )
};

export default MimeTimeline;
