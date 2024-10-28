<script lang="ts">
	import { Accordion, AccordionItem, Modal, Button, Checkbox } from 'flowbite-svelte';

	let clickOutsideModal = true;

    // 
	let topcoverName =
		'w-40 flex-shrink-0 z-10 inline-flex items-center py-2.5 px-4 text-sm font-medium text-center text-gray-500 bg-gray-100 border border-gray-300 rounded-tl-lg hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700 dark:text-white dark:border-gray-600';
	let topcoverDescription =
		'w-full z-10 inline-flex items-center py-2.5 px-5 text-sm font-medium text-center text-gray-500 bg-gray-100 border border-gray-300 rounded-tr-lg dark:bg-gray-700 dark:text-white dark:border-gray-600';
	let bottomCoverName =
		'w-40 flex-shrink-0 z-10 inline-flex items-center py-2.5 px-4 text-sm font-medium text-center text-gray-500 bg-gray-100 border border-gray-300 rounded-bl-lg hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700 dark:text-white dark:border-gray-600';
	let bottomCoverDescription =
		'w-full z-10 inline-flex items-center py-2.5 px-5 text-sm font-medium text-center text-gray-500 bg-gray-100 border border-gray-300 rounded-br-lg dark:bg-gray-700 dark:text-white dark:border-gray-600';

        let common = topcoverName.split(' ').filter(word => {
    return [topcoverDescription, bottomCoverName, bottomCoverDescription].every(str => str.includes(word));
});

console.log(common);
</script>

<Modal title="Settings" bind:open={clickOutsideModal} outsideclose>
	<div class="modal-content max-h-[90vh] overflow-y-auto p-4">
		<Accordion>
			<AccordionItem>
				<svelte:fragment slot="header">Scene</svelte:fragment>
				<div class="flex">
					<p class={topcoverName}>
						<Checkbox>&nbsp;Light</Checkbox>
					</p>
					<p class={topcoverDescription}>Forces normal play even if immersive-vr is enabled</p>
				</div>
				<div class="flex">
					<p class={bottomCoverName}>
						<Checkbox>&nbsp;Show grid</Checkbox>
					</p>
					<p class={bottomCoverDescription}>Display grid on floor</p>
				</div>
			</AccordionItem>
			<AccordionItem>
				<svelte:fragment slot="header">About</svelte:fragment>
			</AccordionItem>
		</Accordion>
	</div>
	<svelte:fragment slot="footer">
		<Button>Reset settings</Button>
	</svelte:fragment>
</Modal>
