// Class of the Space Objects floating around. This is the parent of the child classes CPlanet and CMoons
// It is used to determine the variables for the objects that are taken into consideration in the entire Main Class
export class CSpaceObjects {
    constructor(myorbitRate, myrotationRate, mydistanceToSun, myName, myTexture, mySize, mySegments) {
        this.orbitRate = myorbitRate;
        this.rotationRate = myrotationRate;
        this.distanceToSun = mydistanceToSun;
        this.name = myName;
        this.texture = myTexture;
        this.size = mySize;
        this.segments = mySegments;
    }
}