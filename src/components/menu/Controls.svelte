<script lang="ts">
	import { BottomNav, Listgroup } from 'flowbite-svelte';
	import { objectsGroup, TControls } from '../../stores/sceneStore';
	import { chatHidden } from '../../stores/appStore.js';
	import Objects from './Objects.svelte';

	let classActive =
		'group inline-flex items-center justify-center hover:bg-primary-700 focus:outline-none focus:ring-4 focus:ring-primary-300';

	function dragMe(node) {
		let moving = false;
		let left = 300;
		let top = 100;

		node.style.position = 'absolute';
		node.style.top = `${top}px`;
		node.style.left = `${left}px`;
		node.style.cursor = 'move';
		node.style.userSelect = 'none';

		node.addEventListener('mousedown', () => {
			moving = true;
		});

		window.addEventListener('mousemove', (e) => {
			if (moving) {
				left += e.movementX;
				top += e.movementY;
				node.style.top = `${top}px`;
				node.style.left = `${left}px`;
			}
		});

		window.addEventListener('mouseup', () => {
			moving = false;
		});
	}
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

<div id="object-list" class="hidden" use:dragMe style="z-index: 1">
	<Listgroup active class="w-48">
		<h3 class="p-1 text-center text-xl font-medium text-gray-900 dark:text-gray-400">
			List of objects
		</h3>
		<div class="container overflow-y-scroll" style="max-height: 300px;">
		  {#if $objectsGroup}
			{#if $objectsGroup.children.length > 0}
				{#each $objectsGroup.children as element}
				<Objects {element} />
				{/each}
			{/if}
		  {/if}
		</div>
	</Listgroup>
</div>
