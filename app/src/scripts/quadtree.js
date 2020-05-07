import Person from './person';

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
        midX = minX + (maxX - minX) / 2;
        midY = minY + (maxY - minY) / 2;
        nwChild = this.createTree(minX, midX, midY, maxY, radius);
        swChild = this.createTree(minX, midX, minY, midY, radius);
        seChild = this.createTree(midX, maxX, minY, midY, radius);
        neChild = this.createTree(midX, maxX, midY, maxY, radius);
        return Node(nwChild, swChild, seChild, neChild, maxX, maxY, minX, minY);
    }

    /**
     * Method that inserts the given person in the quadtree
     * @param {Person} person 
     */
    insert(person) {
        throw new Error("Method insert must be implemented.");
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

    insert(person) {
        if(person.x < minX || person.x > maxX || person.y < minY || person.y > maxY) {
            throw new Error("Person must be within borders to be inserted.");
        }
        midX = minX + (maxX - minX) / 2;
        midY = minY + (maxY - minY) / 2;
        if(person.x <= midX || person.y > midY) {
            nwChild.insert(person);
        } else if(person.x <= midX || person.y <= midY) {
            swChild.insert(person);
        } else if(person.x > midX || person.y <= midY) {
            seChild.insert(person);
        } else {
            neChild.insert(person);
        }
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

    insert(person) {
        this.people.push(person);
    }
}