import fs from 'fs';
import { expect, test, describe } from '@jest/globals';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import genDiff from '../src/gendiff';

export const __filename = fileURLToPath(import.meta.url);
export const __dirname = dirname(__filename);

const getFixturePath = (format, filename) => path.join(__dirname, '..', '__fixtures__', format, filename);

describe('parametrized', () => {
  test.each([
    ['json', 'two different files', 'webconfig1.json', 'webconfig2.json', 'expectedWebconfigs.txt'],
    ['json', 'compare with empty', 'webconfig1.json', 'empty.json', 'expectedMinusWebconfig1.txt'],
    ['json', 'compare with itself', 'webconfig1.json', 'webconfig1.json', 'expectedItselfWebconfig1.txt'],
    ['yaml', 'two different files', 'webconfig1.yml', 'webconfig2.yml', 'expectedWebconfigs.txt'],
    ['yaml', 'compare with empty', 'webconfig1.yml', 'empty.yml', 'expectedMinusWebconfig1.txt'],
    ['yaml', 'compare with itself', 'webconfig1.yml', 'webconfig1.yml', 'expectedItselfWebconfig1.txt'],
  ])("format: '%s', case: '%s'", (format, desc, fp1, fp2, fexp) => {
    const filepath1 = getFixturePath(format, fp1);
    const filepath2 = getFixturePath(format, fp2);
    const expectedResult = fs.readFileSync(getFixturePath(format, fexp), 'utf-8');
    const result = genDiff(filepath1, filepath2, format);
    expect(result).toEqual(expectedResult);
  });
});
