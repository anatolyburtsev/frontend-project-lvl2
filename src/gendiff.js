import fs from 'fs';
import * as path from 'path';
import { normalizePath } from './utils.js';
import { getParser } from './parsers.js';

const constructAnswer = (changes) => {
  const str = ['{'];
  changes.forEach((line) => {
    const [sign, key, value] = line;
    str.push(`  ${sign} ${key}: ${value}`);
  });
  str.push('}\n');
  return str.join('\n');
};

const genDiffObjects = (argObj1, argObj2) => {
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
      changes.push([' ', key, value1]);
      return;
    }
    if (value1 === undefined) {
      changes.push(['+', key, value2]);
      return;
    }
    if (value2 === undefined) {
      changes.push(['-', key, value1]);
      return;
    }
    changes.push(['-', key, value1]);
    changes.push(['+', key, value2]);
  });

  return constructAnswer(changes);
};

const getFileExtension = (filepath) => path.extname(filepath).replace('.', '');

// eslint-disable-next-line no-unused-vars
const genDiff = (filepath1, filepath2, format = 'json') => {
  const objects = [filepath1, filepath2]
    .map(normalizePath)
    .map((fp) => {
      const content = fs.readFileSync(fp, 'utf-8');
      const fileExtension = getFileExtension(fp);
      const parser = getParser(fileExtension);
      return parser(content);
    });
  return genDiffObjects(...objects);
};

export default genDiff;
