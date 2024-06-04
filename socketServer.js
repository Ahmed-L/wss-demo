const { displayUsage } = require("./monitorUsage");
const WebSocket = require('ws');
const SocketPool = require('./socketPool');

const poolConfig = {
    maxConnections: 100000 // Set your maximum connections limit here
};

const socketPool = new SocketPool(poolConfig);
const PORT = 8080;

const wss = new WebSocket.Server({ port: PORT });

const heartbeat = function () {
    this.isAlive = true;
};

wss.on('connection', (ws) => {
    const availableSocketObj = socketPool.getAvailableSocket();

    if (!availableSocketObj) {
        ws.close(1000, 'Server is at maximum capacity');
        return;
    }

    // Assume userID and companyID are received upon connection
    // const userData = {
    //     userID: Math.floor(Math.random() * 100), // Random userID for demo purposes
    //     companyID: Math.floor(Math.random() * 3) + 1 // Random companyID (1, 2, or 3) for demo purposes
    // };

    // socketPool.markSocketAsUsed(availableSocketObj, userData);
    // availableSocketObj.socket = ws;

    ws.isAlive = true;
    ws.on('pong', heartbeat);

    console.log('Client connected');

    ws.on('message', (message) => {
        try {
            const data = JSON.parse(message);

            if (data.action === 'joinCompany') {
                // Assume userID and companyID are received upon connection
                // const userData = {
                //     userID: data.userID,
                //     companyID: data.companyID
                // };

                const userData = data.companyID

                socketPool.markSocketAsUsed(availableSocketObj, userData);
                availableSocketObj.socket = ws;

                console.log(`User joined company - UserID: ${userData.userID}, CompanyID: ${userData.companyID}`);

                ws.send('Successfully joined company');
            } else {
                console.log(`Received message: ${message}`);
            }
        } catch (error) {
            console.log(`Error parsing message: ${message}`);
        }
    });

    ws.on('close', () => {
        socketPool.releaseSocket(availableSocketObj);
        console.log('Client disconnected');
    });

    // ws.send('Welcome to the WebSocket server');
});

const interval = setInterval(() => {
    console.log("Active sockets: ", socketPool.activeConnections);
    socketPool.pool.forEach(socketObj => {
        if (socketObj.isUsed && socketObj.socket) {
            if (socketObj.socket.isAlive === false) {
                socketObj.socket.terminate();
                socketPool.releaseSocket(socketObj);
            }

            socketObj.socket.isAlive = false;
            socketObj.socket.ping();
        }
    });
}, 5000);

wss.on('close', () => {
    clearInterval(interval);
});

console.log(`WebSocket server is running on ws://localhost:${PORT}`);

// Example usage of broadcasting to specific users
setInterval(() => {
    const companyIDToBroadcast = 1;
    // const message = `Broadcast message to company ${companyIDToBroadcast}`;
    const message = `Hello Merchant ${companyIDToBroadcast}`

    // socketPool.broadcast(userData => userData.companyID === companyIDToBroadcast, message);
    socketPool.broadcast(companyIDToBroadcast, message);
    // console.log(`Broadcasted message to users of company ${companyIDToBroadcast}`);
}, 500);


// setInterval(displayUsage, 5000);
