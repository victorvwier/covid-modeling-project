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
