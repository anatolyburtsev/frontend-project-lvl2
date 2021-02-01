import { stylish } from './stylish.js';
import { plain } from './plain.js';

const formatters = {
  stylish,
  plain,
};

export const getFormatter = (type) => ({
  format: formatters[type] ?? stylish,
});
