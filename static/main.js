// Import the THREE.js library
import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
import { OrbitControls } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

let object;
let controls;
let objToRender = 'mic';

const loader = new GLTFLoader();
//Keep track of the mouse position, so we can make the eye move
let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;

loader.load(
  `static/models/music_band_low_poly/scene.gltf`,
  function (gltf) {
    object = gltf.scene;
    object.scale.set(5.5, 5.5, 5.5);
    scene.add(object);
  },
  function (xhr) {
    console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
  },
  function (error) {
    console.error(error);
  }
);

const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(window.innerWidth / 1.5, window.innerHeight / 1.5);
document.getElementById("container3D").appendChild(renderer.domElement);

const topLight = new THREE.DirectionalLight(0xffffff, 1);
topLight.position.set(500, 500, 500);
topLight.castShadow = true;
scene.add(topLight);

const ambientLight = new THREE.AmbientLight(0x333333, objToRender === "dino" ? 5 : 1);
scene.add(ambientLight);

if (objToRender === "dino") {
  controls = new OrbitControls(camera, renderer.domElement);
}

let cameraRotation = 0.05;
let speed = 0.001;




function animate() {
  requestAnimationFrame(animate);

  // Update the camera's position for zooming with arrow keys
  // Update the camera's position for zooming with arrow keys
  const zoomSpeed = 10; // Adjust the zoom speed as needed


  // Ensure camera position stays within reasonable bounds
  camera.position.z = Math.max(camera.position.z, 1);
  camera.position.z = Math.min(camera.position.z, 1000);


  if (objToRender === 'mic') {
    const radius = 10;
    if (zoomSpeed < 1000){
        speed *= 1.003;
    }
    

    
    const cameraX = radius * Math.cos(cameraRotation);
    const cameraZ = radius * Math.sin(cameraRotation);

    camera.position.set(cameraX, 8, cameraZ);
    camera.lookAt(0, 0, 0);

    cameraRotation += speed;
    object.rotation.y = -3 + mouseX / window.innerWidth * 3;
    object.rotation.x = -1.2 + mouseY * 2.5 / window.innerHeight;
  }


  renderer.render(scene, camera);
}


document.onmousemove = (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
}

animate();