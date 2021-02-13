import stylish from './stylish.js';
import plain from './plain.js';
import json from './json.js';

const formatters = {
  stylish,
  plain,
  json,
};

const format = (type, data) => {
  const formatter = formatters[type] ?? stylish;
  return formatter(data);
};

export default format;
