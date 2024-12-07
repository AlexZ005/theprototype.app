<script>
  import { Canvas } from '@threlte/core'
  import Scene from './components/Scene.svelte'
  import Menu from './components/Menu.svelte'
  import Flow from './components/Flow.svelte'
  import { isLocked } from './stores/sceneStore'
</script>

{#if !$isLocked}
<Flow />
<Menu />
{/if}

<Canvas>
  <Scene />
</Canvas>
