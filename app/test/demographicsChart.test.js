import Model from '../src/scripts/model';
import RelocationUtil from '../src/scripts/relocationUtil';
import DemographicsChart from '../src/scripts/demographicsChart';
import Stats from '../src/scripts/data/stats';
import AgentChart from '../src/scripts/agentChart';

jest.mock('../src/scripts/agentChart');

describe('demographicsChart test', () => {
  let model;
  const width = 100;
  const height = 100;
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

  const chartMock = {
    update: jest.fn(() => {}),
    data: {
      datasets: [
        { data: [] },
        { data: [] },
        { data: [] },
        { data: [] },
        { data: [] },
        { data: [] },
        { data: [] },
        { data: [] },
        { data: [] },
        { data: [] },
        { data: [] },
      ],
    },
  };

  let demographicsChart;

  beforeEach(() => {
    model = new Model(
      4,
      new AgentChart(null),
      width,
      height,
      new Stats(1, 1, 1, 1, 1),
      () => {},
      () => {},
      borderCtxMock
    );
    model.presetInProcess = true;
    const relocationUtil = new RelocationUtil(model);
    model.relocationUtil = relocationUtil;

    model.setupCommunity();
    model.populateCommunities();
    demographicsChart = new DemographicsChart();
    demographicsChart.demographicChart = chartMock;
  });

  test('receiveUpdate should do stuff', () => {
    const filledDatasetsBefore = chartMock.data.datasets.filter(
      (dataset) => dataset.length > 0
    ).length;

    const population = model.getAllPopulation();
    demographicsChart.receiveUpdate(population);

    const filledDatasetsAfter = chartMock.data.datasets.filter(
      (dataset) => dataset.length > 0
    ).length;
    expect(filledDatasetsBefore).toBe(0) &&
      expect(filledDatasetsAfter).toBeGreaterThan(0);
  });
});
