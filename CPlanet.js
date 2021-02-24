import { CSpaceObjects } from './CSpaceObject.js';


// Class of the Moons, which is a child class of CSpaceObjects
export class CPlanets extends CSpaceObjects {
    constructor(orbitRate, rotationRate, distanceToSun, name, texture, size, segments) {
        super(orbitRate, rotationRate, distanceToSun, name, texture, size, segments);
    }
}