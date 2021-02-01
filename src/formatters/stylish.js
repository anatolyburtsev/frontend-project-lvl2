import {
  KEY_ADDED, NOT_CHANGED, KEY_REMOVED, KEY_UPDATED, KEY_UPDATED_NEW_VALUE, KEY_UPDATED_OLD_VALUE,
} from '../constants.js';
import { isObject } from '../utils.js';

const stylishIndent = '  ';

const nodeTypeToSign = {
  [NOT_CHANGED]: ' ',
  [KEY_UPDATED]: ' ',
  [KEY_REMOVED]: '-',
  [KEY_ADDED]: '+',
  [KEY_UPDATED_OLD_VALUE]: '-',
  [KEY_UPDATED_NEW_VALUE]: '+',
};

const toString = (key, value, nodeType, indentSize) => {
  const indent = stylishIndent.repeat(indentSize);
  // eslint-disable-next-line no-use-before-define
  const valueStr = isObject(value) ? stylishWithIndent(value, indentSize + 2) : value;
  const spaceBeforeValue = valueStr === '' ? '' : ' ';
  return `${indent}${nodeType} ${key}:${spaceBeforeValue}${valueStr}`;
};

const stylishWithIndent = (changes, indentSize) => {
  const str = ['{'];
  const closingIndent = stylishIndent.repeat(indentSize - 1);
  if (Array.isArray(changes)) {
    changes.forEach((line) => {
      const [nodeType, key, value] = line;
      const sign = nodeTypeToSign[nodeType];
      str.push(toString(key, value, sign, indentSize));
    });
  } else {
    Object.entries(changes).forEach(([key, value]) => {
      const sign = nodeTypeToSign[NOT_CHANGED];
      str.push(toString(key, value, sign, indentSize));
    });
  }
  str.push(`${closingIndent}}`);

  if (indentSize === 1) {
    str.push('');
  }

  return str.join('\n');
};

export const stylish = (diff) => stylishWithIndent(diff, 1);
