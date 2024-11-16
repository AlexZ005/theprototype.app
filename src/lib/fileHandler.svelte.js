import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';
import { objectsGroup } from '../stores/sceneStore.js';
import { peers } from '../stores/appStore';

//Access objects Store
let sceneObjects = $state();
objectsGroup.subscribe(value => { sceneObjects = value });

//Access peers Store
let peer = $state();
peers.subscribe(value => { peer = value });

export function save(format) {
	console.log('Saving...');        
	//This exports entire scene with all objects
	const exporter = new GLTFExporter({outputEncoding: format});
	exporter.parse(
		sceneObjects,
		function (result) {
			var blob = new Blob([JSON.stringify(result)], { type: 'application/json' });
			let a = document.createElement('a');
			document.body.appendChild(a);
			a.style = 'display: none';
			let url = window.URL.createObjectURL(blob);
			a.href = url;
			let date = new Date().toISOString().replace(/[T:.Z]/g, '-');
			a.download = `ThePrototype-${date}UTC.${format.toLocaleLowerCase()}`;
			a.click();
			window.URL.revokeObjectURL(url);
		},
		function (error) {
			console.log(error);
		}
	);
}

export async function importFile(file) {
	try {
		const reader = new FileReader();
		reader.readAsArrayBuffer(file);
		await new Promise((resolve, reject) => {
			reader.onload = () => resolve(reader.result);
			reader.onerror = () => reject(reader.error);
		});

		// const json = JSON.parse(reader.result);
		const loader = new GLTFLoader();

		loader.parse(reader.result, '', function (result) {
			const scene = result.scene;
			sceneObjects.add(scene);
		});
		//Trigger reactivity for UI list of objects
		objectsGroup.update((value) => value);
	} catch (error) {
		console.error('Error importing file:', error);
	}
}

export async function load(file) {
try {
	const reader = new FileReader();
	reader.readAsText(file);
	await new Promise((resolve, reject) => {
		reader.onload = () => resolve(reader.result);
		reader.onerror = () => reject(reader.error);
	});
	const json = JSON.parse(reader.result);
	const loader = new GLTFLoader();
	const result = await new Promise((resolve, reject) => {
		loader.parse(
			json,
			'',
			(gltf) => resolve(gltf),
			(error) => reject(error)
		);
	});

    if (file.name.split('.').pop() == 'gltf') {
    let uuids = []
    result.scene.children.forEach(object => {
      let mesh = object.clone()
      uuids.push(mesh.uuid)
      console.log(object.name)
      sceneObjects.add(mesh)
    });
    //Trigger reactivity for UI list of objects
    objectsGroup.update((value) => value);
    //Send object to peers
    peer.send({type: 'object', element: json, uuids: uuids})
    } else if (file.name.split('.').pop() == 'json') {
	//AuxScene is default name for GLTFExporter
	const childs = result.scene.getObjectByName('AuxScene').children[0].children;

	// adding objectArray as mid transition
	// otherwise the child becomes undefined after third iteration, causing an error
	let objectsArray = []; //initialize object array
	childs.forEach((child) => {
		objectsArray.push(child);
	});
	objectsArray.forEach((child) => {
		sceneObjects.add(child);
        //Send object to peers
        peer.send({type: 'object', element: child.toJSON()})
	});
	//Trigger reactivity for UI list of objects
	objectsGroup.update((value) => value);
	// Free memory by emptying the array
	objectsArray.length = 0;
	console.log('Scene load complete');
	return result;
}
} catch (error) {
    console.error('Error loading scene:', error);
}
}
