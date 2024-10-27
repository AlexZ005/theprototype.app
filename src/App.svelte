<script>
  import { Canvas } from '@threlte/core'
  import Scene from './components/Scene.svelte'
  const toggleGridVisibility = () => {
    toggleGrid = !toggleGrid;
  };

  let toggleGrid = $state(false);

  $effect(() => {
    console.log("showGrid2: ", toggleGrid)

  })
</script>

<button on:click={toggleGridVisibility}>
  Toggle Grid Visibility
</button>

<Canvas>
  <Scene showGrid={toggleGrid} />
</Canvas>
