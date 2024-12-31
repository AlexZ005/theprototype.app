<script lang="ts">
    import { T } from '@threlte/core'
    import { Vector3 } from 'three'
    import VRControls from './VRControls.svelte'
    import PointerLockControls from './PointerLockControls.svelte'
    import { playerCam } from '../../stores/sceneStore'
    import { userdata, peers } from '../../stores/appStore'
    import { Text } from '@threlte/extras'
  
    export let position: [x: number, y: number, z: number] = [0, 0, 0]
  </script>
    
  <VRControls />
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

  {#each $userdata as user, i}
    {#if user[0] != $peers.peer.id}
    <!-- {console.log(user)} -->
      <T.Group>
        <T.Mesh
          position={[0, 1000, 0]}
          scale={[1, 1, 1]}
          castShadow
          name={user[0]}
        >
          <Text
            color="black"
            fontSize={0.2}
            anchorX="center"
            position={[0, 0.15, -0.52]}
            rotation={[0, Math.PI, 0]}
            text={user[0]}
          />
          <T.SphereGeometry args={[0.59, 6]} />
          <T.MeshNormalMaterial />
        </T.Mesh>
      </T.Group>
      {/if}
  {/each}