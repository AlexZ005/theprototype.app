<script>
	import {
		Drawer,
		CloseButton,
		Select,
		Modal
	} from 'flowbite-svelte';
	import { peers, chatHidden, libraryClose, toggleExpand } from '../../stores/appStore.js';
	import { sineIn } from 'svelte/easing';
	import { loadFile } from '$lib/fileHandler.svelte';
	import { onMount } from 'svelte';

	let item = $state();
	let attributionModal = $state(false);
	let select = $state();
	let selected = $state();
	let libraries = $state();
	let attribution = $state();

	onMount(async () => {
		// load library list on mount
		libraries = await loadFile('/library/libraryList.json');
		select = libraries[0].value;
	});

	let transitionParamsRight = {
		x: 320,
		duration: 200,
		easing: sineIn
	};

	// Drawer show full screen
	let drawerStyle = $state();

	$effect(() => {
		if ($chatHidden === '') {
			drawerStyle = 'bottom: 350px; z-index: 48; border-bottom-left-radius: 0.5rem;';
		} else {
			drawerStyle = 'bottom: 0px; z-index: 48';
		}
	});
</script>

<Drawer
	style={drawerStyle}
	activateClickOutside={false}
	backdrop={false}
	placement="right"
	height="full"
	position="fixed"
	rightOffset="end-0 top-16"
	leftOffset="start-0 "
	topOffset="top-16"
	transitionType="fly"
	transitionParams={transitionParamsRight}
	bind:hidden={$libraryClose}
	class="rounded-tl-lg"
	id="sidebar-light"
>
	<div class="flex items-center">
		<h5
			id="drawer-label"
			class="mb-4 inline-flex items-center text-base font-semibold text-gray-500 dark:text-gray-400"
		>
			Library
		</h5>
		<CloseButton
			on:click={() => {
				libraryClose.set(true);
				st = 0;
			}}
			class="mb-4 dark:text-white"
		/>
	</div>

	<div class="mb-4 inline-flex w-full items-center rounded-md shadow-sm">
		<Select
			underline
			class="mt-2"
			items={libraries}
			bind:value={select}
			placeholder="Select Library"
			onchange={async (event) => {
				item = await loadFile(event.srcElement.value);
				selected = libraries.find((item) => item.value === event.srcElement.value);
				if (selected) {
					attribution = await loadFile(selected.attribution);
				}
			}}
		/>
		<input
			type="file"
			id="load-library"
			style="display: none"
			onchange={(e) => loadFile(e.target.files[0])}
			accept=".json, .gltf"
		/>
		<button
			type="button"
			class="inline-flex rounded-md shadow-sm"
			onclick={() => document.getElementById('load-library').click()}
		>
			📁
		</button>
	</div>

	<p class="items-center pb-4 italic text-white dark:text-slate-200">
		{selected?.copyright ? selected.copyright : 'Library details'}
		<i
			onclick={() => (attributionModal = true)}
			class="fa-solid fa-circle-info rounded-full border-2 border-blue-400 text-blue-500"
		></i>
	</p>

	{#each item as object}
		{#if object.variants['glTF-Binary']}
			<br />
			<button
				onclick={() => {
					let url = `/library/${selected.name}/${object.name}/glTF-Binary/${object.variants['glTF-Binary']}`;
					loadFile(url);
				}}
			>
				<img
					src={`/library/${selected.name}/${object.name}/${object.screenshot}`}
					class="h-14 w-14 dark:border-gray-800"
				/>
				<p class="pb-4 text-white dark:text-slate-200">{object.name}</p>
			</button>
		{/if}
	{/each}
</Drawer>

<Modal title={selected?.name} bind:open={attributionModal} autoclose>
	<div class="modal-content max-h-[90vh] overflow-y-auto p-4">
		<p class="pb-4 text-white dark:text-slate-200">{@html attribution}</p>
	</div>
</Modal>
