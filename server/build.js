import fs from 'fs';
import esbuild from 'esbuild';

export async function buildBookmarklet(code) {
  console.log('buildBookmarklet');
  fs.mkdirSync('./temp', { recursive: true });
  fs.writeFileSync('./temp/input.js', code);

  const result = await esbuild.build({
    entryPoints: ['./temp/input.js'],
    bundle: true,
    write: false,
    minify: true,
    format: 'iife',
    outfile: 'out.js',
    target: ['chrome58', 'firefox57', 'safari11', 'edge16'],
  });

  const bookmarklet = 'javascript:' + encodeURIComponent(result.outputFiles[0].text);

  return bookmarklet;
}
