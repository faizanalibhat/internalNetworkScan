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

async function processQueueJob(job) {
    const { ips } = job.data;

    try {
        for (const ip of ips) {
            console.log(`Running Nuclei scan for IP: ${ip}`);
            const scanResult = await runNucleiScan(ip);
            await sendScanResultToASM(scanResult);
        }
        await job.moveToCompleted('done', true);
    } catch (error) {
        console.error(`Error processing job ${job.id}:`, error);
        await job.moveToFailed({ message: error.message });
    }
}

const CRON_INTERVAL = process.env.CRON_INTERVAL || '*/30 * * * * *';

const cron = require('node-cron');

cron.schedule(CRON_INTERVAL, async () => {
    console.log('Processing queue...');
    const jobs = await nucleiQueue.getJobs(['waiting', 'active', 'delayed', 'failed']);

    console.log(`Jobs in queue: ${jobs.length}`);
    for (const job of jobs) {
        console.log(`Processing job [${job.id}]:`, job.data);
        await processQueueJob(job);
    }
});

module.exports = {
    nucleiQueue
};
