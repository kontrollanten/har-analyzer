import { h } from 'preact';
import getStyleForEntry from '../lib/get-style-for-entry';
import formatSeconds from '../lib/format-seconds';
import styles from './mime-timeline.scss';

const MimeTimeline = ({ contentLoadTime, endTime, loadTime, mimeEntries, startTime }) => {
  const totalDuration = endTime - startTime;
  const stepSize = (totalDuration/5);

  return (
    <div className={styles.MimeTimeline}>
      <h2>MIME timeline</h2>

      <div
        className={styles.XAxesLabel}
      >
      {Array.from(new Array(Math.round(5)))
          .map((_b, i) => Math.round((i * stepSize)))
          .map((n) => (
            <div
              style={{
                left: `${n*100/totalDuration}%`,
              }}
            >{n/1000} s</div>
          ))}
      </div>

      <div className={styles.Content}>
        <div
          className={styles.OnLoadMarker}
          style={{
            left:
              (loadTime / totalDuration) *
                100 +
              "%"
          }}
          title={`onLoad ${loadTime/1000} s`}
        />

        <div
          className={styles.ContentLoadMarker}
          style={{
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
                className={styles.MimeRow}
              >
                {entry.timings
                .map(entry => ({
                  ...entry,
                  relStartTime: entry.startTime - startTime,
                  relEndTime: entry.endTime - startTime,
                }))
                .map((time, index) => (
                  <div
                    className={styles.MimeTimeSpan}
                    style={{
                      ...getStyleForEntry({ ...entry, initiator: entry.initiatorType }),
                      left: `${(time.relStartTime)*100/totalDuration}%`,
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
