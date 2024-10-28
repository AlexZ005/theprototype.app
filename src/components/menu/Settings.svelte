<script lang="ts">
	import { Accordion, AccordionItem, Modal, Button, Checkbox } from 'flowbite-svelte';

	let clickOutsideModal = true;

	//Rounded corners for options
	let coverClass =
		'z-10 inline-flex items-center py-2.5 text-sm font-medium text-center text-gray-500 bg-gray-100 border border-gray-300 dark:bg-gray-700 dark:text-white dark:border-gray-600';
	let topcoverName =
		'w-40 flex-shrink-0 px-4 rounded-tl-lg hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 dark:hover:bg-gray-600 dark:focus:ring-gray-700 ' + coverClass;
	let topcoverDescription = 'w-full px-5 rounded-tr-lg ' + coverClass;
	let bottomCoverName =
		'w-40 flex-shrink-0 px-4 rounded-bl-lg hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 dark:hover:bg-gray-600 dark:focus:ring-gray-700 ' + coverClass;
	let bottomCoverDescription = 'w-full px-5 rounded-br-lg ' + coverClass;

</script>

<Modal title="Settings" bind:open={clickOutsideModal} outsideclose>
	<div class="modal-content max-h-[90vh] overflow-y-auto p-4">
		<Accordion>
			<AccordionItem>
				<svelte:fragment slot="header">Scene</svelte:fragment>
				<div class="flex">
					<p class={topcoverName}>
						<Checkbox disabled>&nbsp;VR override</Checkbox>
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
