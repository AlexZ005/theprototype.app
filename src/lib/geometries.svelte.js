import * as THREE from 'three';
import { globalScene, objectsGroup, TControls, lockedObjects, selectedObject } from '../stores/sceneStore.js';

//Access scene Store
let scene = $state();
globalScene.subscribe(value => { scene = value });

//Access objects Store
let sceneObjects = $state();
objectsGroup.subscribe(value => { sceneObjects = value });

//Access object controls
let controls = $state();
TControls.subscribe(value => { controls = value });

//Access locked objects
let locked = $state();
lockedObjects.subscribe(value => { locked = value });

/**
 * Creates a THREE.js geometry object based on the given command string.
 * The geometry name is extracted from the command string, and the options
 * are passed as an array of strings to the geometry constructor.
 *
 * @param {string} command - The command string to parse, e.g. "/create sphere 1 2 3"
 * @param {string} uuid - The UUID to assign to the created geometry (optional)
 * @returns {string|null} The UUID of the created geometry, or null if the geometry is invalid
 */

export function createGeometry(command, uuid) {
    let geometry = command.split(' ')[1]
    geometry = geometry.charAt(0).toUpperCase() + geometry.slice(1)
    let options = [command.split(' ')[2],command.split(' ')[3],command.split(' ')[4],command.split(' ')[5]]
    let geometryList = ["Box","Capsule","Circle","Cone","Cylinder","Dodecahedron","Edges","Extrude","Icosahedron","Lathe","Octahedron","Plane","Polyhedron","Ring","Shape","Sphere","Tetrahedron","Torus","TorusKnot","Tube","Wireframe"]
    if (geometryList.includes(geometry)) {
        let mesh = new THREE[geometry+'Geometry'](options[0],options[1],options[2],options[3]);
        let material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        let object = new THREE.Mesh(mesh, material);
        if (uuid) object.uuid = uuid
        object.name = geometry;
        sceneObjects.add(object);
        //Trigger reactivity for UI list of objects
        objectsGroup.update((value) => value);
        console.log('createGeometry: ' + geometry);
        if (!uuid) controls.attach(object);
        if (!uuid) selectedObject.set(object);
        return object.uuid
    } else {
        console.log('Invalid geometry: ' + geometry);
        return null
    }
}

export function moveGeometry(uuid, pos, rot, scale) {
    if(sceneObjects.getObjectByProperty('uuid', uuid)) {
        sceneObjects.getObjectByProperty('uuid', uuid).position.set(pos[0], pos[1], pos[2]);
        sceneObjects.getObjectByProperty('uuid', uuid).rotation.set(rot[0], rot[1], rot[2]);
        sceneObjects.getObjectByProperty('uuid', uuid).scale.set(scale[0], scale[1], scale[2]);
    }
}

/**
 * Locks an object by changing its material color and updating the locked list.
 * 
 * @param {string} uuid - The unique identifier of the geometry object to lock.
 * @param {string} peerId - The unique identifier of the peer requesting the lock.
 */
export function lockGeometry(uuid, peerId) {
    // Check if the object with the given UUID exists
    if (sceneObjects.getObjectByProperty('uuid', uuid)) {
        // Check if there are any currently locked objects
        if (locked.length != 0) {
            // Check if the peer has already locked an object
            let existingLock = locked.find((lockedUuid) => lockedUuid[0] === peerId);
            if (existingLock) {
                let oldUuid = existingLock[1];
                // Change the material of the previously locked object to green
                sceneObjects.getObjectByProperty('uuid', oldUuid).material = new THREE.MeshBasicMaterial({
                    color: 0x00ff00
                });
                // Change the material of the newly locked object to a darker green
                sceneObjects.getObjectByProperty('uuid', uuid).material = new THREE.MeshBasicMaterial({
                    color: 0x003500
                });
                // Update the locked array by removing the old lock and adding the new one
                locked = locked.filter((lockedUuid) => lockedUuid[0] != peerId);
                locked.push([peerId, uuid]);
            } else {
                // If the peer hasn't locked an object, lock the new one
                locked.push([peerId, uuid]);
                sceneObjects.getObjectByProperty('uuid', uuid).material = new THREE.MeshBasicMaterial({
                    color: 0x003500
                });
            }
        } else {
            // If there are no locked objects, simply lock the new one
            locked.push([peerId, uuid]);
            sceneObjects.getObjectByProperty('uuid', uuid).material = new THREE.MeshBasicMaterial({
                color: 0x003500
            });
        }
        // Update the locked objects store
        lockedObjects.set(locked);
    }
}
