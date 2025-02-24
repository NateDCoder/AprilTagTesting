import * as THREE from "three";
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';

// Scene, Camera, Renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Add ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);

// Load model
const loader = new GLTFLoader();
loader.load('/AprilTagTesting/field.glb', (gltf) => {
  scene.add(gltf.scene);
  gltf.scene.scale.set(0.01, 0.01, 0.01);
  gltf.scene.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = false;
      child.receiveShadow = false;
      child.material.side = THREE.DoubleSide;
    }
  });
  gltf.scene.rotation.set(-Math.PI / 2, -Math.PI, 0);
});


// Camera position
camera.position.set(0, 2, 10);
camera.up.set(0, 1, 0);  // Ensures Y is the up direction
camera.rotation.set(0, 0, 0);

// Pointer Lock Controls
const controls = new PointerLockControls(camera, document.body);
document.addEventListener('click', () => {
  controls.lock();  // Locks cursor on click
});

// Movement Variables
var moveSpeed = 0.1;
const velocity = new THREE.Vector3();
const direction = new THREE.Vector3();
const keyStates = {};

// Handle Key Down & Up
document.addEventListener('keydown', (event) => { keyStates[event.code] = true; });
document.addEventListener('keyup', (event) => { keyStates[event.code] = false; });

document.addEventListener("wheel", (event) => {
  if (event.deltaY < 0) {
    moveSpeed = Math.min(1, moveSpeed + 0.1);
  } else {
    moveSpeed = Math.max(0.1, moveSpeed - 0.1);
  }
  console.log(event.deltaY); // Scroll up = positive, Scroll down = negative
});

// Update movement
function updateMovement() {
  if (!controls.isLocked) return;

  // Get camera's forward and right direction
  const forward = new THREE.Vector3();
  camera.getWorldDirection(forward);
  forward.y = 0; // Ignore vertical movement (stays on ground)
  forward.normalize();

  const right = new THREE.Vector3();
  right.crossVectors(forward, camera.up).normalize(); // Perpendicular to forward

  // Reset direction
  direction.set(0, 0, 0);

  // Apply movement relative to camera
  if (keyStates["KeyW"]) direction.add(forward);
  if (keyStates["KeyS"]) direction.sub(forward);
  if (keyStates["KeyA"]) direction.sub(right);
  if (keyStates["KeyD"]) direction.add(right);

  // Vertical movement
  if (keyStates["Space"]) direction.y += 1; // Move up
  if (keyStates["ShiftLeft"] || keyStates["ShiftRight"]) direction.y -= 1; // Move down

  direction.normalize().multiplyScalar(moveSpeed);
  controls.getObject().position.add(direction);
  if (controls.getObject().position.y < 1) {
    controls.getObject().position.y = 1;
  }
}



// Render loop
function animate() {
  requestAnimationFrame(animate);
  updateMovement();
  renderer.render(scene, camera);
}

animate();
