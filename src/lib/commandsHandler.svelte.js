import * as THREE from 'three';
import { globalScene, objectsGroup, showGrid, TControls, lockedObjects, selectedObject } from '../stores/sceneStore.js';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { createGeometry, createLight } from '$lib/geometries.svelte'
import { addMessage, loading, loadingcount, showToast } from '../stores/appStore';
import { peers, userdata } from '../stores/appStore';

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

//Access userdata
let users = $state();
userdata.subscribe(value => { users = value });

const loader = new THREE.ObjectLoader();

export function userData(data) {
    data.forEach(element => {
        console.log('received new approved host : ' + element[0])
        if (!users.some(u => u[0] === element[0]))
            users.push(element)
        else
        {
            let index = users.findIndex(u => u[0] === element[0]);
            if (element[1] != '') users[index][1] = element[1];
            if (element[2] != '') users[index][2] = element[2];
        }

    })
    userdata.set(users);

    //Trigger reactivity for UI list of objects
    userdata.update((value) => value);
}

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
        else if (command.startsWith('/light')) {
                let uuid = createLight(command);
                console.log(uuid + ' created');
                if(uuid != null)
                peer.send({type: 'light', command: command, uuid: uuid});
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

export function lockRestore(lockeditems) {
    // Filter out the current peer id locks
    locked = locked.concat(lockeditems.filter((lock) => lock[0] != peer.peer.id));
    // Update the locked objects store
    lockedObjects.set(locked);
}

export function handleDisconnected(peerId) {
    console.log(peerId + ' disconnected');
    showToast(peerId + ' disconnected');
    users = users.filter(u => u[0] !== peerId);
    userdata.set(users);
    userdata.update((value) => value);

}

export function checkLocks(data) {


    console.log(users);
    console.log("this.connections")
    console.log(peer.peer.connections)

    setTimeout(() => {

    users.forEach(user => {
        const connection = peer.peer.connections[user[0]];
        if (user[0] === peer.peer.id) return true; // ignore current peerId
        if (!connection || connection.length < 1) {
            peer.send({type: 'disconnected', peerId: user[0]});
            console.log("send disconnect of " + user[0])
            users = users.filter(u => u[0] !== user[0]);
            userdata.set(users);
            userdata.update((value) => value);
        }
    });
        
        }, 500)


    console.log(peer.peer.connections);
    
    locked.forEach((objectLock) => {

        if(!peer.peer.connections[objectLock[0]]) {
            console.log('Connection ' + objectLock[0] + ' not found. Releasing...');
            locked = locked.filter((lockedUuid) => lockedUuid[1] === objectLock[1]);
        } else if(peer.peer.connections[objectLock[0]].length <= 1) {
            console.log('Peer ' + objectLock[0] + ' is not connected anymore. Releasing...' + objectLock[1]);
            locked = locked.filter((lockedUuid) => lockedUuid[1] != objectLock[1]);
        }
        lockedObjects.set(locked);

    })
    
}

export async function createLoader(count, uuids) {
    console.log("create loader for " + count + " objects: " + uuids);
    loading.set(uuids);
    loadingcount.set(count);
    //Trigger reactivity for UI list of objects on remote
    loading.update((value) => value);
    //Trigger reactivity for UI list of objects on remote
    loadingcount.update((value) => value);
}

export async function colorObject(uuid, color, near, far) {
    if (uuid == 'background') {
        scene.background = new THREE.Color(color);
    } else if (uuid = 'fog') {
        if (near != null && far != null)
        scene.fog = new THREE.Fog(color, near, far);
        else
        scene.fog = null;
    } else {
        let mesh = sceneObjects.getObjectByProperty('uuid', uuid);
        if (mesh) mesh.material.color.set(color);
    }
}

export async function deleteObject(uuid) {
    if(selected.uuid == uuid) controls.detach();
    sceneObjects.remove(sceneObjects.getObjectByProperty('uuid', uuid));
    //Trigger reactivity for UI list of objects on remote
    objectsGroup.update((value) => value);
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
          loader.parse(object.element, '', (gltf) => resolve(gltf), (error) => reject(error));
        });
        result.scene.uuid = uuid
        result.scene.children.forEach((object, index) => {
          let mesh = object.clone()
          mesh.uuid = uuid[index]
          object.uuid = uuid[index]
          if (sceneObjects.getObjectByProperty('uuid', mesh.uuid) == null || override)
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
        let uuids = [];
        sceneObjects.children.forEach(element => {
            uuids.push(element.uuid)
        })
  
        // Send amount of objects to be sent and their uuids
        conn.send({type: 'loading', count: sceneObjects.children.length, uuids: uuids});

        // Iterate over all objects in the scene
        sceneObjects.children.forEach(element => {
            if (element.type.endsWith('Light')) {
                // Send each object as a JSON object
                conn.send({type: 'object', element: element.toJSON()})
            } else {
                const exporter = new GLTFExporter({outputEncoding: 'json'});
                exporter.parse(
                    element,
                    function (result) {
                        console.log('packing gltf');
                        conn.send({type: 'object', element: result, uuids: [element.uuid]})
                    },
                    function (error) {
                        console.log(error);
                    }
                );                
            }
        })
    }, 500);
}


