const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

app.get('/api/dashboard', (req, res) => {
  res.json({
    containers: [],
    metrics: { cpu: 0, ram: 0, disk: 0 },
    backups: []
  });
});

app.listen(port, () => {
  console.log(`VPS Guardian Backend running on port ${port}`);
});
