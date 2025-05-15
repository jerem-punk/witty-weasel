import fs from 'fs';
import esbuild from 'esbuild';
// import bookmarkletPlugin from 'esbuild-plugin-bookmarklet';

export async function buildBookmarklet(code) {
  console.log('buildBookmarklet');
  fs.mkdirSync('./temp', { recursive: true });
  fs.writeFileSync('./temp/input.js', code);

  const result = await esbuild.build({
    entryPoints: ['./temp/input.js'],
    // plugins: [bookmarkletPlugin],
    bundle: true,
    write: false, // important !
    minify: true,
    format: 'iife',
    outfile: 'out.js', // important même si pas utilisé
    target: ['chrome58', 'firefox57', 'safari11', 'edge16'],
  });

  // const bookmarklet = result.outputFiles[0].text;
  const bookmarklet = 'javascript:' + encodeURIComponent(result.outputFiles[0].text);
  console.log('build done', bookmarklet);
  return bookmarklet;
}
