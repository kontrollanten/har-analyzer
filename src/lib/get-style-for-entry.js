import color from 'color';

const backgroundColors = {
  "application/javascript script": "lime",
  "application/javascript parser": "teal",
  "application/json script": "orange",
  "application/json other": "mediumorchid",
  "application/octet-stream script": "lightblue",
  "application/octet-stream parser": "green",
  "image/svg+xml parser": "olive",
  "image/gif script": "red",
  "image/png other": "mediumpurple",
  "image/x-icon other": "purple",
  "text/css script": "maroon",
  "text/css parser": "aqua",
  "text/html script": "blue",
  "text/html other": "blue",
  "text/javascript script": "yellow",
  "text/plain script": "fuchsia",
  "x-unknown parser": "moccasin",
};

export default entry => {
  const backgroundColor = backgroundColors[entry.mimeType + ' ' + entry.initiator];

  return {
    backgroundColor: color(backgroundColor).alpha(0.4),
    border: `1px solid ${backgroundColor}`,
    color: 'black',
  };
};
