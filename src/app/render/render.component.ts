import { Component, OnInit, HostListener } from '@angular/core';
import * as THREE from "three";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'
import Stats from 'three/examples/jsm/libs/stats.module'
import * as Simplex from '@spissvinkel/simplex-noise';
import { animation } from '@angular/animations';


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
let primaryPlane: THREE.Mesh;
let side = 100;
function createPlane(side: number) {
const planeGeo = new THREE.PlaneGeometry(40, 40, side, side)
const planeMat = new THREE.MeshPhysicalMaterial({
  wireframe: false,
  roughness: 0.5
});
planeMat.reflectivity = 0
planeMat.transmission = 1
planeMat.roughness = 0.5
planeMat.metalness = 0.05
planeMat.clearcoat = 0.3
planeMat.clearcoatRoughness = 0.25
planeMat.color = new THREE.Color(0,0,1)
planeMat.ior = 1.2
planeMat.thickness = 10
let plane = new THREE.Mesh(planeGeo, planeMat);
plane.castShadow = true;
plane.receiveShadow = true;
return plane;
}

let plane = createPlane(side)
primaryPlane = plane;
scene.add(primaryPlane)


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

//Scroll Animation Init
const scrollAnimation: {start: number; end: number; func: () => void}[] = [] 
let scrollPercent = 0;

//Scroll to increase brightness
scrollAnimation.push({
  start: 0,
  end: 50,
  func: () => {
    light.intensity += 0.7
    light.translateZ(0.5)
  }
})

scrollAnimation.push({
  start: 51,
  end: 100,
  func: () => {
    plane.material.color.setHex
  }
})

//Play scroll animation
// scrollAnimation.forEach(())

//Translate distance scrolled to percent
document.body.onscroll = () => {
  scrollPercent = ((document.documentElement.scrollTop || document.body.scrollTop) / 
  (document.documentElement.scrollHeight || document.body.scrollHeight) - document.documentElement.clientHeight) * 100
}

// Animate and render
let clock = new THREE.Clock();
clock.start();
let time = clock.startTime;
function animate (time: number) {
  requestAnimationFrame(animate)
  vertexNoise(primaryPlane, time)
  renderer.render(scene, camera);
}

animate(time)

let btnState = false;
const planeHD = createPlane(500)

let scrollCounter = 0;


@Component({
  selector: 'app-render',
  template: `
  Button State: {{click}}
  `,
  templateUrl: './render.component.html',
  styleUrls: ['./render.component.css']
})
export class RenderComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  @HostListener('document:wheel', ['$event'])
  onScrollEvent($event: any) {
    if($event.deltaY > 0){
      light.intensity += 0.01
      light.translateY(-1)
      light.translateX(-1)
      light.translateZ(0.5)
    }
    if ($event.deltaY < 0){
      light.intensity -= 0.01
      light.translateY(1)
      light.translateX(1)
      light.translateZ(-0.5)
    }
  }
  
  toggleHD() {
    btnState = !btnState
    console.log(btnState)
    console.log(plane)
    if (btnState) {
      primaryPlane = planeHD;
      scene.clear()
      scene.add(planeHD, light)
    }
    else {
      primaryPlane = plane;
      scene.clear()
      scene.add(plane, light)
    }
  }
 
}
