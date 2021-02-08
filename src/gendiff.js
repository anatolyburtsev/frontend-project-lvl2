import fs from 'fs';
import _ from 'lodash';
import { getFileExtension, normalizePath } from './utils.js';
import getParser from './parsers.js';
import getFormatter from './formatters/index.js';
import {
  KEY_ADDED,
  KEY_REMOVED,
  KEY_UPDATED,
  KEY_UPDATED_NEW_VALUE,
  KEY_UPDATED_OLD_VALUE,
  NOT_CHANGED,
} from './constants.js';

const buildDiffForObjects = (obj1 = {}, obj2 = {}) => {
  const unsortedKeys = _.union(_.keys(obj1), _.keys(obj2));
  const keys = _.sortBy(unsortedKeys);

  return keys.flatMap((key) => {
    const value1 = obj1[key];
    const value2 = obj2[key];
    if (!_.has(obj1, key)) {
      return { key, value: value2, status: KEY_ADDED };
    }
    if (!_.has(obj2, key)) {
      return { key, value: value1, status: KEY_REMOVED };
    }
    if (!_.isEqual(value1, value2)) {
      if (_.isPlainObject(obj1[key]) && _.isPlainObject(obj2[key])) {
        return { key, value: buildDiffForObjects(value1, value2), status: KEY_UPDATED };
      }
      return [{ key, value: value1, status: KEY_UPDATED_OLD_VALUE },
        { key, value: value2, status: KEY_UPDATED_NEW_VALUE }];
    }
    return { key, value: value1, status: NOT_CHANGED };
  });
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
