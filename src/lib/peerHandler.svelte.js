import Peer from 'peerjs';
import { sceneCommand } from './commandsHandler.svelte';
import { addMessage } from '../stores/appStore';

export function createPeer() {
	return 'xxxxx'.replace(/[xy]/g, function (c) {
		var r = (Math.random() * 16) | 0,
			v = c == 'x' ? r : (r & 0x3) | 0x8;
		return v.toString(16);
	});
}

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

		this.peer.on('connection', handleConnection.bind(this));

		function handleConnection(conn) {
			conn.on('data', (data) => {console.log(data);
				if(data.type == 'hosts') {
					console.log('Connecting to received hosts');
					data.hosts.forEach( id =>
					{
						this.connectToPeer(id);
					}
					);
				} else if(data.type == 'sent') {
					addMessage({message: data.message, type: 'received', sender: data.sender});
				} else if(data.startsWith('/')) {
					sceneCommand(data);
				}
			}
			);
		}
	}

	connectToPeer(peerId, id = this.peer.id) {
		if (!this.connections[peerId]) {
			console.log("Connecting to " + peerId);
            const conn = this.peer.connect(peerId);
            this.connections[peerId] = conn;
            conn.on('open', () => {
				 console.log('Connection to ' + peerId + ' established')});
				 let hosts = [id];
				 Object.keys(this.connections).forEach(element => {
					if(element != peerId)
					hosts.push(element)
				});
				console.log("sending to " + peerId + "  remote " + hosts)
				setTimeout(() => {
				this.connections[peerId].send({type: 'hosts', hosts: hosts})
				}, 3000);
        } else {
			if (this.connections[peerId].peer == peerId) {
				console.log('already connected to ' + peerId + '. Status: ' + this.connections[peerId].open)
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
				 		this.connections[peerId].send({type: 'hosts', hosts: hosts})
				 	}, 3000);
				}

			}
			
		}
    }

	sendMessage(message) {
		if(message.startsWith('/')) sceneCommand(message);
		addMessage({message: message, type: 'sent', sender: this.peer.id});
		Object.keys(this.connections).forEach(element => {
			this.connections[element].send({message: message, type: 'sent', sender: this.peer.id});
		});
	}
}
