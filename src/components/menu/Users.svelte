<script lang="ts">
	import { Avatar } from 'flowbite-svelte';
</script>

<div style="position: fixed; right: 0px; z-index: 999;">
    <div class="flex" style=" position: absolute; top: 15px; right: 100px;">
        <Avatar stacked />
        <Avatar stacked />
        <Avatar stacked />
        <Avatar stacked href="/" class="bg-gray-700 text-white hover:bg-gray-600 text-sm">+99</Avatar>
    </div>
	<div id="avatar-menu" class="mr-5 flex w-52 items-center md:order-2">
		<div class="flex items-center space-x-3">
			<Avatar
				src=""
				style="position: absolute; top: 10px; right: 10px;"
				class="h-12 w-12 rounded-full border-2 dark:border-gray-800 "
			/>
		</div>
	</div>
</div>
