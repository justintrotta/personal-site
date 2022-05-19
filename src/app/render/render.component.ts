import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, Input } from '@angular/core';
import * as THREE from "three";

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'
import Stats from 'three/examples/jsm/libs/stats.module'

// Create THREE scene
const scene = new THREE.Scene();
scene.add(new THREE.AxesHelper(5))

// Scene Lighting
const light = new THREE.PointLight();
light.position.set(0, 0, 13)
light.intensity = 2
scene.add(light);

const ambinetLight = new THREE.AmbientLight();
scene.add(ambinetLight);

// Scene Camera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
)

camera.position.set(0, 8, 13)


// Create & Initialize Renderer
const renderer= new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

// Scene Camera Controls
const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true
controls.target.set(0, 1, 0)


// Load FBX Model
// const fbxLoader = new FBXLoader()
// fbxLoader.load(
//   '../assets/xbot.fbx',
//   (object) => {
//     object.traverse(function (child) {
//       if ((child as THREE.Mesh).isMesh) {
//         if ((child as THREE.Mesh).material) {
//           ((child as THREE.Mesh).material as THREE.MeshBasicMaterial).transparent = false
//         }
//       }
//     })
//     scene.add(object)
//   },
//   (xhr) => {
//     console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
//   },
//   (error) => {
//       console.log(error)
//   }
// )

// Generate Terrain
function createGround() {
  const groundGeo = new THREE.PlaneGeometry(1000, 1000, 1500, 1500)
  const displacementMap = new THREE.TextureLoader().load("../assets/difmap.jpeg")
  const normalMap = new THREE.TextureLoader().load("../assets/NormalMap.jpg")
  const colorMap = new THREE.TextureLoader().load("../assets/colormap.png")

  const groundMat = new THREE.MeshStandardMaterial({
    color: "white",
    wireframe: false,
    displacementMap: displacementMap,
    displacementScale: 300,
    normalMap: normalMap,
    map: colorMap,
    metalness: 0.2, 
  })

  let groundMesh = new THREE.Mesh(groundGeo, groundMat)
  scene.add(groundMesh)
}

createGround();

scene.background = new THREE.Color("#87CEEB")

// Keep renderer same size as window
window.addEventListener('resize', onWindowResize, false)

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
  render()
}
const stats = Stats();
document.body.appendChild(stats.dom)


// Animation and render call
function animate() {
  requestAnimationFrame(animate)

  controls.update()

  render()

  stats.update();
}

function render() {
  renderer.render(scene, camera)
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
