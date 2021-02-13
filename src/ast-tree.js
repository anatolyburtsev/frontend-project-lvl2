import _ from 'lodash';
import {
  NODE_ADDED, NODE_CHANGED, NODE_NESTED, NODE_NOT_CHANGED, NODE_REMOVED, NODE_ROOT,
} from './constants.js';

const buildAstTree = (obj1 = {}, obj2 = {}) => {
  const unsortedKeys = _.union(_.keys(obj1), _.keys(obj2));
  const keys = _.sortBy(unsortedKeys);

  const children = keys.map((key) => {
    const value1 = obj1[key];
    const value2 = obj2[key];
    if (!_.has(obj1, key)) {
      return { key, value: value2, type: NODE_ADDED };
    }
    if (!_.has(obj2, key)) {
      return { key, value: value1, type: NODE_REMOVED };
    }
    if (!_.isEqual(value1, value2)) {
      if (_.isPlainObject(value1) && _.isPlainObject(value2)) {
        return { key, type: NODE_NESTED, value: buildAstTree(value1, value2) };
      }
      return {
        key, oldValue: value1, newValue: value2, type: NODE_CHANGED,
      };
    }
    return { key, value: value1, type: NODE_NOT_CHANGED };
  });
  return {
    type: NODE_ROOT,
    children,
  };
};

const buildAstTreeMain = (obj1, obj2) => buildAstTree(obj1, obj2);

export default buildAstTreeMain;
