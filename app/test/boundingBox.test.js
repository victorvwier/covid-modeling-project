import BoundingBoxStructure, {
  Column,
  BoundingBox,
} from '../src/scripts/boundingBox';
import Person from '../src/scripts/person';
import { TYPES } from '../src/scripts/CONSTANTS';

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
    const person2 = new Person(TYPES.SUSCEPTIBLE, 4, 4);
    const person3 = new Person(TYPES.SUSCEPTIBLE, 19, 19);
    box.insert(person1);
    box.insert(person2);
    box.insert(person3);
    expect(box.query(person1, 5)).toStrictEqual([person2]);
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
    expect(column.query(person1, 2.1)).toStrictEqual([person2]);
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
    expect(column.query(person3, 2.1)).toStrictEqual([person2, person4]);
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
    expect(column.query(person5, 2.1)).toStrictEqual([person4]);
  });

  test('Bounding Box Structure getIndex 1', () => {
    const struct = new BoundingBoxStructure(0, 10, 0, 10, 2);
    const person = new Person(TYPES.SUSCEPTIBLE, -1, 0);
    expect(() => {
      struct.getIndex(person);
    }).toThrow();
  });

  test('Bounding Box Structure getIndex 2', () => {
    const struct = new BoundingBoxStructure(0, 10, 0, 10, 2);
    const person = new Person(TYPES.SUSCEPTIBLE, 11, 0);
    expect(() => {
      struct.getIndex(person);
    }).toThrow();
  });

  test('Bounding Box Structure getIndex 3', () => {
    const struct = new BoundingBoxStructure(0, 10, 0, 10, 2);
    const person = new Person(TYPES.SUSCEPTIBLE, 5, 5);
    expect(struct.getIndex(person)).toStrictEqual(2);
  });

  test('Bounding Box Structure insert', () => {
    const struct = new BoundingBoxStructure(0, 10, 0, 10, 5);
    const person = new Person(TYPES.SUSCEPTIBLE, 2, 2);
    struct.insert(person);
    expect(struct.columns[0].boxes[0].people).toStrictEqual([person]);
    expect(struct.columns[0].boxes[1].people).toStrictEqual([]);
    expect(struct.columns[1].boxes[0].people).toStrictEqual([]);
    expect(struct.columns[1].boxes[1].people).toStrictEqual([]);
  });

  test('Bounding Box Structure remove', () => {
    const struct = new BoundingBoxStructure(0, 10, 0, 10, 5);
    const person1 = new Person(TYPES.SUSCEPTIBLE, 2, 2);
    const person2 = new Person(TYPES.SUSCEPTIBLE, 2, 7);
    const person3 = new Person(TYPES.SUSCEPTIBLE, 7, 2);
    const person4 = new Person(TYPES.SUSCEPTIBLE, 7, 7);
    struct.insert(person1);
    struct.insert(person2);
    struct.insert(person3);
    struct.insert(person4);
    struct.remove(person1);
    expect(struct.columns[0].boxes[0].people).toStrictEqual([]);
    expect(struct.columns[0].boxes[1].people).toStrictEqual([person2]);
    expect(struct.columns[1].boxes[0].people).toStrictEqual([person3]);
    expect(struct.columns[1].boxes[1].people).toStrictEqual([person4]);
  });

  test('Bounding Box Structure query 1', () => {
    const struct = new BoundingBoxStructure(0, 9, 0, 9, 3);
    const person1 = new Person(TYPES.SUSCEPTIBLE, 1, 1);
    const person2 = new Person(TYPES.SUSCEPTIBLE, 1, 4);
    const person3 = new Person(TYPES.SUSCEPTIBLE, 1, 7);
    const person4 = new Person(TYPES.SUSCEPTIBLE, 4, 1);
    const person5 = new Person(TYPES.SUSCEPTIBLE, 4, 4);
    const person6 = new Person(TYPES.SUSCEPTIBLE, 4, 7);
    const person7 = new Person(TYPES.SUSCEPTIBLE, 7, 1);
    const person8 = new Person(TYPES.SUSCEPTIBLE, 7, 4);
    const person9 = new Person(TYPES.SUSCEPTIBLE, 7, 7);
    struct.insert(person1);
    struct.insert(person2);
    struct.insert(person3);
    struct.insert(person4);
    struct.insert(person5);
    struct.insert(person6);
    struct.insert(person7);
    struct.insert(person8);
    struct.insert(person9);
    const query = struct.query(person2, 5.9).sort();
    const expected = [person1, person3, person4, person5, person6].sort();
    expect(query).toStrictEqual(expected);
  });

  test('Bounding Box Structure query 2', () => {
    const struct = new BoundingBoxStructure(0, 9, 0, 9, 3);
    const person1 = new Person(TYPES.SUSCEPTIBLE, 1, 1);
    const person2 = new Person(TYPES.SUSCEPTIBLE, 1, 4);
    const person3 = new Person(TYPES.SUSCEPTIBLE, 1, 7);
    const person4 = new Person(TYPES.SUSCEPTIBLE, 4, 1);
    const person5 = new Person(TYPES.SUSCEPTIBLE, 4, 4);
    const person6 = new Person(TYPES.SUSCEPTIBLE, 4, 7);
    const person7 = new Person(TYPES.SUSCEPTIBLE, 7, 1);
    const person8 = new Person(TYPES.SUSCEPTIBLE, 7, 4);
    const person9 = new Person(TYPES.SUSCEPTIBLE, 7, 7);
    struct.insert(person1);
    struct.insert(person2);
    struct.insert(person3);
    struct.insert(person4);
    struct.insert(person5);
    struct.insert(person6);
    struct.insert(person7);
    struct.insert(person8);
    struct.insert(person9);
    const query = struct.query(person5, 5.9).sort();
    const expected = [
      person1,
      person2,
      person3,
      person4,
      person6,
      person7,
      person8,
      person9,
    ].sort();
    expect(query).toStrictEqual(expected);
  });

  test('Bounding Box Structure query 3', () => {
    const struct = new BoundingBoxStructure(0, 9, 0, 9, 3);
    const person1 = new Person(TYPES.SUSCEPTIBLE, 1, 1);
    const person2 = new Person(TYPES.SUSCEPTIBLE, 1, 4);
    const person3 = new Person(TYPES.SUSCEPTIBLE, 1, 7);
    const person4 = new Person(TYPES.SUSCEPTIBLE, 4, 1);
    const person5 = new Person(TYPES.SUSCEPTIBLE, 4, 4);
    const person6 = new Person(TYPES.SUSCEPTIBLE, 4, 7);
    const person7 = new Person(TYPES.SUSCEPTIBLE, 7, 1);
    const person8 = new Person(TYPES.SUSCEPTIBLE, 7, 4);
    const person9 = new Person(TYPES.SUSCEPTIBLE, 7, 7);
    struct.insert(person1);
    struct.insert(person2);
    struct.insert(person3);
    struct.insert(person4);
    struct.insert(person5);
    struct.insert(person6);
    struct.insert(person7);
    struct.insert(person8);
    struct.insert(person9);
    const query = struct.query(person8, 5.9).sort();
    const expected = [person4, person5, person6, person7, person9].sort();
    expect(query).toStrictEqual(expected);
  });

  test('Construct Invalid Bounding Box', () => {
    expect(() => {
      BoundingBoxStructure(10, 0, 10, 0, 5);
    }).toThrow();
  });

  test('column with end < start should throw an error', () => {
    expect(() => {
      Column(20, 1, 1);
    }).toThrow(Error);
  });

  test('remove person should do nothing if person does not exist', () => {
    const boundingBox = new BoundingBox();
    const lengthBefore = boundingBox.people.length;
    boundingBox.remove(1);
    expect(boundingBox.people.length).toBe(lengthBefore);
  });
});
