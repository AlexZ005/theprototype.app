import { writable } from 'svelte/store';

export const globalScene = writable(null);
export const objectsGroup = writable(null);
export const showGrid = writable(null);
export const TControls = writable(null);
export const lockedObjects = writable([]);
