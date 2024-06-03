const express = require('express');
const config = require('./config');
const scanRoutes = require('./routes/scanRoutes');

const app = express();

app.use(express.json());
app.use('/api', scanRoutes);

app.listen(config.port, () => {
    console.log(`Vulnerability scanning API running on port ${config.port}`);
});
