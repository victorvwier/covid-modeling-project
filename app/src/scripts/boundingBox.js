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
        return Math.floor(person.y / this.radius);
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
        return [].concat(this.boxes[index - 1].query(person),
                         this.boxes[index].query(person), 
                         this.boxes[index + 1].query(person));
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
        return Math.floor(person.x / this.radius);
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
        return [].concat(this.columns[index - 1].query(person), 
                         this.columns[index].query(person),
                         this.columns[index + 1].query(person));
    }

    export function scanNearbyBoxes(person,infectionRadius) {
        // find boundingBox of current person and scan nearby ones according to infectionRadius.
        const index = this.getBoundingBox(person);// to be implemented.
        const boxes=findBoxesNearby(index);
        for(let i =0;i<boxes.length;i+=1) {
            const current =boxes[i];
            for(let j=0;j<current.people.length;j+=1){
                if(person.metWith(current.people[j],infectionRadius)){
                    if (this.population[i].canInfect(this.population[j])) {
                      this.population[i].hasSymptomaticCount += 1;
                      this.infect(this.population[j]);
                    }
                  }
            }

            
        }

    }

    findBoxesNearby(index){
        // gotta figure this out.
    }
}