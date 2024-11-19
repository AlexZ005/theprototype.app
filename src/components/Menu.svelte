<script lang="ts">
	import Chat from './menu/Chat.svelte';
	import Toasts from './menu/Toasts.svelte';
	import Connect from './menu/Connect.svelte';
	import Controls from './menu/Controls.svelte';
	import Properties from './menu/Properties.svelte';
	import PropertiesScene from './menu/PropertiesScene.svelte';
	import PropertiesLight from './menu/PropertiesLight.svelte';
	import MenuSidebar from './menu/Sidebar.svelte';
	import MenuSettings from './menu/Settings.svelte';
	import { DarkMode } from 'flowbite-svelte';
	import Users from './menu/Users.svelte';
</script>

<Connect />
<Controls />
<Properties />
<MenuSidebar />
<PropertiesScene />
<PropertiesLight />
<MenuSettings />
<Toasts />
<Users />
<Chat />

<div class="dark-mode hidden"><DarkMode /></div>
