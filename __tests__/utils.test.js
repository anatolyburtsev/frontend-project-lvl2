import { expect, test } from '@jest/globals';
import { normalizePath } from '../src/utils.js';
import { __dirname } from './gendiff.test.js';

test('resolve absolute path', () => {
  const path = `${__dirname}/../__tests__`;
  const expectedPath = __dirname;
  expect(normalizePath(path)).toEqual(expectedPath);
});

test('resolve relative path', () => {
  const path = 'dir/file.json';
  const expectedPath = `${process.cwd()}/dir/file.json`;
  expect(normalizePath(path)).toEqual(expectedPath);
});
