const backgroundColors = {
  "text/html other": "blue",
  "text/html script": "blue",
  "text/css parser": "aqua",
  "application/javascript parser": "teal",
  "image/svg+xml parser": "olive",
  "application/octet-stream parser": "green",
  "application/octet-stream script": "lightblue",
  "application/javascript script": "lime",
  "text/javascript script": "yellow",
  "application/json script": "orange",
  "application/json other": "mediumorchid",
  "image/gif script": "red",
  "image/png other": "mediumpurple",
  "text/plain script": "fuchsia",
  "image/x-icon other": "purple",
  "text/css script": "maroon",
  "x-unknown parser": "moccasin",
};

const textColors = {
  blue: 'white',
  green: 'white',
  maroon: 'white',
  purple: 'white',
  teal: 'white',
};

export default entry => {
  const backgroundColor = backgroundColors[entry.mimeType + ' ' + entry.initiator];

  return {
    backgroundColor,
    color: textColors[backgroundColor] || 'black',
  };
};
