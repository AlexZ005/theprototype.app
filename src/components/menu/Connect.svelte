<script lang="ts">
	import { Navbar, NavHamburger, Input, Button } from 'flowbite-svelte';
	import { onMount } from 'svelte';
	function createPeer() {
		return 'xxxxx'.replace(/[xy]/g, function (c) {
			var r = (Math.random() * 16) | 0,
				v = c == 'x' ? r : (r & 0x3) | 0x8;
			return v.toString(16);
		});
	}
	let peer;
	onMount(async () => {
		const { default: Peer } = await import('peerjs');
		peer = new Peer(createPeer(), {
			secure: true,
			host: 'localhost',
			port: 9000
		});
		let displayid = 'disconnected';

		peer.on('open', (id) => {
			displayid = id;
			console.log(id);
		});

		peer.on('connection', handleConnection);

		function handleConnection(conn) {
			conn.on('data', (data) => console.log(data));
		}
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
