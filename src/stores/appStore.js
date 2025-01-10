import { writable } from 'svelte/store';

export const settingsOpen = writable(null);
export const propertiesClose = writable(true);
export const scenePropertiesClose = writable(true);
export const lightPropertiesClose = writable(true);
export const flowGraphClose = writable(false);
export const chatHidden = writable('hidden');
export const libraryClose = writable(true);
export const userdata = writable([]);
export const username = writable(null);
export const peers = writable(null);
export const toggleExpand = writable(null);
export const closeMenu = writable(true);
export const specatorMode = writable(false);

// update the sidebar visibility
export function showSidebar(store) {
	if (store != 'library') libraryClose.set(true);
	if (store != 'scene') scenePropertiesClose.set(true);
	if (store != 'lightProperties') lightPropertiesClose.set(true);
	if (store != 'properties') propertiesClose.set(true);

	// The delay adds cool effect
	setTimeout(() => {	
		if (store === 'library') libraryClose.set(false);
		if (store === 'scene') scenePropertiesClose.set(false);
		if (store === 'lightProperties') lightPropertiesClose.set(false);
		if (store === 'properties') propertiesClose.set(false);
		// if (store === null) {}
	}, 50);
  }

export const fixLight = writable(false);
export const pendingApprovals = writable([]);
export const waitingForApproval = writable([]);
export const toastStore = writable([]);

export function showToast(message) {
  toastStore.update((toast) => [...toast, message]);
}

export function clearToast(toast) {
  toastStore.update((toast) => []);
}

export const loading = writable([]);
export const loadingcount = writable([]);
export const loadingFile = writable([]);

export const messages = writable([]);

export function addMessage(newMessage, type, sender) {
	messages.update((currentMessages) => [
		...currentMessages,
		{
			id: messages.length,
			text: newMessage.message,
			sender: newMessage.sender,
			type: newMessage.type
		}
	]);
}
