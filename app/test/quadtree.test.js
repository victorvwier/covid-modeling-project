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
});