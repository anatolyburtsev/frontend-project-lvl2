import fs from 'fs';
import { getFileExtension, normalizePath } from './utils.js';
import getParser from './parsers.js';
import getFormatter from './formatters/index.js';
import buildAstTree from './ast-tree.js';

const buildDiff = (filepath1, filepath2, format) => {
  const objects = [filepath1, filepath2]
    .map(normalizePath)
    .map((filepath) => {
      const content = fs.readFileSync(filepath, 'utf-8');
      const fileExtension = getFileExtension(filepath);
      const parser = getParser(fileExtension);
      return parser.parse(content);
    });
  const astTree = buildAstTree(...objects);
  const formatter = getFormatter(format);
  return formatter.format(astTree);
};

export default buildDiff;
