import * as THREE from 'three';
import { globalScene, objectsGroup, showGrid, TControls, lockedObjects } from '../stores/sceneStore.js';
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

const loader = new THREE.ObjectLoader();

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

export function createObject(object) {
    let mesh = loader.parse(object.element);
    if (sceneObjects.getObjectByProperty('uuid', mesh.uuid) == null)
    sceneObjects.add(mesh);
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
            // Send each object as a JSON object
            conn.send({type: 'object', element: element.toJSON()})
        })
    }, 500);
}

