<script lang="ts">
	import { peers, loading, loadingcount } from '../../stores/appStore'
	import { objectsGroup } from '../../stores/sceneStore.js';
	import { Progressbar, Toast } from 'flowbite-svelte';
    import { fly } from 'svelte/transition';

let showToast = $state(false);

$effect(() => {
    if($loading.length > 0) showToast = true;
    if($loading.length > 0)
    if($objectsGroup)
    $objectsGroup.children.forEach((object) => {
        if ($loading.includes(object.uuid)) {
            // count++;
            console.log(object.uuid)
            // $loading.pop(object.uuid)
            const index = $loading.indexOf(object.uuid, 0);
            if (index > -1) {
                $loading.splice(index, 1);
                console.log($loading)
                $loading = $loading // Trigger reactivity
            }

        }
    })
    
    if (($loadingcount-$loading.length) === $loadingcount) {
        trigger();
    }
});

let toastStatus = $state(true);

let counter = 2;

function trigger() {
toastStatus = true;
counter = 2;
timeout();
}

function timeout() {
if (--counter > 0) return setTimeout(timeout, 1000);
toastStatus = false;
}
</script>

{#if showToast}
<div class="my-4"
style="position: absolute; top: 105px; left: 50%; width: 300px; transform: translate(-50%, -50%); z-index: 300;"
>
<Toast  dismissable={false} transition={fly} bind:toastStatus>
	<div class="mb-1 text-base font-medium text-green-700 dark:text-green-500">Receiving objects: {($loadingcount-$loading.length)}/{$loadingcount}</div>
	<Progressbar progress="{100 * (($loadingcount-$loading.length) - 0) / ($loadingcount - 0)}" color="green" />
</Toast>
  </div>
{/if}