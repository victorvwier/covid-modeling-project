import App from '../src/scripts/bla';

describe('testing bla.js', () => {
  test('should return num when getNum is called', () => {
    const num = 6;
    const app = new App(num);
    expect(app.getNum()).toBe(num)
  });
});