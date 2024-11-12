<script lang="ts">
	import { Tooltip, BottomNav, Listgroup, ListgroupItem } from 'flowbite-svelte';
	import { objectsGroup, TControls, selectedObject, lockedObjects } from '../../stores/sceneStore';
	import {
		chatHidden,
		propertiesClose,
		lightPropertiesClose,
		scenePropertiesClose,
		peers
	} from '../../stores/appStore.js';
	import { sceneCommand } from '$lib/commandsHandler.svelte';

	let previoslySelectedObject;
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
		<i class="fas fa-bars text-black dark:text-slate-200"></i>
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
		{#if $objectsGroup}
			{#if $objectsGroup.children.length > 0}
				<div>
					<div></div>
					{#each $objectsGroup.children as item (item.id)}
						<ListgroupItem
							class="items-center justify-between gap-2  text-base font-semibold"
							on:click={() => {
								if (!$lockedObjects.find((lockedUuid) => lockedUuid[1] === item.uuid)) {
									propertiesClose.set(true);
									lightPropertiesClose.set(true);
									previoslySelectedObject = $selectedObject;
									selectedObject.set($objectsGroup.getObjectByProperty('uuid', item.uuid));
									$TControls.attach($objectsGroup.getObjectByProperty('uuid', item.uuid));
									$peers.send({ type: 'lock', uuid: item.uuid, peerId: $peers.peer.id });
								} else {
									$TControls.detach();
									selectedObject.set($objectsGroup.getObjectByProperty('uuid', item.uuid));
								}
							}}
						>
							{#if $lockedObjects.find((lockedUuid) => lockedUuid[1] === item.uuid)}

								<div class="container">
									<div class="grid grid-cols-2">
										<div class="text-overflow-ellipsis w-full overflow-hidden">
											<p class="">{item.name}</p>
										</div>
										<div class="">
											<div class="flex flex-row justify-end">
												<li class="configure inline-flex">🔒</li>
												
												<p class="configure grayscale">⚙️</p>
												
												<p class="delete grayscale">✖️</p>
											</div>
											<Tooltip placement='left' arrow={false}>Locked by {$lockedObjects.find((lockedUuid) => lockedUuid[1] === item.uuid)[0]}</Tooltip>
										</div>
									</div>
								</div>

								
							{:else}
								<div class="container">
									<div class="grid grid-cols-2">
										<div class="text-overflow-ellipsis w-full overflow-hidden">
											{#if $selectedObject.uuid === item.uuid}
												<p class="text-blue-200">{item.name}</p>
												{:else}
											<p class="">{item.name}</p>
											{/if}
										</div>
										<div class="">
											<div class="flex flex-row justify-end">
												
												<p
													class="configure"
													on:click={(event) => {
														// When press on ListgroupItem even on configure button, it activates
														// The delay adds cool effect and protects from error on click
														setTimeout(() => {
															if (item.type.endsWith('Light')) {
																console.log(item.type);
																lightPropertiesClose.set(false);
																scenePropertiesClose.set(true);
																propertiesClose.set(true);
															} else {
																lightPropertiesClose.set(true);
																scenePropertiesClose.set(true);
																propertiesClose.set(false);
															}
														}, 100);
													}}
												>
													⚙️
												</p>

												<p
													class="delete"
													on:click={(event) => {
														// When press on ListgroupItem even on delete button, it activates
														// Select previous one as we about to delete tje current one
														setTimeout(() => {
															console.log(previoslySelectedObject.name);
															if (
																previoslySelectedObject &&
																previoslySelectedObject.uuid !== item.uuid &&
																$objectsGroup.getObjectByProperty(
																	'uuid',
																	previoslySelectedObject.uuid
																)
															) {
																selectedObject.set(previoslySelectedObject);
																$TControls.attach(previoslySelectedObject);
																previoslySelectedObject = null;
															} else {
																propertiesClose.set(true);
																$TControls.detach();
															}
															sceneCommand('/clear ' + item.uuid);
														}, 100);
													}}
												>
													✖️
												</p>
											</div>
										</div>
									</div>
								</div>

								{/if}
								
						</ListgroupItem>
					{/each}
				</div>
			{:else}
				<ListgroupItem class="w-48 items-center justify-center">
					<p
						class=""
						on:click={(event) => {
							console.log(myItems);
						}}
					>
						Empty Scene
					</p>
				</ListgroupItem>
			{/if}
		{/if}
	</Listgroup>
</div>
