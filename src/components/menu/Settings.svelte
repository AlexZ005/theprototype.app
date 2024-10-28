<script lang="ts">
	import {
		Accordion,
		AccordionItem,
		Modal,
        Button
	} from 'flowbite-svelte';

	let clickOutsideModal = true;

</script>

<Modal title="Settings" bind:open={clickOutsideModal} outsideclose>
    <div class="modal-content overflow-y-auto max-h-[90vh] p-4">
	<Accordion>
		<AccordionItem>
			<svelte:fragment slot="header">Scene</svelte:fragment>
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
