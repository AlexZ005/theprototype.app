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
            select(item)
			if (item.type.endsWith('Light')) {
				lightPropertiesClose.set(false);
				scenePropertiesClose.set(true);
				propertiesClose.set(true);
			} else {
				lightPropertiesClose.set(true);
				scenePropertiesClose.set(true);
				propertiesClose.set(false);
			}
	}

	function deleteItem(item) {
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

			if(typeof el.parent !== 'undefined') {
                el.parent?.remove(el);
            } else {
                sceneCommand('/clear ' + item[0].uuid);
            }

			// Toggle the 'hidden' class to immediately hide the item
			// The list will update automatically after collapse/expand
			document.getElementById(item.uuid)?.classList.toggle('hidden');
	}
  </script>


{#if element.type === 'Group'}
    <p id={element.uuid}>
    <ListgroupItem itemDefaultClass="flex items-center text-overflow-ellipsis w-full overflow-hidden inline-flex" >
        {#if !isExpanded}
            <div class="inline-flex text-overflow-ellipsis w-full overflow-hidden items-center grid grid-cols-12">
                <div class="flex inline-flex justify-start items-center col-span-9" onclick={() => { select(element); }}>
                    <i class="pl-2 fa-regular fa-plus pr-2" title="Expand group" onclick={() => isExpanded = !isExpanded}></i>
                    <p class={`overflow-hidden whitespace-nowrap ${$selectedObject && $selectedObject.uuid === element.uuid ? 'text-blue-200' : ''}`}>{element.name}</p>
                </div>
                {#if $lockedObjects.find((lockedUuid) => lockedUuid[1] === element.uuid)}
                    <div class="flex inline-flex justify-end col-span-3">
                        <li class="configure inline-flex">🔒</li>
                        <p class="configure grayscale">⚙️</p>
                        <p class="delete grayscale">✖️</p>
                    </div>
                    <Tooltip placement='left' arrow={false}>Locked by {$lockedObjects.find((lockedUuid) => lockedUuid[1] === element.uuid)[0]}</Tooltip>
                {:else}
                    <div class="flex inline-flex justify-end col-span-3">
                        <!-- <li class="configure inline-flex">🔓</li> -->
                        <p class="configure hover:brightness-200" onclick={() => configure(element)}>⚙️</p>
                        <p class="delete hover:brightness-200" onclick={() => deleteItem(element)}>✖️</p>
                    </div>
                {/if}
            </div>
        {:else}
            <div class="pl-2 container flex inline-flex justify-start items-center" onclick={() => { select(element); }}>
            <i class="fa-solid fa-minus pr-2" title="Collapse group" onclick={() => isExpanded = !isExpanded}></i>
            <p class={`overflow-hidden whitespace-nowrap ${$selectedObject && $selectedObject.uuid === element.uuid ? 'text-blue-200' : ''}`}>{element.name}</p>
            </div>
        {/if}
    </ListgroupItem>
    </p>

    {#if isExpanded}
    {#each element.children as item}
        <p class="pl-8">
        {#if item.type === 'Group'}    
            <svelte:self element={item} />
        {:else}
            <p id={item.uuid}>
            <ListgroupItem itemDefaultClass="flex items-center text-overflow-ellipsis w-full overflow-hidden inline-flex" >
                <div class="inline-flex text-overflow-ellipsis w-full overflow-hidden items-center grid grid-cols-12">
                    <div class="flex inline-flex justify-start items-center col-span-9" onclick={() => { select(item); }}>
                    {#if item.type.endsWith('Light')}
                        <i class="pl-2 fa-regular fa-sun pr-2" title="Light"></i>
                    {:else}
                        <i class="pl-2 fa-solid fa-cube pr-2" title="Object"></i>
                    {/if}
                    <p class={`overflow-hidden whitespace-nowrap ${$selectedObject && $selectedObject.uuid === item.uuid ? 'text-blue-200' : ''}`}>{item.name}</p>
                    </div>

                    {#if $lockedObjects.find((lockedUuid) => lockedUuid[1] === item.uuid)}
                        <div class="flex inline-flex justify-end col-span-3">
                            <li class="configure inline-flex">🔒</li>
                            <p class="configure grayscale">⚙️</p>
                            <p class="delete grayscale">✖️</p>
                        </div>
                        <Tooltip placement='left' arrow={false}>Locked by {$lockedObjects.find((lockedUuid) => lockedUuid[1] === item.uuid)[0]}</Tooltip>
                    {:else}
                        <div class="flex inline-flex justify-end col-span-3">
                            <!-- <li class="configure inline-flex">🔓</li> -->
                            <p class="configure hover:brightness-200" onclick={() => configure(item)}>⚙️</p>
                            <p class="delete hover:brightness-200" onclick={() => deleteItem(item)}>✖️</p>
                        </div>
                    {/if}
                </div>
            </ListgroupItem>
            </p>
        {/if}
        
        </p>
    {/each}
    {/if}

{:else}
    

    <p class="pl-8">
        <p id={element.uuid} onclick={() => { select(element); }}>
        <ListgroupItem itemDefaultClass="flex items-center text-overflow-ellipsis w-full overflow-hidden inline-flex" >
        <div class="inline-flex text-overflow-ellipsis w-full overflow-hidden items-center grid grid-cols-12">
            <div class="flex inline-flex justify-start items-center col-span-9">
                {#if element.type.endsWith('Light')}
                    <i class="pl-2 fa-regular fa-sun pr-2" title="Light"></i>
                {:else}
                    <i class="pl-2 fa-solid fa-cube pr-2" title="Object"></i>                    
                {/if}
                <p class={`overflow-hidden whitespace-nowrap ${$selectedObject && $selectedObject.uuid === element.uuid ? 'text-blue-200' : ''}`}>{element.name}</p>
            </div>

            {#if $lockedObjects.find((lockedUuid) => lockedUuid[1] === element.uuid)}
                <div class="flex inline-flex justify-end col-span-3">
                    <li class="configure inline-flex">🔒</li>
                    <p class="configure grayscale">⚙️</p>
                    <p class="delete grayscale">✖️</p>
                </div>
                <Tooltip placement='left' arrow={false}>Locked by {$lockedObjects.find((lockedUuid) => lockedUuid[1] === element.uuid)[0]}</Tooltip>
            {:else}
                <div class="flex inline-flex justify-end col-span-3">
                    <!-- <li class="configure inline-flex">🔓</li> -->
                    <p class="configure hover:brightness-200" onclick={() => configure(element)}>⚙️</p>
                    <p class="delete hover:brightness-200" onclick={() => deleteItem(element)}>✖️</p>
                </div>
            {/if}
            </div>
        </ListgroupItem>
    </p>
        
        
{/if}