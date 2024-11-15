import Peer from 'peerjs';
import { sceneCommand, lockRestore, checkLocks, createObject, sendObjects, deleteObject, colorObject, createLoader, userData } from './commandsHandler.svelte';
import { createGeometry, createLight, changeName, moveGeometry, lockGeometry } from '$lib/geometries.svelte';
import { lockedObjects, selectedObject } from '../stores/sceneStore';
import { addMessage, peers, userdata, pendingApprovals, waitingForApproval } from '../stores/appStore';
import { get } from 'svelte/store';

export function createPeer() {
	return 'xxxxx'.replace(/[xy]/g, function (c) {
		var r = (Math.random() * 16) | 0,
			v = c == 'x' ? r : (r & 0x3) | 0x8;
		return v.toString(16);
	});
}

//Access locked objects
let locked = $state();
lockedObjects.subscribe(value => { locked = value });

//Access selected object
let selected = $state();
selectedObject.subscribe(value => { selected = value });

//Access userData
let users = $state();
userdata.subscribe(value => { users = value });


export class PeerConnection {
	constructor(id, updateIdFn) {
		this.updateIdFn = updateIdFn;

		this.connections = {};

		const regex = /(\.io|\.app)$/i;
		if (!regex.test(location.hostname)) {
		this.peer = new Peer(id, {
			secure: true,
			host: 'localhost',
			port: 9000
		});} else {
			this.peer = new Peer(id)
		}

		this.peer.on('open', (id) => {
			console.log(id);
			if (this.updateIdFn) this.updateIdFn(id);
		});

		this.peer.on('close', function() { console.log('server closed') });
		this.peer.on('disconnected', function() { console.log('server disconnected') });

		this.peer.on('connection', handleConnection.bind(this));

		function handleConnection(conn) {

			// Update approval status on expected connections
			let waiting = get(waitingForApproval);
			waiting.forEach(element => {
				if(element[0] === conn.peer) {
					element[1] = 'approved';
				}
			})
   

			// This block prevents unauthorized peers from accessing data
			const users = get(userdata);
			let found = users.some(element => element[0] === conn.peer);

			if (!found) {
				// If peer is not found, add it to the pending approvals
				var approvals = get(pendingApprovals);
				if (!approvals.some(toast => toast.peerId === conn.peer)) {
					approvals.push({ peerId: conn.peer });
					pendingApprovals.set(approvals);
				}
				conn.close();
			}

			conn.on('data', (data) => {
				// console.log(data);
				if(data.type == 'hosts') {
					console.log('Connecting to received hosts');
					data.hosts.forEach( id =>
					{
						this.connectToPeer(id);
					}
					);
				} else if(data.type == 'sent') {
					addMessage({message: data.message, type: 'received', sender: data.sender});
				} else if(data.type == 'info') {
					addMessage({message: data.message, type: data.type, sender: data.sender});
				} else if(data.type == 'create') {
					createGeometry(data.command, data.uuid);
				} else if(data.type == 'light') {
					createLight(data.command, data.uuid);
				} else if(data.type == 'name') {
					changeName(data.uuid, data.name);
				} else if(data.type == 'move') {
					moveGeometry(data.uuid, data.pos, data.rot, data.scale);
				} else if(data.type == 'lock') {
					lockGeometry(data.uuid, data.peerId);
				} else if(data.type == 'locked') {
					lockRestore(data.lockeditems);
				} else if(data.type == 'userdata') {
					userData(data.userdata);
				} else if(data.type == 'getobjects') {
					sendObjects(data.sender)
				} else if(data.type == 'object') {
					createObject(data, data.uuids, data.override);
				} else if(data.type == 'delete') {
					deleteObject(data.uuid);
				} else if(data.type == 'color') {
					colorObject(data.uuid, data.color, data.near, data.far);
				} else if(data.type == 'loading') {
					createLoader(data.count, data.uuids);
				} else if(data.startsWith('/')) {
					sceneCommand(data);
				}
			}
			);
		}
	}

	connectToPeer(peerId, getobjects = true, id = this.peer.id) {
		if (!this.connections[peerId]) {
			console.log("Connecting to " + peerId);
            const conn = this.peer.connect(peerId);
            this.connections[peerId] = conn;

			conn.on('close', function(data) { checkLocks(data) });
			conn.on('disconnected', function(data) { checkLocks(data) });
	
            conn.on('open', () => {
				 console.log('Connection to ' + peerId + ' established')});
				//Trigger reactivity for UI list of objects
				peers.update((value) => value);
				 let hosts = [id];
				 Object.keys(this.connections).forEach(element => {
					if(element != peerId)
					hosts.push(element)
				});
				console.log("sending to " + peerId + "  remote " + hosts)
				setTimeout(() => {
				let locks = [...locked];
				if(selected.uuid) locks.push([id, selected.uuid]);
				this.connections[peerId].send({type: 'locked', lockeditems: locks})
				this.connections[peerId].send({type: 'hosts', hosts: hosts})
				this.connections[peerId].send({type: 'userdata', userdata: users})
				if (getobjects) this.connections[peerId].send({type: 'getobjects', sender: this.peer.id})
				}, 500);
        } else {
			if (this.connections[peerId].peer == peerId) {
				console.log(`Peer ${peerId} is already connected or has a pending request. Connection status: ${this.connections[peerId].open}`)
				if(!this.connections[peerId].open) {
					console.log('Restoring connection: ' + peerId);
					const conn = this.peer.connect(peerId);
           	 		this.connections[peerId] = conn;
            		conn.on('open', () => {
					 console.log('Connection to ' + peerId + ' restored')});
					let hosts = [id];
				 	Object.keys(this.connections).forEach(element => {
						if(element != peerId)
						hosts.push(element)
					});
				 	console.log("sending to " + peerId + "  remote " + hosts)
				 	setTimeout(() => {
						let locks = [...locked];
						if(selected.uuid) locks.push([id, selected.uuid]);
						this.connections[peerId].send({type: 'locked', lockeditems: locks})
				 		this.connections[peerId].send({type: 'hosts', hosts: hosts})
						 this.connections[peerId].send({type: 'userdata', userdata: users})
						if (getobjects) this.connections[peerId].send({type: 'getobjects', sender: this.peer.id})
				 	}, 500);
				}

			}
			
		}
    }

	sendMessage(message, type) {
		if(message.startsWith('/')) {
			sceneCommand(message);
		} else {
			if(type === undefined) type = 'sent';
			addMessage({message: message, type: type, sender: this.peer.id});
			Object.keys(this.connections).forEach(element => {
				this.connections[element].send({message: message, type: type, sender: this.peer.id});
			});
		}
	}

	send(data) {
		if(data.type == 'create')
		this.sendMessage('created a ' + data.command.split(' ')[1], 'info');
		Object.keys(this.connections).forEach(element => {
			this.connections[element].send(data);
		});
	}
}
