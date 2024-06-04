const WebSocket = require('ws');

// Get command line arguments
const args = process.argv.slice(2);
const userID = parseInt(args[0]) || 1;
const companyID = parseInt(args[1]) || 1;

const ws = new WebSocket('ws://localhost:8080');

// Function to send a join message to the server
const joinCompany = (userID, companyID) => {
    const joinMessage = JSON.stringify({ action: 'joinCompany', userID, companyID });
    ws.send(joinMessage);
};

ws.on('open', () => {
    console.log('Connected to the WebSocket server');

    // Join a company
    joinCompany(userID, companyID);

    // Send a test message to the server
    ws.send('Hello, server!');
});

ws.on('message', (message) => {
    console.log(`Received message: ${message}`);
});

ws.on('close', () => {
    console.log('Disconnected from the WebSocket server');
});
