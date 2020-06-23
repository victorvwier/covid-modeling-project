/*
Licensed to the Apache Software Foundation (ASF) under one
or more contributor license agreements.  See the NOTICE file
distributed with this work for additional information
regarding copyright ownership.  The ASF licenses this file
to you under the Apache License, Version 2.0 (the
"License"); you may not use this file except in compliance
with the License.  You may obtain a copy of the License at

  http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing,
software distributed under the License is distributed on an
"AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, either express or implied.  See the License for the
specific language governing permissions and limitations
under the License.
*/

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
