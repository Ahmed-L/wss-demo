// const { spawn } = require('child_process');

// // Number of client instances to spawn
// const numClients = 100;

// // Track total messages received by each client
// const messageCounts = {};

// // Function to generate a random number within a specified range
// const getRandomNumber = (min, max) => {
//     return Math.floor(Math.random() * (max - min + 1)) + min;
// };

// // Function to run the client script with random arguments
// const runClient = () => {
//     const userID = getRandomNumber(1, 1000);
//     const companyID = getRandomNumber(1, 2);
    
//     // Spawn a child process to run the client script
//     const clientProcess = spawn('node', ['client.js', userID, companyID]);

//     // Initialize message count for this client
//     messageCounts[`${userID}-${companyID}`] = 0;

//     // Log stdout from the client process
//     clientProcess.stdout.on('data', (data) => {
//         console.log(`Client (${userID}-${companyID}) stdout: ${data}`);
//     });

//     // Log stderr from the client process
//     clientProcess.stderr.on('data', (data) => {
//         console.error(`Client (${userID}-${companyID}) stderr: ${data}`);
//     });

//     // Increment message count when client receives a message
//     clientProcess.stdout.on('data', () => {
//         messageCounts[`${userID}-${companyID}`]++;
//     });

//     // Handle process exit
//     clientProcess.on('close', (code) => {
//         console.log(`Client (${userID}-${companyID}) exited with code ${code}`);
//     });
// };

// // Function to start load testing by spawning multiple client instances
// const startLoadTest = () => {
//     console.log(`Starting load test - ${numClients} client instances`);
//     for (let i = 0; i < numClients; i++) {
//         setTimeout(runClient, i * 100); // Delay spawning clients to avoid overwhelming the server
//     }
// };

// // Start the load test
// startLoadTest();

// // Log message counts every few seconds
// setInterval(() => {
//     console.log('Message counts per client:');
//     Object.entries(messageCounts).forEach(([clientID, count]) => {
//         console.log(`${clientID}: ${count} messages`);
//     });
// }, 5000); // Adjust the interval as needed


const { spawn } = require('child_process');

// Number of client instances to spawn
const numClients = 100;

// Duration of the load test in seconds
const testDurationSeconds = 100;

// Track total messages received by each client
const messageCounts = {};

// Track start time for each client
const startTime = {};

// Function to generate a random number within a specified range
const getRandomNumber = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Function to run the client script with random arguments
const runClient = () => {
    const userID = getRandomNumber(1, 1000);
    const companyID = 1;
    // const companyID = getRandomNumber(1, 2);

    // Spawn a child process to run the client script
    const clientProcess = spawn('node', ['client.js', userID, companyID]);

    // Initialize message count and start time for this client
    messageCounts[`${userID}-${companyID}`] = 0;
    startTime[`${userID}-${companyID}`] = Date.now();

    // Increment message count when client receives a message
    clientProcess.stdout.on('data', () => {
        messageCounts[`${userID}-${companyID}`]++;
    });

    // Handle process exit
    clientProcess.on('close', (code) => {
        console.log(`Client (${userID}-${companyID}) exited with code ${code}`);
    });
};

// Function to start load test by spawning multiple client instances
const startLoadTest = () => {
    console.log(`Starting load test - ${numClients} client instances for ${testDurationSeconds} seconds`);

    // Start the load test
    for (let i = 0; i < numClients; i++) {
        setTimeout(runClient, i * 100); // Delay spawning clients to avoid overwhelming the server
    }

    // Stop the load test after the specified duration
    setTimeout(stopLoadTest, testDurationSeconds * 1000);
};

// Function to stop the load test and generate log
const stopLoadTest = () => {
    console.log(`Load test completed - generating log`);

    // Calculate total messages received and average time per message for each client
    const clientStats = {};
    Object.entries(messageCounts).forEach(([clientID, count]) => {
        const durationSeconds = (Date.now() - startTime[clientID]) / 1000;
        const averageTimePerMessage = durationSeconds > 0 ? durationSeconds / count : 0;
        clientStats[clientID] = {
            messagesReceived: count,
            durationSeconds: durationSeconds,
            averageTimePerMessage: averageTimePerMessage
        };
    });

    // Calculate overall throughput (messages per second)
    const totalMessagesReceived = Object.values(messageCounts).reduce((total, count) => total + count, 0);
    const overallThroughput = totalMessagesReceived / testDurationSeconds;

    // Generate detailed log
    console.log('Detailed log:');
    Object.entries(clientStats).forEach(([clientID, stats]) => {
        console.log(`${clientID}:`);
        console.log(`- Messages received: ${stats.messagesReceived}`);
        console.log(`- Duration (seconds): ${stats.durationSeconds}`);
        console.log(`- Average time per message (seconds): ${stats.averageTimePerMessage}`);
    });
    console.log(`#########################################################################`);
    console.log(`Total messages received: ${totalMessagesReceived}`);
    console.log(`Total Duration in Seconds: : ${testDurationSeconds}`);
    console.log(`Overall throughput (messages per second): ${overallThroughput.toFixed(2)}`);

    // Optionally, you can write the log to a file or perform additional analysis
};

// Start the load test
startLoadTest();
