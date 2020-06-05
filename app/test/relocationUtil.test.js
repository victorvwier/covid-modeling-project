import RelocationInfo from '../src/scripts/data/relocationInfo';
import RelocationUtil from '../src/scripts/relocationUtil';
import Model from '../src/scripts/model';
import Stats from '../src/scripts/data/stats';
import AgentChart from '../src/scripts/agentChart';
import Person from '../src/scripts/person';

jest.mock('../src/scripts/agentChart.js');
jest.mock('../src/scripts/DOM/domValues.js');

describe('RelocationUtil tests', () => {
  const stats = new Stats(1, 1, 1, 1, 1);
  let model;
  const width = 100;
  const height = 100;
  let community0;
  let community1;
  let relocationUtil;

  beforeEach(() => {
    const borderCtxMock = {
      clearRect: jest.fn(() => {}),
      strokeRect: jest.fn(() => {}),
      canvas: {
        getBoundingClientRect: jest.fn(() => ({
          width,
          height,
        })),
      },
    };
    model = new Model(
      2,
      new AgentChart(null),
      width,
      height,
      stats,
      () => {},
      () => {},
      borderCtxMock
    );
    model.presetInProcess = false;
    model.setupCommunity();

    model.populateCommunities();
    community0 = model.communities[0];
    community1 = model.communities[1];
    relocationUtil = new RelocationUtil(model);
  });

  test('Handle all relocations should terminate when person arrives and add that person to the new model ', () => {
    const destId = 1;

    const person = community0.population[0];
    const destCoords = community1.getRandomPoint();
    community0.handlePersonLeaving(person);

    person.relocating = true;
    person.x = destCoords.x;
    person.y = destCoords.y;

    const lengthOfCommunity0 = community0.population.length;
    const lengthOfCommunity1 = community0.population.length;
    relocationUtil.relocations.push(
      new RelocationInfo(person, destCoords, destId)
    );

    while (person.relocating) {
      relocationUtil.handleAllRelocations();
    }

    expect(person.relocating).toBe(false) &&
      expect(person.communityId).toBe(destId) &&
      expect(community0.population.length).toBe(lengthOfCommunity0 - 1) &&
      expect(community1.population.length).toBe(lengthOfCommunity1 + 1);
  });

  test('_removeRelocationInfo should throw error if length of relocations doesnt change', () => {
    const relocationInfo = new RelocationInfo(
      community0.population[0],
      null,
      1
    );
    expect(() => relocationUtil._removeRelocationInfo(relocationInfo)).toThrow(
      Error
    );
  });

  test('_removeRelocationInfo should remove relocation if it exists', () => {
    const relocationInfo = new RelocationInfo(
      community0.population[0],
      null,
      1
    );
    relocationUtil.relocations.push(relocationInfo);
    const lengthBefore = relocationUtil.relocations.length;
    relocationUtil._removeRelocationInfo(relocationInfo);
    expect(relocationUtil.relocations.length).toBe(lengthBefore - 1);
  });

  test('getStats should return all the stats', () => {
    Object.values(model.communities).forEach((community) => {
      community.population.forEach((person) =>
        relocationUtil.relocations.push(new RelocationInfo(person, null, 1))
      );
    });

    expect(relocationUtil.getStats()).toEqual(
      new Stats(
        stats.susceptible,
        stats.noninfectious,
        stats.infectious,
        stats.immune,
        stats.dead
      )
    );
  });

  test('getStats should throw an error when type of person inside relocations is unknown', () => {
    relocationUtil.relocations.push(
      new RelocationInfo(new Person('bla', 1, 1, 1), null, 1)
    );
    expect(() => relocationUtil.getStats()).toThrow(Error);
  });
});
