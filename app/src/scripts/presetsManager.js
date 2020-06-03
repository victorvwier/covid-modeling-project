/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
import { PRESET_TYPES } from './CONSTANTS';

class PresetsManager {
  constructor(initialPreset = 'RIVM') {
    this.selectedPreset = initialPreset;
    this.presets = {};
    Object.values(PRESET_TYPES).forEach((presetType) => {
      this.presets[presetType] = require(`./presetsData/${presetType}.json`);
    });

    // Debug
    window.presetsManager = this;
  }

  changePreset(newPresetType) {
    if (!Object.keys(PRESET_TYPES).includes(newPresetType)) {
      throw Error('Trying to choose a preset that is not known!');
    }
    this.selectedPreset = newPresetType;
  }

  loadPreset() {
    return this.presets[PRESET_TYPES[this.selectedPreset]];
  }
}

// Export an instance of it so that whenever imported the same instance is used hence state is preserved
export default new PresetsManager();
