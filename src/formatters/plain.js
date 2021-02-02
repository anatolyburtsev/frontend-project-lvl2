import {
  KEY_ADDED, KEY_REMOVED, KEY_UPDATED, KEY_UPDATED_NEW_VALUE, KEY_UPDATED_OLD_VALUE,
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

const formatPlain = (changes, prefix) => changes.map((line, idx) => {
  const { key, value, status } = line;
  if (status === KEY_REMOVED) {
    return `Property '${prefix}${key}' was removed`;
  }
  if (status === KEY_ADDED) {
    return `Property '${prefix}${key}' was added with value: ${toString(value)}`;
  }
  if (status === KEY_UPDATED) {
    return formatPlain(value, `${prefix}${key}.`);
  }

  if (status === KEY_UPDATED_NEW_VALUE) {
    const { key: prevKey, value: prevValue, status: prevStatus } = changes[idx - 1];
    if (prevStatus !== KEY_UPDATED_OLD_VALUE) {
      throw Error(`Unexpected key: ${prevStatus}`);
    }
    if (key !== prevKey) {
      throw Error(`Keys in update expected to be the same: ${key} and ${prevKey}`);
    }
    return `Property '${prefix}${key}' was updated. From ${toString(prevValue)} to ${toString(value)}`;
  }

  return null;
}).filter((l) => l).join('\n');

const plain = (diff) => formatPlain(diff, '');

export default plain;
