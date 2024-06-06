const express = require('express');
const router = express.Router();
const jwtMiddleware = require('../middlewares/jwt'); 
const nmapController = require('../controllers/nmapController');
const httpxController = require('../controllers/httpxController');
const nucleiController = require('../controllers/nucleiController');

router.use(jwtMiddleware);

router.post('/scan/nmap', nmapController.scan);
router.post('/scan/httpx', httpxController.scan);
// router.post('/scan/nuclei', nucleiController.scan);
router.post('/scan/nuclei', nucleiController.enqueueNucleiScan);


module.exports = router;
