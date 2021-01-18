import path from 'path';

export const normalizePath = (filepath) => {
  const absoluteFilepath = path.isAbsolute(filepath) ? filepath
    : path.join(process.cwd(), filepath);
  return path.normalize(absoluteFilepath);
};
