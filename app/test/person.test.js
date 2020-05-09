import Person from "../src/scripts/person";
import { TYPES } from "../src/scripts/CONSTANTS";

describe('person test suite', () => {
    test('test apply force', () => {
        const person = new Person(TYPES.SUSCEPTIBLE, 10, 10, null);
        person.applyForce(1, 1);
        expect(person.accX).toBe(1);
        expect(person.accY).toBe(1);
    });

    test('test metWith', () => {
        const person1 = new Person(TYPES.SUSCEPTIBLE, 0, 0, null);
        const person2 = new Person(TYPES.SUSCEPTIBLE, 3, 4, null);
        expect(person1.metWith(person2, 3)).toBe(true);
    });
});