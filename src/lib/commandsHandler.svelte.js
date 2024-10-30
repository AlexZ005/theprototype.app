import { globalScene, objectsGroup } from '../stores/sceneStore.js';

//Access scene Store
let scene = $state();
globalScene.subscribe(value => { scene = value });

//Access objects Store
let sceneObjects = $state();
objectsGroup.subscribe(value => { sceneObjects = value });

export function sceneCommand(command) {
    console.log('Executing command: ' + command);
    console.log(scene)
    scene.clear()
}