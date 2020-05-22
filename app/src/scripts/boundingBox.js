class BoundingBox {
  constructor() {
    this.people = [];
  }

  insert(person) {
    this.people.push(person);
  }

  remove(person) {
    const index = this.people.indexOf(person);
    if (index > -1) {
      this.people.splice(index, 1);
    }
  }

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

class Column {
  constructor(startY, endY, size) {
    if (endY < startY) {
      throw new Error('Start points must be closer to origin than end points');
    }
    this.startY = startY;
    this.endY = endY;
    this.size = size;
    this.boxes = [];
    let i;
    for (i = 0; i * size < endY - startY; i++) {
      this.boxes.push(new BoundingBox());
    }
  }

  getIndex(person) {
    if (person.y > this.endY || person.y < this.startY) {
      throw new Error('Person is out of bounds');
    }
    return Math.floor((person.y - this.startY) / this.size);
  }

  insert(person) {
    const index = this.getIndex(person);
    this.boxes[index].insert(person);
  }

  remove(person) {
    const index = this.getIndex(person);
    this.boxes[index].remove(person);
  }

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

export default class BoundingBoxStructure {
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
    let i;
    for (i = 0; i * size < endX - startX; i++) {
      this.columns.push(new Column(startY, endY, size));
    }
  }

  getIndex(person) {
    if (person.x > this.endX || person.x < this.startX) {
      throw new Error('Person is out of bounds');
    }
    return Math.floor((person.x - this.startX) / this.size);
  }

  insert(person) {
    const index = this.getIndex(person);
    if (!person.x) {
      throw new Error('Person has nan x');
    }
    this.columns[index].insert(person);
  }

  remove(person) {
    const index = this.getIndex(person);
    this.columns[index].remove(person);
  }

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
