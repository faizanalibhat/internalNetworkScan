const Queue = require('bull');
const axios = require('axios');
const jwt = require('jsonwebtoken');
const path = require('path');
const { performNucleiScan } = require('./helpers/scanUtils');
require('dotenv').config();

const nucleiQueue = new Queue('nuclei', {
    redis: {
        host: '127.0.0.1',
        port: 6379
    }
});

nucleiQueue.process(async (job) => {
    const { ips } = job.data;

    for (const ip of ips) {
        console.log(`Running Nuclei scan for IP: ${ip}`);
        const scanResult = await runNucleiScan(ip);
        await sendScanResultToASM(scanResult);
    }

    return { message: 'Nuclei scans completed' };
});

async function runNucleiScan(ip) {
    const templatesPath = path.resolve(__dirname, 'tools', 'nuclei-templates');
    const scanResult = await performNucleiScan(ip, templatesPath);
    return scanResult;
}

async function sendScanResultToASM(scanResult) {
    const webhookUrl = process.env.ASM_WEBHOOK_URL;
    const authToken = jwt.sign(scanResult, process.env.SECRET_KEY, { algorithm: 'HS256' });

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
    };

    const response = await axios.post(webhookUrl, scanResult, { headers });
    return response.data;
}

const CRON_INTERVAL = process.env.CRON_INTERVAL || '*/30 * * * *';

const cron = require('node-cron');

cron.schedule(CRON_INTERVAL, async () => {
    console.log('Processing queue...');
    const jobs = await nucleiQueue.getWaiting();
    console.log(`Jobs in queue: ${jobs.length}`);
    jobs.forEach((job, index) => {
        console.log(`Job ${index + 1}:`, job.data);
    });
    await nucleiQueue.process();
});

module.exports = {
    nucleiQueue
};
