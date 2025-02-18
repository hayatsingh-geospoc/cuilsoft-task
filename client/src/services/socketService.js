import io from 'socket.io-client';

class SocketService {
    constructor() {
        this.socket = null;
        this.connectCallbacks = new Set();
        this.disconnectCallbacks = new Set();
    }

    connect() {
        if (this.socket) {
            return;
        }

        this.socket = io('http://localhost:3000', {
            reconnection: true,
            reconnectionDelay: 1000,
            reconnectionDelayMax: 5000,
            reconnectionAttempts: Infinity
        });

        this.socket.on('connect', () => {
            console.log('Connected to WebSocket server');
            this.connectCallbacks.forEach(cb => cb());
        });

        this.socket.on('disconnect', () => {
            console.log('Disconnected from WebSocket server');
            this.disconnectCallbacks.forEach(cb => cb());
        });

        this.socket.on('connect_error', (error) => {
            console.error('Socket connection error:', error);
        });
    }

    onConnect(callback) {
        this.connectCallbacks.add(callback);
        if (this.socket?.connected) {
            callback();
        }
    }

    onDisconnect(callback) {
        this.disconnectCallbacks.add(callback);
    }

    subscribeToEvents(callback) {
        if (!this.socket) {
            return;
        }
        this.socket.on('analyticsEvent', callback);
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }
        this.connectCallbacks.clear();
        this.disconnectCallbacks.clear();
    }

    isConnected() {
        return this.socket?.connected || false;
    }
}

export default new SocketService(); 