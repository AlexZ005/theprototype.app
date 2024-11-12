<script lang="ts">
	import { T, useTask, useThrelte } from '@threlte/core';
	import { interactivity, OrbitControls, TransformControls } from '@threlte/extras';
	import { spring } from 'svelte/motion';
	import { peers, username,userdata } from '../stores/appStore';
	import Grid from '../extensions/Grid.svelte';
	import Outline from './Outline.svelte'

	let { scene } = useThrelte();
	// Store for global scene variables
	import { globalScene, objectsGroup, showGrid, TControls, selectedObject } from '../stores/sceneStore.js';
	$globalScene = scene; // console.log($globalScene)

	$username = localStorage.getItem('username');
	$userdata.push([$peers.peer.id, localStorage.getItem('username'), localStorage.getItem('avatar')]);
	$userdata = $userdata;

	$showGrid = localStorage.getItem('showGrid') === 'false' ? false : true;

	interactivity();
	const scale = spring(0.5);
	let rotation = 0;
	useTask((delta) => {
		rotation += 0.25 * delta;
	});

	function oncreate() { $TControls.visible = false; }
	function onchange() {
		//This would update reactively the object properties UI
		$selectedObject = $selectedObject // Trigger reactivity
		if (typeof $TControls.object !== 'undefined')
			if (typeof $TControls.object.parent !== 'undefined')
				if ($TControls.object.parent.name === 'sceneObjects') {
					$TControls.visible = true;
					$peers.send({
						type: 'move',
						uuid: $TControls.object.uuid,
						pos: $TControls.object.position.toArray(),
						rot: $TControls.object.rotation.toArray(),
						scale: $TControls.object.scale.toArray()
					});
				}
	}
</script>

<T.PerspectiveCamera makeDefault position={[-10, 10, 10]} fov={15}>
	<OrbitControls enableZoom={false} enableDamping autoRotateSpeed={0.5} target.y={1.5} />
</T.PerspectiveCamera>

<T.DirectionalLight position={[0, 10, 10]} castShadow />

<T.Mesh
	rotation.y={rotation}
	position.y={1}
	scale={$scale}
	on:pointerenter={() => scale.set(1.5)}
	on:pointerleave={() => scale.set(1)}
	castShadow
>
	<T.BoxGeometry args={[1, 2, 1]} />
	<T.MeshStandardMaterial color="lightblue" />
</T.Mesh>

<T.Mesh rotation.x={-Math.PI / 2} receiveShadow>
	<T.CircleGeometry args={[4, 40]} />
	<T.MeshStandardMaterial color="white" />
</T.Mesh>

<T.Group bind:ref={$objectsGroup} name="sceneObjects" />

<Grid showGrid={$showGrid} />

<TransformControls bind:controls={$TControls} {onchange} {oncreate} />

<Outline />
