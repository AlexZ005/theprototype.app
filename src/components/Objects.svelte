<script lang="ts">
	import * as THREE from 'three';

	import { globalScene, objectsGroup, TControls } from '../stores/sceneStore.js';
	// $: console.log($globalScene)

	export function clear() {
		// console.log($globalScene);
		$objectsGroup.clear();
		console.log('Clear objects');
	}

	export function addCube() {
		let mesh = new THREE.BoxGeometry(2, 2, 2);
		let material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
		let cube = new THREE.Mesh(mesh, material);
		cube.name = "cube"
		$objectsGroup.add(cube);
		console.log($globalScene.getObjectByName("cube"));
		$TControls.attach(cube);
	}

	export function addCone() {
		let mesh = new THREE.ConeGeometry(2, 2, 64);
		let material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
		let cone = new THREE.Mesh(mesh, material);
		$objectsGroup.add(cone);
		$TControls.attach(cone);
	}

	export function addSphere() {
		let mesh = new THREE.IcosahedronGeometry(1, 8);
		let material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
		let cone = new THREE.Mesh(mesh, material);
		$objectsGroup.add(cone);
		$TControls.attach(cone);
	}
</script>
