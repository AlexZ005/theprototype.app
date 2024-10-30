import * as THREE from 'three';
import { globalScene, objectsGroup, showGrid } from '../stores/sceneStore.js';

//Access scene Store
let scene = $state();
globalScene.subscribe(value => { scene = value });

//Access objects Store
let sceneObjects = $state();
objectsGroup.subscribe(value => { sceneObjects = value });

export function sceneCommand(command) {
    if (command.startsWith('/')) {
        console.log('Executing command: ' + command);
        if (command.startsWith('/clear')) {
            if (command.split(' ')[1] == 'all')
                sceneObjects.clear();
        }
        else if (command.startsWith('/grid')) {
            if (command.split(' ')[1] == 'on')
                showGrid.set(true);
            else if (command.split(' ')[1] == 'off')
                showGrid.set(false);
        }
        else if (command.startsWith('/create')) {
            if (command.split(' ')[1] == 'cube') {
                if (command.split(' ')[2] && command.split(' ')[3] && command.split(' ')[4]) {
                    createCube(command.split(' ')[2], command.split(' ')[3], command.split(' ')[4]);
                } else {
                    createCube();
                }   
            }
        }
    }
}

function createCube(x,y,z) {
    let mesh = new THREE.BoxGeometry(x, y, z);
    let material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    let cube = new THREE.Mesh(mesh, material);
    sceneObjects.add(cube);
}
