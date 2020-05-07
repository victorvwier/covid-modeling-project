import createContext from "gl";
import * as agentChart from "../src/scripts/agentChart";
var gl = require('gl')(64, 64, { preserveDrawingBuffer: true })

describe('agentChart Test suite', () => {
  test('load shader successful', () => {
      const shader = agentChart.loadShader(gl, gl.VERTEX_SHADER, agentChart.vSource);
      expect(shader).not.toBe(null);
    });

  test('load shader unsuccessful', () => {
      const vSource = 'Random garbage'
      const shader = agentChart.loadShader(gl, gl.VERTEX_SHADER, vSource);
      expect(shader).toBe(null);
    });

  test('load shader program successful', () => {
      const shaderProgram = agentChart.initShaderProgram(gl, agentChart.vSource, agentChart.fSource);
      expect(shaderProgram).not.toBe(null);
    });

  test('load shader program unsuccessful', () => {
      const vSource = 'Random garbage';
      const shaderProgram = agentChart.initShaderProgram(gl, vSource, vSource);
      expect(shaderProgram).toBe(null);
    });
  });
  