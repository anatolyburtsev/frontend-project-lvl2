import genDiff from "../src/gendiff";
import fs from "fs";
import path from "path";

const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);

test('different files - positive', () => {
    const obj1 = JSON.parse(fs.readFileSync(getFixturePath("webconfig1.json"), "utf-8"));
    const obj2 = JSON.parse(fs.readFileSync(getFixturePath("webconfig2.json"), "utf-8"));
    const expectedResult = fs.readFileSync(getFixturePath("expectedWebconfigs.txt"), "utf-8");
    const result = genDiff(obj1, obj2);
    expect(result).toEqual(expectedResult);
});

test('compare with empty object - positive', () => {
    const obj1 = JSON.parse(fs.readFileSync(getFixturePath("webconfig1.json"), "utf-8"));
    const obj2 = {};
    const expectedResult = fs.readFileSync(getFixturePath("expectedMinusWebconfig1.txt"), "utf-8");
    const result = genDiff(obj1, obj2);
    expect(result).toEqual(expectedResult);
});

test('compare file with itself - positive', () => {
    const obj1 = JSON.parse(fs.readFileSync(getFixturePath("webconfig1.json"), "utf-8"));
    const obj2 = obj1;
    const expectedResult = fs.readFileSync(getFixturePath("expectedItselfWebconfig1.txt"), "utf-8");
    const result = genDiff(obj1, obj2);
    expect(result).toEqual(expectedResult);
});
