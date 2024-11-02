<script lang="ts">
	import { BottomNav } from 'flowbite-svelte';
	import { TControls } from '../../stores/sceneStore';

    let classActive = "group inline-flex items-center justify-center hover:bg-primary-700 focus:outline-none focus:ring-4 focus:ring-primary-300"
</script>

<BottomNav
	position="absolute"
	navType="application"
	classOuter="h-10 w-70 bg-white rounded-full dark:bg-gray-700 "
	classInner="grid-cols-7"
>
	<p
		class={classActive+' rounded-l-full'}
		on:click={(event) => $TControls.setMode('translate')}
	>
		<i class="fas fa-arrows-alt text-black dark:text-slate-200"></i>
	</p>
	<p
		class={classActive}
		on:click={(event) => $TControls.setMode('rotate')}
	>
		<i class="fas fa-rotate-left text-black dark:text-slate-200"></i>
	</p>

	<p
		class={classActive}
		on:click={(event) => $TControls.setMode('scale')}
	>
		<i class="fas fa-expand-arrows-alt text-black dark:text-slate-200"></i>
	</p>
	<div class="flex items-center justify-center">
		<p
			class={classActive+ ' h-10 w-10  bg-primary-600 font-medium dark:focus:ring-primary-800'}
		>
		</p>
	</div>

	<p
		class={classActive}
		on:click={() => document.getElementById('object-list').classList.toggle('hidden')}
	>
		<i class="fas fa-bars text-black dark:text-slate-200"></i>
	</p>
	<p
		class={classActive}
		on:click={() => document.getElementById('flow-list').classList.toggle('hidden')}
	>
		<i class="fas fa-circle-nodes text-black dark:text-slate-200"></i>
	</p>
	<p
		class={classActive+' rounded-r-full'}
		on:click={(event) => document.getElementById('chat').classList.toggle('hidden')}
	>
		<i class="fas fa-message text-black dark:text-slate-200"></i>
	</p>
</BottomNav>

<p
    class={classActive+' bg-primary-600 font-medium dark:focus:ring-primary-800 rounded-full'}
    style="position: absolute; height: 50px; width: 50px; bottom: 10px; z-index: 100;
        display: flex; left: 50%; transform: translate(-50%,0)"
    on:click={() => {
        checkPlay();
    }}
>
    <i class="fas fa-play text-black dark:text-slate-200 hover:scale-110" style="font-size: 25px;"></i>
</p>