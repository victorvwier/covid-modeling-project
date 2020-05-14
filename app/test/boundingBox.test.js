import BoundingBoxStructure from "../src/scripts/boundingBox";
import Person from "../src/scripts/person";
import {TYPES} from "../src/scripts/CONSTANTS";

describe('bounding box test suite', () => {
    test('initialize to empty structure', () => {
        const struct = new BoundingBoxStructure(20, 20, 5);
        expect(struct.columns[0].boxes[0].people).toStrictEqual([]);
        expect(struct.columns[0].boxes[1].people).toStrictEqual([]);
        expect(struct.columns[1].boxes[1].people).toStrictEqual([]);
        expect(struct.columns[1].boxes[0].people).toStrictEqual([]);
    });

    test('insert person 1', () => {
        const struct = new BoundingBoxStructure(20, 20, 5);
        const person = new Person(TYPES.SUSCEPTIBLE, 5, 5, null);
        struct.insert(person);
        expect(struct.columns[0].boxes[0].people).toStrictEqual([person]);
        expect(struct.columns[0].boxes[1].people).toStrictEqual([]);
        expect(struct.columns[1].boxes[1].people).toStrictEqual([]);
        expect(struct.columns[1].boxes[0].people).toStrictEqual([]);
    });
    
    test('insert person 2', () => {
        const struct = new BoundingBoxStructure(20, 20, 5);
        const person = new Person(TYPES.SUSCEPTIBLE, 5, 15, null);
        struct.insert(person);
        expect(struct.columns[0].boxes[0].people).toStrictEqual([]);
        expect(struct.columns[0].boxes[1].people).toStrictEqual([person]);
        expect(struct.columns[1].boxes[1].people).toStrictEqual([]);
        expect(struct.columns[1].boxes[0].people).toStrictEqual([]);
    });

    test('insert person 3', () => {
        const struct = new BoundingBoxStructure(20, 20, 5);
        const person = new Person(TYPES.SUSCEPTIBLE, 15, 15, null);
        struct.insert(person);
        expect(struct.columns[0].boxes[0].people).toStrictEqual([]);
        expect(struct.columns[0].boxes[1].people).toStrictEqual([]);
        expect(struct.columns[1].boxes[1].people).toStrictEqual([person]);
        expect(struct.columns[1].boxes[0].people).toStrictEqual([]);
    });

    test('insert person 4', () => {
        const struct = new BoundingBoxStructure(20, 20, 5);
        const person = new Person(TYPES.SUSCEPTIBLE, 15, 5, null);
        struct.insert(person);
        expect(struct.columns[0].boxes[0].people).toStrictEqual([]);
        expect(struct.columns[0].boxes[1].people).toStrictEqual([]);
        expect(struct.columns[1].boxes[1].people).toStrictEqual([]);
        expect(struct.columns[1].boxes[0].people).toStrictEqual([person]);
    });

    test('delete person 1', () => {
        const struct = new BoundingBoxStructure(20, 20, 5);
        const person1 = new Person(TYPES.SUSCEPTIBLE, 5, 5, null);
        const person2 = new Person(TYPES.SUSCEPTIBLE, 5, 15, null);
        const person3 = new Person(TYPES.SUSCEPTIBLE, 15, 15, null);
        const person4 = new Person(TYPES.SUSCEPTIBLE, 15, 5, null);
        struct.insert(person1);
        struct.insert(person2);
        struct.insert(person3);
        struct.insert(person4);
        struct.remove(person1);
        expect(struct.columns[0].boxes[0].people).toStrictEqual([]);
        expect(struct.columns[0].boxes[1].people).toStrictEqual([person2]);
        expect(struct.columns[1].boxes[1].people).toStrictEqual([person3]);
        expect(struct.columns[1].boxes[0].people).toStrictEqual([person4]);
    });

    test('delete person 2', () => {
        const struct = new BoundingBoxStructure(20, 20, 5);
        const person1 = new Person(TYPES.SUSCEPTIBLE, 5, 5, null);
        const person2 = new Person(TYPES.SUSCEPTIBLE, 5, 15, null);
        const person3 = new Person(TYPES.SUSCEPTIBLE, 15, 15, null);
        const person4 = new Person(TYPES.SUSCEPTIBLE, 15, 5, null);
        struct.insert(person1);
        struct.insert(person2);
        struct.insert(person3);
        struct.insert(person4);
        struct.remove(person2);
        expect(struct.columns[0].boxes[0].people).toStrictEqual([person1]);
        expect(struct.columns[0].boxes[1].people).toStrictEqual([]);
        expect(struct.columns[1].boxes[1].people).toStrictEqual([person3]);
        expect(struct.columns[1].boxes[0].people).toStrictEqual([person4]);
    });

    test('delete person 3', () => {
        const struct = new BoundingBoxStructure(20, 20, 5);
        const person1 = new Person(TYPES.SUSCEPTIBLE, 5, 5, null);
        const person2 = new Person(TYPES.SUSCEPTIBLE, 5, 15, null);
        const person3 = new Person(TYPES.SUSCEPTIBLE, 15, 15, null);
        const person4 = new Person(TYPES.SUSCEPTIBLE, 15, 5, null);
        struct.insert(person1);
        struct.insert(person2);
        struct.insert(person3);
        struct.insert(person4);
        struct.remove(person3);
        expect(struct.columns[0].boxes[0].people).toStrictEqual([person1]);
        expect(struct.columns[0].boxes[1].people).toStrictEqual([person2]);
        expect(struct.columns[1].boxes[1].people).toStrictEqual([]);
        expect(struct.columns[1].boxes[0].people).toStrictEqual([person4]);
    });

    test('delete person 4', () => {
        const struct = new BoundingBoxStructure(20, 20, 5);
        const person1 = new Person(TYPES.SUSCEPTIBLE, 5, 5, null);
        const person2 = new Person(TYPES.SUSCEPTIBLE, 5, 15, null);
        const person3 = new Person(TYPES.SUSCEPTIBLE, 15, 15, null);
        const person4 = new Person(TYPES.SUSCEPTIBLE, 15, 5, null);
        struct.insert(person1);
        struct.insert(person2);
        struct.insert(person3);
        struct.insert(person4);
        struct.remove(person4);
        expect(struct.columns[0].boxes[0].people).toStrictEqual([person1]);
        expect(struct.columns[0].boxes[1].people).toStrictEqual([person2]);
        expect(struct.columns[1].boxes[1].people).toStrictEqual([person3]);
        expect(struct.columns[1].boxes[0].people).toStrictEqual([]);
    });

    test('query test',() => {
        const struct = new BoundingBoxStructure(20, 20, 5);
        // person 1 and 2 in same box
        const person1 = new Person(TYPES.SUSCEPTIBLE, 5, 5, null);
        const person2 = new Person(TYPES.SUSCEPTIBLE, 4, 4, null);
        const person3 = new Person(TYPES.SUSCEPTIBLE, 16, 4, null);
        const person4 = new Person(TYPES.SUSCEPTIBLE, 4, 16, null);
        struct.insert(person1);
        struct.insert(person2);
        struct.insert(person3);
        struct.insert(person4);
        expect(struct.query(person1)).toStrictEqual([person2]);
    });
});