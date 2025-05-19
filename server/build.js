import fs from 'fs';
import esbuild from 'esbuild';

export async function buildBookmarklet(weaselContext) {
  const code = weaselContext.source;
  fs.mkdirSync('./temp', { recursive: true });
  fs.writeFileSync('./temp/input.js', code);

  try {
    const result = await esbuild.build({
      entryPoints: ['./temp/input.js'],
      bundle: true,
      write: false,
      minify: true,
      format: 'iife',
      outfile: 'out.js',
      target: ['chrome58', 'firefox57', 'safari11', 'edge16'],
    });

    weaselContext.error = '';
    weaselContext.built = 'javascript:' + encodeURIComponent(result.outputFiles[0].text);
  } catch(error) {
    console.error(error);
    weaselContext.error = error.toString();
    weaselContext.built = '';
  }
}
