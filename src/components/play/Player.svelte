<script lang="ts">
    import { T } from '@threlte/core'
    import { Vector3 } from 'three'
    import PointerLockControls from './PointerLockControls.svelte'
    import { playerCam } from '../../stores/sceneStore'
  
    export let position: [x: number, y: number, z: number] = [0, 0, 0]
  </script>
    
  <T.Group position.y={0.9}>
    <T.PerspectiveCamera
      fov={90}
      bind:ref={$playerCam}
      position.x={position[0]}
      position.y={position[1]}
      position.z={position[2]}
      on:create={({ ref }) => {
        ref.lookAt(new Vector3(0, 2, 0))
      }}
    >
      <PointerLockControls />
    </T.PerspectiveCamera>
  </T.Group>