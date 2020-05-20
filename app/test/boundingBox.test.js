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

    test('Column getIndex 1', () => {
        const struct = new BoundingBoxStructure(0, 10, 0, 10, 2);
        const column = struct.columns[0];
        const person = new Person(TYPES.SUSCEPTIBLE, 0, -1);
        expect(() => {
            column.getIndex(person);
        }).toThrow();
    });

    test('Column getIndex 2', () => {
        const struct = new BoundingBoxStructure(0, 10, 0, 10, 2);
        const column = struct.columns[0];
        const person = new Person(TYPES.SUSCEPTIBLE, 0, 11);
        expect(() => {
            column.getIndex(person);
        }).toThrow();
    });

    test('Column getIndex 3', () => {
        const struct = new BoundingBoxStructure(0, 10, 0, 10, 2);
        const column = struct.columns[0];
        const person = new Person(TYPES.SUSCEPTIBLE, 0, 5);
        expect(column.getIndex(person)).toStrictEqual(2);
    });

    test('Column insert', () => {
        const struct = new BoundingBoxStructure(0, 10, 0, 10, 2);
        const column = struct.columns[0];
        const person = new Person(TYPES.SUSCEPTIBLE, 0, 5);
        column.insert(person);
        expect(column.boxes[0].people).toStrictEqual([]);
        expect(column.boxes[1].people).toStrictEqual([]);
        expect(column.boxes[2].people).toStrictEqual([person]);
        expect(column.boxes[3].people).toStrictEqual([]);
        expect(column.boxes[4].people).toStrictEqual([]);
    });

    test('Column remove', () => {
        const struct = new BoundingBoxStructure(0, 10, 0, 10, 2);
        const column = struct.columns[0];
        const person1 = new Person(TYPES.SUSCEPTIBLE, 0, 1);
        const person2 = new Person(TYPES.SUSCEPTIBLE, 0, 3);
        const person3 = new Person(TYPES.SUSCEPTIBLE, 0, 5);
        const person4 = new Person(TYPES.SUSCEPTIBLE, 0, 7);
        const person5 = new Person(TYPES.SUSCEPTIBLE, 0, 9);
        column.insert(person1);
        column.insert(person2);
        column.insert(person3);
        column.insert(person4);
        column.insert(person5);
        column.remove(person3);
        expect(column.boxes[0].people).toStrictEqual([person1]);
        expect(column.boxes[1].people).toStrictEqual([person2]);
        expect(column.boxes[2].people).toStrictEqual([]);
        expect(column.boxes[3].people).toStrictEqual([person4]);
        expect(column.boxes[4].people).toStrictEqual([person5]);
    });

    test('Column query 1', () => {
        const struct = new BoundingBoxStructure(0, 10, 0, 10, 2);
        const column = struct.columns[0];
        const person1 = new Person(TYPES.SUSCEPTIBLE, 0, 1);
        const person2 = new Person(TYPES.SUSCEPTIBLE, 0, 3);
        const person3 = new Person(TYPES.SUSCEPTIBLE, 0, 5);
        const person4 = new Person(TYPES.SUSCEPTIBLE, 0, 7);
        const person5 = new Person(TYPES.SUSCEPTIBLE, 0, 9);
        column.insert(person1);
        column.insert(person2);
        column.insert(person3);
        column.insert(person4);
        column.insert(person5);
        expect(column.query(person1)).toStrictEqual([person2]);
    });

    test('Column query 2', () => {
        const struct = new BoundingBoxStructure(0, 10, 0, 10, 2);
        const column = struct.columns[0];
        const person1 = new Person(TYPES.SUSCEPTIBLE, 0, 1);
        const person2 = new Person(TYPES.SUSCEPTIBLE, 0, 3);
        const person3 = new Person(TYPES.SUSCEPTIBLE, 0, 5);
        const person4 = new Person(TYPES.SUSCEPTIBLE, 0, 7);
        const person5 = new Person(TYPES.SUSCEPTIBLE, 0, 9);
        column.insert(person1);
        column.insert(person2);
        column.insert(person3);
        column.insert(person4);
        column.insert(person5);
        expect(column.query(person3)).toStrictEqual([person2, person4]);
    });

    test('Column query 3', () => {
        const struct = new BoundingBoxStructure(0, 10, 0, 10, 2);
        const column = struct.columns[0];
        const person1 = new Person(TYPES.SUSCEPTIBLE, 0, 1);
        const person2 = new Person(TYPES.SUSCEPTIBLE, 0, 3);
        const person3 = new Person(TYPES.SUSCEPTIBLE, 0, 5);
        const person4 = new Person(TYPES.SUSCEPTIBLE, 0, 7);
        const person5 = new Person(TYPES.SUSCEPTIBLE, 0, 9);
        column.insert(person1);
        column.insert(person2);
        column.insert(person3);
        column.insert(person4);
        column.insert(person5);
        expect(column.query(person5)).toStrictEqual([person4]);
    });
});