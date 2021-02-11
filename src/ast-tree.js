import _ from 'lodash';
import {
  NODE_ADDED, NODE_CHANGED, NODE_NESTED, NODE_NOT_CHANGED, NODE_REMOVED, NODE_ROOT,
} from './constants.js';

const buildAstTree = (obj1 = {}, obj2 = {}) => {
  const unsortedKeys = _.union(_.keys(obj1), _.keys(obj2));
  const keys = _.sortBy(unsortedKeys);

  const children = keys.flatMap((key) => {
    const value1 = obj1[key];
    const value2 = obj2[key];
    if (!_.has(obj1, key)) {
      return { key, value: obj2[key], type: NODE_ADDED };
    }
    if (!_.has(obj2, key)) {
      return { key, value: obj1[key], type: NODE_REMOVED };
    }
    if (!_.isEqual(value1, value2)) {
      if (_.isPlainObject(obj1[key]) && _.isPlainObject(obj2[key])) {
        // return { key, type: NODE_NESTED, value: buildAstTree(value1, value2) };
        return { key, type: NODE_NESTED, value: buildAstTree(value1, value2) };
      }
      return {
        key, oldValue: obj1[key], newValue: obj2[key], type: NODE_CHANGED,
      };
    }
    return { key, value: obj1[key], type: NODE_NOT_CHANGED };
  });
  return {
    type: NODE_ROOT,
    children,
  };
};

const buildAstTreeMain = (obj1, obj2) => buildAstTree(obj1, obj2);

export default buildAstTreeMain;
