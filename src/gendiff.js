import fs from 'fs';
import { getFileExtension, normalizePath } from './utils.js';
import getParser from './parsers.js';
import getFormatter from './formatters/index.js';
import {
  KEY_ADDED, NOT_CHANGED, KEY_REMOVED, KEY_UPDATED, KEY_UPDATED_NEW_VALUE, KEY_UPDATED_OLD_VALUE,
} from './constants.js';

const buildDiffForObjects = (argObj1, argObj2) => {
  const obj1 = argObj1 ?? {};
  const obj2 = argObj2 ?? {};

  const keys = [...new Set(Object.keys(obj1).concat(Object.keys(obj2)))]
    .filter((x) => x);
  keys.sort();

  const changes = [];
  keys.forEach((key) => {
    const value1 = obj1[key];
    const value2 = obj2[key];
    if (value1 === value2) {
      changes.push({ key, value: value1, status: NOT_CHANGED });
      return;
    }
    if (value1 === undefined) {
      changes.push({ key, value: value2, status: KEY_ADDED });
      return;
    }
    if (value2 === undefined) {
      changes.push({ key, value: value1, status: KEY_REMOVED });
      return;
    }
    if (typeof value1 === 'object' && typeof value2 === 'object') {
      changes.push({ key, value: buildDiffForObjects(value1, value2), status: KEY_UPDATED });
    } else {
      changes.push({ key, value: value1, status: KEY_UPDATED_OLD_VALUE });
      changes.push({ key, value: value2, status: KEY_UPDATED_NEW_VALUE });
    }
  });

  return changes;
};

const buildDiff = (filepath1, filepath2, format) => {
  const objects = [filepath1, filepath2]
    .map(normalizePath)
    .map((fp) => {
      const content = fs.readFileSync(fp, 'utf-8');
      const fileExtension = getFileExtension(fp);
      const parser = getParser(fileExtension);
      return parser.parse(content);
    });
  const diff = buildDiffForObjects(...objects);
  const formatter = getFormatter(format);
  return formatter.format(diff);
};

export default buildDiff;
