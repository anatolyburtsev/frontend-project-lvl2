import { KEY_REMAINED } from './constants.js';

const stylishIndent = '  ';

const isObject = (obj) => typeof obj === 'object' && obj !== null;

const stylishLine = (key, value, sign, indentSize) => {
  const indent = stylishIndent.repeat(indentSize);
  // eslint-disable-next-line no-use-before-define
  const valueStr = isObject(value) ? stylishWithIndent(value, indentSize + 2) : value;
  const spaceBeforeValue = valueStr === '' ? '' : ' ';
  return `${indent}${sign} ${key}:${spaceBeforeValue}${valueStr}`;
};

const stylishWithIndent = (changes, indentSize) => {
  const str = ['{'];
  const closingIndent = stylishIndent.repeat(indentSize - 1);
  if (Array.isArray(changes)) {
    changes.forEach((line) => {
      const [sign, key, value] = line;
      str.push(stylishLine(key, value, sign, indentSize));
    });
  } else {
    Object.entries(changes).forEach(([key, value]) => {
      str.push(stylishLine(key, value, KEY_REMAINED, indentSize));
    });
  }
  str.push(`${closingIndent}}`);

  if (indentSize === 1) {
    str.push('');
  }

  return str.join('\n');
};
const stylish = (diff) => stylishWithIndent(diff, 1);

const formatters = {
  stylish,
};

export const getFormatter = (type) => ({
  format: formatters[type] ?? stylish,
});
