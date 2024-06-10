const express = require('express');
const config = require('./config');
const scanRoutes = require('./routes/scanRoutes');

const app = express();

app.use(express.json());
app.use('/api', scanRoutes);

app.listen(config.port, "0.0.0.0", () => {
    console.log(`Internal network scanning API running on port ${config.port}`);
});
