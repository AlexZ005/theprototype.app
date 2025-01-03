import * as THREE from 'three';
import { globalScene, objectsGroup, showGrid, TControls, lockedObjects, selectedObject, globalCamera } from '../stores/sceneStore.js';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { createGeometry, createLight, createGroup } from '$lib/geometries.svelte'
import { addMessage, loading, loadingcount, showToast, fixLight, specatorMode } from '../stores/appStore';
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

//Access specatorMode
let specating = $state();
specatorMode.subscribe(value => { specating = value });

//Access globalCamera
let camera = $state();
globalCamera.subscribe(value => { camera = value });

const loader = new THREE.ObjectLoader();

let uuids = [];

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

export function specator(data, specator) {
    if ( specator === 'false') {
        let index = users.findIndex(u => u[0] === data.peerId);
        users[index][3] = null;
        return;
    }
    scene.getObjectByName(data.peerId).position.set(0, 1000, 0);
    let index = users.findIndex(u => u[0] === data.peerId);
    users[index][3] = specator;
}

export function cameraSettings(data) {
    // console.log('peer sent camera settings: ' + data.fov);
    if ( data.fov ) {
        let index = users.findIndex(u => u[0] === data.peerId);
        users[index][4] = data.fov;
        //update camera fov if watching peer camera
        if (specating === data.peerId)
        {
            camera.fov = data.fov;
            camera.updateProjectionMatrix();
        }
    }

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
                let object = sceneObjects.getObjectByProperty('uuid', command.split(' ')[1])
                if (object != null) sceneObjects.remove(object);
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

                let checklight = sceneObjects.getObjectByProperty('type', 'HemisphereLight')
                console.log(checklight);
                if (typeof checklight === 'undefined') {
                    checklight = sceneObjects.getObjectByProperty('type', 'AmbientLight')
                    if (typeof checklight === 'undefined') checklight = sceneObjects.getObjectByProperty('type', 'DirectionalLight')
                        if (typeof checklight === 'undefined') {
                            console.log('No light found, adding default light');
                            // showToast('No light found, adding default light');
                            fixLight.set(true);
                        }
                }
    
        }
        else if (command.startsWith('/light')) {
                let uuid = createLight(command);
                console.log(uuid + ' created');
                if(uuid != null)
                peer.send({type: 'light', command: command, uuid: uuid});
                peer.send({type: 'lock', uuid: uuid, peerId: peer.peer.id});
        }
        else if (command.startsWith('/group')) {
                let uuid = createGroup(command);
                console.log(uuid + ' created');
                if(uuid != null)
                peer.send({type: 'group', command: command, uuid: uuid});
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
    // console.log("create loader for " + count + " objects: " + uuids);
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
    } else if (uuid == 'fog') {
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
    let object = sceneObjects.getObjectByProperty('uuid', uuid)
    object.parent?.remove(object);
    if(selected.uuid == uuid) controls.detach();
    sceneObjects.remove(sceneObjects.getObjectByProperty('uuid', uuid));
    //Trigger reactivity for UI list of objects on remote
    objectsGroup.update((value) => value);
}


export async function createObject(object, uuid, override, groupuuid, pos, rot, scale) {
    if (uuid == null) {
    let mesh = loader.parse(object.element);
    if (override)
    sceneObjects.remove(sceneObjects.getObjectByProperty('uuid', mesh.uuid));
    if (sceneObjects.getObjectByProperty('uuid', mesh.uuid) == null || override)
    sceneObjects.add(mesh);
    } else {
        // console.log("Adding GLTF object " + uuid)
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
            if (groupuuid){
                let group = sceneObjects.getObjectByProperty('uuid', groupuuid)
                group.attach(mesh)
                // if (group.parent.parent.parent !== null) {
                // mesh.position.set(0, 0, 0);
                // mesh.rotation.set(0, 0, 0);
                // mesh.scale.set(1, 1, 1);
                // } else {
                if(pos && rot && scale) {
                    mesh.position.set(pos[0], pos[1], pos[2]);
                    mesh.rotation.set(rot[0], rot[1], rot[2]);
                    mesh.scale.set(scale[0], scale[1], scale[2]);
                }
            }
        });
    }
    //Trigger reactivity for UI list of objects
    objectsGroup.update((value) => value);
}

/**
 * Sends all objects in the scene to the given peer.
 * @param {string} peerId - The ID of the peer to send the objects to.
 */
export function sendObjects(peerId, element) {
    let conn; let groupid;
    if (peerId === null) {
        groupid = element.uuid;
        conn = peer;
        conn.send({type: 'group', name: element.name, uuid: element.uuid, groupparent: null,
            pos: element.position.toArray(),
            rot: element.rotation.toArray(),
            scale: element.scale.toArray()
        });
    }
    else
    conn = peer.connections[peerId];

    let objects = [];

    // Iterate over all objects in the scene
    let count = countObjects(element);
    console.log("Sending " + count + " objects to " + peerId);

    // Wait 500ms to ensure the connection is established before sending the objects
    setTimeout(() => {
        // Send amount of objects to be sent and their uuids
        conn.send({type: 'loading', count: count, uuids: uuids});
        sendObject(conn, element, groupid);
        uuids = [];
    }, 500);

}

function sendObject(conn, element, groupuuid) {
    let objects = [];
    let test = new THREE.Vector3();
    if (typeof element !== 'undefined') {
        objects = element.children;
    } else {
        objects = sceneObjects.children;
    }
    // Iterate over all objects in the scene
    objects.forEach(element => {
        if (element.type == "Group") {
            if (element.parent.parent.parent !== null) {
                groupuuid = element.parent.uuid
                console.log("group uuid: " + groupuuid);
            }
            element.getWorldPosition(test);
            conn.send({
                type: 'group',
                name: element.name,
                uuid: element.uuid,
                groupparent: groupuuid,
                pos: test.toArray(),
                rot: element.rotation.toArray(),
                scale: element.scale.toArray()
            });
            sendObject(conn, element, element.uuid, groupuuid);
        } else if (element.type.endsWith('Light')) {
            element.getWorldPosition(test);
            // Send each object as a JSON object
            conn.send({
                type: 'object',
                element: element.toJSON(),
                pos: test.toArray(),
                rot: element.rotation.toArray(),
                scale: element.scale.toArray()
            });
        } else {
            const exporter = new GLTFExporter({outputEncoding: 'json'});
            exporter.parse(
                element,
                function (result) {
                    console.log('packing gltf');
                    element.getWorldPosition(test);
                    // if (element.name === "Rug001")
                        // console.log("Rug001 pos: " + element.position.x + " " + element.position.y + " " + element.position.z)
                    // if (groupuuid) console.log("group uuid " + groupuuid + ' ' + ' ' + element.name);
                    conn.send({
                        type: 'object',
                        element: result,
                        uuids: [element.uuid],
                        groupuuid: groupuuid,
                        pos: element.position.toArray(),
                        rot: element.rotation.toArray(),
                        scale: element.scale.toArray()
                    });
                },
                function (error) {
                    console.log(error);
                }
            );                
        }
    })

}

function countObjects(element) {
    let objects = [];
    if (typeof element !== 'undefined') {
        objects = element.children;
    } else {
        objects = sceneObjects.children;
    }
    objects.forEach(element => {
        if (element.type == "Group") {
            countObjects(element);
        }
        uuids.push(element.uuid)
    })
    // console.log(uuids.length)
    return uuids.length;
}
