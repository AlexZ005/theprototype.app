<script>
    let { element } = $props();
    let isExpanded = $state(false);
    let previoslySelectedObject;
    import { Tooltip, ListgroupItem } from 'flowbite-svelte';
    import { objectsGroup, TControls, selectedObject, lockedObjects } from '../../stores/sceneStore';
    import { sceneCommand } from '$lib/commandsHandler.svelte';
    import {
		propertiesClose,
		lightPropertiesClose,
		scenePropertiesClose,
		peers
	} from '../../stores/appStore.js';

    function select(item) {
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
    }

	function configure(item) {
		// When press on ListgroupItem even on configure button, it activates
		// The delay adds cool effect and protects from error on click
		setTimeout(() => {
			if (item.type.endsWith('Light')) {
				lightPropertiesClose.set(false);
				scenePropertiesClose.set(true);
				propertiesClose.set(true);
			} else {
				lightPropertiesClose.set(true);
				scenePropertiesClose.set(true);
				propertiesClose.set(false);
			}
		}, 100);
	}

	function deleteItem(item) {
		// When press on ListgroupItem even on delete button, it activates
		// Select previous one as we about to delete tje current one
		setTimeout(() => {
			// console.log(previoslySelectedObject.name);
			if (
				previoslySelectedObject &&
				previoslySelectedObject.uuid !== item.uuid &&
				$objectsGroup.getObjectByProperty('uuid', previoslySelectedObject.uuid)
			) {
				selectedObject.set(previoslySelectedObject);
				$TControls.attach(previoslySelectedObject);
				previoslySelectedObject = null;
			} else {
				propertiesClose.set(true);
				$TControls.detach();
			}
			var el = $objectsGroup.getObjectByProperty('uuid', item.uuid);
			el.parent?.remove(el);
			// console.log(item[0].uuid);
			sceneCommand('/clear ' + item[0].uuid);
			// $objectsGroup = $objectsGroup;

			// Toggle the 'hidden' class to immediately hide the item
			// The list will update automatically after collapse/expand
			document.getElementById(item.uuid)?.classList.toggle('hidden');
		}, 100);
	}
  </script>


{#if element.type === 'Group'}
    <p id={element.uuid} onclick={() => { select(element); }}>
    <ListgroupItem itemDefaultClass="flex items-center text-overflow-ellipsis w-full overflow-hidden inline-flex" >
        {#if !isExpanded}
            <div class="inline-flex text-overflow-ellipsis w-full overflow-hidden items-center grid grid-cols-2">
                <div class="flex inline-flex justify-start items-center">
                    <i class="fa-regular fa-plus pr-2" title="Expand group" onclick={() => isExpanded = !isExpanded}></i>
                    <p class={`overflow-hidden ${$selectedObject && $selectedObject.uuid === element.uuid ? 'text-blue-200' : ''}`}>{element.name}</p>
                </div>
                {#if $lockedObjects.find((lockedUuid) => lockedUuid[1] === element.uuid)}
                    <div class="flex inline-flex justify-end">
                        <li class="configure inline-flex">🔒</li>
                        <p class="configure grayscale">⚙️</p>
                        <p class="delete grayscale">✖️</p>
                    </div>
                    <Tooltip placement='left' arrow={false}>Locked by {$lockedObjects.find((lockedUuid) => lockedUuid[1] === element.uuid)[0]}</Tooltip>
                {:else}
                    <div class="flex inline-flex justify-end">
                        <!-- <li class="configure inline-flex">🔓</li> -->
                        <p class="configure" onclick={() => configure(element)}>⚙️</p>
                        <p class="delete" onclick={() => deleteItem(element)}>✖️</p>
                    </div>
                {/if}
            </div>
        {:else}
            <i class="fa-solid fa-minus pr-2" title="Collapse group" onclick={() => isExpanded = !isExpanded}></i>
            {element.name} <br />
        {/if}
    </ListgroupItem>
    </p>

    {#if isExpanded}
    {#each element.children as item}
        <p class="pl-8">
        {#if item.type === 'Group'}    
            <svelte:self element={item} />
        {:else}
            <p id={item.uuid} onclick={() => { select(item); }}>
            <ListgroupItem itemDefaultClass="flex items-center text-overflow-ellipsis w-full overflow-hidden inline-flex" >
            {#if item.type.endsWith('Light')}
                <i class="fa-regular fa-sun pr-2" title="Light"></i>
                <p class={`overflow-hidden ${$selectedObject && $selectedObject.uuid === item.uuid ? 'text-blue-200' : ''}`}>{item.name}</p>
            {:else}
                <div class="inline-flex text-overflow-ellipsis w-full overflow-hidden items-center grid grid-cols-2">
                    <div class="flex inline-flex justify-start items-center">
                        <i class="fa-solid fa-cube pr-2" title="Object"></i>
                        <p class={`overflow-hidden ${$selectedObject && $selectedObject.uuid === item.uuid ? 'text-blue-200' : ''}`}>{item.name}</p>
                    </div>
                    {#if $lockedObjects.find((lockedUuid) => lockedUuid[1] === item.uuid)}
                        <div class="flex inline-flex justify-end">
                            <li class="configure inline-flex">🔒</li>
                            <p class="configure grayscale">⚙️</p>
                            <p class="delete grayscale">✖️</p>
                        </div>
                        <Tooltip placement='left' arrow={false}>Locked by {$lockedObjects.find((lockedUuid) => lockedUuid[1] === item.uuid)[0]}</Tooltip>
                    {:else}
                        <div class="flex inline-flex justify-end">
                            <!-- <li class="configure inline-flex">🔓</li> -->
                            <p class="configure" onclick={() => configure(item)}>⚙️</p>
                            <p class="delete" onclick={() => deleteItem(item)}>✖️</p>
                        </div>
                    {/if}
                </div>
            {/if}
            </ListgroupItem>
            </p>
        {/if}
        </p>
    {/each}
    {/if}
{:else if element.type.endsWith('Light')}
    <p onclick={() => { select(element); }}>
    <i class="fa-regular fa-sun pr-2" title="Light"></i>
    {element.name} <br />
    </p>
{:else}
    <p class="pl-8" onclick={() => { select(element); }}>
    <i class="fa-solid fa-cube pr-2" title="Object"></i>
    {element.name} <br />
    </p>
{/if}