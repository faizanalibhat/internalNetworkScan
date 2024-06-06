const Queue = require('bull');
const nucleiQueue = new Queue('nuclei', {
    redis: {
        host: '127.0.0.1',
        port: 6379
    }
});

exports.enqueueNucleiScan = async (req, res) => {
    try {
        const { ips } = req.body;

        if (!ips || !Array.isArray(ips)) {
            return res.status(400).json({ message: 'Invalid IP addresses provided' });
        }

        await nucleiQueue.add({ ips });

        return res.status(200).json({ message: 'Nuclei scan jobs added to the queue' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
