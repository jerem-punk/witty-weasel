// server/witty-weasel.js
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { handlePostUpdate, handlePostBuild, getCode } from './routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));
app.use(express.text({ type: 'text/plain' }));

// Routes GET
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.get('/code', getCode);

// Routes POST
app.post('/update', handlePostUpdate);
app.post('/build', handlePostBuild);

// Start server
const port = 3000;
app.listen(port, () => {
  console.log(`🚀 Witty Weasel ready on http://localhost:${port}/`);
});
