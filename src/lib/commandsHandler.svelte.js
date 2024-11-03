import * as THREE from 'three';
import { globalScene, objectsGroup, showGrid, TControls, lockedObjects, selectedObject } from '../stores/sceneStore.js';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { createGeometry } from '$lib/geometries.svelte'
import { addMessage } from '../stores/appStore';
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

//Access object controls
let controls = $state();
TControls.subscribe(value => { controls = value });

//Access locked objects
let locked = $state();
lockedObjects.subscribe(value => { locked = value });

//Access selected object
let selected = $state();
selectedObject.subscribe(value => { selected = value });

const loader = new THREE.ObjectLoader();

export function sceneCommand(command) {
    if (command.startsWith('/')) {
        console.log('Executing command: ' + command);
        if (command.startsWith('/clear')) {
            if (command.split(' ')[1] == 'all')
            {
                controls.detach();
                sceneObjects.clear();
            } else {
                sceneObjects.remove(sceneObjects.getObjectByProperty('uuid', command.split(' ')[1]));
                peer.send({type: 'delete', uuid: command.split(' ')[1], peerId: peer.peer.id});
            }
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
                let uuid = createGeometry(command);
                console.log(uuid + ' created');
                if(uuid != null)
                peer.send({type: 'create', command: command, uuid: uuid});
                peer.send({type: 'lock', uuid: uuid, peerId: peer.peer.id});
        }
        else if (command.startsWith('/transform')) {
            const regex = /(\translate|\.rotate|\.scale)/i;
		    if (!regex.test(command.split(' ')[1]))
            controls.setMode( command.split(' ')[1])
            else
            console.log('Invalid command: ' + command);
        }
        else if (command.startsWith('/select')) {
            let uuid = command.split(' ')[1]
            if(sceneObjects.getObjectByProperty( 'uuid' , uuid) != null) {
                console.log(locked.filter(lockedUuid => lockedUuid[1] === uuid));
                if(locked.length != 0){
                    console.log(locked)
                    if(!locked.filter(lockedUuid => lockedUuid[1] === uuid)) {
                        controls.attach(sceneObjects.getObjectByProperty( 'uuid' , uuid));
                        peer.send({type: 'lock', uuid: command.split(' ')[1], peerId: peer.peer.id});
                    } else {
                        console.log('Object ' + uuid + ' already locked by ' + locked.find(lockedUuid => lockedUuid[1] === uuid)[0]);
                    }
                } else {
                    controls.attach(sceneObjects.getObjectByProperty( 'uuid' , uuid));
                    peer.send({type: 'lock', uuid: command.split(' ')[1], peerId: peer.peer.id});
                }
            }
            else
            console.log('Object uuid not found: ' + command.split(' ')[1]);
        }
        else if (command.startsWith('/list')) {
            addMessage({message: "List of objects:", type: '', sender: 'SYSTEM'});
            sceneObjects.children.forEach((mesh, index) => {
                addMessage({message: 'name: \"' + mesh.name + '\" uuid: ' + mesh.uuid, type: 'info', sender: index})
            }
        );
        }
    }
    //Trigger reactivity for UI list of objects
    objectsGroup.update((value) => value);
}

export function checkLocks(data) {

    console.log(peer.peer.connections);
    
    locked.forEach((objectLock) => {

        if(!peer.peer.connections[objectLock[0]]) {
            console.log('Connection ' + objectLock[0] + ' not found. Releasing...');
            sceneObjects.getObjectByProperty('uuid', objectLock[1]).material = new THREE.MeshBasicMaterial({
                color: 0x00ff00
            });
            locked = locked.filter((lockedUuid) => lockedUuid[1] === objectLock[1]);
        } else if(peer.peer.connections[objectLock[0]].length <= 1) {
            console.log('Peer ' + objectLock[0] + ' is not connected anymore. Releasing...' + objectLock[1]);
            sceneObjects.getObjectByProperty('uuid', objectLock[1]).material = new THREE.MeshBasicMaterial({
                color: 0x00ff00
            });
            locked = locked.filter((lockedUuid) => lockedUuid[1] != objectLock[1]);
        }
        lockedObjects.set(locked);

    })
    
}

export async function deleteObject(uuid) {
    if(selected.uuid == uuid) controls.detach();
    sceneObjects.remove(sceneObjects.getObjectByProperty('uuid', uuid));
}

export async function createObject(object, uuid, override) {
    if (uuid == null) {
    let mesh = loader.parse(object.element);
    if (override)
    sceneObjects.remove(sceneObjects.getObjectByProperty('uuid', mesh.uuid));
    if (sceneObjects.getObjectByProperty('uuid', mesh.uuid) == null || override)
    sceneObjects.add(mesh);
    } else {
        console.log("Adding GLTF object " + uuid)
        const loader = new GLTFLoader();
        const result = await new Promise((resolve, reject) => {
          loader.parse(object.object, '', (gltf) => resolve(gltf), (error) => reject(error));
        });
        console.log(result)
        result.scene.uuid = uuid
        result.scene.children.forEach((object, index) => {
          let mesh = object.clone()
          mesh.uuid = uuid[index]
          object.uuid = uuid[index]
          console.log(object.name)
          sceneObjects.add(mesh)
        });
    }
    //Trigger reactivity for UI list of objects
    objectsGroup.update((value) => value);
}

/**
 * Sends all objects in the scene to the given peer.
 * @param {string} peerId - The ID of the peer to send the objects to.
 */
export function sendObjects(peerId) {
    const conn = peer.connections[peerId];
    console.log("Sending objects to " + conn.peer);
    // Wait 500ms to ensure the connection is established before sending the objects
    setTimeout(() => {
        // Iterate over all objects in the scene
        sceneObjects.children.forEach(element => {
            if (element.isMesh) {
            // Send each object as a JSON object
            conn.send({type: 'object', element: element.toJSON()})
            } else {
                const exporter = new GLTFExporter({outputEncoding: 'json'});
                exporter.parse(
                    element,
                    function (result) {
                        var blob = new Blob([JSON.stringify(result)], { type: 'application/json' });
                        conn.send({type: 'object', element: blob, uuids: [element.uuid]})
                    },
                    function (error) {
                        console.log(error);
                    }
                );                
            }
        })
    }, 500);
}


