<script lang="ts">
	import '../../styles/chat.css';
</script>

<div id="chat" class="">
	<div id="chat-window">
		<div id="chat-handle" class="drag-handle"></div>

		<div id="chat-messages">
			<ul id="messages">
                <li class="message">Hello world!</li>
			</ul>
		</div>
	</div>
	<div
		id="chat-input"
		class="rounded-lg border border-gray-200 bg-white text-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
	>
		<input type="text" id="message" class="chat-input text-gray-800 dark:text-gray-200" />
		<input type="button" id="send" value="Send" class="chat-button" />
	</div>
</div>
