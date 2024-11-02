<script lang="ts">
	import { BottomNav } from 'flowbite-svelte';
	import { TControls } from '../../stores/sceneStore';
</script>

<BottomNav
	position="absolute"
	navType="application"
	classOuter="h-10 w-70 bg-white rounded-full dark:bg-gray-700 "
	classInner="grid-cols-7"
>
	<p
		class="group inline-flex items-center justify-center rounded-l-full hover:bg-primary-700 focus:outline-none focus:ring-4 focus:ring-primary-300"
		on:click={(event) => $TControls.setMode('translate')}
	>
		<i class="fas fa-arrows-alt text-black dark:text-slate-200"></i>
	</p>
	<p
		class="group inline-flex items-center justify-center rounded-full hover:bg-primary-700 focus:outline-none focus:ring-4 focus:ring-primary-300"
		on:click={(event) => $TControls.setMode('rotate')}
	>
		<i class="fas fa-rotate-left text-black dark:text-slate-200"></i>
	</p>

	<p
		class="group inline-flex items-center justify-center rounded-full hover:bg-primary-700 focus:outline-none focus:ring-4 focus:ring-primary-300"
		on:click={(event) => $TControls.setMode('scale')}
	>
		<i class="fas fa-expand-arrows-alt text-black dark:text-slate-200"></i>
	</p>
	<div class="flex items-center justify-center">
		<p
			class="group inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary-600 font-medium hover:bg-primary-700 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:focus:ring-primary-800"
			on:click={() => {
				checkPlay();
			}}
		>
			<i class="fas fa-play text-black dark:text-slate-200"></i>
		</p>
	</div>

	<p
		class="group inline-flex items-center justify-center rounded-full hover:bg-primary-700 focus:outline-none focus:ring-4 focus:ring-primary-300"
		on:click={() => document.getElementById('object-list').classList.toggle('hidden')}
	>
		<i class="fas fa-bars text-black dark:text-slate-200"></i>
	</p>
	<p
		class="group inline-flex items-center justify-center rounded-full hover:bg-primary-700 focus:outline-none focus:ring-4 focus:ring-primary-300"
		on:click={() => document.getElementById('flow-list').classList.toggle('hidden')}
	>
		<i class="fas fa-circle-nodes text-black dark:text-slate-200"></i>
	</p>
	<p
		class="group inline-flex items-center justify-center rounded-r-full hover:bg-primary-700 focus:outline-none focus:ring-4 focus:ring-primary-300"
		on:click={(event) => document.getElementById('chat').classList.toggle('hidden')}
	>
		<i class="fas fa-message text-black dark:text-slate-200"></i>
	</p>
</BottomNav>
