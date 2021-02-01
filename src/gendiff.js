import fs from 'fs';
import { getFileExtension, normalizePath } from './utils.js';
import { getParser } from './parsers.js';
import { getFormatter } from './formatters';
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
      changes.push([NOT_CHANGED, key, value1]);
      return;
    }
    if (value1 === undefined) {
      changes.push([KEY_ADDED, key, value2]);
      return;
    }
    if (value2 === undefined) {
      changes.push([KEY_REMOVED, key, value1]);
      return;
    }
    if (typeof value1 === 'object' && typeof value2 === 'object') {
      changes.push([KEY_UPDATED, key, buildDiffForObjects(value1, value2)]);
    } else {
      changes.push([KEY_UPDATED_OLD_VALUE, key, value1]);
      changes.push([KEY_UPDATED_NEW_VALUE, key, value2]);
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
