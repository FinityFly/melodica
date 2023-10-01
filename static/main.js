//Import the THREE.js library
import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
// To allow for the camera to move around the scene
import { OrbitControls } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js";
// To allow for importing the .gltf file
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";

//Create a Three.JS Scene
const scene = new THREE.Scene();
//create a new camera with positions and angles
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

//Keep the 3D object on a global variable so we can access it later
let object;
//OrbitControls allow the camera to move around the scene
let controls;

//Set which object to render
let objToRender = 'mic';

//Instantiate a loader for the .gltf file
const loader = new GLTFLoader();

//Load the file
loader.load(
  `static/models/music_band_low_poly/scene.gltf`,
  function (gltf) {
    //If the file is loaded, add it to the scene
    object = gltf.scene;
    object.scale.set(5.5,5.5,5.5);
    scene.add(object);

    
  },
  function (xhr) {
    //While it is loading, log the progress
    console.log((xhr.loaded / xhr.total * 100) + '% loaded');
  },
  function (error) {
    //If there is an error, log it
    console.error(error);
  }
);

//Instantiate a new renderer and set its size
const renderer = new THREE.WebGLRenderer({ alpha: true }); //Alpha: true allows for the transparent background
renderer.setSize(window.innerWidth /1.5 , window.innerHeight / 1.5);

//Add the renderer to the DOM
document.getElementById("container3D").appendChild(renderer.domElement);

//Set how far the camera will be from the 3D model
camera.position.z = objToRender === "dino" ? 25 : 500;

//Add lights to the scene, so we can actually see the 3D model
const topLight = new THREE.DirectionalLight(0xffffff, 1); // (color, intensity)
topLight.position.set(500, 500, 500) //top-left-ish
topLight.castShadow = true;
scene.add(topLight);

const ambientLight = new THREE.AmbientLight(0x333333, objToRender === "dino" ? 5 : 1);
scene.add(ambientLight);

//This adds controls to the camera, so we can rotate / zoom it with the mouse
if (objToRender === "dino") {
  controls = new OrbitControls(camera, renderer.domElement);
}

//Render the scene
let cameraRotation = 0.05;
let speed = 0.001;

function animate() {
  
  // requestAnimationFrame(animate);
  // //Here we could add some code to update the scene, adding some automatic movement

  // //Make the eye move
  // if (object && objToRender === "eye") {
  //   //I've played with the constants here until it looked good 
  //   object.rotation.y = -3 + mouseX / window.innerWidth * 3;
  //   object.rotation.x = -1.2 + mouseY * 2.5 / window.innerHeight;
  // }
  // renderer.render(scene, camera);

  requestAnimationFrame(animate);

  // Update the camera's position for orbiting the object
  if (objToRender === 'mic') {
    const radius = 10; // Adjust the radius as needed
    speed +=0.00005;
    // Calculate new camera position
    const cameraX = radius * Math.cos(cameraRotation);
    const cameraZ = radius * Math.sin(cameraRotation);

    // Set the camera's position to orbit around the microphone
    camera.position.set(cameraX, 8, cameraZ); // Adjust the height (3) as needed
    camera.lookAt(0, 0, 0); // Look at the microphone's position (0, 0, 0)

    // Increment the camera's rotation angle
    cameraRotation += speed;
  }

  // Render the scene
  renderer.render(scene, camera);

  // Rotate the camera around the object when objToRender is 'dino'
  if (objToRender === 'dino' && controls) {
    controls.update();
  }

  // Make the eye move (if objToRender is 'eye')
  if (object && objToRender === 'eye') {
    // Adjust rotation based on mouse position
    object.rotation.y = -3 + mouseX / window.innerWidth * 3;
    object.rotation.x = -1.2 + mouseY * 2.5 / window.innerHeight;
  }

  renderer.render(scene, camera);
}

//Add a listener to the window, so we can resize the window and the camera
window.addEventListener("resize", function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

//add mouse position listener, so we can make the eye move
document.onmousemove = (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
}

//Start the 3D rendering
animate();