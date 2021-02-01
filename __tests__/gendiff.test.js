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
    ['json', 'two different files', 'webconfig1.json', 'webconfig2.json', 'expectedWebconfigs.txt', 'stylish'],
    ['json', 'compare with empty', 'webconfig1.json', 'empty.json', 'expectedMinusWebconfig1.txt', 'stylish'],
    ['json', 'compare with itself', 'webconfig1.json', 'webconfig1.json', 'expectedItselfWebconfig1.txt', 'stylish'],
    ['json', 'nested files', 'nestedConfig1.json', 'nestedConfig2.json', 'expectedNestedConfigDiff.txt', 'stylish'],
    ['yaml', 'two different files', 'webconfig1.yml', 'webconfig2.yml', 'expectedWebconfigs.txt', 'stylish'],
    ['yaml', 'compare with empty', 'webconfig1.yml', 'empty.yml', 'expectedMinusWebconfig1.txt', 'stylish'],
    ['yaml', 'compare with itself', 'webconfig1.yml', 'webconfig1.yml', 'expectedItselfWebconfig1.txt', 'stylish'],
    ['yaml', 'nested files', 'nestedConfig1.yml', 'nestedConfig2.yml', 'expectedNestedConfigDiff.txt', 'stylish'],
    ['yaml', 'nested files with plain format', 'nestedConfig1.yml', 'nestedConfig2.yml', 'expectedNestedConfigDiffPlain.txt', 'plain'],
    ['yaml', 'nested files with json format', 'nestedConfig1.yml', 'nestedConfig2.yml', 'expectedNestedConfigDiffJson.json', 'json'],
  ])("format: '%s', case: '%s'", (inputFormat, desc, fp1, fp2, fexp, outputFormat) => {
    const filepath1 = getFixturePath(inputFormat, fp1);
    const filepath2 = getFixturePath(inputFormat, fp2);
    const expectedResult = fs.readFileSync(getFixturePath(inputFormat, fexp), 'utf-8');
    const result = genDiff(filepath1, filepath2, outputFormat);
    expect(result).toEqual(expectedResult);
  });
});
