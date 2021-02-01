import {
  KEY_ADDED, KEY_REMAINED, KEY_REMOVED, KEY_UPDATED, KEY_UPDATED_NEW_VALUE, KEY_UPDATED_OLD_VALUE,
} from '../constants.js';
import { isObject } from '../utils.js';

const stylishIndent = '  ';

const operationToSign = {
  [KEY_REMAINED]: ' ',
  [KEY_UPDATED]: ' ',
  [KEY_REMOVED]: '-',
  [KEY_ADDED]: '+',
  [KEY_UPDATED_OLD_VALUE]: '-',
  [KEY_UPDATED_NEW_VALUE]: '+',
};

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
      const [operation, key, value] = line;
      const sign = operationToSign[operation];
      str.push(stylishLine(key, value, sign, indentSize));
    });
  } else {
    Object.entries(changes).forEach(([key, value]) => {
      const sign = operationToSign[KEY_REMAINED];
      str.push(stylishLine(key, value, sign, indentSize));
    });
  }
  str.push(`${closingIndent}}`);

  if (indentSize === 1) {
    str.push('');
  }

  return str.join('\n');
};

export const stylish = (diff) => stylishWithIndent(diff, 1);
