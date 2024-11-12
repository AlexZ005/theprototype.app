<script lang="ts">
	import { objectsGroup, selectedObject, lockedObjects } from '../stores/sceneStore.js';
	import { useTask, useThrelte } from '@threlte/core';
	import {
		BlendFunction,
		EffectComposer,
		EffectPass,
		OutlineEffect,
		RenderPass
	} from 'postprocessing';
	import { onMount } from 'svelte';

	let outlineEffectSelected: OutlineEffect | null = null;
	let outlineEffectLocked: OutlineEffect | null = null;

	const { scene, renderer, camera, size, autoRender, renderStage } = useThrelte();
	const composer = new EffectComposer(renderer);
	composer.removeAllPasses();
	composer.addPass(new RenderPass(scene, camera.current));
	outlineEffectSelected = new OutlineEffect(scene, camera.current, {
		blendFunction: BlendFunction.ALPHA,
		edgeStrength: 100,
		pulseSpeed: 0.0,
		visibleEdgeColor: 0x353535,
		hiddenEdgeColor: 0x353535,
		xRay: true,
		blur: true
	});
	outlineEffectLocked = new OutlineEffect(scene, camera.current, {
		blendFunction: BlendFunction.ALPHA,
		edgeStrength: 100,
		pulseSpeed: 0.0,
		visibleEdgeColor: 0x0a0000,
		hiddenEdgeColor: 0x0a0000,
		xRay: true,
		blur: true
	});
  // The order is important as the last added pass will be on top
	composer.addPass(new EffectPass(camera.current, outlineEffectLocked));
	composer.addPass(new EffectPass(camera.current, outlineEffectSelected));
	$effect(() => {
		composer.setSize($size.width, $size.height);
	});
	onMount(() => {
		let before = autoRender.current;
		autoRender.set(false);
		return () => {
			autoRender.set(before);
		};
	});
	useTask(
		(delta) => {
			composer.render(delta);
		},
		{ stage: renderStage, autoInvalidate: false }
	);
	$effect(() => {
		if ($selectedObject.type) {
			outlineEffectSelected.selection.clear();
			outlineEffectSelected.selection.add($selectedObject);
		}
		if ($lockedObjects) {
			outlineEffectLocked.selection.clear();
			for (let i = 0; i < $lockedObjects.length; i++) {
				let mesh = $objectsGroup.getObjectByProperty('uuid', $lockedObjects[i][1]);
				outlineEffectLocked.selection.add(mesh);
			}
		}
	});
</script>
