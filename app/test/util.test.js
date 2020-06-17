import { getRandomIntExceptForValue } from '../src/scripts/util';

describe('util tests', () => {
  test('should ', () => {
    const rand = getRandomIntExceptForValue(0, 2, [1]);
    expect(rand === 0 || rand === 2);
  });
});
