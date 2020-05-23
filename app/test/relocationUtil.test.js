import Model from '../src/scripts/model';
import Bounds from '../src/scripts/data/bounds';
import RelocationInfo from '../src/scripts/data/relocationInfo';
import RelocationUtil from '../src/scripts/relocationUtil';
import Community from '../src/scripts/community';
import Stats from '../src/scripts/data/stats';
import Coordinate from '../src/scripts/data/coordinate';
import AgentChart from '../src/scripts/agentChart';
import Person from '../src/scripts/person';

jest.mock('../src/scripts/agentChart.js');

describe('RelocationUtil tests', () => {
  const stats = new Stats(1, 1, 1, 1, 1);
  const bounds = new Bounds(0, 100, 0, 100);
  let community;
  let model0;
  let model1;
  let relocationUtil;

  beforeEach(() => {
    community = new Community(
      1,
      new AgentChart(null),
      100,
      100,
      stats,
      () => {}
    );
    model0 = new Model(0, bounds, stats, () => {});
    model1 = new Model(1, bounds, stats, () => {});
    relocationUtil = new RelocationUtil(community);

    community.communities[model0.id] = model0;
    community.communities[model0.id].populateCanvas();
    community.communities[model1.id] = model1;
    community.communities[model1.id].populateCanvas();
  });

  test('Handle all relocations should terminate when person arrives and add that person to the new model ', () => {
    const destId = 1;

    const person = model0.population[0];
    person.x = 20;
    person.y = 20;
    person.relocating = true;

    const lengthOfModel0 = model0.population.length;
    const lengthOfModel1 = model0.population.length;
    relocationUtil.relocations.push(
      new RelocationInfo(person, new Coordinate(50, 50), destId)
    );

    while (person.relocating) {
      relocationUtil.handleAllRelocations();
    }
    expect(person.relocating).toBe(false) &&
      expect(person.modelId).toBe(destId) &&
      expect(model0.population.length).toBe(lengthOfModel0 - 1) &&
      expect(model1.population.length).toBe(lengthOfModel1 + 1);
  });

  test('_removeRelocationInfo should throw error if length of relocations doesnt change', () => {
    const relocationInfo = new RelocationInfo(model0.population[0], null, 1);
    expect(() => relocationUtil._removeRelocationInfo(relocationInfo)).toThrow(
      Error
    );
  });

  test('_removeRelocationInfo should remove relocation if it exists', () => {
    const relocationInfo = new RelocationInfo(model0.population[0], null, 1);
    relocationUtil.relocations.push(relocationInfo);
    const lengthBefore = relocationUtil.relocations.length;
    relocationUtil._removeRelocationInfo(relocationInfo);
    expect(relocationUtil.relocations.length).toBe(lengthBefore - 1);
  });

  test('getStats should return all the stats', () => {
    Object.values(community.communities).forEach((model) => {
      model.population.forEach((person) =>
        relocationUtil.relocations.push(new RelocationInfo(person, null, 1))
      );
    });

    expect(relocationUtil.getStats()).toEqual(
      new Stats(
        stats.susceptible * 2,
        stats.noninfectious * 2,
        stats.infectious * 2,
        stats.immune * 2,
        stats.dead * 2
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
