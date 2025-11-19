import express from 'express';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json({ limit: '50mb' }));

const DATA_FILE = path.join(__dirname, 'public', 'data', 'values_dashboard.json');

// Endpoint to save the data
app.post('/api/save-data', async (req, res) => {
  try {
    const data = req.body;
    await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
    res.json({ success: true, message: 'Data saved successfully' });
  } catch (error) {
    console.error('Error saving data:', error);
    res.status(500).json({ success: false, message: 'Failed to save data' });
  }
});

app.listen(PORT, () => {
  console.log(`Data persistence server running on http://localhost:${PORT}`);
});
