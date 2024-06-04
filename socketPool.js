class SocketPool {
    constructor(poolConfig) {
        this.maxConnections = poolConfig.maxConnections || 100;
        this.pool = Array.from({ length: this.maxConnections }, () => ({
            socket: null,
            isUsed: false,
            userData: null // To store user-specific data
        }));
        this.activeConnections = 0;
    }

    getAvailableSocket() {
        return this.pool.find(socketObj => !socketObj.isUsed);
    }

    markSocketAsUsed(socketObj, userData) {
        socketObj.isUsed = true;
        socketObj.userData = userData;
        this.activeConnections++;
    }

    releaseSocket(socketObj) {
        socketObj.isUsed = false;
        socketObj.socket = null;
        socketObj.userData = null;
        this.activeConnections--;
    }

    // broadcast(criteria, message) {
    //     this.pool.forEach(socketObj => {
    //         if (socketObj.isUsed && socketObj.userData && criteria(socketObj.userData)) {
    //             socketObj.socket.send(message);
    //         }
    //     });
    // }

    broadcast(merchantId, message) {
        this.pool.forEach(socketObj => {
            if (socketObj.isUsed && socketObj.userData && socketObj.userData==merchantId) {
                socketObj.socket.send(message);
            }
        });
    }
}

module.exports = SocketPool;
