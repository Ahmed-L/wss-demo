const WebSocket = require('ws');

// Get command line arguments
const args = process.argv.slice(2);
const companyID = parseInt(args[0]) || 1;
const numConnections = parseInt(args[1]) || 100;
var msg = 0

// Function to connect to WebSocket server
const connectToWebSocket = (userID) => {
    const ws = new WebSocket('ws://localhost:8080');

    ws.onopen = () => {
        console.log(`Connected to WebSocket server with userID: ${userID}`);
        const joinMessage = JSON.stringify({ action: 'joinCompany', userID, companyID });
        ws.send(joinMessage);
    };

    ws.onerror = (error) => {
        console.error(`WebSocket error: ${error}`);
    };

    ws.onclose = () => {
        console.log(`Disconnected from WebSocket server with userID: ${userID}`);
    };
};

// Connect to WebSocket server with multiple connections
for (let i = 0; i < numConnections; i++) {
    connectToWebSocket(i + 1); // Assuming user IDs start from 1
}
