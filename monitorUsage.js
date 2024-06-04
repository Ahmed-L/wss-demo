const os = require('os');
const pidusage = require('pidusage');
const process = require('process');

function formatBytes(bytes) {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes == 0) return '0 Byte';
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
}

function displayUsage() {
    const memoryUsage = process.memoryUsage();
    console.clear();
    console.log('Memory Usage:');
    console.log(`RSS: ${formatBytes(memoryUsage.rss)}`);
    console.log(`Heap Total: ${formatBytes(memoryUsage.heapTotal)}`);
    console.log(`Heap Used: ${formatBytes(memoryUsage.heapUsed)}`);
    console.log(`External: ${formatBytes(memoryUsage.external)}`);

    const cpuLoad = os.loadavg();
    console.log('\nCPU Load (1m, 5m, 15m):');
    console.log(`1m: ${cpuLoad[0].toFixed(2)}`);
    console.log(`5m: ${cpuLoad[1].toFixed(2)}`);
    console.log(`15m: ${cpuLoad[2].toFixed(2)}`);

    pidusage(process.pid, (err, stats) => {
        if (err) {
            console.error(err);
        } else {
            console.log('\nCPU Utilization:');
            console.log(`CPU: ${stats.cpu.toFixed(2)}%`);
            console.log(`Memory: ${formatBytes(stats.memory)}`);
        }
    });
}

module.exports = {displayUsage}