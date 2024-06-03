const express = require('express');
const router = express.Router();
const nmapController = require('../controllers/nmapController');
const httpxController = require('../controllers/httpxController');
const nucleiController = require('../controllers/nucleiController');

router.post('/scan/nmap', nmapController.scan);
router.post('/scan/httpx', httpxController.scan);
router.post('/scan/nuclei', nucleiController.scan);

module.exports = router;
