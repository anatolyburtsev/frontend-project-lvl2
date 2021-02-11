import {
  NODE_ADDED, NODE_CHANGED, NODE_NESTED,
  NODE_REMOVED, NODE_ROOT,
} from '../constants.js';
import { isObject } from '../utils.js';

const toString = (value) => {
  if (isObject(value)) {
    return '[complex value]';
  } if (typeof value === 'string') {
    return `'${value}'`;
  }
  return value;
};

const formatPlain = (nodeArray, prefix) => nodeArray.map((node) => {
  const { key, type } = node;
  if (type === NODE_REMOVED) {
    return `Property '${prefix}${key}' was removed`;
  }
  if (type === NODE_ADDED) {
    const { value } = node;
    return `Property '${prefix}${key}' was added with value: ${toString(value)}`;
  }
  if (type === NODE_NESTED) {
    return formatPlain([node.value], `${prefix}${key}.`);
  }

  if (type === NODE_ROOT) {
    return formatPlain(node.children, prefix);
  }

  if (type === NODE_CHANGED) {
    const { oldValue, newValue } = node;
    return `Property '${prefix}${key}' was updated. From ${toString(oldValue)} to ${toString(newValue)}`;
  }

  return null;
}).filter((u) => u).join('\n');

const plain = (tree) => formatPlain(tree.children, '');

export default plain;
