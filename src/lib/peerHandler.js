import Peer from 'peerjs';
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

		this.peer.on('connection', handleConnection);

		function handleConnection(conn) {
			conn.on('data', (data) => console.log(data));
		}
	}

	connectToPeer(peerId) {
		if (!this.connections[peerId]) {
			console.log("Connecting to " + peerId);
            const conn = this.peer.connect(peerId);
            this.connections[peerId] = conn;
            conn.on('open', () => {
				 console.log('Connection to ' + peerId + ' established')});
        } else {
			if (this.connections[peerId].peer == peerId) console.log('already connected to ' + peerId)
		}
    }
}
