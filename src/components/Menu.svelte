<script lang="ts">
	import Chat from './menu/Chat.svelte';
	import Connect from './menu/Connect.svelte';
	import Controls from './menu/Controls.svelte';
	import Properties from './menu/Properties.svelte';
	import MenuSidebar from './menu/Sidebar.svelte';
	import MenuSettings from './menu/Settings.svelte';
	import { Hamburger } from 'svelte-hamburgers';
	import { DarkMode } from 'flowbite-svelte';
	let open = $state(false);
</script>

<div
	class="burger inline-flex rounded-md shadow-sm"
	style="height: 60px; background-color: rgba(100, 123, 155, 0.4); top: 5px; left: 5px"
>
	<Hamburger bind:open --color="black" />
</div>
<Connect />
<Controls />
<Properties />
<MenuSidebar {open} />
<MenuSettings />
<Chat />

<div class="dark-mode hidden"><DarkMode /></div>
