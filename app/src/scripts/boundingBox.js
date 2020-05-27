/** @class BoundingBox representing a single bounding box within the structure. */
export class BoundingBox {
  
  /**
   * Creates an instance of a BoundingBox.
   * 
   * @constructor
   */
  constructor() {
    /** @private */ this.people = [];
  }

  /**
   * Inserts a person into the bounding box.
   * 
   * @param {Person} person The person to be inserted into the bounding box.
   */
  insert(person) {
    this.people.push(person);
  }

  /**
   * Finds and removes given person from the bounding box.
   * Does nothing if given person is not present.
   * 
   * @param {Person} person the person to be removed from the bounding box.
   */
  remove(person) {
    const index = this.people.indexOf(person);
    if (index > -1) {
      this.people.splice(index, 1);
    }
  }

  /**
   * Find all people within range for infection of a given person.
   * 
   * @param {Person} person the person for which all people in range need to be found.
   * @returns {Array{Person}} All people within range of given person.
   */
  query(person) {
    const contacts = [];
    let i;
    for (i = 0; i < this.people.length; i++) {
      const other = this.people[i];
      if (other !== person && other.metWith(person)) {
        contacts.push(other);
      }
    }
    return contacts;
  }
}

/** @class Column representing a column of bounding boxes. */
export class Column {

  /**
   * Creates an instance of a column.
   * 
   * @constructor
   * @param {number} startY The lower bound of the column on the Y axis.
   * @param {number} endY The upper bound of the column on the Y axis.
   * @param {number} size The size of the side of a single bounding box.
   */
  constructor(startY, endY, size) {
    if (endY < startY) {
      throw new Error('Start points must be closer to origin than end points');
    }
    this.startY = startY;
    this.endY = endY;
    this.size = size;
    this.boxes = [];
    /** 
     * The bounding boxes are all have sides with set size starting from the lower bound.
     * The last bounding box may be cut off by the upper bound.
     */
    let i;
    for (i = 0; i * size < endY - startY; i++) {
      this.boxes.push(new BoundingBox());
    }
  }

  /**
   * A function to retrieve the index of the bounding box in which the person should be located.
   * 
   * @param {Person} person The person for which the index is to be retrieved.
   * @returns {number} The corresponding index.
   */
  getIndex(person) {
    if (person.y > this.endY || person.y < this.startY) {
      throw new Error('Person is out of bounds');
    }
    return Math.floor((person.y - this.startY) / this.size);
  }

  /**
   * A function inserting the person into the corresponding bounding box.
   * 
   * @param {Person} person The person to be inserted.
   */
  insert(person) {
    const index = this.getIndex(person);
    this.boxes[index].insert(person);
  }

  /**
   * A function removing the person from the corresponding bounding box.
   * 
   * @param {Person} person The person to be removed.
   */
  remove(person) {
    const index = this.getIndex(person);
    this.boxes[index].remove(person);
  }

  /**
   * A function finding all people within range of infection of the give person.
   * Also checks adjacent bounding boxes if those are valid indices.
   * 
   * @param {Person} person The person for which all people in range are to be found.
   * @returns {Array{Person}} The people found in range of given person.
   */
  query(person) {
    const index = this.getIndex(person);
    let result = this.boxes[index].query(person);
    if (index > 0) {
      result = result.concat(this.boxes[index - 1].query(person));
    }
    if (index + 1 < this.boxes.length) {
      result = result.concat(this.boxes[index + 1].query(person));
    }
    return result;
  }
}

/** @class BoundingBoxStructure representing a list of columns capable of fully covering a 2D space. */
export default class BoundingBoxStructure {

  /**
   * Creates an instance of a BoundingBoxStructure.
   * 
   * @constructor
   * @param {number} startX The lower bound of the structure on the X axis.
   * @param {number} endX The upper bound of the structure on the X axis.
   * @param {number} startY The lower bound of the structure on the Y axis.
   * @param {number} endY The upper bound of the structure on the Y axis.
   * @param {number} size The size of the sides of a single BoundingBox.
   */
  constructor(startX, endX, startY, endY, size) {
    if (endX < startX || endY < startY) {
      throw new Error('Start points must be closer to origin than end points');
    }
    this.startX = startX;
    this.endX = endX;
    this.startY = startY;
    this.endY = endY;
    this.size = size;
    this.columns = [];
    /** 
     * The bounding boxes are all have sides with set size starting from the lower bound.
     * The last bounding box may be cut off by the upper bound.
     */
    let i;
    for (i = 0; i * size < endX - startX; i++) {
      this.columns.push(new Column(startY, endY, size));
    }
  }

  /**
   * A function to retrieve the index of the Column corresponding to given person.
   * 
   * @param {Person} person The person of which the corresponding index is to be found.
   * @returns {number} The corresponding index.
   */
  getIndex(person) {
    if (person.x > this.endX || person.x < this.startX) {
      throw new Error('Person is out of bounds');
    }
    return Math.floor((person.x - this.startX) / this.size);
  }

  /**
   * Inserts given person into the corresponding Column.
   * 
   * @param {Person} person The person to be inserted.
   */
  insert(person) {
    const index = this.getIndex(person);
    this.columns[index].insert(person);
  }

  /**
   * Removes given person from the corresponding Column.
   * 
   * @param {Person} person The person to be removed.
   */
  remove(person) {
    const index = this.getIndex(person);
    this.columns[index].remove(person);
  }

  /**
   * A function finding all people within range of infection of the given person.
   * Also checks adjacent columns if those are valid indices.
   * 
   * @param {Person} person The person for which all people in range are to be found.
   * @returns {Array{Person}} The people within range of the given person.
   */
  query(person) {
    const index = this.getIndex(person);
    let result = this.columns[index].query(person);
    if (index > 0) {
      result = result.concat(this.columns[index - 1].query(person));
    }
    if (index + 1 < this.columns.length) {
      result = result.concat(this.columns[index + 1].query(person));
    }
    return result;
  }
}
