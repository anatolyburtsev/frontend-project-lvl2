const constructAnswer = (changes) => {
  const str = ['{'];
  changes.forEach((line) => {
    const [sign, key, value] = line;
    str.push(`  ${sign} ${key}: ${value}`);
  });
  str.push('}\n');
  return str.join('\n');
};

const genDiff = (obj1, obj2) => {
  const keys = [...new Set(Object.keys(obj1).concat(Object.keys(obj2)))];
  keys.sort();

  const changes = [];
  keys.forEach((key) => {
    const value1 = obj1[key];
    const value2 = obj2[key];
    if (value1 === value2) {
      changes.push([' ', key, value1]);
      return;
    }
    if (value1 === undefined) {
      changes.push(['+', key, value2]);
      return;
    }
    if (value2 === undefined) {
      changes.push(['-', key, value1]);
      return;
    }
    changes.push(['-', key, value1]);
    changes.push(['+', key, value2]);
  });

  return constructAnswer(changes);
};

export default genDiff;
