import Model from '../src/scripts/model';
import RelocationUtil from '../src/scripts/relocationUtil';
import AgentChart from '../src/scripts/agentChart';
import Stats from '../src/scripts/data/stats';

jest.mock('../src/scripts/agentChart');

// const borderCtxMock = jest.createMockFromModule('./canvasContextMock.js')
//   .default;

describe('Community test', () => {
  let model;
  let relocationUtil;
  const width = 100;
  const height = 100;
  const agentChart = new AgentChart(null);
  const stats = new Stats(1, 1, 1, 1, 1);

  beforeEach(() => {
<<<<<<< HEAD
    model = new Model(4, agentChart, width, height, stats, () => {});
    relocationUtil = new RelocationUtil(model);
    model.relocationUtil = relocationUtil;
    model.setupCommunity();
    model.populateCommunities();
=======
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
    community = new Model(
      4,
      agentChart,
      width,
      height,
      stats,
      () => {},
      () => {},
      borderCtxMock
    );
    relocationUtil = new RelocationUtil(community);
    community.relocationUtil = relocationUtil;

    community.setupCommunity();
    community.populateCommunities();
>>>>>>> dev
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

  test('getAgentSize should return 1.5 if the population is over 2000', () => {
    expect(community.getAgentSize(2500)).toEqual(1.5);
  });
  test('getAgentSize should return 2.5 if the population is over 1000', () => {
    expect(community.getAgentSize(1500)).toEqual(2.5);
  });
  test('getAgentSize should return 3.5 if the population is over 600', () => {
    expect(community.getAgentSize(700)).toEqual(3.5);
  });
  test('getAgentSize should return 1.5 if the population is over 200', () => {
    expect(community.getAgentSize(100)).toEqual(5);
  });
});
