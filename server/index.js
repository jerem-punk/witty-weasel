import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { buildBookmarklet } from './build.js';
import { existsSync, readFileSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

let source = `alert('hello from witty weasel');`;
const sourcePath = path.join(process.cwd(), 'src/input.js');
if (existsSync(sourcePath)) {
  source = readFileSync(sourcePath, { encoding: 'utf8' });
}

const weaselContext = {
  projectRoot: process.cwd(),
  source: source,
  built: '',
  error: '',
};

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));
app.use(express.text({ type: 'text/plain' }));

app.use((req, res, next) => {
  res.set('Access-Control-Allow-Origin', '*');
  next();
});

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
app.post('/update', async (req, res) => {
  weaselContext.source = req.body;
  await buildBookmarklet(weaselContext);
  if (weaselContext.error) {
    res.status(500).send(weaselContext.error);
  } else {
    res.send(weaselContext.built);
  }
});

// Start server
const port = 3000;
app.listen(port, () => {
  console.log(`🚀 Witty Weasel ready on http://localhost:${port}/ with working directory: ${weaselContext.projectRoot}`);
});
