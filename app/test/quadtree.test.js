import {
    Tree,
    Node,
    Leaf,
    createTree
} from "../src/scripts/quadtree"
import Person from "../src/scripts/person"
import TYPES from "../src/scripts/CONSTANTS"

describe('quadtree test suite', () => {
    test('construct tree 1', () => {
        const tree = createTree(0, 20, 0, 20, 8);
        expect(tree).toStrictEqual(new Node(new Leaf(10, 20, 0, 10, []), new Leaf(10, 10, 0, 0, []), new Leaf(20, 10, 10, 0, []), new Leaf(20, 20, 10, 10, []), 20, 20, 0, 0));
    })
});