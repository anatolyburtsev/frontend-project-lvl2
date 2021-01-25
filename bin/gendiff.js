#!/usr/bin/env node

import { program } from 'commander';
import genDiff from '../src/gendiff.js';

program
  .version('0.0.1')
  .description('Compares two configuration files and shows a difference.')
  .arguments('<filepath1> <filepath2>')
  .option('-f, --format [type]', 'output format')
  .action((filepath1, filepath2, options) => {
    const diff = genDiff(filepath1, filepath2, options.format);
    // const objs = [filepath1, filepath2]
    //   .map(normalizePath)
    //   .map((fp) => fs.readFileSync(fp))
    //   .map(JSON.parse);
    console.log(diff);
  });

program.parse();
