<script lang="ts">
    import { Grid } from '@threlte/extras'
    let { showGrid } = $props()
  </script>
  
   {#if showGrid}
    <Grid
      userData={{ ignoreOverrideMaterial: true }}
      infiniteGrid
      renderOrder={9999}
      position={[0,0,0.03]}
      cellColor={0x5f5f5f}
      sectionColor={0x5f5f5f}
      fadeDistance={100}
      />
  {/if}
