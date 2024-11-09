<script lang="ts">
	import {
		SvelteFlow,
		Background,
		BackgroundVariant,
		useSvelteFlow,
		type Node,
		type Edge,
		type IsValidConnection
	} from '@xyflow/svelte';
	// 👇 this is important! You need to import the styles for Svelte Flow to work
	import '@xyflow/svelte/dist/style.css';
	import { writable, type Writable } from 'svelte/store';
	const onDragOver = (event: DragEvent) => {};
	const onDrop = (event: DragEvent) => {};

	export const initialNodes: Node[] = [];
	export const initialEdges: Node[] = [];
	const nodes = writable<Node[]>(initialNodes);
	const edges = writable<Edge[]>(initialEdges);

	const nodeTypes = {};
</script>

<SvelteFlow
	{nodes}
	{nodeTypes}
	{edges}
	fitView
	maxZoom={1}
	minZoom={0.5}
	on:dragover={onDragOver}
	on:drop={onDrop}
	on:nodeclick={(event) => console.log('on node click', event.detail.node)}>
	<Background bgColor="transparent" variant={BackgroundVariant.Dots} />
</SvelteFlow>

<style>
	:global(.svelte-flow) {
		background-color: transparent !important;
	}
	:global(.svelte-flow__attribution) {
		display: none;
	}

	.svelteFlow {
		position: absolute;
		width: 500px;
		height: 500px;
	}
</style>
