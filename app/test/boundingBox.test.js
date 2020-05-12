import BoundingBox from '../src/scripts/boundingBox';
import Column from '../src/scripts/Column';
import BoundingBoxStructure from '../src/scripts/BoundingBoxStructure';


describe('Bounding box constructor', function () {
    beforeEach( () => {
        const b=new BoundingBox(15);

    })
    it('creates a new boundingbox', function () {
        expect(b.radius).toEqual(15);
        expect(b.people).toHaveLength(0);
    });
});

describe('Column constructor', function () {
    beforeEach( () => {
        const b=new Column(15,20);

    })
    it('creates a new columns', function () {
        expect(b.height).toEqual(15);
        expect(b.radius).toEqual(20);
       // expect(b.boxes).toHaveLength(0);
    });
});

describe('BoundingBoxStructure constructor', function () {
    beforeEach( () => {
        const b=new BoundingBoxStructure(15,20,25);

    })
    it('creates a new BoundingBoxStructure', function () {
        expect(b.width).toEqual(15)
        expect(b.height).toEqual(20);
        expect(b.radius).toEqual(25);
       
    });
});