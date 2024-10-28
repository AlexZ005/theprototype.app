<script lang="ts">
	import {
		Accordion,
		AccordionItem,
		Modal,
        Button,
        Checkbox
	} from 'flowbite-svelte';

	let clickOutsideModal = true;

</script>

<Modal title="Settings" bind:open={clickOutsideModal} outsideclose>
    <div class="modal-content overflow-y-auto max-h-[90vh] p-4">
	<Accordion>
		<AccordionItem>
			<svelte:fragment slot="header">Scene</svelte:fragment>
            <div class="flex ">
                <p class="w-40 flex-shrink-0 z-10 inline-flex items-center py-2.5 px-4 text-sm font-medium text-center text-gray-500 bg-gray-100 border border-gray-300 rounded-tl-lg hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700 dark:text-white dark:border-gray-600">
                  <Checkbox>&nbsp;VR override</Checkbox>
                </p>
                <p class="w-full z-10 inline-flex items-center py-2.5 px-5 text-sm font-medium text-center text-gray-500 bg-gray-100 border border-gray-300 rounded-tr-lg dark:bg-gray-700 dark:text-white dark:border-gray-600">
                  Forces normal play even if immersive-vr is enabled
                </p>
              </div>
            <div class="flex ">
              <p class="w-40 flex-shrink-0 z-10 inline-flex items-center py-2.5 px-4 text-sm font-medium text-center text-gray-500 bg-gray-100 border border-gray-300 rounded-bl-lg hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700 dark:text-white dark:border-gray-600">
                <Checkbox>&nbsp;Show grid</Checkbox>
              </p>
              <p class="w-full z-10 inline-flex items-center py-2.5 px-5 text-sm font-medium text-center text-gray-500 bg-gray-100 border border-gray-300 rounded-br-lg dark:bg-gray-700 dark:text-white dark:border-gray-600">
                Display grid on floor
              </p>
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
