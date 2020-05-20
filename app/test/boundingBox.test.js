import BoundingBoxStructure from "../src/scripts/boundingBox";
import Person from "../src/scripts/person";
import { TYPES } from "../src/scripts/CONSTANTS";

describe('Bounding box test suite', () => {
    test('Bounding box insert', () => {
        const struct = new BoundingBoxStructure(0, 10, 0, 10, 10);
        const box = struct.columns[0].boxes[0];
        const person = new Person(TYPES.SUSCEPTIBLE, 5, 5);
        box.insert(person);
        expect(box.people).toStrictEqual([person]);
    });

    test('Bounding box remove', () => {
        const struct = new BoundingBoxStructure(0, 10, 0, 10, 10);
        const box = struct.columns[0].boxes[0];
        const person1 = new Person(TYPES.SUSCEPTIBLE, 5, 5);
        const person2 = new Person(TYPES.SUSCEPTIBLE, 4, 4);
        box.insert(person1);
        box.insert(person2);
        box.remove(person1);
        expect(box.people).toStrictEqual([person2]);
    });

    test('Bounding box query', () => {
        const struct = new BoundingBoxStructure(0, 20, 0, 20, 20);
        const box = struct.columns[0].boxes[0];
        const person1 = new Person(TYPES.SUSCEPTIBLE, 1, 1);
        const person2 = new Person(TYPES.SUSCEPTIBLE, 4, 4,);
        const person3 = new Person(TYPES.SUSCEPTIBLE, 19, 19);
        box.insert(person1);
        box.insert(person2);
        box.insert(person3);
        expect(box.query(person1)).toStrictEqual([person2]);
    });
});