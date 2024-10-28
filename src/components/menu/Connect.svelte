<script lang="ts">
	import { Navbar, NavHamburger, Input, Button } from 'flowbite-svelte';
	import { onMount } from 'svelte';
	import { createPeer, PeerConnection } from '../../lib/peerHandler';

	let displayid = 'disconnected';

	function updateDisplayId(id) {
		displayid = id;
	}

	onMount(async () => {
		const id = createPeer();

		new PeerConnection(id, updateDisplayId);
	});
</script>

<div
	class="p-8"
	style="position: absolute; top: 35px; left: 50%; transform: translate(-50%, -50%); z-index: 1;"
>
	<Navbar rounded color="form">
		<div class="inline-flex rounded-md shadow-sm" role="group">
			<Input
				type="text"
				placeholder="Enter peer ID to connect"
				class="nob rounded-r-none border-0 "
			/>
			<Button
				color="primary"
				class="nob rounded-l-none rounded-r-lg bg-blue-500 text-white dark:bg-blue-700 dark:text-gray-200"
				>Connect</Button
			>
		</div>

		<NavHamburger />
	</Navbar>
</div>
