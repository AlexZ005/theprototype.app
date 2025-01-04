<!-- VRControls inspired by a StackOverflow comment from stereopan-com -->
<!-- Reference: https://stackoverflow.com/questions/62476426/webxr-controllers-for-button-pressing-in-three-js -->
<script lang="ts">
	import * as THREE from 'three';
	import { Quaternion } from 'three';
	import { useThrelte, useTask } from '@threlte/core';
    import { selectedObject } from '../../stores/sceneStore';

	const { renderer, camera, scene } = useThrelte();
	const orientation = new Quaternion();
	const { xr } = useThrelte().renderer;

	let prevGamePads = new Map();
	let handedness = '';
	let cameraVector = new THREE.Vector3();
	let speedFactor = [0.025, 0.025, 0.025, 0.025];
	let dolly;
    
    //dolly for camera
	dolly = new THREE.Group();
	dolly.position.set(0, 0, 0);
	dolly.name = "dolly";
	scene.add(dolly);
	dolly.add(camera.current);

	function isIterable(obj) {
		// checks for null and undefined
		if (obj == null) {
			return false;
		}
		return typeof obj[Symbol.iterator] === 'function';
	}

	const offset = { x: 0, y: 0, z: 0 };
	useTask((delta) => {

        let controller1 = xr.getController(0);
        let controller2 = xr.getController(1);
        let controllerGrip1 = xr.getControllerGrip(0);
        let controllerGrip2 = xr.getControllerGrip(1);

        //add the controls to the dolly also or they will not move with the dolly
        dolly.add(controller1);
        dolly.add(controller2);
        dolly.add(controllerGrip1);
        dolly.add(controllerGrip2);

		let i = 0;
		//determine if we are in an xr session
		const session = renderer.xr.getSession();
		if (session) {
			let xrCamera = xr.getCamera(camera.current);
			xrCamera.getWorldDirection(cameraVector);
			// console.log(cameraVector)
			let space = xr.getReferenceSpace();
			const pose = xr.getFrame()?.getViewerPose(space);
			if (pose !== undefined) {
				//a check to prevent console errors if only one input source
				if (isIterable(session.inputSources)) {
					for (const source of session.inputSources) {
						if (source && source.handedness) {
							handedness = source.handedness; //left or right controllers
						}
						if (!source.gamepad) continue;
						const controller = renderer.xr.getController(i++);
						const old = prevGamePads.get(source);
						const data = {
							handedness: handedness,
							buttons: source.gamepad.buttons.map((b) => b.value),
							axes: source.gamepad.axes.slice(0)
						};
						if (old) {
							data.buttons.forEach((value, i) => {
								//handlers for buttons
								if (value !== old.buttons[i] || Math.abs(value) > 0.8) {
									//check if it is 'all the way pushed'
									if (value === 1) {
										//console.log("Button" + i + "Down");
										if (data.handedness == 'left') {
											//console.log("Left Paddle Down");
											if (i == 1) {
												// dolly.rotateY(-THREE.MathUtils.degToRad(1));

											}
											if (i == 3) {
												//center selected object on dolly
                                                // console.log("Left Thumbstick Down");
												// dolly.position.x = $selectedObject.position.x;
												// dolly.position.y = $selectedObject.position.y;
												// dolly.position.z = $selectedObject.position.z;
											}
										} else {
											//console.log("Right Paddle Down");
											if (i == 1) {
												// dolly.rotateY(THREE.MathUtils.degToRad(1));
											}
										}
									} else {
										// console.log("Button" + i + "Up");

										if (i == 1) {
											//use the paddle buttons to rotate
											if (data.handedness == 'left') {
												//console.log("Left Paddle Down");
												// dolly.rotateY(-THREE.MathUtils.degToRad(Math.abs(value)));
											} else {
												//console.log("Right Paddle Down");
												// dolly.rotateY(THREE.MathUtils.degToRad(Math.abs(value)));
											}
										}
									}
								}
							});
							data.axes.forEach((value, i) => {
								//handlers for thumbsticks
								//if thumbstick axis has moved beyond the minimum threshold from center, windows mixed reality seems to wander up to about .17 with no input
								if (Math.abs(value) > 0.2) {
									//set the speedFactor per axis, with acceleration when holding above threshold, up to a max speed
									speedFactor[i] > 1 ? (speedFactor[i] = 1) : (speedFactor[i] *= 1.001);
									// console.log(value, speedFactor[i], i);
									if (i == 2) {
										//left and right axis on thumbsticks
										if (data.handedness == 'left') {
											// data.axes[2] > 0 ? console.log('left on left thumbstick') : console.log('right on left thumbstick');
											offset.x = 0.1 * data.axes[2] * cameraVector.z;
											offset.z = -0.1 * data.axes[2] * cameraVector.x;

											//provide haptic feedback if available in browser
											if (source.gamepad.hapticActuators && source.gamepad.hapticActuators[0]) {
												var pulseStrength = Math.abs(data.axes[2]) + Math.abs(data.axes[3]);
												if (pulseStrength > 0.75) {
													pulseStrength = 0.75;
												}

												var didPulse = source.gamepad.hapticActuators[0].pulse(pulseStrength, 100);
											}
										} else {
											// (data.axes[2] > 0) ? console.log('left on right thumbstick') : console.log('right on right thumbstick')
											// dolly.rotateY(-THREE.MathUtils.degToRad(data.axes[2]));
										}
										const teleportOffset = new XRRigidTransform(offset, orientation);
										xr.setReferenceSpace(space.getOffsetReferenceSpace(teleportOffset));
									}

									if (i == 3) {
										//up and down axis on thumbsticks
										if (data.handedness == 'left') {
											// data.axes[3] > 0 ? console.log('up on left thumbstick') : console.log('down on left thumbstick');
											offset.y = 0.1 * data.axes[3];

											if (source.gamepad.hapticActuators && source.gamepad.hapticActuators[0]) {
												pulseStrength = Math.abs(data.axes[3]);
												if (pulseStrength > 0.75) {
													pulseStrength = 0.75;
												}
												didPulse = source.gamepad.hapticActuators[0].pulse(pulseStrength, 100);
											}
										} else {
											// (data.axes[3] > 0) ? console.log('up on right thumbstick') : console.log('down on right thumbstick')
                                            offset.z = 0.1 * data.axes[3] * cameraVector.z;
                                            offset.x = 0.1 * data.axes[3] * cameraVector.x;

											//provide haptic feedback if available in browser
											if (source.gamepad.hapticActuators && source.gamepad.hapticActuators[0]) {
												pulseStrength = Math.abs(data.axes[2]) + Math.abs(data.axes[3]);
												if (pulseStrength > 0.75) {
													pulseStrength = 0.75;
												}
												didPulse = source.gamepad.hapticActuators[0].pulse(pulseStrength, 100);
											}
										}
										const teleportOffset = new XRRigidTransform(offset, orientation);
										xr.setReferenceSpace(space.getOffsetReferenceSpace(teleportOffset));

                                        //reset the offset if thumbstick is released
										offset.x = 0;
										offset.z = 0;
										offset.y = 0;
									}
								} else {
									//axis below threshold - reset the speedFactor if it is greater than zero  or 0.025 but below our threshold
									if (Math.abs(value) > 0.025) {
										speedFactor[i] = 0.025;
									}
								}
							});
						}
						prevGamePads.set(source, data);
					}
				}
			}
		}
	});
</script>
