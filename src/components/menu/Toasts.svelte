<script lang="ts">
	import { peers, loading, loadingcount, pendingApprovals, userdata } from '../../stores/appStore'
	import { objectsGroup } from '../../stores/sceneStore.js';
	import { Progressbar, Toast, Button } from 'flowbite-svelte';
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

<div class="my-4"
style="position: absolute; top: 65px; left: 50%; max-width: 500px; transform: translate(-50%, 0%); z-index: 40;"
>
{#each $pendingApprovals as approval}
<div class="my-1">
<Toast  transition={fly} class="p-2 rounded-lg dark:bg-green-800 dark:border-dark-700 border-2 border-green-500" divClass="flex items-center gap-3">
    <div style="position: relative; left: 50%; transform: translate(-25%, -50%);">

    </div>
    <div class="mb-1 text-base font-medium text-green-700 dark:text-green-500 inline-flex items-center">
        
        <p class="text-sm font-medium text-gray-500 dark:text-gray-200 pr-4 overflow-hidden max-w-80">
            Connection request from peer:&nbsp;{approval.peerId}
        </p>


        <Button
            color="primary"
            class="nob rounded bg-blue-500 text-white dark:bg-green-600 dark:text-gray-200 dark:hover:bg-green-700"
            onclick={() => {
                // Remove approved peer from pending approvals
                $pendingApprovals = $pendingApprovals.filter(peer => peer.peerId !== approval.peerId);

                // Add peer to user data (whitelist)
                let data = [approval.peerId, '', '']
                $userdata.push(data);

                // Broadcast updated whitelist to all connected peers
                $peers.send({type: 'userdata', userdata: $userdata})

                // Simply connect as requester whitelisted us
                $peers.connectToPeer(approval.peerId, true);
            }}
            >Approve</Button
        >

    </div>

</Toast>
</div>
{/each}
</div>