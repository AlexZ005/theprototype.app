<script>
  import { Canvas } from '@threlte/core'
  import Scene from './components/Scene.svelte'
  import Menu from './components/Menu.svelte'
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

<Menu />

<Canvas>
  <Scene showGrid={toggleGrid} />
</Canvas>
