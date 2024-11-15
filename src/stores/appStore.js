import { writable } from 'svelte/store';

export const settingsOpen = writable(null);
export const propertiesClose = writable(true);
export const scenePropertiesClose = writable(true);
export const lightPropertiesClose = writable(true);
export const flowGraphClose = writable(false);
export const chatHidden = writable('hidden');
export const userdata = writable([]);
export const username = writable(null);
export const peers = writable(null);

export const pendingApprovals = writable([]);

export const loading = writable([]);
export const loadingcount = writable([]);

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
