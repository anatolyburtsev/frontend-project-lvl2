import jsyaml from 'js-yaml';

const parsers = {
  json: JSON.parse,
  yaml: jsyaml.load,
  yml: jsyaml.load,
};

const getParser = (type) => ({
  parse: parsers[type],
});

export default getParser;
