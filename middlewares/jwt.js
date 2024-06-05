require('dotenv').config(); 

const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    try {
        const decoded = jwt.verify(token.split(' ')[1], process.env.SECRET_KEY); 
        req.orgId = decoded.orgId;
        req.serverUrl = decoded.serverUrl;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' });
    }
};
