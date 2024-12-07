<script lang="ts">
    import { onDestroy } from 'svelte'
    import { Euler, Camera } from 'three'
    import { useThrelte, useParent } from '@threlte/core'
    import { isLocked, playerCam, editorCam } from '../../stores/sceneStore'

    const { renderer, camera, invalidate } = useThrelte()
  
    const domElement = renderer.domElement
    const cameraParent = useParent()

    let { minPolarAngle, maxPolarAngle, pointerSpeed } = $props()
    minPolarAngle = 0 // radians
    maxPolarAngle = Math.PI // radians
    pointerSpeed = 1.0    

    const _euler = new Euler(0, 0, 0, 'YXZ')
    const _PI_2 = Math.PI / 2
  
    if (!renderer) {
      throw new Error('Threlte Context missing: Is <PointerLockControls> a child of <Canvas>?')
    }
  
    const isCamera = (p: any): p is Camera => {
      return p.isCamera
    }
  
    if (!isCamera($cameraParent)) {
      throw new Error('Parent missing: <PointerLockControls> need to be a child of a <Camera>')
    }
  
    const onChange = () => {
      invalidate()
    }
  
        $effect(() => {
      if ($isLocked) {
        domElement.requestPointerLock({
          unadjustedMovement: true
        })
      }
    })

    export const unlock = () => document.exitPointerLock()
  
    domElement.addEventListener('mousemove', onMouseMove)
    domElement.ownerDocument.addEventListener('pointerlockchange', onPointerlockChange)
    domElement.ownerDocument.addEventListener('pointerlockerror', onPointerlockError)
  
    onDestroy(() => {
      domElement.removeEventListener('mousemove', onMouseMove)
      domElement.ownerDocument.removeEventListener('pointerlockchange', onPointerlockChange)
      domElement.ownerDocument.removeEventListener('pointerlockerror', onPointerlockError)
    })
  
    function onMouseMove(event: MouseEvent) {
      if (!$isLocked) return
      if (!$cameraParent) return
  
      const { movementX, movementY } = event
  
      _euler.setFromQuaternion($cameraParent.quaternion)
  
      _euler.y -= movementX * 0.002 * pointerSpeed
      _euler.x -= movementY * 0.002 * pointerSpeed
  
      _euler.x = Math.max(_PI_2 - maxPolarAngle, Math.min(_PI_2 - minPolarAngle, _euler.x))
  
      $cameraParent.quaternion.setFromEuler(_euler)
  
      onChange()
    }
  
    function onPointerlockChange() {
      if (document.pointerLockElement === domElement) {
        // console.log("locked")
        $isLocked = true
        camera.current = $playerCam
      } else {
        // console.log("unlocked")
        $isLocked = false
        camera.current = $editorCam
      }
    }
  
    function onPointerlockError() {
      console.error('PointerLockControls: Unable to use Pointer Lock API')
    }
  </script>