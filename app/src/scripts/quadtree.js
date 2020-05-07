/**
 * Abstract class Tree
 */
export class Tree {
    constructor() {
        if(this.constructor === Tree) {
            throw new Error("This is an abstract class and cannot be instantiated");
        }
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
 * Class Leaf extending Tree.
 * Represents all external nodes of the tree.
 * Must have two defining points and an array of people contained within those.
 */
export class Leaf extends Tree {
    constructor(maxX, maxY, minX, minY, people) {
        super();
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

/**
 * Class Node extending Tree.
 * Represents all inner nodes of the tree.
 * Must have 4 children and two defining points
 */
export class Node extends Tree {
    constructor(nwChild, swChild, seChild, neChild, maxX, maxY, minX, minY) {
        super();
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
        if(person.x < this.minX || person.x > this.maxX || person.y < this.minY || person.y > this.maxY) {
            throw new Error("Person must be within borders to be inserted.");
        }
        const midX = this.minX + (this.maxX - this.minX) / 2;
        const midY = this.minY + (this.maxY - this.minY) / 2;
        if(person.x <= midX || person.y > midY) {
            this.nwChild.insert(person);
        } else if(person.x <= midX || person.y <= midY) {
            this.swChild.insert(person);
        } else if(person.x > midX || person.y <= midY) {
            this.seChild.insert(person);
        } else if(person.x > midX || person.y > midY) {
            this.neChild.insert(person);
        }
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
export function createTree(minX, maxX, minY, maxY, radius) {
    if((maxX - minX) < radius * 2 || (maxY - minY) < radius * 2) {
        return new Leaf(maxX, maxY, minX, minY, []);
    }
    const midX = minX + (maxX - minX) / 2;
    const midY = minY + (maxY - minY) / 2;
    const nwChild = createTree(minX, midX, midY, maxY, radius);
    const swChild = createTree(minX, midX, minY, midY, radius);
    const seChild = createTree(midX, maxX, minY, midY, radius);
    const neChild = createTree(midX, maxX, midY, maxY, radius);
    return new Node(nwChild, swChild, seChild, neChild, maxX, maxY, minX, minY);
}