import _ from 'lodash';
import {
  NODE_ADDED, NODE_CHANGED, NODE_NESTED, NODE_NOT_CHANGED, NODE_REMOVED, NODE_ROOT,
} from '../constants.js';

const stylishIndent = '  ';

const nodeTypeToSign = {
  [NODE_NOT_CHANGED]: ' ',
  [NODE_CHANGED]: ' ',
  [NODE_NESTED]: ' ',
  [NODE_REMOVED]: '-',
  [NODE_ADDED]: '+',
};

const getIndent = (indentSize) => stylishIndent.repeat(indentSize);

const stringifyObject = (obj, indentSize) => {
  const indent = getIndent(indentSize + 2);
  const closingIndent = getIndent(indentSize);
  const properties = Object.entries(obj).map(([key, value]) => {
    const valueStr = _.isPlainObject(value) ? stringifyObject(value, indentSize + 2) : value;
    return `${indent}${key}: ${valueStr}`;
  }).join('\n');
  return `{\n${properties}\n${closingIndent}}`;
};

const stringify = (key, value, sign, indentSize) => {
  const indent = getIndent(indentSize);
  const valueStr = _.isPlainObject(value) ? stringifyObject(value, indentSize + 1) : value;
  return `${indent}${sign} ${key}: ${valueStr}`;
};

const stylishWithIndent = (nodeArray, indentSize) => nodeArray.flatMap((node) => {
  const { key, type } = node;
  if (type === NODE_NESTED) {
    const indent = getIndent(indentSize + 1);
    const value = stylishWithIndent([node.value], indentSize + 2);
    return `${indent}${key}: {\n${value}\n${indent}}`;
  }
  if (type === NODE_ROOT) {
    return stylishWithIndent(node.children, indentSize);
  }
  if (type === NODE_CHANGED) {
    const { oldValue, newValue } = node;
    return [
      stringify(key, oldValue, nodeTypeToSign[NODE_REMOVED], indentSize),
      stringify(key, newValue, nodeTypeToSign[NODE_ADDED], indentSize),
    ];
  }
  if (type === NODE_ADDED || type === NODE_REMOVED || type === NODE_NOT_CHANGED) {
    const sign = nodeTypeToSign[type];
    const { value } = node;
    return stringify(key, value, sign, indentSize);
  }
  return null;
}).join('\n');

const stylish = (tree) => {
  const value = stylishWithIndent(tree.children, 1);
  return `{\n${value}\n}`;
};

export default stylish;
