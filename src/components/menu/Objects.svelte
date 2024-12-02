<script>
    let { element } = $props();
    let isExpanded = $state(false);
    let previoslySelectedObject;
    import { Tooltip, ListgroupItem } from 'flowbite-svelte';
    import { toggleExpand } from '../../stores/appStore';
    import { objectsGroup, TControls, selectedObject, lockedObjects } from '../../stores/sceneStore';
    import { sceneCommand } from '$lib/commandsHandler.svelte';
    import {
        showSidebar,
		propertiesClose,
		peers
	} from '../../stores/appStore.js';

    /**
     * Listens for the toggleExpand state and, when it changes, expands
     * the corresponding group in the object list, and then selects the
     * previously selected object.
     * This is a brute force solution until I learn how to trigger reactivity on svelte:self
     * @todo figure out how to re-render nested component when the state changes
     */
    $effect(() => {
        if ($toggleExpand !== null) {
            // save the uuid of the previously selected object
            let save = $selectedObject.uuid;

            // get the element with the toggleExpand uuid
            let element = document.getElementById($toggleExpand);

            // toggle the expand state for collapsed group
            element?.querySelector("button > div > i")?.click();

            // wait 100ms and toggle the expand state again
            setTimeout(() => {
                element?.querySelector("button > div > i")?.click();
                element?.querySelector("div > i")?.click();
            }, 100);

            // wait another 100ms and select the previously selected object
            setTimeout(() => {
                let saved = document.getElementById(save);
                // keep UI state for previously selected object
                if (saved)
                saved.querySelector("p > button > div > div")?.click();
                if (saved.querySelector("p > button > div > div") !== null)
                configure($objectsGroup.getObjectByProperty('uuid', save), 1);
            }, 100);

            // reset the toggleExpand state
            $toggleExpand = null;
        }
    });

    function select(uuid) {
        if (!$lockedObjects.find((lockedUuid) => lockedUuid[1] === uuid)) {
            // showSidebar(null);
            previoslySelectedObject = $selectedObject;
            selectedObject.set($objectsGroup.getObjectByProperty('uuid', uuid));
            $TControls.attach($objectsGroup.getObjectByProperty('uuid', uuid));
            $peers.send({ type: 'lock', uuid: uuid, peerId: $peers.peer.id });
        } else {
            $TControls.detach();
            selectedObject.set($objectsGroup.getObjectByProperty('uuid', uuid));
        }
    }

	function configure(item, delay = 100) {
        // The delay adds cool effect
        // setTimeout(() => {
            select(item.uuid)
			if (item.type.endsWith('Light')) {
                showSidebar('lightProperties');
			} else {
                showSidebar('properties');
			}
        // }, delay)
        // propertiesClose.set(false);
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

			if(el.parent.parent.parent !== null) {
                console.log("muchas")
                console.log(el.parent.parent.parent)
                el.parent?.remove(el);
                sceneCommand('/clear ' + el.uuid);

                // Toggle the 'hidden' class to immediately hide the item
                // The list will update automatically after collapse/expand
                document.getElementById(el.uuid)?.classList.toggle('hidden');
            } else {
                sceneCommand('/clear ' + el.uuid);
            }

	}
  </script>


{#if element.type === 'Group'}
    <p id={element.uuid}>
    <ListgroupItem itemDefaultClass="flex items-center text-overflow-ellipsis w-full overflow-hidden inline-flex" >
        {#if !isExpanded}
            <div class="inline-flex text-overflow-ellipsis w-full overflow-hidden items-center grid grid-cols-12">
                <div class="flex inline-flex justify-start items-center col-span-9" onclick={() => { select(element.uuid); }}>
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
            <div class="pl-2 container flex inline-flex justify-start items-center" onclick={() => { select(element.uuid); }}>
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
            <svelte:self element={item} key={item.uuid} />
        {:else}
            <p id={item.uuid}>
            <ListgroupItem itemDefaultClass="flex items-center text-overflow-ellipsis w-full overflow-hidden inline-flex" >
                <div class="inline-flex text-overflow-ellipsis w-full overflow-hidden items-center grid grid-cols-12">
                    <div class="flex inline-flex justify-start items-center col-span-9" onclick={() => { select(item.uuid); }}>
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
        <p id={element.uuid} onclick={() => { select(element.uuid); }}>
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