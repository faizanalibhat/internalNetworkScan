const infoService = require('../services/infoService');

exports.scan = async (req, res) => {
    const target = req.body.target;
    try {
        const result = await infoService.scan(target);
        res.send({ result });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};
