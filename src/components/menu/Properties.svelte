<script>
import * as THREE from 'three';
import { Tooltip, Accordion, AccordionItem, Checkbox, Select, Drawer, CloseButton, NumberInput, Input, Range } from 'flowbite-svelte';
import { objectsGroup, TControls, selectedObject } from '../../stores/sceneStore';
import { peers, chatHidden, propertiesClose  } from '../../stores/appStore.js';
import ColorPicker,{ ChromeVariant }  from 'svelte-awesome-color-picker';
import CustomWrapper from '$lib/ColorWrapper.svelte';
import { sineIn } from 'svelte/easing';

let color = $state();

let moving;
let { min_position_x, max_position_x, min_position_y, max_position_y, min_position_z, max_position_z,
      min_rotation_x, max_rotation_x, min_rotation_y, max_rotation_y, min_rotation_z, max_rotation_z,
      min_scale_x, max_scale_x, min_scale_y, max_scale_y, min_scale_z, max_scale_z
 } = $state(0) //reactivity for slider min/max values

let transitionParamsRight = {
    x: 320,
    duration: 200,
    easing: sineIn
};

let st = $state(0)

let materials = [
    { value: 'MeshBasicMaterial', name: 'Basic' },
    { value: 'MeshStandardMaterial', name: 'Standard' },
    { value: 'MeshNormalMaterial', name: 'Normals' },
    { value: 'MeshPhongMaterial', name: 'Phong' },
    { value: 'MeshToonMaterial', name: 'Toon' },
    { value: 'ShadowMaterial', name: 'Shadow' }
  ];

function event(node) {
      //Center slide
     //-3 = -1 +5 //-2 = 0 +4 //-1 = -1 +3
    //0 = -2 +2 //1 = -3 +1 //2 = -4  0
    min_position_x = $selectedObject.position.x-($selectedObject.position.x+2)
    max_position_x = $selectedObject.position.x+(($selectedObject.position.x-2)*-1)
    min_position_y = $selectedObject.position.y-($selectedObject.position.y+2)
    max_position_y = $selectedObject.position.y+(($selectedObject.position.y-2)*-1)
    min_position_z = $selectedObject.position.z-($selectedObject.position.z+2)
    max_position_z = $selectedObject.position.z+(($selectedObject.position.z-2)*-1)

    min_rotation_x = $selectedObject.rotation.x-($selectedObject.rotation.x+2)
    max_rotation_x = $selectedObject.rotation.x+(($selectedObject.rotation.x-2)*-1)
    min_rotation_y = $selectedObject.rotation.y-($selectedObject.rotation.y+2)
    max_rotation_y = $selectedObject.rotation.y+(($selectedObject.rotation.y-2)*-1)
    min_rotation_z = $selectedObject.rotation.z-($selectedObject.rotation.z+2)
    max_rotation_z = $selectedObject.rotation.z+(($selectedObject.rotation.z-2)*-1)

    min_scale_x = $selectedObject.scale.x-($selectedObject.scale.x+2)
    max_scale_x = $selectedObject.scale.x+(($selectedObject.scale.x-2)*-1)
    min_scale_y = $selectedObject.scale.y-($selectedObject.scale.y+2)
    max_scale_y = $selectedObject.scale.y+(($selectedObject.scale.y-2)*-1)
    min_scale_z = $selectedObject.scale.z-($selectedObject.scale.z+2)
    max_scale_z = $selectedObject.scale.z+(($selectedObject.scale.z-2)*-1)
    
    node.addEventListener('mousedown', () => {
        moving = true;
    });

    window.addEventListener('mousemove', (e) => {
        if (!$selectedObject.type.endsWith('Light')) {
        if ($selectedObject.material.type !== "MeshNormalMaterial")
        color = $selectedObject.material.color.getHexString()
        if (moving) {
            $peers.send({
						type: 'move',
						uuid: $selectedObject.uuid,
						pos: $selectedObject.position.toArray(),
						rot: $selectedObject.rotation.toArray(),
						scale: $selectedObject.scale.toArray()
					});
        }
        }
    });

    window.addEventListener('mouseup', () => {
        moving = false;
        min_position_x = $selectedObject.position.x-5
        max_position_x = $selectedObject.position.x+5
        min_position_y = $selectedObject.position.y-5
        max_position_y = $selectedObject.position.y+5
        min_position_z = $selectedObject.position.z-5
        max_position_z = $selectedObject.position.z+5

        min_rotation_x = $selectedObject.rotation.x-1
        max_rotation_x = $selectedObject.rotation.x+1
        min_rotation_y = $selectedObject.rotation.y-1
        max_rotation_y = $selectedObject.rotation.y+1
        min_rotation_z = $selectedObject.rotation.z-1
        max_rotation_z = $selectedObject.rotation.z+1

        min_scale_x = $selectedObject.scale.x-5
        max_scale_x = $selectedObject.scale.x+5
        min_scale_y = $selectedObject.scale.y-5
        max_scale_y = $selectedObject.scale.y+5
        min_scale_z = $selectedObject.scale.z-5
        max_scale_z = $selectedObject.scale.z+5
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

function sendUpdate() {        
        $peers.send({
            type: 'object',
            element: $selectedObject.toJSON(),
            override: true
        });
    }
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

    
    <Input id="name" class="text-white dark:text-slate-200 -rounded rounded-tl-lg rounded-tr-lg" bind:value={$selectedObject.name}
        onchange={() => {
        //Trigger reactivity for UI list of objects
        objectsGroup.update((value) => value);
        $peers.send({
            type: 'name',
            name: $selectedObject.name,
            uuid: $selectedObject.uuid
        });
        }} />
        <Tooltip placement='top' arrow={false} triggeredBy="#name">Name</Tooltip>
    
    <Input id="uuid" class="text-white dark:text-slate-200 -rounded rounded-bl-lg rounded-br-lg" disabled value={$selectedObject.uuid} />
    <Tooltip placement='bottom' arrow={false} triggeredBy="#uuid">UUID</Tooltip>
    <div use:event>
    <Accordion class="text-white dark:text-slate-200 w-full" flush>
  <AccordionItem>
    <svelte:fragment slot="header">Color</svelte:fragment>
    
    
    <ColorPicker
    label="test"
    isAlpha={false}
    isTextInput={false}
    isDialog={false}
    components={{...ChromeVariant, wrapper: CustomWrapper}} 
    isOpen={true}
    sliderDirection="horizontal"
    --picker-indicator-size="20px"
    --cp-bg-color="#1f2937"
    --cp-border-color="#353f4e"
    --picker-height="70px"
    --picker-width="50px"
    --slider-width="10px"    
    bind:value={color}
    on:input={(event) => {
        if ($selectedObject.material.type !== "MeshNormalMaterial"){
        $selectedObject.material.color.set(event.detail.hex);
        $peers.send({
						type: 'color',
						uuid: $selectedObject.uuid,
                        color: event.detail.hex
					});
        }
    }}
    />
    <Input type="text" bind:value={color} onchange={ () => { $selectedObject.material.color.set('#'+color); }} />
    </AccordionItem>
    <AccordionItem>
    <svelte:fragment slot="header">Transform</svelte:fragment>
    <br /><p class="text-white dark:text-slate-200">Position:</p>
    
    
    <div class="flex items-center space-x-2 p-1">
        <span  class="w-2/3 text-right pr-2 truncate">
            <Range id="posx" step="0.1" min={min_position_x} max={max_position_x} bind:value={$selectedObject.position.x} />
        </span>
        <span class="w-1/3">
        <NumberInput bind:value={$selectedObject.position.x} />
        </span>
    </div>

    <div class="flex items-center space-x-2 p-1">
        <span  class="w-2/3 text-right pr-2 truncate">
            <Range id="posy" step="0.1" min={min_position_y} max={max_position_y} bind:value={$selectedObject.position.y} />
        </span>
        <span class="w-1/3">
        <NumberInput bind:value={$selectedObject.position.y} />
        </span>
    </div>

    <div class="flex items-center space-x-2 p-1">
        <span class="w-2/3 text-right pr-2 truncate">
            <Range id="posz" step="0.1" min={min_position_z} max={max_position_z} bind:value={$selectedObject.position.z} />
        </span>
        <span class="w-1/3">
        <NumberInput bind:value={$selectedObject.position.z} />
        </span>
    </div>

    
    <br /><p class="text-white dark:text-slate-200">Rotation:</p>
    
    <div class="flex items-center space-x-2 p-1">
        <span  class="w-2/3 text-right pr-2 truncate">
            <Range id="posx" step="0.01" min={min_rotation_x} max={max_rotation_x} bind:value={$selectedObject.rotation.x} />
        </span>
        <span class="w-1/3">
        <NumberInput bind:value={$selectedObject.rotation.x} />
        </span>
    </div>

    <div class="flex items-center space-x-2 p-1">
        <span  class="w-2/3 text-right pr-2 truncate">
            <Range id="posy" step="0.01" min={min_rotation_y} max={max_rotation_y} bind:value={$selectedObject.rotation.y} />
        </span>
        <span class="w-1/3">
        <NumberInput bind:value={$selectedObject.rotation.y} />
        </span>
    </div>

    <div class="flex items-center space-x-2 p-1">
        <span class="w-2/3 text-right pr-2 truncate">
            <Range id="posz" step="0.01" min={min_rotation_z} max={max_rotation_z} bind:value={$selectedObject.rotation.z} />
        </span>
        <span class="w-1/3">
        <NumberInput bind:value={$selectedObject.rotation.z} />
        </span>
    </div>

    
    <br /><p class="text-white dark:text-slate-200">Scale:</p>
    
    <div class="flex items-center space-x-2 p-1">
        <span  class="w-2/3 text-right pr-2 truncate">
            <Range id="posx" step="0.1" min={min_scale_x} max={max_scale_x} bind:value={$selectedObject.scale.x} />
        </span>
        <span class="w-1/3">
        <NumberInput bind:value={$selectedObject.scale.x} />
        </span>
    </div>

    <div class="flex items-center space-x-2 p-1">
        <span  class="w-2/3 text-right pr-2 truncate">
            <Range id="posy" step="0.1" min={min_scale_y} max={max_scale_y} bind:value={$selectedObject.scale.y} />
        </span>
        <span class="w-1/3">
        <NumberInput bind:value={$selectedObject.scale.y} />
        </span>
    </div>

    <div class="flex items-center space-x-2 p-1">
        <span class="w-2/3 text-right pr-2 truncate">
            <Range id="posz" step="0.1" min={min_scale_z} max={max_scale_z} bind:value={$selectedObject.scale.z} />
        </span>
        <span class="w-1/3">
        <NumberInput bind:value={$selectedObject.scale.z} />
        </span>
    </div>
    </AccordionItem>
    <AccordionItem open>
        <svelte:fragment slot="header">Material</svelte:fragment>
        <p class="mb-4 font-semibold text-gray-900 dark:text-white">
            <Checkbox bind:checked={$selectedObject.visible}
            onchange={() => { sendUpdate(); }}>Visible</Checkbox>
        </p>

        <Select id="select-underline" underline class="mt-2" items={materials} bind:value={$selectedObject.material.type}
            on:change={(event) => {
                console.log(event.srcElement.value);
                $selectedObject.material = new THREE[event.srcElement.value];
                sendUpdate();
            }}
        />

        <p class="mb-4 font-semibold text-gray-900 dark:text-white">Shadow</p>
        <ul class="items-center w-full rounded-lg border border-gray-200 sm:flex dark:bg-gray-800 dark:border-gray-600 divide-x rtl:divide-x-reverse divide-gray-200 dark:divide-gray-600">
            <li class="w-full">
                <Checkbox bind:checked={$selectedObject.castShadow}
                    onchange={() => { sendUpdate(); }}
                    class="p-3">Cast
                </Checkbox>
            </li>
            <li class="w-full">
                <Checkbox bind:checked={$selectedObject.receiveShadow}
                    onchange={() => { sendUpdate(); }} 
                    class="p-3">Receive
                </Checkbox>
            </li>
        </ul>
    </AccordionItem>
    </Accordion>
    </div>
    {:else}
    {st=0}

    {/if}

  </Drawer>