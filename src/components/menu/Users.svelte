<script lang="ts">
	import { Avatar, Tooltip, Popover, Button } from 'flowbite-svelte';
	import {
		chatHidden,
		propertiesClose,
		lightPropertiesClose,
		scenePropertiesClose,
		peers
	} from '../../stores/appStore.js';

	$effect(() => {
		Object.keys($peers.connections).forEach((element) => {
			// if(element != peerId)
			console.log(element);
		});
	});
</script>

<div style="position: fixed; right: 0px; z-index: 999;">
	<div class="flex" style=" position: absolute; top: 15px; right: 100px;">
		{#if $peers}
			{#if Object.keys($peers.connections).length > 2}
				<Avatar href="/" stacked />
				<Tooltip placement="top" arrow={false}>
					{Object.keys($peers.connections)[0]}
					{#if $peers.peer.connections[Object.keys($peers.connections)[0]].length >= 1}
						<span style="font-size: 8px;">🟢</span>
					{:else}
						<span style="font-size: 8px;">🟡</span>
					{/if}
				</Tooltip>

				<Avatar href="/" stacked />
				<Tooltip placement="top" arrow={false}>
					{Object.keys($peers.connections)[1]}
					{#if $peers.peer.connections[Object.keys($peers.connections)[1]].length >= 1}
						<span style="font-size: 8px;">🟢</span>
					{:else}
						<span style="font-size: 8px;">🟡</span>
					{/if}
				</Tooltip>

				<Avatar
					id="b2"
					stacked
					class="bg-gray-700 text-sm text-white hover:bg-gray-600"
					onclick={() => console.log($peers.connections)}
					><button>+{Object.keys($peers.connections).length - 2}</button></Avatar
				>

				<Popover
					triggeredBy="#b2"
					class="w-64 bg-white text-sm font-light text-gray-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400"
				>
					<div class="p-3">
						{#each Object.keys($peers.connections) as peer, i}
							{#if i > 1}
								<ul class="w-full items-center divide-gray-200 text-sm font-medium dark:divide-gray-600 dark:border-gray-600 dark:bg-gray-800 sm:flex">
									<li class="w-full">
										<Avatar href="/" alt="Jese Leos" />
									</li>
									<li class="w-full">{peer}</li>
									<li class="w-full">
										{#if $peers.peer.connections[peer].length >= 1}
											<span style="font-size: 8px;">🟢</span>
										{:else}
											<span style="font-size: 8px;">🟡</span>
										{/if}
									</li>
								</ul>
							{/if}
						{/each}
					</div>
				</Popover>
			{:else}
				<div style=" position: absolute; right: 0px;">
					<div class="flex items-center space-x-3">
						{#each Object.keys($peers.connections) as peer}
							<Avatar href="/" stacked />

							<Tooltip placement="top" arrow={false} class="w-20">
								<div style="display: flex; align-items: center;">
									{peer}&nbsp;
									{#if $peers.peer.connections[peer].length >= 1}
										<span style="font-size: 8px;">🟢</span>
									{:else}
										<span style="font-size: 8px;">🟡</span>
									{/if}
								</div>
							</Tooltip>
						{/each}
					</div>
				</div>
			{/if}
		{/if}
	</div>
	<div id="avatar-menu" class="mr-5 flex w-52 items-center md:order-2">
		<div class="flex items-center space-x-3">
			<Avatar
				href="/"
				src=""
				style="position: absolute; top: 10px; right: 10px;"
				class="h-12 w-12 rounded-full border-2 dark:border-gray-800 "
			/>
		</div>
	</div>
</div>
