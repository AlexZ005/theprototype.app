<script lang="ts">
	import { BottomNav, Listgroup } from 'flowbite-svelte';
	import { objectsGroup, TControls, isLocked, isVRMode } from '../../stores/sceneStore';
	import { chatHidden } from '../../stores/appStore.js';
	import Objects from './Objects.svelte';
	import { VRButton } from '@threlte/xr'

	let allowPlay = true;
	let resizing = $state(false);
	let classActive =
		'group inline-flex items-center justify-center hover:bg-primary-700 focus:outline-none focus:ring-4 focus:ring-primary-300';

	function dragMe(node) {
		let moving = false;
		let left = 350;
		let top = 100;

		let startX = 0;
		let startY = 0;
		let startWidth = -300;
		let startHeight = -130;

		node.style.position = 'absolute';
		node.style.top = `${top}px`;
		node.style.left = `${left}px`;
		// node.style.cursor = 'move';
		node.style.userSelect = 'none';
		node.style.width = '300px';
		node.style.height = '250px';

		node.addEventListener('mousedown', (e) => {
			if (e.target.classList.contains('resize-handle')) {
				resizing = true;
				startX = 0;
				startY = 0;
			}
			if (e.target.classList.contains('move-handle')) {
				moving = true;
			}
		});

		window.addEventListener('mousemove', (e) => {
			if (moving) {
				left += e.movementX;
				top += e.movementY;
				node.style.top = `${top}px`;
				node.style.left = `${left}px`;
				if (left < 0) left = 0;
				if (top < 0) top = 0;
				if (left > window.innerWidth - node.offsetWidth) left = window.innerWidth - node.offsetWidth;
				if (top > window.innerHeight - node.offsetHeight) top = window.innerHeight - node.offsetHeight;
			}
			if (resizing) {
			const width = startWidth + (e.clientX - startX);
			const height = startHeight + (e.clientY - startY);
			node.style.width = `${width}px`;
			node.style.height = `${height}px`;
			}
		});

		window.addEventListener('mouseup', () => {
			moving = false;
			resizing = false;
		});
	}

	function checkPlay() {
		const vrButton = document.getElementById('vrButton')?.querySelector('button');
		if (vrButton?.textContent === 'Enter VR' && localStorage.getItem('vrOverride') !== 'true') {
			$isVRMode = true;
			vrButton.click();
		} else {
			if ($isLocked === null && allowPlay === true)
			$isLocked	= true
		}
	}

	$effect(() => {
		//Timeout for pointer lock
		//on ESC release have delay
	if ($isLocked === false) {
		$isLocked = null;
		allowPlay = false;
		setTimeout(() => {
			allowPlay = true;
		}, 2000)
	}
	});
</script>

<BottomNav
	position="absolute"
	navType="application"
	classOuter="h-10 w-70 bg-white rounded-full dark:bg-gray-700 z-10"
	classInner="grid-cols-7"
>
	<p class={classActive + ' rounded-l-full'} on:click={(event) => $TControls.setMode('translate')}>
		<i class="fas fa-arrows-alt text-black dark:text-slate-200"></i>
	</p>
	<p class={classActive} on:click={(event) => $TControls.setMode('rotate')}>
		<i class="fas fa-rotate-left text-black dark:text-slate-200"></i>
	</p>

	<p class={classActive} on:click={(event) => $TControls.setMode('scale')}>
		<i class="fas fa-expand-arrows-alt text-black dark:text-slate-200"></i>
	</p>
	<div class="flex items-center justify-center">
		<p
			class={classActive + ' h-10 w-10  bg-primary-600 font-medium dark:focus:ring-primary-800'}
		></p>
	</div>

	<p
		class={classActive}
		on:click={() => document.getElementById('object-list').classList.toggle('hidden')}
	>
		<i class="fas fa-list-ul text-black dark:text-slate-200"></i>
	</p>
	<p
		class={classActive}
		on:click={() => document.getElementById('flow-list').classList.toggle('hidden')}
	>
		<i class="fas fa-circle-nodes text-black dark:text-slate-200"></i>
	</p>
	<p
		class={classActive + ' rounded-r-full'}
		on:click={(event) => {
			chatHidden.set($chatHidden === 'hidden' ? '' : 'hidden');
		}}
	>
		<i class="fas fa-message text-black dark:text-slate-200"></i>
	</p>
</BottomNav>

<p
	class={classActive + ' rounded-full bg-primary-600 font-medium dark:focus:ring-primary-800'}
	style="position: absolute; height: 50px; width: 50px; bottom: 10px; z-index: 11;
        display: flex; left: 50%; transform: translate(-50%,0)"
	on:click={() => {
		checkPlay();
	}}
>
	<i class="fas fa-play text-black hover:scale-110 dark:text-slate-200" style="font-size: 25px;"
	></i>
</p>

<div class="hidden" id="vrButton">
	<VRButton />
</div>

<div id="object-list" class="hidden" use:dragMe style="z-index: 1; max-height: 70%; max-width: 50%; min-width: 250px;">
	<Listgroup class="move-handle p-1 text-center text-xl font-medium text-gray-900 dark:text-gray-400 -rounded rounded-tr rounded-tl cursor-move">
		List of objects
	</Listgroup>
	<Listgroup active class="h-full overflow-y-scroll -rounded rounded-br rounded-bl">
		<div class="container">
			<!-- style="max-height: 300px;" -->
		  {#if $objectsGroup}
			{#if $objectsGroup.children.length > 0}
				{#each $objectsGroup.children as element}
				<Objects {element} />
				{/each}
			{/if}
		  {/if}
		</div>
	</Listgroup>
	<div class="resize-handle" style="position: absolute; bottom: -38px; right: 0; width: 10px; height: 10px; background-color: #ccc; cursor: se-resize;"></div>
</div>
