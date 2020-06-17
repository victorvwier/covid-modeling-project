/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
import { PRESET_TYPES } from './CONSTANTS';

/** @class PresetsManager describing a manager for the different presets we have. */
class PresetsManager {
  /**
   * Instantiates a PresetsManager.
   * 
   * @constructor
   * @param {String} initialPreset The string identifying which preset is supposed to be the initial one.
   * @default RIVM
   */
  constructor(initialPreset = 'RIVM') {
    this.selectedPreset = initialPreset;
    this.presets = {};
    Object.keys(PRESET_TYPES).forEach((presetType) => {
      this.presets[presetType] = require(`./presetsData/${presetType}.json`);
    });

    // Debug
    window.presetsManager = this;
  }

  /**
   * A function to change the active preset.
   * 
   * @param {String} newPresetType The new preset to be loaded, has to be a valid one as stored in CONSTANTS.js
   */
  changePreset(newPresetType) {
    if (!Object.keys(PRESET_TYPES).includes(newPresetType)) {
      throw Error('Trying to choose a preset that is not known!');
    }
    this.selectedPreset = newPresetType;
  }

  /**
   * A function to load the current preset.
   * 
   * @returns {Object} The current preset.
   */
  loadPreset() {
    return this.presets[this.selectedPreset];
  }
}

// Export an instance of it so that whenever imported the same instance is used hence state is preserved
export default new PresetsManager();
