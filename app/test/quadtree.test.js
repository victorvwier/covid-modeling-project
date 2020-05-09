import {
    Tree,
    Node,
    Leaf,
    createTree
} from "../src/scripts/quadtree"
import Person from "../src/scripts/person"
import {TYPES} from "../src/scripts/CONSTANTS"

describe('quadtree test suite', () => {
    test('construct tree 1', () => {
        const tree = createTree(0, 20, 0, 20, 8);
        expect(tree).toStrictEqual(new Node(new Leaf(10, 20, 0, 10, []),
            new Leaf(10, 10, 0, 0, []),
            new Leaf(20, 10, 10, 0, []),
            new Leaf(20, 20, 10, 10, []),
            20, 20, 0, 0));
    });

    test('construct tree 2', () => {
        expect(() => {
            new Tree();
        }).toThrow();
    });

    test('test insert outside', () => {
        const tree = createTree(0, 20, 0, 20, 8);
        expect(() => {
            tree.insert(new Person(TYPES.SUSCEPTIBLE, 21, 21, null));
        }).toThrow();
    });

    test('insert outside leaf', () => {
        const tree = new Leaf(10, 10, 0, 0, []);
        expect(() => {
            tree.insert(new Person(TYPES.SUSCEPTIBLE, 11, 11, null));
        }).toThrow();
    });

    test('test insert agent nw', () => {
        const tree = createTree(0, 20, 0, 20, 8);
        const person = new Person(TYPES.SUSCEPTIBLE, 5, 15, null);
        tree.insert(person);
        expect(tree).toStrictEqual(new Node(new Leaf(10, 20, 0, 10, [person]),
            new Leaf(10, 10, 0, 0, []),
            new Leaf(20, 10, 10, 0, []),
            new Leaf(20, 20, 10, 10, []),
            20, 20, 0, 0));
    });

    test('test insert agent sw', () => {
        const tree = createTree(0, 20, 0, 20, 8);
        const person = new Person(TYPES.SUSCEPTIBLE, 5, 5, null);
        tree.insert(person);
        expect(tree).toStrictEqual(new Node(new Leaf(10, 20, 0, 10, []),
            new Leaf(10, 10, 0, 0, [person]),
            new Leaf(20, 10, 10, 0, []),
            new Leaf(20, 20, 10, 10, []),
            20, 20, 0, 0));
    });

    test('test insert agent se', () => {
        const tree = createTree(0, 20, 0, 20, 8);
        const person = new Person(TYPES.SUSCEPTIBLE, 15, 5, null);
        tree.insert(person);
        expect(tree).toStrictEqual(new Node(new Leaf(10, 20, 0, 10, []),
            new Leaf(10, 10, 0, 0, []),
            new Leaf(20, 10, 10, 0, [person]),
            new Leaf(20, 20, 10, 10, []),
            20, 20, 0, 0));
    });

    test('test insert agent ne', () => {
        const tree = createTree(0, 20, 0, 20, 8);
        const person = new Person(TYPES.SUSCEPTIBLE, 15, 15, null);
        tree.insert(person);
        expect(tree).toStrictEqual(new Node(new Leaf(10, 20, 0, 10, []),
            new Leaf(10, 10, 0, 0, []),
            new Leaf(20, 10, 10, 0, []),
            new Leaf(20, 20, 10, 10, [person]),
            20, 20, 0, 0));
    });

    test('test remove agent outside Leaf', () => {
        const tree = new Leaf(10, 10, 0, 0, []);
        expect(() => {
            tree.remove(new Person(TYPES.SUSCEPTIBLE, 11, 11, null));
        }).toThrow();
    });

    test('test remove agent outside', () => {
        const tree = createTree(0, 20, 0, 20, 8);
        expect(() => {
            tree.delete(new Person(TYPES.SUSCEPTIBLE, 21, 21, null));
        }).toThrow();
    });

    test('test remove agent Leaf', () => {
        const tree = new Leaf(10, 10, 0, 0, []);
        const person1 = new Person(TYPES.SUSCEPTIBLE, 1, 1, null);
        const person2 = new Person(TYPES.SUSCEPTIBLE, 2, 2, null);
        tree.insert(person1);
        tree.insert(person2);
        tree.delete(person1);
        expect(tree).toStrictEqual(new Leaf(10, 10, 0, 0, [person2]));
    });

    test('test remove agent nw', () => {
        const tree = createTree(0, 20, 0, 20, 8);
        const person = new Person(TYPES.SUSCEPTIBLE, 5, 15, null);
        tree.insert(person);
        expect(tree).toStrictEqual(new Node(
            new Leaf(10, 20, 0, 10, [person]),
            new Leaf(10, 10, 0, 0, []),
            new Leaf(20, 10, 10, 0, []),
            new Leaf(20, 20, 10, 10, []),
            20, 20, 0, 0));
        tree.delete(person);
        expect(tree).toStrictEqual(new Node(
            new Leaf(10, 20, 0, 10, []),
            new Leaf(10, 10, 0, 0, []),
            new Leaf(20, 10, 10, 0, []),
            new Leaf(20, 20, 10, 10, []),
            20, 20, 0, 0));
    });

    test('test remove agent sw', () => {
        const tree = createTree(0, 20, 0, 20, 8);
        const person = new Person(TYPES.SUSCEPTIBLE, 5, 5, null);
        tree.insert(person);
        expect(tree).toStrictEqual(new Node(
            new Leaf(10, 20, 0, 10, []),
            new Leaf(10, 10, 0, 0, [person]),
            new Leaf(20, 10, 10, 0, []),
            new Leaf(20, 20, 10, 10, []),
            20, 20, 0, 0));
        tree.delete(person);
        expect(tree).toStrictEqual(new Node(
            new Leaf(10, 20, 0, 10, []),
            new Leaf(10, 10, 0, 0, []),
            new Leaf(20, 10, 10, 0, []),
            new Leaf(20, 20, 10, 10, []),
            20, 20, 0, 0));
    });

    test('test remove agent se', () => {
        const tree = createTree(0, 20, 0, 20, 8);
        const person = new Person(TYPES.SUSCEPTIBLE, 15, 5, null);
        tree.insert(person);
        expect(tree).toStrictEqual(new Node(
            new Leaf(10, 20, 0, 10, []),
            new Leaf(10, 10, 0, 0, []),
            new Leaf(20, 10, 10, 0, [person]),
            new Leaf(20, 20, 10, 10, []),
            20, 20, 0, 0));
        tree.delete(person);
        expect(tree).toStrictEqual(new Node(
            new Leaf(10, 20, 0, 10, []),
            new Leaf(10, 10, 0, 0, []),
            new Leaf(20, 10, 10, 0, []),
            new Leaf(20, 20, 10, 10, []),
            20, 20, 0, 0));
    });

    test('test remove agent ne', () => {
        const tree = createTree(0, 20, 0, 20, 8);
        const person = new Person(TYPES.SUSCEPTIBLE, 15, 15, null);
        tree.insert(person);
        expect(tree).toStrictEqual(new Node(
            new Leaf(10, 20, 0, 10, []),
            new Leaf(10, 10, 0, 0, []),
            new Leaf(20, 10, 10, 0, []),
            new Leaf(20, 20, 10, 10, [person]),
            20, 20, 0, 0));
        tree.delete(person);
        expect(tree).toStrictEqual(new Node(
            new Leaf(10, 20, 0, 10, []),
            new Leaf(10, 10, 0, 0, []),
            new Leaf(20, 10, 10, 0, []),
            new Leaf(20, 20, 10, 10, []),
            20, 20, 0, 0));
    });
});