<script lang="ts">
	import '../../app.css';

	import {
		Sidebar,
		SidebarGroup,
		SidebarItem,
		SidebarWrapper,
		SidebarDropdownWrapper,
		SidebarDropdownItem,
		Radio,
		Dropdown,
	} from 'flowbite-svelte';

	let spanClass = 'flex-1 ms-3 whitespace-nowrap';
</script>

<Sidebar>
	<SidebarWrapper>
		<SidebarGroup>
			<!-- <div class="text-sm font-medium text-gray-500">Primitives</div> -->
			<SidebarDropdownWrapper label="Primitives">
				<svelte:fragment slot="arrowup">
					<svg
						style="transform: rotate(180deg);"
						xmlns="http://www.w3.org/2000/svg"
						width="16"
						height="16"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					>
						<polyline points="18 9 12 15 6 9"></polyline>
					</svg>
				</svelte:fragment>
				<svelte:fragment slot="arrowdown">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="16"
						height="16"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					>
						<polyline points="18 9 12 15 6 9"></polyline>
					</svg>
				</svelte:fragment>
				<SidebarDropdownItem label="🧊Cube" on:click={console.log('Cube')}>
					<svelte:fragment slot="icon"></svelte:fragment>
				</SidebarDropdownItem>
				<SidebarDropdownItem label="🔼Cone" on:click={console.log('Cone')}>
					<svelte:fragment slot="icon"></svelte:fragment>
				</SidebarDropdownItem>
				<SidebarDropdownItem label="🟠Sphere" on:click={console.log('Sphere')}>
					<svelte:fragment slot="icon"></svelte:fragment>
				</SidebarDropdownItem>
			</SidebarDropdownWrapper>

			<input type="file" id="load-file" style="display: none" on:change={console.log('Load')} />
		</SidebarGroup>
		<SidebarGroup border>
			<SidebarItem label="Clear Scene" {spanClass} on:click={console.log('Clear')}></SidebarItem>

			<SidebarItem
				label="Settings"
				{spanClass}
				style="padding-right: 40px"
				on:click={console.log('Settings')}
			>
				<svelte:fragment slot="icon">⚙️</svelte:fragment>
			</SidebarItem>
		</SidebarGroup>
	</SidebarWrapper>
</Sidebar>

<style>
	:global(.switchMenu) {
		display: flex;
	}
</style>
