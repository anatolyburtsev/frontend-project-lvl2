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

const nodeProcessingMapping = {
  [NODE_NESTED]: (node, indentSize) => {
    const { key } = node;
    const indent = getIndent(indentSize + 1);
    // eslint-disable-next-line no-use-before-define
    const value = stylishWithIndent([node.value], indentSize + 2);
    return `${indent}${key}: {\n${value}\n${indent}}`;
  },
  // eslint-disable-next-line no-use-before-define
  [NODE_ROOT]: (node, indentSize) => stylishWithIndent(node.children, indentSize),
  [NODE_CHANGED]: (node, indentSize) => {
    const { key, oldValue, newValue } = node;
    return [
      stringify(key, oldValue, nodeTypeToSign[NODE_REMOVED], indentSize),
      stringify(key, newValue, nodeTypeToSign[NODE_ADDED], indentSize),
    ];
  },
};

const defaultProcessing = (node, indentSize) => {
  const { key, type, value } = node;
  const sign = nodeTypeToSign[type];
  return stringify(key, value, sign, indentSize);
};

const processNode = (node, indentSize) => {
  const processor = nodeProcessingMapping[node.type] ?? defaultProcessing;
  return processor(node, indentSize);
};

const stylishWithIndent = (nodeArray, indentSize) => nodeArray
  .flatMap((node) => processNode(node, indentSize)).join('\n');

const stylish = (tree) => {
  const value = stylishWithIndent([tree], 1);
  return `{\n${value}\n}`;
};

export default stylish;
