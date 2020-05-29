import Model from '../src/scripts/model';
import RelocationUtil from '../src/scripts/relocationUtil';
import AgentChart from '../src/scripts/agentChart';
import Stats from '../src/scripts/data/stats';

// jest.mock('../src/scripts/model')
// jest.mock('../src/scripts/relocationUtil');
jest.mock('../src/scripts/agentChart');

describe('Community test', () => {
  let model;
  let relocationUtil;
  const width = 100;
  const height = 100;
  const agentChart = new AgentChart(null);
  const stats = new Stats(1, 1, 1, 1, 1);

  beforeEach(() => {
    model = new Model(4, agentChart, width, height, stats, () => {});
    relocationUtil = new RelocationUtil(model);
    model.relocationUtil = relocationUtil;
    model.setupCommunity();
    model.populateCommunities();
  });

  test('_animationFunction should make new dt if both timestamp and lasttimestamp exist', () => {
    const oldLastTimeStamp = 1000;
    const thisTimeStamp = 2000;
    model.lastTimestamp = oldLastTimeStamp;
    model._animationFunction(thisTimeStamp);
    expect(model.lastTimestamp).toBe(thisTimeStamp);
  });

  test('_animationFunction should not make new dt if either timestamp and lasttimestamp do not exist', () => {
    const thisTimeStamp = 2;
    model.lastTimestamp = null;
    model._animationFunction(thisTimeStamp);
    expect(model.lastTimestamp).toBe(thisTimeStamp);
  });
});
