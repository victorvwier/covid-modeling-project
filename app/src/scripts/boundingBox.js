class BoundingBox {
    constructor(radius) {
        this.people = [];
        this.radius = radius;
    }

    insert(person) {
        this.people.push(person);
    }

    remove(person) {
        const index = this.people.indexOf(person);
        if(index > -1) {
            this.people.splice(index, 1);
        }
    }

    query(person) {
        const contacts = [];
        let i;
        for(i = 0; i < this.people.length; i++) {
            const other = this.people[i];
            if(other !== person && other.metWith(person, this.radius)) {
                contacts.push(other);
            }
        }
        return contacts;
    }
}

class Column {
    constructor(height, radius) {
        this.height = height;
        this.radius = radius;
        this.boxes = [];
        let i;
        for(i = 0; i * radius < height; i++) {
            this.boxes.push(new BoundingBox(radius));
        }
    }

    getIndex(person) {
        if(person.y > this.height || person.y < 0) {
            throw new Error("Person is out of bounds");
        }
        return Math.floor(person.y / (this.radius * 2));
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
        if (index !== 0) {
            result = result.concat(this.boxes[index - 1].query(person));
        }
        if (index !== Math.floor(this.width / this.radius)) {
            result = result.concat(this.boxes[index + 1].query(person));
        }
        return result;
    }
}

export default class BoundingBoxStructure {
    constructor(width, height, radius) {
        this.width = width;
        this.height = height;
        this.radius = radius;
        this.columns = [];
        let i;
        for(i = 0; i * radius < width; i++) {
            this.columns.push(new Column(height, radius));
        }
    }

    getIndex(person) {
        if(person.x > this.width || person.x < 0) {
            throw new Error("Person is out of bounds");
        }
        return Math.floor(person.x / (this.radius * 2));
    }

    insert(person) {
        const index = this.getIndex(person);
        this.columns[index].insert(person);
    }

    remove(person) {
        const index = this.getIndex(person);
        this.columns[index].remove(person);
    }

    query(person) {
        const index = this.getIndex(person);
        let result = this.columns[index].query(person);
        if (index !== 0) {
            result = result.concat(this.columns[index - 1].query(person));
        }
        if (index !== Math.floor(this.width / this.radius)) {
            result = result.concat(this.columns[index + 1].query(person));
        }
        return result;
    }
}