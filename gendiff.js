#!/usr/bin/env node

import { program } from 'commander';
import fs from 'fs';
import path from 'path';

const normalizePath = (filepath) => {
  if (path.isAbsolute(filepath)) {
    return path.normalize(filepath);
  }
  return path.resolve(process.cwd(), filepath);
};

const constructAnswer = (changes) => {
  const str = ['{'];
  changes.forEach((line) => {
    const [sign, key, value] = line;
    str.push(`  ${sign} ${key}: ${value}`);
  });
  str.push('}');
  return str.join('\n');
};

const genDiff = (obj1, obj2) => {
  const keys = [...new Set(Object.keys(obj1).concat(Object.keys(obj2)))];
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

program
  .version('0.0.1')
  .description('Compares two configuration files and shows a difference.')
  .arguments('<filepath1> <filepath2>')
  .option('-f, --format [type]', 'output format')
  .action((filepath1, filepath2) => {
    const objs = [filepath1, filepath2]
      .map(normalizePath)
      .map((fp) => fs.readFileSync(fp))
      .map(JSON.parse);
    console.log(genDiff(...objs));
  });

program.parse();

export default genDiff;
