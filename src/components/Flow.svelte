<script lang="ts">
	import { flowGraphClose } from '../stores/appStore.js';
	import { Drawer } from 'flowbite-svelte';
	let transitionParamsRight = {
		z: 320,
		y: 0,
		duration: 200
	};
	import { SvelteFlowProvider } from '@xyflow/svelte';
	import Nodes from './editors/Nodes.svelte';
</script>

<Drawer
	id="flow-list"
    class="hidden"
	backdrop={false}
	activateClickOutside={false}
	bottomOffset="w-full bottom-0"
	style="z-index: 3; height: 200px"
	placement="bottom"
	transitionType="fly"
	transitionParams={transitionParamsRight}
	hidden={$flowGraphClose}
>
	<div style="position: absolute; left: 50%; transform: translate(-50%, -50%); top: 20%;">
		<p style=" width: 100%; display: flex; justify-content: center;" class="text-xl text-gray-400">
			This mysterious feature is under development
		</p>
		<p style=" width: 100%; display: flex; justify-content: center;" class="text-sm text-white">
			Please come back later
		</p>
	</div>

	<SvelteFlowProvider>
		<Nodes />
	</SvelteFlowProvider>
</Drawer>
