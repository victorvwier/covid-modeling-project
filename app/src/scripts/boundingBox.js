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
   * @param {Number} range the range which if exceeded a other person is not in range
   * @returns {Array{Person}} All people within range of given person.
   */
  query(person, range) {
    const contacts = [];
    let i;
    for (i = 0; i < this.people.length; i++) {
      const other = this.people[i];
      if (other !== person && other.isInRange(person, range)) {
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
   * @param {Number} startY The lower bound of the column on the Y axis.
   * @param {Number} endY The upper bound of the column on the Y axis.
   * @param {Number} size The size of the side of a single bounding box.
   *
   * @throws Lower bound must be a smaller Number than upper bound.
   */
  constructor(startY, endY, size) {
    if (endY < startY) {
      throw new Error('Start points must be closer to origin than end points');
    }
    /** @private */ this.startY = startY;
    /** @private */ this.endY = endY;
    /** @private */ this.size = size;
    /** @private */ this.boxes = [];
    /*
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
   * @returns {Number} The corresponding index.
   *
   * @throws Person must be between lower and upper bound.
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
   * @param {Number} range the range which if exceeded a other person is not in range
   * @returns {Array{Person}} The people found in range of given person.
   */

  query(person, range) {
    const index = this.getIndex(person);
    let result = [];
    const maxOffset = Math.ceil(range / this.size);
    for (let i = index - maxOffset; i < index + maxOffset; i++) {
      if (i >= 0 && i < this.boxes.length) {
        if (this.boxes[i] === undefined) {
          throw new Error('Boundingbox Error');
        }
        result = result.concat(this.boxes[i].query(person, range));
      }
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
   * @param {Number} startX The lower bound of the structure on the X axis.
   * @param {Number} endX The upper bound of the structure on the X axis.
   * @param {Number} startY The lower bound of the structure on the Y axis.
   * @param {Number} endY The upper bound of the structure on the Y axis.
   * @param {Number} size The size of the sides of a single BoundingBox.
   *
   * @throws Lower bound must be a smaller Number than upper bound.
   */
  constructor(startX, endX, startY, endY, size) {
    if (endX < startX || endY < startY) {
      throw new Error('Start points must be closer to origin than end points');
    }
    /** @private */ this.startX = startX;
    /** @private */ this.endX = endX;
    /** @private */ this.startY = startY;
    /** @private */ this.endY = endY;
    /** @private */ this.size = size;
    /** @private */ this.columns = [];
    /*
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
   * @param {Number} range the range which if exceeded a other person is not in range
   * @returns {Number} The corresponding index.
   *
   * @throws Person must be between lower and upper bound.
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
  query(person, range) {
    if (range === undefined) {
      throw new Error('No range was specified in the query');
    }
    const index = this.getIndex(person);
    let result = [];
    const maxOffset = Math.ceil(range / this.size);
    let i;
    for (i = index - maxOffset; i < index + maxOffset; i++) {
      if (i >= 0 && i < this.columns.length) {
        if (this.columns[i] === undefined) {
          throw new Error('Boundingbox error');
        }
        result = result.concat(this.columns[i].query(person, range));
      }
    }
    return result;
  }
}
