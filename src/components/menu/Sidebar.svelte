<script lang="ts">
	import '../../app.css';
	import '../../styles/menu.css';
	import { save, load } from '$lib/fileHandler.svelte';
	import {
		settingsOpen,
		propertiesClose,
		scenePropertiesClose,
		lightPropertiesClose
	} from '../../stores/appStore.js';
	import { sceneCommand } from '$lib/commandsHandler.svelte';
	import { sineIn } from 'svelte/easing';

	import {
		Sidebar,
		SidebarGroup,
		SidebarItem,
		SidebarWrapper,
		SidebarDropdownWrapper,
		SidebarDropdownItem,
		Radio,
		Dropdown,
		Drawer
	} from 'flowbite-svelte';

	let saveFormat = 'json';
	let spanClass = 'flex-1 ms-3 whitespace-nowrap';
	let saveClass =
		'px-4 py-2 text-sm font-medium text-gray-900 border-gray-200 hover:bg-gray-100\
	hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-800\
	dark:text-gray-400 dark:border-gray-700 dark:text-white dark:hover:text-white dark:hover:bg-gray-700\
	dark:focus:ring-blue-500 dark:focus:text-white bg-white';

	let { open } = $props();

	let transitionParamsRight = {
		x: -320,
		duration: 200,
		easing: sineIn
	};
</script>

{#if true}

<div class="hamburger" style="z-index: 49;">
<div>
<Drawer
	hidden={!open}
	activateClickOutside={false}
	backdrop={false}
	placement="left"
	position="fixed"
	rightOffset="end-0 top-16"
	leftOffset="start-0 top-16 h-full"
	topOffset="top-16"
	transitionType="fly"
	transitionParams={transitionParamsRight}
	id="sidebar70"
>
<Sidebar>
	<SidebarWrapper>
		<SidebarGroup>
			<SidebarDropdownWrapper label="Primitives">
				<svelte:fragment slot="arrowup">
					<svg
						style="transform: rotate(180deg);"
						xmlns="http://www.w3.org/2000/svg"
						width="16"
						height="16"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					>
						<polyline points="18 9 12 15 6 9"></polyline>
					</svg>
				</svelte:fragment>
				<svelte:fragment slot="arrowdown">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="16"
						height="16"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					>
						<polyline points="18 9 12 15 6 9"></polyline>
					</svg>
				</svelte:fragment>
				<SidebarDropdownItem
				label="🧊Cube"
				on:click={() => {
					lightPropertiesClose.set(true);
					scenePropertiesClose.set(true);
					propertiesClose.set(false);
					sceneCommand('/create Box 2 2 2');
				}}
			>
					<svelte:fragment slot="icon"></svelte:fragment>
				</SidebarDropdownItem>
				<SidebarDropdownItem
					label="🔼Cone"
					on:click={() => {
						lightPropertiesClose.set(true);
						scenePropertiesClose.set(true);
						propertiesClose.set(false);
						sceneCommand('/create Cone 1');
					}}
				>
					<svelte:fragment slot="icon"></svelte:fragment>
				</SidebarDropdownItem>
				<SidebarDropdownItem
					label="🟠Sphere"
					on:click={() => {
						lightPropertiesClose.set(true);
						scenePropertiesClose.set(true);
						propertiesClose.set(false);
						sceneCommand('/create Sphere 1');
					}}
				>
				<svelte:fragment slot="icon"></svelte:fragment>
				</SidebarDropdownItem>
			</SidebarDropdownWrapper>

			<SidebarDropdownWrapper label="Lights">
				<svelte:fragment slot="arrowup">
					<svg
						style="transform: rotate(180deg);"
						xmlns="http://www.w3.org/2000/svg"
						width="16"
						height="16"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					>
						<polyline points="18 9 12 15 6 9"></polyline>
					</svg>
				</svelte:fragment>
				<svelte:fragment slot="arrowdown">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="16"
						height="16"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					>
						<polyline points="18 9 12 15 6 9"></polyline>
					</svg>
				</svelte:fragment>
				
					<SidebarDropdownItem
					label="Ambient"
					on:click={() => {
						scenePropertiesClose.set(true);
						propertiesClose.set(true);
						lightPropertiesClose.set(false);
						sceneCommand('/light ambient');
					}}
				>
					<svelte:fragment slot="icon"></svelte:fragment>
				</SidebarDropdownItem>
				<SidebarDropdownItem
					label="Directional"
					on:click={() => {
						scenePropertiesClose.set(true);
						propertiesClose.set(true);
						lightPropertiesClose.set(false);
						sceneCommand('/light directional');
					}}
				>
					<svelte:fragment slot="icon"></svelte:fragment>
				</SidebarDropdownItem>
				<SidebarDropdownItem
					label="Hemisphere"
					on:click={() => {
						scenePropertiesClose.set(true);
						propertiesClose.set(true);
						lightPropertiesClose.set(false);
						sceneCommand('/light hemisphere');
					}}
				>
					<svelte:fragment slot="icon"></svelte:fragment>
				</SidebarDropdownItem>
			</SidebarDropdownWrapper>

			<input type="file" id="load-file" style="display: none" on:change={e => load(e.target.files[0])} />
		</SidebarGroup>
		<SidebarGroup border>

        <div class="inline-flex rounded-md shadow-sm" role="group">
			<button type="button" class={saveClass + " border rounded-s-lg"}
			on:click={() => document.getElementById('load-file').click()}>
			  📁<br />Load
			</button>
			<button type="button" class={saveClass + " border-t border-b border-r"}
			on:click={() => save(saveFormat)}>
			  💾<br />Save
			</button>
			<button type="button" class="px-1 py-2 text-sm font-medium text-gray-900 bg-white border-t border-b border-r border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-blue-500 dark:focus:text-white"
			>
		   
			<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
				<polyline points="18 9 12 15 6 9"></polyline>
			</svg>    
			
			</button>
			<Dropdown placement='bottom' class="w-44 p-3 space-y-3 text-sm">
			  <li>
				<Radio name="group1" bind:group={saveFormat} value={'scene'} disabled>Scene</Radio>
			  </li>
			  <li>
				<Radio name="group1" bind:group={saveFormat} value={'json'}>JSON</Radio>
			  </li>
			  <li>
				<Radio name="group1" bind:group={saveFormat} value={'gltf'}>GLTF</Radio>
			  </li>
			</Dropdown>
		</div>

			<SidebarItem
				label="Configure Scene"
				{spanClass}
				on:click={() => {
					lightPropertiesClose.set(true);
					propertiesClose.set(true);
					scenePropertiesClose.set(false);
				}}
			></SidebarItem>
			<SidebarItem
				label="Clear Scene"
				{spanClass}
				on:click={() => {
					lightPropertiesClose.set(true);
					propertiesClose.set(true);
					sceneCommand('/clear all');
				}}
			></SidebarItem>

			<SidebarItem
				label="Settings"
				{spanClass}
				style="padding-right: 40px"
				on:click={() => settingsOpen.set(!$settingsOpen)}
			>
				<svelte:fragment slot="icon">⚙️</svelte:fragment>
			</SidebarItem>
		</SidebarGroup>
	</SidebarWrapper>
</Sidebar>
</Drawer>


</div>
</div>
{/if}


<style>
	:global(.switchMenu) {
		display: flex;
	}
</style>
