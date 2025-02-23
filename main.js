import * as THREE from "three";
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';


const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();


renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Add an ambient light to provide uniform lighting without shadows
const ambientLight = new THREE.AmbientLight(0xffffff, 1);  // White light, no shadows
scene.add(ambientLight);

// Load model
const loader = new GLTFLoader();
loader.load('./FieldCAD/field.glb', (gltf) => {
  scene.add(gltf.scene);
  gltf.scene.scale.set(0.01, 0.01, 0.01);  // Scale down model if needed
  
  // Make sure the model doesn't cast or receive shadows
  gltf.scene.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = false;
      child.receiveShadow = false;
      child.material.side = THREE.DoubleSide;x  
    }
  });
});

// Camera setup
camera.position.set(0, 0, 10);
camera.lookAt(0, 0, 0);

// Orbit controls for camera movement
const controls = new OrbitControls(camera, renderer.domElement);

// Render loop
function animate() {
  requestAnimationFrame(animate);
  controls.update();  // Update controls (for OrbitControls)
  renderer.render(scene, camera);
}

animate();
