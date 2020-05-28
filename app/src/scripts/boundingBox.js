export class BoundingBox {
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

export class Column {
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

  query(person, range) {
    const index = this.getIndex(person);
    let result = [];
    const maxOffset = Math.ceil(range/this.size);
    for(let i = index - maxOffset; i < index + maxOffset; i++) {
      if (i >= 0 && i < this.boxes.length) {
        if( this.boxes[i] === undefined) {
          throw new Error("something is not quite going as planned");          
        }
        result = result.concat(this.boxes[i].query(person, range));
      }
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
    this.columns[index].insert(person);
  }

  remove(person) {
    const index = this.getIndex(person);
    this.columns[index].remove(person);
  }

  query(person, range) {
    if(isNaN(range) || range === undefined) { 
      throw new Error("Yeah we forgot to include the range in our query"); 
    }
    const index = this.getIndex(person);
    let result = [];
    const maxOffset = Math.ceil(range/this.size);
    let i;
    for(i = index - maxOffset; i < index + maxOffset; i++) {
      if (i >= 0 && i < this.columns.length) {
        if( this.columns[i] === undefined) {
          throw new Error("something is not quite going as planned");          
        }
        result = result.concat(this.columns[i].query(person, range));
      }       
    }
    return result;
  }
}
