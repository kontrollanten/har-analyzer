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

export default getEntryPerMime;
