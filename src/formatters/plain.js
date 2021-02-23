import _ from 'lodash';
import {
  NODE_ADDED, NODE_CHANGED, NODE_NESTED, NODE_NOT_CHANGED,
  NODE_REMOVED, NODE_ROOT,
} from '../ast-tree.js';

const toString = (value) => {
  if (_.isObject(value)) {
    return '[complex value]';
  }
  if (typeof value === 'string') {
    return `'${value}'`;
  }
  return value;
};

const getPropertyName = (path, key) => [...path, key].join('.');

const nodeProcessingMapping = {
  [NODE_REMOVED]: (node, path) => {
    const { key } = node;
    const propertyName = getPropertyName(path, key);
    return `Property '${propertyName}' was removed`;
  },
  [NODE_ADDED]: (node, path) => {
    const { value, key } = node;
    const propertyName = getPropertyName(path, key);
    return `Property '${propertyName}' was added with value: ${toString(value)}`;
  },
  [NODE_NESTED]: (node, path) => {
    const { key } = node;
    // eslint-disable-next-line no-use-before-define
    return formatPlain([node.value], [...path, key]);
  },
  // eslint-disable-next-line no-use-before-define
  [NODE_ROOT]: (node, path) => formatPlain(node.children, path),
  [NODE_CHANGED]: (node, path) => {
    const { oldValue, newValue, key } = node;
    const propertyName = getPropertyName(path, key);
    return `Property '${propertyName}' was updated. From ${toString(oldValue)} to ${toString(newValue)}`;
  },
  [NODE_NOT_CHANGED]: () => {},
};

const formatPlain = (nodeArray, path) => nodeArray.map((node) => {
  const { type } = node;
  const func = nodeProcessingMapping[type];
  return func(node, path);
}).filter((u) => u).join('\n');

const plain = (tree) => formatPlain(tree.children, []);

export default plain;
