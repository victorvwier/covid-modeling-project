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

export function resetGlobalRandom(realMath) {
  global.Math = realMath;
}

export function mockRandom(val, clearRandom = false) {
  const realMath = global.Math;
  const mockMath = Object.create(global.Math);
  mockMath.random = () => {
    const toReturn = val;

    // If we only use the mocked random once we need to clear it!
    if (clearRandom) {
      resetGlobalRandom(realMath);
    }
    return toReturn;
  };
  global.Math = mockMath;
}
