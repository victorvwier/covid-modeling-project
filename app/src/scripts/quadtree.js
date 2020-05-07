/**
 * Abstract class Tree
 */
export default class Tree {
    constructor() {
        if(this.constructor === Tree) {
            throw new Error("This is an abstract class and cannot be instantiated");
        }
    }

    /**
     * Method to create an empty tree over an area
     * @param {Int} minX 
     * @param {Int} maxX 
     * @param {Int} minY 
     * @param {Int} maxY
     * @param {Float} radius
     */
    static createTree(minX, maxX, minY, maxY, radius) {
        if((maxX - minX) <= radius || (maxY - minY) <= radius) {
            return new Leaf(maxX, maxY, minX, minY, []);
        }
        midX = minX + (maxX - minX);
        midY = minY + (maxY - minY);
        nwChild = this.createTree(minX, midX, midY, maxY, radius);
        swChild = this.createTree(minX, midX, minY, midY, radius);
        seChild = this.createTree(midX, maxX, minY, midY, radius);
        neChild = this.createTree(midX, maxX, midY, maxY, radius);
        return Node(nwChild, swChild, seChild, neChild, maxX, maxY, minX, minY);
    }
}

/**
 * Class Node extending Tree.
 * Represents all inner nodes of the tree.
 * Must have 4 children and two defining points
 */
class Node extends Tree {
    constructor(nwChild, swChild, seChild, neChild, maxX, maxY, minX, minY) {
        this.nwChild = nwChild;
        this.swChild = swChild;
        this.seChild = seChild;
        this.neChild = neChild;
        this.maxX = maxX;
        this.maxY = maxY;
        this.minX = minX;
        this.minY = minY;
    }
}

/**
 * Class Leaf extending Tree.
 * Represents all external nodes of the tree.
 * Must have two defining points and an array of people contained within those.
 */
class Leaf extends Tree {
    constructor(maxX, maxY, minX, minY, people) {
        this.maxX = maxX;
        this.maxY = maxY;
        this.minX = minX;
        this.minY = minY;
        this.people = people;
    }
}