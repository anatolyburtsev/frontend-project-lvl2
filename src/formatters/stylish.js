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
  return `${indent}${nodeType} ${key}: ${valueStr}`;
};

const stylishFromArray = (array, indentSize) => array.map((line) => {
  const { key, value, status } = line;
  const sign = nodeTypeToSign[status];
  return toString(key, value, sign, indentSize);
}).join('\n');

const stylishFromObj = (obj, indentSize) => Object.entries(obj).map(([key, value]) => {
  const sign = nodeTypeToSign[NOT_CHANGED];
  return toString(key, value, sign, indentSize);
}).join('\n');

const stylishWithIndent = (changes, indentSize) => {
  const closingIndent = stylishIndent.repeat(indentSize - 1);
  const content = Array.isArray(changes)
    ? stylishFromArray(changes, indentSize)
    : stylishFromObj(changes, indentSize);
  return `{\n${content}\n${closingIndent}}`;
};

const stylish = (diff) => stylishWithIndent(diff, 1);

export default stylish;
