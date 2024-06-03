const nmapService = require('../services/nmapService');

exports.scan = async (req, res) => {
    const target = req.body.target;
    try {
        const result = await nmapService.scan(target);
        res.send({ result });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};
