import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, Input } from '@angular/core';
import * as THREE from "three";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'
import Stats from 'three/examples/jsm/libs/stats.module'
import * as Simplex from '@spissvinkel/simplex-noise';


// Create THREE scene
const scene = new THREE.Scene();

// Scene Lighting
const light = new THREE.PointLight();
light.position.set(30, 30, 50)
light.intensity = 1
scene.add(light);
const ambinetLight = new THREE.AmbientLight();
scene.add(ambinetLight);

// Scene Camera
const camera = new THREE.PerspectiveCamera(
  50,
  window.innerWidth / window.innerHeight,
  0.1,
  2000
)
camera.position.set(0, 8, 13)

// Create & Initialize Renderer
const renderer= new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

// Scene Camera Controls
// const controls = new OrbitControls(camera, renderer.domElement)
// controls.enableDamping = true
// controls.target.set(0, 1, 0)

// Procedural Terrain Generation
//Simplex Noise setup
const simplex = Simplex.mkSimplexNoise(Math.random)

//Plane Setup
function createPlane() {
const side = 300
const planeGeo = new THREE.PlaneGeometry(40, 40, side, side)
const planeMat = new THREE.MeshPhysicalMaterial({
  wireframe: false,
  roughness: 0.5,
  color: new THREE.Color("darkblue")
});
planeMat.reflectivity = 0
planeMat.transmission = 1
planeMat.roughness = 0.5
planeMat.metalness = 0.05
planeMat.clearcoat = 0.3
planeMat.clearcoatRoughness = 0.25
planeMat.color = new THREE.Color("darkblue")
planeMat.ior = 1.2
planeMat.thickness = 10
let plane = new THREE.Mesh(planeGeo, planeMat);
plane.castShadow = true;
plane.receiveShadow = true;

scene.add(plane);

return plane;
}

let plane = createPlane()

// Update vertex with noise
function vertexNoise(plane: THREE.Mesh, time: number){
 
  let v3 = new THREE.Vector3();
  for (let i = 0; i < plane.geometry.attributes['position'].count; i++){
    v3.fromBufferAttribute(plane.geometry.attributes['position'], i).addScalar(time * 0.0001)
    let z = time * 0.0000001
    let noise = simplex.noise4D(v3.x * 0.1, v3.y, z, z)
    plane.geometry.attributes['position'].setZ(i, noise);
  }
  plane.geometry.computeVertexNormals()
  plane.geometry.attributes['position'].needsUpdate = true;
}

// Keep renderer same size as window
window.addEventListener('resize', onWindowResize, false)

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.render(scene, camera);
}

// Animate and render
let animate = function () {
  requestAnimationFrame(animate)

  let clock = new THREE.Clock();
  clock.start();
  let time = clock.startTime;
  vertexNoise(plane, time)

  renderer.render(scene, camera);
}

animate()


@Component({
  selector: 'app-render',
  templateUrl: './render.component.html',
  styleUrls: ['./render.component.css']
})
export class RenderComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
