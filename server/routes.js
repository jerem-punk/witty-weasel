import { currentCode, updateCode, bookmarkletCode, updateBookmarklet } from './state.js';
import { buildBookmarklet } from './build.js';

export function getCode(req, res) {
  res.type('text/plain').send(currentCode);
}

export function handlePostUpdate(req, res) {
  const code = req.body;
  updateCode(code);
  res.send('ok');
}

export async function handlePostBuild(req, res) {
  const bookmarklet = await buildBookmarklet(currentCode);
  updateBookmarklet(bookmarklet);
  res.send(bookmarklet);
}
