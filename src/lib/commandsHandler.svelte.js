import * as THREE from 'three';
import { globalScene, objectsGroup, showGrid } from '../stores/sceneStore.js';
import { createGeometry } from '$lib/geometries.svelte'
import { peers } from '../stores/appStore';

//Access scene Store
let scene = $state();
globalScene.subscribe(value => { scene = value });

//Access objects Store
let sceneObjects = $state();
objectsGroup.subscribe(value => { sceneObjects = value });

//Access peers Store
let peer = $state();
peers.subscribe(value => { peer = value });

export function sceneCommand(command) {
    if (command.startsWith('/')) {
        console.log('Executing command: ' + command);
        if (command.startsWith('/clear')) {
            if (command.split(' ')[1] == 'all')
                sceneObjects.clear();
        }
        else if (command.startsWith('/grid')) {
            if (command.split(' ')[1] == 'on')
            {
                showGrid.set(true);
                localStorage.removeItem('showGrid')
            }
            else if (command.split(' ')[1] == 'off')
            {
                showGrid.set(false);
                localStorage.setItem('showGrid', false);
            }
        }
        else if (command.startsWith('/create')) {
                createGeometry(command);
                peer.send({type: 'create', command: command});
        }
    }
}

