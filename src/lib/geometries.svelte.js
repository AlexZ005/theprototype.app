import * as THREE from 'three';
import { globalScene, objectsGroup, TControls } from '../stores/sceneStore.js';

//Access scene Store
let scene = $state();
globalScene.subscribe(value => { scene = value });

//Access objects Store
let sceneObjects = $state();
objectsGroup.subscribe(value => { sceneObjects = value });

//Access object controls
let controls = $state();
TControls.subscribe(value => { controls = value });

export function createGeometry(command) {
    let geometry = command.split(' ')[1]
    geometry = geometry.charAt(0).toUpperCase() + geometry.slice(1)
    let options = [command.split(' ')[2],command.split(' ')[3],command.split(' ')[4],command.split(' ')[5]]
    let geometryList = ["Box","Capsule","Circle","Cone","Cylinder","Dodecahedron","Edges","Extrude","Icosahedron","Lathe","Octahedron","Plane","Polyhedron","Ring","Shape","Sphere","Tetrahedron","Torus","TorusKnot","Tube","Wireframe"]
    if (geometryList.includes(geometry)) {
        let mesh = new THREE[geometry+'Geometry'](options[0],options[1],options[2],options[3]);
        let material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        let object = new THREE.Mesh(mesh, material);
        object.name = geometry;
        sceneObjects.add(object);
        console.log('createGeometry: ' + geometry);
        controls.attach(object);
    } else {
        console.log('Invalid geometry: ' + geometry);
    }
}
