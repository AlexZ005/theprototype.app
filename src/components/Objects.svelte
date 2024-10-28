<script lang="ts">
	import * as THREE from 'three';

	import { globalScene } from '../stores/sceneStore.js';
	// $: console.log($globalScene)

	export function clear() {
		// console.log($globalScene);
		$globalScene.clear()
		console.log('Clear objects');
	}

    export function addCube() {
        let mesh = new THREE.BoxGeometry(2, 2, 2);
		let material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
		let cube = new THREE.Mesh(mesh, material);
		$globalScene.add(cube);
    }

</script>
