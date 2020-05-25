import { mortalityStat } from '../src/scripts/util';

describe('MortalityStat tests', () => {
  // TODO move these tests to a util file
  test('Mortality rate for younger than 10 should be 0', () => {
    expect(mortalityStat(8)).toBe(0);
  });

  test('Mortality rate for younger than 20 should be 0.002', () => {
    expect(mortalityStat(18)).toBe(0.002);
  });

  test('Mortality rate for younger than 30 should be 0.002', () => {
    expect(mortalityStat(28)).toBe(0.002);
  });

  test('Mortality rate for younger than 40 should be 0.002', () => {
    expect(mortalityStat(38)).toBe(0.002);
  });

  test('Mortality rate for younger than 50 should be 0.004', () => {
    expect(mortalityStat(48)).toBe(0.004);
  });

  test('Mortality rate for younger than 60 should be 0.013', () => {
    expect(mortalityStat(58)).toBe(0.013);
  });

  test('Mortality rate for younger than 70 should be 0.036', () => {
    expect(mortalityStat(68)).toBe(0.036);
  });

  test('Mortality rate for younger than 80 should be 0.08', () => {
    expect(mortalityStat(78)).toBe(0.08);
  });

  test('Mortality rate for older than 80 should be 0.148', () => {
    expect(mortalityStat(88)).toBe(0.148);
  });
});
