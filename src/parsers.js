import yaml from 'js-yaml';

const parsers = {
  json: JSON.parse,
  yaml: yaml.load,
};

export const getParser = (type) => parsers[type] ?? JSON.parse;
