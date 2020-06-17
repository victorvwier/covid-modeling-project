import Stats from '../src/scripts/data/stats';

describe('Stats tests', () => {
  const stats = new Stats(1, 1, 1, 1, 1, 1);
  const statsOther = new Stats(1, 1, 1, 1, 1, 1);
  const statsJoin = new Stats(2, 2, 2, 2, 2, 2);

  test('Test stats sum method', () => {
    const sum = 5;

    expect(stats.sum()).toBe(sum);
  });

  test('Test joinStats method', () => {
    expect(Stats.joinStats(stats, statsOther)).toEqual(statsJoin);
  });
});
