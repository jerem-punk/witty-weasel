import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { buildBookmarklet } from './build.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

const weaselContext = {
  source: `alert('hello from witty weasel');`,
  built: '',
};

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));
app.use(express.text({ type: 'text/plain' }));

// Routes GET
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.get('/code', (req, res) => {
  res.type('text/plain').send(weaselContext.source);
});

app.get('/bookmarklet.js', (req, res) => {
  res.type('text/plain').send(weaselContext.built);
});

// Routes POST
app.post('/update', (req, res) => {
  weaselContext.source = req.body;
  res.send('ok');
});

app.post('/build', async (req, res) => {
  const bookmarklet = await buildBookmarklet(weaselContext.source);
  weaselContext.built = bookmarklet;
  res.send(bookmarklet);
});

// Start server
const port = 3000;
app.listen(port, () => {
  console.log(`🚀 Witty Weasel ready on http://localhost:${port}/`);
});
