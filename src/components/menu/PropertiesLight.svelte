<script>
	import { Accordion, AccordionItem, Tooltip, Drawer, Checkbox, CloseButton, NumberInput, Input, Range, Select } from 'flowbite-svelte';
	import { globalScene, objectsGroup, TControls, selectedObject } from '../../stores/sceneStore';
	import { peers, chatHidden, lightPropertiesClose, toggleExpand } from '../../stores/appStore.js';
	import ColorPicker, { ChromeVariant } from 'svelte-awesome-color-picker';
	import CustomWrapper from '$lib/ColorWrapper.svelte';
	import { sineIn } from 'svelte/easing';

    const hexColor = /^#[0-9A-F]{6}$/i;
    let color = $state();
	let near = $state(10);
	let far = $state(15);
	let hemisphereGroundColor = $state(0xffffff);

	let moving;
	let {
		min_position_x,
		max_position_x,
		min_position_y,
		max_position_y,
		min_position_z,
		max_position_z
	} = $state(0); //reactivity for slider min/max values

	let transitionParamsRight = {
		x: 320,
		duration: 200,
		easing: sineIn
	};

	let st = $state(0);
	let rerenderSelectGroup = $state(0)

	let groups = $state([{
        value: 'none',
	    name: 'None'
	}]);

	function event(node) {
		//Center slide
		//-3 = -1 +5 //-2 = 0 +4 //-1 = -1 +3
		//0 = -2 +2 //1 = -3 +1 //2 = -4  0
		min_position_x = $selectedObject.position.x - ($selectedObject.position.x + 2);
		max_position_x = $selectedObject.position.x + ($selectedObject.position.x - 2) * -1;
		min_position_y = $selectedObject.position.y - ($selectedObject.position.y + 2);
		max_position_y = $selectedObject.position.y + ($selectedObject.position.y - 2) * -1;
		min_position_z = $selectedObject.position.z - ($selectedObject.position.z + 2);
		max_position_z = $selectedObject.position.z + ($selectedObject.position.z - 2) * -1;

		node.addEventListener('mousedown', () => {
			moving = true;
		});

        window.addEventListener('mousemove', (e) => {
		if (typeof $selectedObject !== 'undefined')
		if ($selectedObject.type.endsWith('Light')) {
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
			if (typeof $selectedObject !== 'undefined')
			{
			min_position_x = $selectedObject.position.x - 5;
			max_position_x = $selectedObject.position.x + 5;
			min_position_y = $selectedObject.position.y - 5;
			max_position_y = $selectedObject.position.y + 5;
			min_position_z = $selectedObject.position.z - 5;
			max_position_z = $selectedObject.position.z + 5;
			}
		});
	}

	// Drawer show full screen
	let drawerStyle = $state();

	$effect(() => {
		if ($chatHidden === '') {
	        drawerStyle="bottom: 350px; z-index: 48; border-bottom-left-radius: 0.5rem;"
		} else {
			drawerStyle = 'bottom: 0px; z-index: 48';
		}
	});
    function sendUpdate() {        
        $peers.send({
            type: 'object',
            element: $selectedObject.toJSON(),
            override: true
        });
    }

	function sendTransformUpdate() {
    if (typeof $TControls.object !== 'undefined')
			if (typeof $TControls.object.parent !== 'undefined')
				if (typeof $TControls.object.uuid !== 'undefined') {
					$TControls.visible = true;
					$peers.send({
						type: 'move',
						uuid: $TControls.object.uuid,
						pos: $TControls.object.position.toArray(),
						rot: $TControls.object.rotation.toArray(),
						scale: $TControls.object.scale.toArray()
					});
				}
}
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
	bind:hidden={$lightPropertiesClose}
	class="rounded-tl-lg"
	id="sidebar-light"
>
	<div class="flex items-center">
		<h5
			id="drawer-label"
			class="mb-4 inline-flex items-center text-base font-semibold text-gray-500 dark:text-gray-400"
		>
			Light Properties
		</h5>
		<CloseButton
			on:click={() => {
				lightPropertiesClose.set(true);
				st = 0;
			}}
			class="mb-4 dark:text-white"
		/>
	</div>
	{#if $selectedObject}
		{(st = null)}
    <div use:event>
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
    
    <p
    on:click={() => { 
        groups = $selectedObject.parent.children
					.map((item) => (item.type === 'Group' ? { name: item.name, value: item.uuid } : null))
					.filter(Boolean);
        if($selectedObject.parent.parent.parent !== null)
        groups.push({ name: 'Level Up', value: $selectedObject.parent.parent.uuid })
        groups = groups.filter(item => item.value !== $selectedObject.uuid)
     }}>
    {#key rerenderSelectGroup}
    <Select id="select-group" underline class="mt-2" items={groups} placeholder="Move to group"
    on:change={(event) => {
        let selectedGroup = $objectsGroup.getObjectByProperty('uuid', event.srcElement.value);
        
        let selected = groups.find(item => item.value === event.srcElement.value)

        if (selected.name === "Level Up") {
            $toggleExpand = $selectedObject.parent.uuid;
            $peers.send({ type: 'group', uuid: $selectedObject.uuid, group: 'up' });
        } else {
            $toggleExpand = selectedGroup.uuid;
            $peers.send({ type: 'group', uuid: $selectedObject.uuid, group: selectedGroup.uuid });
        }
        selectedGroup.attach($selectedObject);
        $objectsGroup = $objectsGroup;
        
        // Trigger to refresh the select group as it have only on change
		// and we want to run event even if the same value is selected
        rerenderSelectGroup = rerenderSelectGroup ? false : true
    }}
    />
    {/key}
    </p>
    <Tooltip placement='bottom' arrow={false} triggeredBy="#uuid">Move to group</Tooltip>

    <Accordion multiple class="text-white dark:text-slate-200 w-full" flush>
        <AccordionItem>
        <svelte:fragment slot="header">Color</svelte:fragment>
		<ColorPicker
			isAlpha={false}
			isTextInput={false}
			isDialog={false}
			components={{ ...ChromeVariant, wrapper: CustomWrapper }}
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
				$selectedObject.color.set(event.detail.hex);
				color = event.detail.hex;
                sendUpdate();
			}}
		/>
		<Input
			type="text"
			bind:value={color}
            oninput={() => {
                if(hexColor.test(color)) {
                    $selectedObject.color.set(color);
                    sendUpdate();
                }
            }}
		/>
    </AccordionItem>

    {#if $selectedObject.type == 'HemisphereLight'}
    <AccordionItem>
        <svelte:fragment slot="header">Ground Color</svelte:fragment>
			<br />
			<ColorPicker
				isAlpha={false}
				isTextInput={false}
				isDialog={false}
				components={{ ...ChromeVariant, wrapper: CustomWrapper }}
				isOpen={true}
				sliderDirection="horizontal"
				--picker-indicator-size="20px"
				--cp-bg-color="#1f2937"
				--cp-border-color="#353f4e"
				--picker-height="70px"
				--picker-width="50px"
				--slider-width="10px"
				bind:value={hemisphereGroundColor}
				on:input={(event) => {
					$selectedObject.groundColor.set(event.detail.hex);
					hemisphereGroundColor = event.detail.hex;
                    sendUpdate();

				}}
			/>
			<Input
				type="text"
				bind:value={hemisphereGroundColor}
				oninput={() => {
                    if(hexColor.test(hemisphereGroundColor)) {
                        $selectedObject.groundColor.set(hemisphereGroundColor);
                        sendUpdate();
                    }
				}}
			/>
        </AccordionItem>
		{/if}

        <AccordionItem>
            <svelte:fragment slot="header">Intensity</svelte:fragment>		
		

		<div class="flex items-center space-x-2 p-1">
			<span class="w-2/3 truncate pr-2 text-right">
				<Range step="0.1" min="0" max="10" bind:value={$selectedObject.intensity}
                onchange={() => { sendUpdate(); }} />
			</span>
			<span class="w-1/3">
				<NumberInput bind:value={$selectedObject.intensity}
                oninput={() => { sendUpdate(); }} />
			</span>
		</div>
    </AccordionItem>

		{#if $selectedObject.type !== 'AmbientLight'}
        <AccordionItem>
        <svelte:fragment slot="header">Position</svelte:fragment>

			
				<div class="flex items-center space-x-2 p-1">
					<span class="w-2/3 truncate pr-2 text-right">
						<Range
							step="0.1"
							min={min_position_x}
							max={max_position_x}
							bind:value={$selectedObject.position.x}
							onchange={() => { sendTransformUpdate(); }}
						/>
					</span>
					<span class="w-1/3">
						<NumberInput bind:value={$selectedObject.position.x}
						onchange={() => { sendTransformUpdate(); }}
						/>
					</span>
				</div>

				<div class="flex items-center space-x-2 p-1">
					<span class="w-2/3 truncate pr-2 text-right">
						<Range
							step="0.1"
							min={min_position_y}
							max={max_position_y}
							bind:value={$selectedObject.position.y}
							onchange={() => { sendTransformUpdate(); }}
						/>
					</span>
					<span class="w-1/3">
						<NumberInput bind:value={$selectedObject.position.y}
						onchange={() => { sendTransformUpdate(); }}
						/>
					</span>
				</div>

				<div class="flex items-center space-x-2 p-1">
					<span class="w-2/3 truncate pr-2 text-right">
						<Range
							step="0.1"
							min={min_position_z}
							max={max_position_z}
							bind:value={$selectedObject.position.z}
							onchange={() => { sendTransformUpdate(); }}
						/>
					</span>
					<span class="w-1/3">
						<NumberInput bind:value={$selectedObject.position.z}
						onchange={() => { sendTransformUpdate(); }}
						/>
					</span>
				</div>
            </AccordionItem>
			{#if $selectedObject.type == 'DirectionalLight'}
            <AccordionItem>
            <svelte:fragment slot="header">Parameters</svelte:fragment>
				<Checkbox bind:checked={$selectedObject.castShadow}
                    onchange={() => { sendUpdate(); }}>Cast Shadow</Checkbox>

				<br />
				<p class="text-white dark:text-slate-200">Shadow Intensity:</p>
				<div class="flex items-center space-x-2 p-1">
					<span class="w-2/3 truncate pr-2 text-right">
						<Range
							step="0.1"
							min="0"
							max="5"
							bind:value={$selectedObject.shadow.intensity}
                            onchange={() => { sendUpdate(); }}
						/>
					</span>
					<span class="w-1/3">
						<NumberInput bind:value={$selectedObject.shadow.intensity}
                        oninput={() => { sendUpdate(); }} />
					</span>
				</div>
            </AccordionItem>
			{/if}

		{/if}
        </Accordion>
        <br />
		<Checkbox bind:checked={$selectedObject.visible}
        onchange={() => { sendUpdate(); }}>Visible</Checkbox>
        </div>
	{:else}
		{(st = 0)}
	{/if}
</Drawer>
