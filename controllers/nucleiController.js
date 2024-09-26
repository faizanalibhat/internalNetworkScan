const nucleiQueue = require('../queueProcessor').nucleiQueue;


exports.enqueueNucleiScan = async (req, res) => {
    const { target } = req.body;

    try {
        const job = await nucleiQueue.add({ ips: [target] });
        console.log(`New job added to queue:`, job.data);
        res.status(200).send({ message: 'Nuclei scan job added to queue', jobId: job.id });
    } catch (error) {
        console.error('Error adding job to queue:', error);
        res.status(500).send({ message: 'Failed to add job to queue', error });
    }
};
