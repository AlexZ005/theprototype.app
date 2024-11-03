<script lang="ts">
	import '../../app.css';
	import '../../styles/menu.css';
	import { save, load } from '$lib/fileHandler.svelte';
    import { settingsOpen, propertiesClose } from '../../stores/appStore.js';
	import { sceneCommand } from '$lib/commandsHandler.svelte';	

	import {
		Sidebar,
		SidebarGroup,
		SidebarItem,
		SidebarWrapper,
		SidebarDropdownWrapper,
		SidebarDropdownItem,
		Radio,
		Dropdown,
	} from 'flowbite-svelte';

    import { fly } from 'svelte/transition';
    
	let saveFormat = 'json';
	let spanClass = 'flex-1 ms-3 whitespace-nowrap';
	let saveClass = 'px-4 py-2 text-sm font-medium text-gray-900 border-gray-200 hover:bg-gray-100\
	hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-800\
	dark:text-gray-400 dark:border-gray-700 dark:text-white dark:hover:text-white dark:hover:bg-gray-700\
	dark:focus:ring-blue-500 dark:focus:text-white bg-white';

    let { open } = $props();
</script>

{#if open}

<div class="hamburger">
  <!-- {#each ['Home', 'Example', 'About', 'Contact'] as link, i} -->
      <div transition:fly={{ x: -15, direction: 'in' }}>


<Sidebar>
	<SidebarWrapper>
		<SidebarGroup>
			<!-- <div class="text-sm font-medium text-gray-500">Primitives</div> -->
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
				<SidebarDropdownItem label="🧊Cube" on:click={() => { propertiesClose.set(false); sceneCommand('/create Box 2 2 2') }}>
					<svelte:fragment slot="icon"></svelte:fragment>
				</SidebarDropdownItem>
				<SidebarDropdownItem label="🔼Cone" on:click={() => { propertiesClose.set(false); sceneCommand('/create Cone 1') } }>
					<svelte:fragment slot="icon"></svelte:fragment>
				</SidebarDropdownItem>
				<SidebarDropdownItem label="🟠Sphere" on:click={() => { propertiesClose.set(false); sceneCommand('/create Sphere 1') } }>
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
			<Dropdown placement='right' class="w-44 p-3 space-y-3 text-sm">
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

			<SidebarItem label="Clear Scene" {spanClass} on:click={() => { sceneCommand('/clear all')}}></SidebarItem>

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


</div>
</div>
{/if}


<style>
	:global(.switchMenu) {
		display: flex;
	}
</style>
