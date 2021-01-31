import jsyaml from 'js-yaml';

const parsers = {
  json: JSON.parse,
  yaml: jsyaml.load,
  yml: jsyaml.load,
};

export const getParser = (type) => parsers[type] ?? JSON.parse;