<script lang="ts">
	import { Accordion, AccordionItem, Modal, Button, Checkbox } from 'flowbite-svelte';
	import { showGrid, vrOverride } from '../../stores/sceneStore.js';
	import {
		settingsOpen,
		closeMenu,
		scenePropertiesClose,
		lightPropertiesClose,
		propertiesClose,
		libraryClose
	} from '../../stores/appStore.js';
	import { onMount } from 'svelte';

	//Rounded corners for options
	let coverClass =
		'z-10 inline-flex items-center py-2.5 text-sm font-medium text-center text-gray-500 bg-gray-100 border border-gray-300 dark:bg-gray-700 dark:text-white dark:border-gray-600';
	let topcoverName =
		'w-40 flex-shrink-0 px-4 rounded-tl-lg hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 dark:hover:bg-gray-600 dark:focus:ring-gray-700 ' +
		coverClass;
	let topcoverDescription = 'w-full px-5 rounded-tr-lg ' + coverClass;
	let bottomCoverName =
		'w-40 flex-shrink-0 px-4 rounded-bl-lg hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 dark:hover:bg-gray-600 dark:focus:ring-gray-700 ' +
		coverClass;
	let bottomCoverDescription = 'w-full px-5 rounded-br-lg ' + coverClass;

	let status = [];
</script>

<Modal
	title="Settings"
	bind:open={$settingsOpen}
	outsideclose
	on:open={() => {
		if (!$closeMenu) {
			$closeMenu = true;
			status[0] = true;
		}
		if (!$libraryClose) {
			status[1] = true;
			$libraryClose = true;
		}
		if (!$lightPropertiesClose) {
			status[2] = true;
			$lightPropertiesClose = true;
		}
		if (!$scenePropertiesClose) {
			status[3] = true;
			$scenePropertiesClose = true;
		}
		if (!$propertiesClose) {
			status[4] = true;
			$propertiesClose = true;
		}
	}}
	on:close={() => {
		if (status[0]) {
			$closeMenu = false;
			status[0] = false;
		}
		if (status[1]) {
			$libraryClose = false;
			status[1] = false;
		}
		if (status[2]) {
			status[2] = false;
			$lightPropertiesClose = false;
		}
		if (status[3]) {
			status[3] = false;
			$scenePropertiesClose = false;
		}
		if (status[4]) {
			status[4] = false;
			$propertiesClose = false;
		}
	}}
>
	<div class="modal-content max-h-[90vh] overflow-y-auto p-4">
		<Accordion>
			<AccordionItem>
				<svelte:fragment slot="header">Scene</svelte:fragment>
				<div class="flex">
					<p class={topcoverName}>
						<Checkbox
							bind:checked={$vrOverride}
							on:click={() => {
								if (localStorage.getItem('vrOverride')) localStorage.removeItem('vrOverride');
								else localStorage.setItem('vrOverride', 'true');
							}}>&nbsp;VR override</Checkbox
						>
					</p>
					<p class={topcoverDescription}>Forces normal play even if immersive-vr is enabled</p>
				</div>
				<div class="flex">
					<p class={bottomCoverName}>
						<Checkbox
							bind:checked={$showGrid}
							on:click={() => {
								if (localStorage.getItem('showGrid')) localStorage.removeItem('showGrid');
								else localStorage.setItem('showGrid', 'false');
							}}>&nbsp;Show grid</Checkbox
						>
					</p>
					<p class={bottomCoverDescription}>Display grid on floor</p>
				</div>
			</AccordionItem>
			<AccordionItem>
				<svelte:fragment slot="header">About</svelte:fragment>
			</AccordionItem>
		</Accordion>
	</div>
	<svelte:fragment slot="footer">
		<Button>Reset settings</Button>
	</svelte:fragment>
</Modal>
