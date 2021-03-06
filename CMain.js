// --------------------------------------------------------------------------------------
// This project is a JavaScript Project, which is simulating a Solar-System. It simulates 
// all the planets we know with their orbits, information about the planet and their
// most important moons. The scale between the planets is roughly correct, although
// the distances are not.
// 
// This CMain is the Main Class of the entire projects, here is where everything is coded
// and contains all the functions to create the Solar-System.
// 
//
//Author: Shpetim Veseli    VES     IMS Frauenfeld      24.02.2021
//
//Version   2.0     Updated by: VES
//
//All the rights remain to the original creator Shpetim Veseli ©
// --------------------------------------------------------------------------------------

// Imports CMoons and CPlanets from their JavaScript Files
import { CMoons } from './CMoon.js';
import { CPlanets } from './CPlanet.js';

//Global variables
let pointlight, controls, scene, camera, renderer;
//Creates the variables for the orbits.
let earthOrbit,mercuryOrbit,venusOrbit,marsOrbit,jupiterOrbit,saturnOrbit,uranusOrbit,neptuneOrbit,ring;
//All the planet variables including the sun
let sun, earth, mars, mercury, venus, jupiter, saturn, neptune, uranus;
//All the moon variables for Earth, Mars, Jupiter, Saturn, Uranus and Neptune
let moon, phobos, deimos, io, europa, ganymede, callisto, enceladus, titan, dione, miranda, titania, umbriel, ariel, triton;
// ThreeJS needs the segments to form the geometric sphere. It basically shapes the spheres to be round.
let planetSegments = 96;

// Orbit Data to provide for the rotation and the speed of orbit or rotation
let orbitData = {velocity: 10, runOrbit: true, runRotation: true};

// Sets the width of the white lines (orbit lines)
let orbitWidth = 0.15;

//Creates the Data for the Sun and saves it into a variables
let sunStats = new CPlanets(1, 0.002, 0, "sun", "img/sun.jpg", 48, planetSegments);

// Creates all the Data for all the planets and saves them into their variables.
//CPlanets(rotationRate,OrbitRate,distanceToSun,name,texturelocation,size,segments)
let earthStats = new CPlanets(365, 0.009, 180, "earth", "img/earth.jpg", 2, planetSegments);
let mercuryStats = new CPlanets(115, 0.002, 70.2, "mercury", "img/mercury.jpg", 0.5*earthStats.size, planetSegments);
let venusStats = new CPlanets(225, 0.009, 131.4, "venus", "img/venus.jpg", 0.6*earthStats.size, planetSegments);
let marsStats = new CPlanets(687, 0.012, 248.4, "mars", "img/mars.jpg", 0.75*earthStats.size, planetSegments);
let jupiterStats = new CPlanets(4328.9, 0.015, 410, "jupiter", "img/jupiter.jpg", 5.2*earthStats.size, planetSegments);
let saturnStats = new CPlanets(10749.25, 0.015, 650, "saturn", "img/saturn.jpg", 4.5*earthStats.size, planetSegments);
let uranusStats = new CPlanets(30660, 0.013, 900, "uranus", "img/uranus.jpg", 2*earthStats.size, planetSegments);
let neptuneStats = new CPlanets(60155.65, 0.012, 1000, "neptune", "img/neptune.png", 1.9*earthStats.size, planetSegments);


// Creates all the Data for all the moons and saves them into their variables.
//Instatation of the moons
//CMoons(rotationRate,OrbitRate,distanceToSun,name,texturelocation,size,segments)
let moonStats = new CMoons(27, 0.01, 4, "moon", "img/moon.jpg", 0.8, planetSegments);
let phobosStats = new CMoons(15, 0.01, 2.8, "phobos", "img/moon.jpg", 0.6, planetSegments);
let deimosStats = new CMoons(24, 0.01, 8, "deimos", "img/moon.jpg", 0.4, planetSegments);
let ioStats = new CMoons(24, 0.01, 15, "io", "img/io.jpg", 0.4, planetSegments);
let europaStats = new CMoons(30, 0.01, 20, "europa", "img/europa.jpg", 0.9, planetSegments);
let ganymedeStats = new CMoons(12, 0.01, 40, "ganymede", "img/ganymede.jpg", 0.7, planetSegments);
let callistoStats = new CMoons(50, 0.01, 55, "callisto", "img/callisto.jpg", 0.7, planetSegments);
let enceladusStats = new CMoons(40, 0.01, 25, "enceladus", "img/enceladus.jpg", 0.9, planetSegments);
let titanStats = new CMoons(90, 0.01, 75, "titan", "img/titan.jpg", 1.1, planetSegments);
let dioneStats = new CMoons(60, 0.01, 55, "dione", "img/dione.jpg", 0.7, planetSegments);
let mirandaStats = new CMoons(60, 0.01, 15, "miranda", "img/moon.jpg", 0.7, planetSegments);
let titaniaStats = new CMoons(40, 0.01, 30, "titania", "img/titania.jpg", 0.7, planetSegments);
let umbrielStats = new CMoons(20, 0.01, 55, "umbriel", "img/moon.jpg", 0.7, planetSegments);
let arielStats = new CMoons(25, 0.01, 65, "ariel", "img/moon.jpg", 0.7, planetSegments);
let tritonStats = new CMoons(60, 0.01, 55, "triton", "img/triton.jpg", 0.7, planetSegments);



//GLobal variables for the 2 THREEJS variables raycaster and mouse, which are used for 
//click functions on specified objects
let raycaster = new THREE.Raycaster();
let mouse = new THREE.Vector2();
let selectedObject;


//Function getSphere creates a THREE JS Sphere Geometry and returns the object
function getSphere(material, size, segments) {
    let geometry = new THREE.SphereGeometry(size, segments, segments);
    let sphere = new THREE.Mesh(geometry, material);
    sphere.castShadow = true;

    return sphere;
}

// Function for the material which is used for the planets, moons and the sun
// This function is inspiried by stackoverflow (small parts of it)
function getMaterial(type, color, myTexture) {
    let materialOptions = {
        color: color === undefined ? 'rgb(255,255,255)' : color,
        map: myTexture === undefined ? null : myTexture
    };
    switch (type) {
        case 'basic':
            return new THREE.MeshBasicMaterial(materialOptions);
        case 'lambert':
            return new THREE.MeshLambertMaterial(materialOptions);
        case 'phong':
            return new THREE.MeshPhongMaterial(materialOptions);
        case 'standard':
            return new THREE.MeshStandardMaterial(materialOptions);
        default:
            return new THREE.MeshBasicMaterial(materialOptions);
    }
    
    
}



// Function createPlanet takes the data, the positon, and the material type and creates the planets.
// checks first if texture is empty, which it should be and then it adds the texture that you give it.
//also shadows get added to the planets
function createPlanet(plntData, x, y, z, myMaterialType) {
    let myMaterial;
    let passTexture;

    if (plntData.texture && plntData.texture !== "") {
        passTexture = new THREE.ImageUtils.loadTexture(plntData.texture);
    }
    if (myMaterialType) {
        myMaterial = getMaterial(myMaterialType, "rgb(255,255,255)", passTexture);
    } else {
        myMaterial = getMaterial("lambert", "rgb(255,255,255)", passTexture);
    }

    myMaterial.receiveShadow = true;
    myMaterial.castShadow = true;
    let myPlanet = getSphere(myMaterial, plntData.size, plntData.segments);
    myPlanet.receiveShadow = true;
    myPlanet.name = plntData.name;
    scene.add(myPlanet);
    myPlanet.position.set(x, y, z);

    return myPlanet;
}

//Function to create ThreeJS rings which are used for the orbits and the rings of saturn
// basic function created after the documentation of three.js on how to create a ring
function getRing(size, innerDiameter, facets, myColor, name, distanceToSun) {
    let ring1Geometry = new THREE.RingGeometry(size, innerDiameter, facets);
    let ring1Material = new THREE.MeshBasicMaterial({color: myColor, side: THREE.DoubleSide});
    let myRing = new THREE.Mesh(ring1Geometry, ring1Material);
    myRing.name = name;
    myRing.position.set(distanceToSun, 0, 0);
    myRing.rotation.x = Math.PI / 2;
    scene.add(myRing);
    return myRing;
}



//This function shows all the orbits of the planets in a white color.
function showOrbits() {
    
    earthOrbit = getRing(earthStats.distanceToSun + orbitWidth, earthStats.distanceToSun - orbitWidth, 320, 0xffffff, "earthOrbit", 0);
    mercuryOrbit = getRing(mercuryStats.distanceToSun + orbitWidth, mercuryStats.distanceToSun - orbitWidth, 320, 0xffffff, "mercuryOrbit", 0);
    venusOrbit = getRing(venusStats.distanceToSun + orbitWidth, venusStats.distanceToSun - orbitWidth, 320, 0xffffff, "venusOrbit", 0);
    marsOrbit = getRing(marsStats.distanceToSun + orbitWidth, marsStats.distanceToSun - orbitWidth, 320, 0xffffff, "marsOrbit", 0);
    jupiterOrbit = getRing(jupiterStats.distanceToSun + orbitWidth, jupiterStats.distanceToSun - orbitWidth, 320, 0xffffff, "jupiterOrbit", 0);
    saturnOrbit = getRing(saturnStats.distanceToSun + orbitWidth, saturnStats.distanceToSun - orbitWidth, 320, 0xffffff, "saturnOrbit", 0);
    uranusOrbit = getRing(uranusStats.distanceToSun + orbitWidth, uranusStats.distanceToSun - orbitWidth, 320, 0xffffff, "uranusOrbit", 0);
    neptuneOrbit = getRing(neptuneStats.distanceToSun + orbitWidth, neptuneStats.distanceToSun - orbitWidth, 320, 0xffffff, "neptuneOrbit", 0);
}


//Function onclick is to determine if a user double clicks on a certain object and show the information about the planets.
function onclick1(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    let modal = document.getElementById("myModal");
    raycaster.setFromCamera(mouse, camera);
    let intersects = raycaster.intersectObjects(scene.children, true);
    if (intersects.length > 0) {
        selectedObject = intersects[0].object;
//    alert(selectedObject.name + " selected!");


        switch (selectedObject.name) {
            case "sun":
                modal.style.display = "block";
                modal.querySelector('h1').textContent = 'The Sun';
                modal.querySelector('img').src = 'Descriptions/sunDescription.png';
                modal.querySelector('p').innerHTML = "<p>The Sun is a yellow dwarf star, a hot ball of glowing gases <br> at the heart of our solar system. Its gravity holds everything <br> from the biggest planets to tiny debris in its orbit. <br> </p> \
<table><tr><td>Age:</td><td>4.6 Billion Years</td></tr><tr><td>Type:</td><td>Yellow Dwarf (G2V)</td></tr><tr><td>Mass:</td><td>1'989'100'000'000'000'000'000 billion kg (333'060 * Earth)</td></tr><tr><td>Diameter:</td><td>1'392'648 km</td></tr><tr><td>Circumference at Equator:</td><td>4'370'005.6 km</td></tr></tr><tr><td>Surface Temperature:</td><td>5'500 °C</td></tr></table>";
                break;
            case "mercury":
                modal.style.display = "block";
                modal.querySelector('h1').textContent = 'Mercury';
                modal.querySelector('img').src = 'Descriptions/mercuryDescription.png';
                modal.querySelector('p').innerHTML = "<p>Mercury—the smallest planet in our solar system and closest to the Sun—is only slightly larger than Earth's Moon. Mercury is the fastest planet, zipping around the Sun every 88 Earth days.</p> \
<table><tr><td>Mass:</td><td>330'104'000'000'000 billion kg (0.055 * Earth)</td></tr><tr><td>Equational Diameter:</td><td>4'879 km</td></tr><tr><td>Equatioral Circumference:</td><td>15'329 km</td></tr><tr><td>Moons:</td><td>0</td></tr><tr><td>Orbit Distance:</td><td>57'909'227 km(0.39 AU)</td></tr></tr><tr><td>Orbit Period:</td><td>87.97 Earth days</td></tr></table>";
                break;
            case "venus":
                modal.style.display = "block";
                modal.querySelector('h1').textContent = 'Venus';
                modal.querySelector('img').src = 'Descriptions/venusDescription.png';
                modal.querySelector('p').innerHTML = "<p>Venus spins slowly in the opposite direction from most planets. A thick atmosphere traps heat in a runaway greenhouse effect, making it the hottest planet in our solar system.</p> \
<table><tr><td>Mass:</td><td>4'867'320'000'000'000 billion kg (0.815 * Earth)</td></tr><tr><td>Equational Diameter:</td><td>12'104 km</td></tr><tr><td>Equatioral Circumference:</td><td>38'025 km</td></tr><tr><td>Moons:</td><td>0</td></tr><tr><td>Orbit Distance:</td><td>108'209'475 km(0.73 AU)</td></tr></tr><tr><td>Orbit Period:</td><td>224.70 Earth days</td></tr></table>";
                break;
            case "earth":
                modal.style.display = "block";
                modal.querySelector('h1').textContent = 'Earth';
                modal.querySelector('img').src = 'Descriptions/earthDescription.png';
                modal.querySelector('p').innerHTML = "<p>Earth—our home planet—is the only place we know of so far that’s inhabited by living things. It's also the only planet in our solar system with liquid water on the surface.</p> \
<table><tr><td>Mass:</td><td>5'972'190'000'000'000 billion kg (1 * Earth)</td></tr><tr><td>Equational Diameter:</td><td>12'756 km</td></tr><tr><td>Equatioral Circumference:</td><td>40'030 km</td></tr><tr><td>Moons:</td><td>1</td></tr><tr><td>Orbit Distance:</td><td>149'598'262 km(1 AU)</td></tr></tr><tr><td>Orbit Period:</td><td>365.26 Earth days</td></tr></table>";
                break;
            case "mars":
                modal.style.display = "block";
                modal.querySelector('h1').textContent = 'Mars';
                modal.querySelector('img').src = 'Descriptions/marsDescription.png';
                modal.querySelector('p').innerHTML = "<p>Mars is a dusty, cold, desert world with a very thin atmosphere. There is strong evidence Mars was—billions of years ago—wetter and warmer, with a thicker atmosphere.</p> \
<table><tr><td>Mass:</td><td>641'693'000'000'000 billion kg (0.107 * Earth)</td></tr><tr><td>Equational Diameter:</td><td>6'805 km</td></tr><tr><td>Equatioral Circumference:</td><td>21'297 km</td></tr><tr><td>Moons:</td><td>2</td></tr><tr><td>Orbit Distance:</td><td>227'943'824 km(1.38 AU)</td></tr></tr><tr><td>Orbit Period:</td><td>686.98 Earth days</td></tr></table>";
                break;
            case "jupiter":
                modal.style.display = "block";
                modal.querySelector('h1').textContent = 'Jupiter';
                modal.querySelector('img').src = 'Descriptions/jupiterDescription.png';
                modal.querySelector('p').innerHTML = "<p>Jupiter is more than twice as massive than the other planets of our solar system combined. The giant planet's Great Red spot is a centuries-old storm bigger than Earth.</p> \
<table><tr><td>Mass:</td><td>1'898'130'000'000'000'000 billion kg (317.83 * Earth)</td></tr><tr><td>Equational Diameter:</td><td>142'984 km</td></tr><tr><td>Equatioral Circumference:</td><td>439'264 km</td></tr><tr><td>Moons:</td><td>67</td></tr><tr><td>Orbit Distance:</td><td>778'340'821 km(5.20 AU)</td></tr></tr><tr><td>Orbit Period:</td><td>4'332.82 Earth days</td></tr></table>";
                break;
            case "saturn":
                modal.style.display = "block";
                modal.querySelector('h1').textContent = 'Saturn';
                modal.querySelector('img').src = 'Descriptions/saturnDescription.png';
                modal.querySelector('p').innerHTML = "<p>Adorned with a dazzling, complex system of icy rings, Saturn is unique in our solar system. The other giant planets have rings, but none are as spectacular as Saturn's.</p> \
<table><tr><td>Mass:</td><td>568'319'000'000'000'000 billion kg (95.16 * Earth)</td></tr><tr><td>Equational Diameter:</td><td>120'536 km</td></tr><tr><td>Equatioral Circumference:</td><td>365'882 km</td></tr><tr><td>Moons:</td><td>62</td></tr><tr><td>Orbit Distance:</td><td>1'426'666'422 km(9.58 AU)</td></tr></tr><tr><td>Orbit Period:</td><td>10'755.70 Earth days</td></tr></table>";
                break;
            case "uranus":
                modal.style.display = "block";
                modal.querySelector('h1').textContent = 'Uranus';
                modal.querySelector('img').src = 'Descriptions/uranusDescription.png';
                modal.querySelector('p').innerHTML = "<p>Uranus—seventh planet from the Sun—rotates at a nearly 90-degree angle from the plane of its orbit. This unique tilt makes Uranus appear to spin on its side.</p> \
<table><tr><td>Mass:</td><td>86'810'300'000'000'000 billion kg (14.536 * Earth)</td></tr><tr><td>Equational Diameter:</td><td>51'118 km</td></tr><tr><td>Equatioral Circumference:</td><td>159'354 km</td></tr><tr><td>Moons:</td><td>27</td></tr><tr><td>Orbit Distance:</td><td>2'870'658'186 km(19.22 AU)</td></tr></tr><tr><td>Orbit Period:</td><td>30'687.15 Earth days</td></tr></table>";
                break;
            case "neptune":
                modal.style.display = "block";
                modal.querySelector('h1').textContent = 'Neptune';
                modal.querySelector('img').src = 'Descriptions/neptuneDescription.png';
                modal.querySelector('p').innerHTML = "<p>Neptune—the eighth and most distant major planet orbiting our Sun—is dark, cold and whipped by supersonic winds. It was the first planet located through mathematical calculations, rather than by telescope.</p> \
<table><tr><td>Mass:</td><td>102'410'000'000'000'000 billion kg (17.15 * Earth)</td></tr><tr><td>Equational Diameter:</td><td>49'528 km</td></tr><tr><td>Equatioral Circumference:</td><td>155'600 km</td></tr><tr><td>Moons:</td><td>14</td></tr><tr><td>Orbit Distance:</td><td>4'498'396'441 km(30.10 AU)</td></tr></tr><tr><td>Orbit Period:</td><td>60'190.03 Earth days</td></tr></table>";
                break;
            default:
        }

    }
}

//When the user clicks outside of the modal it closes it.
window.onclick = function (event) {
    let modal = document.getElementById("myModal");
    if (event.target == modal) {
        modal.style.display = "none";
    }
}



//Function to set the light for the solar system starting from the sun (it gives shadows to the planets and lights them up)
function getPointLight(intensity, color) {
    let light = new THREE.PointLight(color, intensity);
    light.castShadow = true;

    light.shadow.bias = 0.001;
    light.shadow.mapSize.width = 2048;
    light.shadow.mapSize.height = 2048;
    return light;
}

//The initial function that moves the planets around the fixed position which is the sun
// It uses the current time with Date.now which is in milliseconds and i turn it down to seconds
function movePlanet(myPlanet, plntData, myTime, stopRotation) {
    
    if (orbitData.runRotation && !stopRotation) {
        myPlanet.rotation.y += plntData.rotationRate;
    }
    if (orbitData.runOrbit) {
        myPlanet.position.x = Math.cos((myTime/1000)
                * (1.0 / (plntData.orbitRate / orbitData.velocity)) )
                * plntData.distanceToSun;
        myPlanet.position.z = Math.sin((myTime/1000)
                * (1.0 / (plntData.orbitRate / orbitData.velocity)) )
                * plntData.distanceToSun;
    }
}


//Same function like the planet but here the moon spins around the planet
function moveMoon(myMoon, myPlanet, plntData, myTime) {
    movePlanet(myMoon, plntData, myTime);
    if (orbitData.runOrbit) {
        myMoon.position.x = myMoon.position.x + myPlanet.position.x;
        myMoon.position.z = myMoon.position.z + myPlanet.position.z;
    }
}

//update function which initializes everything and animates them
function update(renderer, scene, camera, controls) {
    pointlight.position.copy(sun.position);
    let time = Date.now();
    
    controls.update();
//initializes all the moons and planets
    movePlanet(earth, earthStats, time);
    moveMoon(moon, earth, moonStats, time);
    moveMoon(phobos, mars, phobosStats, time);
    moveMoon(deimos, mars, deimosStats, time);
    moveMoon(io, jupiter, ioStats, time);
    moveMoon(europa, jupiter, europaStats, time);
    moveMoon(ganymede, jupiter, ganymedeStats, time);
    moveMoon(callisto, jupiter, callistoStats, time);

    moveMoon(dione, saturn, dioneStats, time);
    moveMoon(titan, saturn, titanStats, time);
    moveMoon(enceladus, saturn, enceladusStats, time);

    moveMoon(miranda, uranus, mirandaStats, time);
    moveMoon(umbriel, uranus, umbrielStats, time);
    moveMoon(ariel, uranus, arielStats, time);
    moveMoon(titania, uranus, titaniaStats, time);

    moveMoon(triton, neptune, tritonStats, time);

    movePlanet(mars, marsStats, time);
    movePlanet(mercury, mercuryStats, time);
    movePlanet(venus, venusStats, time);
    movePlanet(jupiter, jupiterStats, time);
    movePlanet(saturn, saturnStats, time);
    movePlanet(uranus, uranusStats, time);
    movePlanet(neptune, neptuneStats, time);
    movePlanet(sun, sunStats, time);
    movePlanet(ring, saturnStats, time, true);

    renderer.render(scene, camera);
    requestAnimationFrame(function () {
        update(renderer, scene, camera, controls);
    });
}



//Initialize function to start everything and set up the threejs camera it also creates the planets 
function init() {
    camera = new THREE.PerspectiveCamera(
            45,
            window.innerWidth / window.innerHeight,
            1,
            15000
            );
    camera.position.z = 180;
    camera.position.x = -90;
    camera.position.y = 90;
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    scene = new THREE.Scene();

    renderer = new THREE.WebGLRenderer({
        //smoother lines
        antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);

    document.getElementById('webgl').appendChild(renderer.domElement);

    controls = new THREE.OrbitControls(camera, renderer.domElement);

    pointlight = getPointLight(1.3, "rgb(243, 247, 195)");
    scene.add(pointlight);

    let ambientLight = new THREE.AmbientLight(0xaaaaaa);
    scene.add(ambientLight);

    let sunMaterial = getMaterial("basic", "rgb(255,255,0)");
    sun = getSphere(sunMaterial, 1, 48);
    scene.add(sun);
    

// all the planets get initizalized by this function and this function will create the planets and automatically add them to the scene
    earth = createPlanet(earthStats, earthStats.distanceToSun, 0, 0);
    mars = createPlanet(marsStats, marsStats.distanceToSun, 0, 0);
    mercury = createPlanet(mercuryStats, mercuryStats.distanceToSun, 0, 0);
    venus = createPlanet(venusStats, venusStats.distanceToSun, 0, 0);
    jupiter = createPlanet(jupiterStats, jupiterStats.distanceToSun, 0, 0);
    saturn = createPlanet(saturnStats, saturnStats.distanceToSun, 0, 0);
    uranus = createPlanet(uranusStats, uranusStats.distanceToSun, 0, 0);
    neptune = createPlanet(neptuneStats, neptuneStats.distanceToSun, 0, 0);
    sun = createPlanet(sunStats, sunStats.distanceToSun, 0, 0);
    
    moon = createPlanet(moonStats, moonStats.distanceToSun, 0, 0);
    phobos = createPlanet(phobosStats, phobosStats.distanceToSun, 0, 0);
    deimos = createPlanet(deimosStats, deimosStats.distanceToSun, 0, 0);
    europa = createPlanet(europaStats, europaStats.distanceToSun, 0, 0);
    io = createPlanet(ioStats, ioStats.distanceToSun, 0, 0);
    ganymede = createPlanet(ganymedeStats, ganymedeStats.distanceToSun, 0, 0);
    callisto = createPlanet(callistoStats, callistoStats.distanceToSun, 0, 0);
    dione = createPlanet(dioneStats, dioneStats.distanceToSun, 0, 0);
    titan = createPlanet(titanStats, titanStats.distanceToSun, 0, 0);
    enceladus = createPlanet(enceladusStats, enceladusStats.distanceToSun, 0, 0);
    titania = createPlanet(titaniaStats, titaniaStats.distanceToSun, 0, 0);
    miranda = createPlanet(mirandaStats, mirandaStats.distanceToSun, 0, 0);
    umbriel = createPlanet(umbrielStats, umbrielStats.distanceToSun, 0, 0);
    ariel = createPlanet(arielStats, arielStats.distanceToSun, 0, 0);
    triton = createPlanet(tritonStats, tritonStats.distanceToSun, 0, 0);
    
    ring = getRing(20, 15, 1000, 0x757064, "ring", saturnStats.distanceToSun);

//makes the orbits of the planets visible
    showOrbits();
//Helptext
           var object1 = {
               Helptext: function () {
                   alert('This site gives an overview on our Solarsystem and you can look around and explore it. \n \nLook Around: Look around by pressing mouse1 and dragging \
                   \nMove: By Clicking right mouse button and draggin you can move your camera. \nrunRotation: In the Settings menu you can stop the rotation of the planets. \
                   \nrunOrbit: By Pressing runOrbit the planets stop orbiting the sun.\nInformation: Double clicking the planets will give you little information about the planets. \
                   \nAdjusting the value: It will speed up or speed down the orbit Rate \nAdjusting the intensity: It will increase or decrease the intensity of the light, the sun emits.');
               }
           };
//GUI for the settings
    let gui = new dat.GUI();
    let orbits = gui.addFolder('Settings');
    let help = gui.addFolder('Help');
    help.add(object1,'Helptext')
    orbits.add(orbitData, 'velocity', 0, 500);
    orbits.add(orbitData, 'runOrbit', 0, 1);
    orbits.add(orbitData, 'runRotation', 0, 1);
    orbits.add(pointlight,'intensity');
//updates
    update(renderer, scene, camera, controls);
    renderer.domElement.addEventListener("dblclick", onclick1, false);



}
//Initializes the project
init();

