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

const formatPlain = (changes, prefix) => {
  const str = [];
  changes.forEach((line, idx) => {
    const [sign, key, value] = line;
    if (sign === KEY_REMOVED) {
      str.push(`Property '${prefix}${key}' was removed`);
    }
    if (sign === KEY_ADDED) {
      str.push(`Property '${prefix}${key}' was added with value: ${toString(value)}`);
    }
    if (sign === KEY_UPDATED) {
      str.push(formatPlain(value, `${prefix}${key}.`));
    }

    if (sign === KEY_UPDATED_NEW_VALUE) {
      const [prevSign, prevKey, prevValue] = changes[idx - 1];
      if (prevSign !== KEY_UPDATED_OLD_VALUE) {
        throw Error(`Unexpected key: ${prevSign}`);
      }
      if (key !== prevKey) {
        throw Error(`Keys in update expected to be the same: ${key} and ${prevKey}`);
      }
      str.push(`Property '${prefix}${key}' was updated. From ${toString(prevValue)} to ${toString(value)}`);
    }
  });
  if (prefix === '') {
    str.push('');
  }
  return str.join('\n');
};

export const plain = (diff) => formatPlain(diff, '');
