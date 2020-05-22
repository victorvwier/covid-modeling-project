import Person from '../src/scripts/person';
import { TYPES, COLORS } from '../src/scripts/CONSTANTS';

describe('Testing person initialization', () => {
  const X = 1;
  const Y = 2;

  test('Expect susceptible person to have the susceptible color', () => {
    const susPerson = new Person(TYPES.SUSCEPTIBLE, X, Y, null);
    expect(susPerson.color).toBe(COLORS.SUSCEPTIBLE);
  });

  test('Expect symptomatic person to have the symptomatic color', () => {
    const symPerson = new Person(TYPES.SYMPTOMATIC, X, Y, null);
    expect(symPerson.color).toBe(COLORS.SYMPTOMATIC);
  });

  test('Expect asymptomatic person to have the asymptomatic color', () => {
    const asymPerson = new Person(TYPES.ASYMPTOMATIC, X, Y, null);
    expect(asymPerson.color).toBe(COLORS.ASYMPTOMATIC);
  });
});

describe('Test move method', () => {
  test('Should not move dead', () => {
    const x = 1;
    const y = 1;
    const person = new Person(TYPES.DEAD, 1, 2, null);
    person.move(0, 12, 0, 12);
    // assert nothing moved
    expect(person.x).toBe(x) && expect(person.y).toBe(y);
  });

  test('test _handleXOutOfBounds close to left', () => {
    const width = 100;
    const x = 1;
    const y = 1;
    const person = new Person(TYPES.SUSCEPTIBLE, x, y, null);
    // Expected
    const resX = 2 * person.radius;
    const speedXRes = person.speedX * -1;

    person._handleXOutOfBounds(width);
    expect(person.x).toBe(resX) && expect(person.speedX).toBe(speedXRes);
  });

  test('test _handleXOutOfBounds close to right', () => {
    const width = 100;
    const x = width - 1;
    const y = 1;
    const person = new Person(TYPES.SUSCEPTIBLE, x, y, null);
    // Expected
    const resX = width - 2 * person.radius;
    const speedXRes = person.speedX * -1;

    person._handleXOutOfBounds(width);
    expect(person.x).toBe(resX) && expect(person.speedX).toBe(speedXRes);
  });

  test('test _handleXOutOfBounds middle nothing happens', () => {
    const width = 100;
    const x = width / 2;
    const y = 1;
    const person = new Person(TYPES.SUSCEPTIBLE, x, y, null);
    // Expected
    const resX = person.x;
    const speedXRes = person.speedX;

    person._handleXOutOfBounds(width);
    expect(person.x).toBe(resX) && expect(person.speedX).toBe(speedXRes);
  });

  test('test _handleYOutOfBounds from top', () => {
    const height = 100;
    const x = 1;
    const y = 1;
    const person = new Person(TYPES.SUSCEPTIBLE, x, y, null);
    // Expected
    const resY = 2 * person.radius;
    const speedYRes = person.speedY * -1;

    person._handleYOutOfBounds(height);
    expect(person.y).toBe(resY) && expect(person.speedY).toBe(speedYRes);
  });

  test('test _handleYOutOfBounds from bottom', () => {
    const height = 100;
    const x = 1;
    const y = height - 1;
    const person = new Person(TYPES.SUSCEPTIBLE, x, y, null);
    // Expected
    const resY = height - 2 * person.radius;
    const speedYRes = person.speedY * -1;

    person._handleYOutOfBounds(height);
    expect(person.y).toBe(resY) && expect(person.speedY).toBe(speedYRes);
  });

  test('test _handleYOutOfBounds from bottom', () => {
    const height = 100;
    const x = 1;
    const y = height / 2;
    const person = new Person(TYPES.SUSCEPTIBLE, x, y, null);
    // Expected
    const resY = person.y;
    const speedYRes = person.speedY;

    person._handleYOutOfBounds(height);
    expect(person.y).toBe(resY) && expect(person.speedY).toBe(speedYRes);
  });

  test('should change speed if exceed max', () => {
    const person = new Person(TYPES.SUSCEPTIBLE, 1, 1, null);
    person.speedX = person.maxSpeed * 2;
    person.speedY = person.maxSpeed * 2;

    const expectSpeedX = Math.sign(person.speedX) * person.maxSpeed;
    const expectSpeedY = Math.sign(person.speedY) * person.maxSpeed;

    person._checkIfExceededMaxSpeed();

    expect(person.speedX).toBe(expectSpeedX) &&
      expect(person.speedY).toBe(expectSpeedY);
  });

  test('should stay same speed if not exceeded max', () => {
    const person = new Person(TYPES.SUSCEPTIBLE, 1, 1, null);
    person.speedX = person.maxSpeed / 2;
    person.speedY = person.maxSpeed / 2;

    const expectSpeedX = person.speedX;
    const expectSpeedY = person.speedY;

    person._checkIfExceededMaxSpeed();

    expect(person.speedX).toBe(expectSpeedX) &&
      expect(person.speedY).toBe(expectSpeedY);
  });

  test('test can infect person is not infectable nothing happens', () => {
    const person = new Person(TYPES.DEAD, 1, 1, null);
    const { type } = person;
    person.canInfect(null);
    expect(person.type).toBe(type);
  });

  test('test can infect person is not infectable and not infectious nothing happens', () => {
    const person = new Person(TYPES.DEAD, 1, 1, null);
    expect(person.canInfect(null)).toBe(false);
  });

  test('test can infect person is not infectable nothing happens', () => {
    const infectiousPerson = new Person(TYPES.SYMPTOMATIC, 1, 1, null);
    const infectablePerson = new Person(TYPES.DEAD, 1, 1, null);
    expect(infectiousPerson.canInfect(infectablePerson)).toBe(false);
  });

  test("test repel for two people with the exact same coordinates doesn't fail", () => {
    const person1 = new Person(TYPES.SUSCEPTIBLE, 0, 0, null);
    const person2 = new Person(TYPES.SUSCEPTIBLE, 0, 0, null);
    person1.repel(person2);
    expect(Number.isNaN(person1.accX)).toBe(false);
  });
});
