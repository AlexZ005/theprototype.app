<script lang="ts">
	import '../../styles/chat.css';
	import { peers, messages, chatHidden } from '../../stores/appStore';
	import { isLocked } from '../../stores/sceneStore'
	let message;
</script>

<div id="chat" class="{$chatHidden}">
	<div id="chat-window">
		<div id="chat-handle" class="drag-handle"></div>

		<div id="chat-messages">
			<ul id="messages">
				{#each $messages as message (message)}
					<li class="chat-message {message.type}">{message.sender}: {message.text}</li>
				{/each}
			</ul>
		</div>
	</div>
	{#if !$isLocked}
	<div
		id="chat-input"
		class="rounded-lg border border-gray-200 bg-white text-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
	>
		<input
			type="text"
			id="message"
			class="chat-input text-gray-800 dark:text-gray-600"
			bind:value={message}
		/>
		<input
			type="button"
			id="send"
			value="Send"
			class="chat-button"
			on:click={() => $peers.sendMessage(message)}
		/>
	</div>
	{/if}
</div>
