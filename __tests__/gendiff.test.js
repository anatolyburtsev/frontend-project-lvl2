import fs from 'fs';
import { expect, test, describe } from '@jest/globals';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import buildDiff from '../src/gendiff';

export const __filename = fileURLToPath(import.meta.url);
export const __dirname = dirname(__filename);

const getFixturePath = (format, filename) => path.join(__dirname, '..', '__fixtures__', format, filename);

describe('parametrized', () => {
  test.each([
    ['json', 'nested json files', 'nestedConfig1.json', 'nestedConfig2.json', 'expectedNestedConfigDiff.txt', 'stylish'],
    ['yaml', 'nested yaml files', 'nestedConfig1.yml', 'nestedConfig2.yml', 'expectedNestedConfigDiffStylish.txt', 'stylish'],
    ['yaml', 'nested files, plain output format', 'nestedConfig1.yml', 'nestedConfig2.yml', 'expectedNestedConfigDiffPlain.txt', 'plain'],
    ['yaml', 'nested files, json output format', 'nestedConfig1.yml', 'nestedConfig2.yml', 'expectedNestedConfigDiffJson.json', 'json'],
  ])("format: '%s', case: '%s'", (inputFormat, desc, fp1, fp2, expFp, outputFormat) => {
    const filepath1 = getFixturePath(inputFormat, fp1);
    const filepath2 = getFixturePath(inputFormat, fp2);
    const expectedFilepath = getFixturePath(inputFormat, expFp);
    const expectedResult = fs.readFileSync(expectedFilepath, 'utf-8');
    const result = buildDiff(filepath1, filepath2, outputFormat);
    expect(expectedResult).toEqual(result);
  });
});
