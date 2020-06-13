import presetManager from '../src/scripts/presetsManager';
import { PRESET_TYPES } from '../src/scripts/CONSTANTS';

describe('presetManager tests', () => {
  test('changePreset should throw error if it is an unknown preset', () => {
    expect(() => presetManager.changePreset('WHAT_THE_HELL')).toThrow();
  });

  test('changePreset should select the other preset type if it is one we know', () => {
    const newPreset = Object.keys(PRESET_TYPES)[0];
    presetManager.changePreset(newPreset);
    expect(presetManager.selectedPreset).toBe(newPreset);
  });
});
