<script lang="ts">
    import { peers, loading, loadingcount, pendingApprovals, waitingForApproval, userdata, toastStore, fixLight, showSidebar, specatorMode } from '../../stores/appStore'
    import { sceneCommand } from '$lib/commandsHandler.svelte';
	import { objectsGroup, camSave, globalCamera, globalScene } from '../../stores/sceneStore.js';
	import { Progressbar, Toast, Button } from 'flowbite-svelte';
    import { fly } from 'svelte/transition';

let showToast = $state(false);

$effect(() => {
    if($loading.length > 0) showToast = true;
    if($loading.length > 0)
    if($objectsGroup)
    // Remove loaded UUIDs from the loading array
    // once their corresponding objects are available
    $loading.forEach((uuid) => {
        $objectsGroup.getObjectByProperty('uuid', uuid)
        if ($objectsGroup.getObjectByProperty('uuid', uuid)) {
            $loading.splice($loading.indexOf(uuid, 0), 1);
            $loading = $loading // Trigger reactivity
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
if (--counter > 0) return setTimeout(timeout, 4000);
toastStatus = false;
}
</script>
<div class="my-4"
style="position: absolute; top: 65px; left: 50%; max-width: 500px; transform: translate(-50%, 0%); z-index: 40;"
>
{#if showToast}
{#if $loadingcount > 0}
<Toast  dismissable={false} transition={fly} bind:toastStatus>
	<div class="mb-1 text-base font-medium text-green-700 dark:text-green-500">Receiving objects: {($loadingcount-$loading.length)}/{$loadingcount}</div>
	<Progressbar progress="{100 * (($loadingcount-$loading.length) - 0) / ($loadingcount - 0)}" color="green" />
</Toast>
{/if}
{/if}


{#each $pendingApprovals as approval}
<div class="my-1">
{#if approval.status != 'retry'}
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
{:else}
<Toast  transition={fly} class="p-2 rounded-lg dark:bg-green-800 dark:border-dark-700 border-2 border-green-500" divClass="flex items-center gap-3">
    <div style="position: relative; left: 50%; transform: translate(-25%, -50%);">

    </div>
    <div class="mb-1 text-base font-medium text-green-700 dark:text-green-500 inline-flex items-center">
        
        <p class="text-sm font-medium text-gray-500 dark:text-gray-200 pr-4 overflow-hidden max-w-80">
            Connection &nbsp;{approval.peerId} already exists
        </p>


        <Button
            color="primary"
            class="nob rounded bg-blue-500 text-white dark:bg-green-600 dark:text-gray-200 dark:hover:bg-green-700"
            onclick={() => {
                console.log($peers.connections[approval.peerId])
                $peers.connections[approval.peerId].close();
                // $peers.peers[approval.peerId].close()
                // Remove approved peer from pending approvals
                $pendingApprovals = $pendingApprovals.filter(peer => peer.peerId !== approval.peerId);

                // Add peer to user data (whitelist)
                // let data = [approval.peerId, '', '']
                // $userdata.push(data);

                // Broadcast updated whitelist to all connected peers
                $peers.send({type: 'userdata', userdata: $userdata})

                // Simply connect as requester whitelisted us
                $peers.connectToPeer(approval.peerId, true);
            }}
            >Retry</Button
        >

    </div>
</Toast>
{/if}
</div>
{/each}

{#if (typeof localStorage !== 'undefined' && !localStorage.getItem('hasSeenDisclaimer'))}
<div class="my-1">
    <Toast  transition={fly} class="p-2 rounded-lg dark:bg-red-300 dark:border-dark-700 border-2 border-red-500" divClass="flex items-center gap-3" on:close={() => 
        { localStorage.setItem('hasSeenDisclaimer', 'true'); }
        }>
        <div style="position: relative; left: 50%; transform: translate(-25%, -50%);">
    
        </div>
        <div class="mb-1 text-base font-medium text-black-700 dark:text-brack-500 inline-flex items-center">
            
            <p class="text-sm font-medium text-gray-500 dark:text-gray-800 pr-4 overflow-hidden max-w-80">
                This is a pre-alpha version of the application.<br />
                Some features may be incomplete or buggy.
            </p>
        </div>
    
    </Toast>
    </div>
{/if}

{#if $specatorMode}
<div class="my-1">
    <Toast dismissable={false} transition={fly} class="p-2 rounded-lg dark:bg-gray-700 dark:border-dark-700  border-2 border-red-500" divClass="flex items-center gap-3" on:close={() => 
        { localStorage.setItem('hasSeenDisclaimer', 'true'); }
        }>
        <div style="position: relative; left: 50%; transform: translate(-25%, -50%);">
    
        </div>
        <div class="mb-1 text-base font-medium text-black-700 dark:text-brack-500 inline-flex items-center">
            
            <p class="text-sm font-medium text-gray-500 dark:text-gray-200 pr-4 overflow-hidden max-w-80">
                
                Watching: {$specatorMode}<br />
                
            </p>
            <Button
            color="primary"
            class="nob rounded bg-blue-500 text-white dark:bg-green-600 dark:text-gray-200 dark:hover:bg-green-700"
            onclick={() => {
                let dolly = $globalScene.getObjectByName('dolly')
                dolly.attach($globalCamera)
                $globalScene.getObjectByName($specatorMode).visible = true
                $specatorMode = false;
                $globalCamera.position.copy($camSave.position)
                $globalCamera.rotation.copy($camSave.rotation)
                $globalCamera.fov = $camSave.fov
                $globalCamera.updateProjectionMatrix()


                //specating has ended send camera position once to appear for peers
                $peers.send({ type: 'camera', peerId: $peers.peer.id, position: $globalCamera.position.toArray(), rotation: $globalCamera.rotation.toArray() });
                $peers.send({ type: 'specator', peerId: $peers.peer.id, watching: 'false' });
                // $globalCamera.zoom = $camSave.zoom
            }}
            >Exit</Button
        >
        </div>
    
    </Toast>
    </div>
{/if}

{#if $fixLight}
<div class="my-1">
    <Toast  transition={fly} class="p-2 rounded-lg dark:bg-gray-700 dark:border-dark-700 border-2 border-red-500" divClass="flex items-center gap-3" on:close={() => 
        { localStorage.setItem('hasSeenDisclaimer', 'true'); }
        }>
        <div style="position: relative; left: 50%; transform: translate(-25%, -50%);">
    
        </div>
        <div class="mb-1 text-base font-medium text-gray-300 dark:text-brack-500 inline-flex items-center">
            
            <p class="text-sm font-medium text-gray-200 dark:text-gray-200 pr-4 overflow-hidden max-w-80">
                There is no light in the scene<br />
                Click FIX to add hemisphere. 
            </p>
            <Button
            color="primary"
            class="nob rounded bg-blue-500 text-white dark:bg-green-600 dark:text-gray-200 dark:hover:bg-green-700"
            onclick={() => {
                showSidebar('lightProperties');
                sceneCommand('/light hemisphere');
                $fixLight = false;
            }}
            >Fix</Button
        >
        </div>
    
    </Toast>
    </div>
{/if}

{#each $waitingForApproval as status}
{#if status[1] === 'pending'}
<div class="my-1">
<Toast  transition={fly} class="p-2 rounded-lg dark:bg-green-800 dark:border-dark-700 border-2 border-green-500" divClass="flex items-center gap-3">
    <div style="position: relative; left: 50%; transform: translate(-25%, -50%);">

    </div>
    <div class="mb-1 text-base font-medium text-green-700 dark:text-green-500 inline-flex items-center">
        
        <p class="text-sm font-medium text-gray-500 dark:text-gray-400 pr-4 overflow-hidden max-w-80">
            Connection request to peer:&nbsp;{status[0]} <br />
            Status: {status[1]}
        </p>
    </div>

</Toast>
</div>
{/if}
{/each}

{#each $toastStore as toast}
<div class="my-1">
    <Toast
        dismissable={false}
        oncreate={setTimeout(() => {
            $toastStore = $toastStore.filter((t) => t !== toast);
        }, 3000)}
        transition={fly}
        class="dark:border-dark-700 rounded-lg border-2 border-green-500 p-2 dark:bg-green-800"
        divClass="flex items-center gap-3">
        <div style="position: relative; left: 50%; transform: translate(-25%, -50%);"></div>
        <div class="mb-1 inline-flex items-center text-base font-medium text-green-700 dark:text-green-500">
            <p class="max-w-80 overflow-hidden pr-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                {toast}
            </p>
        </div>
    </Toast>
</div>
{/each}

</div>