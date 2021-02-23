import fs from 'fs';
import path from 'path';
import parse from './parsers.js';
import format from './formatters/index.js';
import buildAstTree from './ast-tree.js';

const normalizePath = (filepath) => {
  const absoluteFilepath = path.isAbsolute(filepath) ? filepath
    : path.join(process.cwd(), filepath);
  return path.normalize(absoluteFilepath);
};

const getFileExtension = (filepath) => path.extname(filepath).replace('.', '');

const buildDiff = (filepath1, filepath2, outputFormat) => {
  const objectsToCompare = [filepath1, filepath2]
    .map(normalizePath)
    .map((filepath) => {
      const content = fs.readFileSync(filepath, 'utf-8');
      const fileExtension = getFileExtension(filepath);
      return parse(fileExtension, content);
    });
  const astTree = buildAstTree(...objectsToCompare);
  return format(outputFormat, astTree);
};

export default buildDiff;
