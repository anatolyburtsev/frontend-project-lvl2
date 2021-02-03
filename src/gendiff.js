import fs from 'fs';
import _ from 'lodash';
import { getFileExtension, normalizePath } from './utils.js';
import getParser from './parsers.js';
import getFormatter from './formatters/index.js';
import {
  KEY_ADDED, NOT_CHANGED, KEY_REMOVED, KEY_UPDATED, KEY_UPDATED_NEW_VALUE, KEY_UPDATED_OLD_VALUE,
} from './constants.js';

const buildDiffForObjects = (argObj1, argObj2) => {
  const obj1 = argObj1 ?? {};
  const obj2 = argObj2 ?? {};

  const unsortedKeys = [...new Set(Object.keys(obj1).concat(Object.keys(obj2)))]
    .filter((x) => x);
  const keys = _.sortBy(unsortedKeys);

  const changes = keys.map((key) => {
    const value1 = obj1[key];
    const value2 = obj2[key];
    if (value1 === value2) {
      return { key, value: value1, status: NOT_CHANGED };
    }
    if (value1 === undefined) {
      return { key, value: value2, status: KEY_ADDED };
    }
    if (value2 === undefined) {
      return { key, value: value1, status: KEY_REMOVED };
    }
    if (typeof value1 === 'object' && typeof value2 === 'object') {
      return { key, value: buildDiffForObjects(value1, value2), status: KEY_UPDATED };
    }
    return [{ key, value: value1, status: KEY_UPDATED_OLD_VALUE },
      { key, value: value2, status: KEY_UPDATED_NEW_VALUE }];
  }).flat(1);
  return changes;
};

const buildDiff = (filepath1, filepath2, format) => {
  const objects = [filepath1, filepath2]
    .map(normalizePath)
    .map((filepath) => {
      const content = fs.readFileSync(filepath, 'utf-8');
      const fileExtension = getFileExtension(filepath);
      const parser = getParser(fileExtension);
      return parser.parse(content);
    });
  const diff = buildDiffForObjects(...objects);
  const formatter = getFormatter(format);
  return formatter.format(diff);
};

export default buildDiff;
