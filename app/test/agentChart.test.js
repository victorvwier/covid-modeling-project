import createContext from "gl";
import * as agentChart from "../src/scripts/agentChart";

describe('agentChart Test suite', () => {
  test('load shader successful', () => {
      const gl = createContext(64, 64);
      const shader = agentChart.loadShader(gl, gl.VERTEX_SHADER, agentChart.vSource);
      expect(shader).not.toBe(null);
    });

  test('load shader unsuccessful', () => {
      const vSource = 'Random garbage'
      const gl = createContext(64, 64);
      const shader = agentChart.loadShader(gl, gl.VERTEX_SHADER, vSource);
      expect(shader).toBe(null);
    });

  test('load shader program successful', () => {
      const gl = createContext(64, 64);
      const shaderProgram = agentChart.initShaderProgram(gl, agentChart.vSource, agentChart.fSource);
      expect(shaderProgram).not.toBe(null);
    });

  test('load shader program unsuccessful', () => {
      const vSource = 'Random garbage';
      const gl = createContext(64, 64);
      const shaderProgram = agentChart.initShaderProgram(gl, vSource, vSource);
      expect(shaderProgram).toBe(null);
    });
  });
  