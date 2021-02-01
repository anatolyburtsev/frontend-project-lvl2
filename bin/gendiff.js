#!/usr/bin/env node

import { program } from 'commander';
import buildDiff from '../src/gendiff.js';

program
  .version('0.0.1')
  .description('Compares two configuration files and shows a difference.')
  .arguments('<filepath1> <filepath2>')
  .option('-f, --format [type]', 'output format', 'stylish')
  .action((filepath1, filepath2, options) => {
    const diff = buildDiff(filepath1, filepath2, options.format);
    console.log(diff);
  });

program.parse();
