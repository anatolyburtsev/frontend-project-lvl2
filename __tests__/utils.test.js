import { expect, test } from '@jest/globals';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { normalizePath } from '../src/utils.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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
