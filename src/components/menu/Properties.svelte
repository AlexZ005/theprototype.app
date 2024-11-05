<script>
import { Drawer, Button, CloseButton, NumberInput, Input, Range } from 'flowbite-svelte';
import { objectsGroup, TControls, selectedObject } from '../../stores/sceneStore';
import { propertiesClose,  } from '../../stores/appStore.js';
import { peers, chatHidden } from '../../stores/appStore';
import { sineIn } from 'svelte/easing';

let { min_x, max_x, min_y, max_y, min_z, max_z } = $state(0) //reactivity for slider min/max values

let transitionParamsRight = {
    x: 320,
    duration: 200,
    easing: sineIn
};

let st = $state(0)

function event(node) {

      //Center slide
     //-3 = -1 +5 //-2 = 0 +4 //-1 = -1 +3
    //0 = -2 +2 //1 = -3 +1 //2 = -4  0
    min_x = $selectedObject.position.x-($selectedObject.position.x+2)
    max_x = $selectedObject.position.x+(($selectedObject.position.x-2)*-1)
    min_y = $selectedObject.position.y-($selectedObject.position.y+2)
    max_y = $selectedObject.position.y+(($selectedObject.position.y-2)*-1)
    min_z = $selectedObject.position.z-($selectedObject.position.z+2)
    max_z = $selectedObject.position.z+(($selectedObject.position.z-2)*-1)
        
    window.addEventListener('mouseup', () => {
        min_x = $selectedObject.position.x-5
        max_x = $selectedObject.position.x+5
        min_y = $selectedObject.position.y-5
        max_y = $selectedObject.position.y+5
        min_z = $selectedObject.position.z-5
        max_z = $selectedObject.position.z+5
    });

}

// Drawer show full screen
let drawerStyle = $state();

$effect(() => {
    if ($chatHidden === '') {
        drawerStyle="bottom: 350px; z-index: 48"
    } else {
        drawerStyle="bottom: 0px; z-index: 48"
    }
})
</script>
  
  <Drawer style={drawerStyle} activateClickOutside={false} backdrop={false} placement="right" height="full" position="fixed" rightOffset="end-0 top-16" leftOffset="start-0 " topOffset="top-16"   transitionType="fly" transitionParams={transitionParamsRight} bind:hidden={$propertiesClose} id="sidebar6">
    <div class="flex items-center">
      <h5 id="drawer-label" class="inline-flex items-center mb-4 text-base font-semibold text-gray-500 dark:text-gray-400">
        Properties
      </h5>
      <CloseButton on:click={() => {(propertiesClose.set(true)); st=0}} class="mb-4 dark:text-white" />
    </div>
    {#if $selectedObject.name !== undefined}
    {st=null}
    
    <br /><p class="text-white dark:text-slate-200">Position:</p>
    
    <div use:event>
    <div class="flex items-center space-x-2 p-1">
        <span  class="w-2/3 text-right pr-2 truncate">
            <Range id="posx" step="0.1" min={min_x} max={max_x} bind:value={$selectedObject.position.x} />
        </span>
        <span class="w-1/3">
        <NumberInput bind:value={$selectedObject.position.x} />
        </span>
    </div>

    <div class="flex items-center space-x-2 p-1">
        <span  class="w-2/3 text-right pr-2 truncate">
            <Range id="posy" step="0.1" min={min_y} max={max_y} bind:value={$selectedObject.position.y} />
        </span>
        <span class="w-1/3">
        <NumberInput bind:value={$selectedObject.position.y} />
        </span>
    </div>

    <div class="flex items-center space-x-2 p-1">
        <span class="w-2/3 text-right pr-2 truncate">
            <Range id="posz" step="0.1" min={min_z} max={max_z} bind:value={$selectedObject.position.z} />
        </span>
        <span class="w-1/3">
        <NumberInput bind:value={$selectedObject.position.z} />
        </span>
    </div>
    </div>

    <!-- updateMatrixWorld required to include position in JSON -->
    <Button on:click={() => {$selectedObject.updateMatrixWorld();
        $peers.send({type: 'object', element: $selectedObject.toJSON(), override: true}) } }>Set</Button>
    
    <Button on:click={() => {$TControls.detach(); $objectsGroup.remove($selectedObject)}}>Delete</Button>
    
    {:else}
    {st=0}

    {/if}

  </Drawer>