import jsyaml from 'js-yaml';

const parsers = {
  json: JSON.parse,
  yaml: jsyaml.load,
  yml: jsyaml.load,
};

const parse = (type, data) => {
  const parser = parsers[type];
  return parser(data);
};

export default parse;
