import fs from 'fs';
import esbuild from 'esbuild';
import path from 'path';

export async function buildBookmarklet(weaselContext) {
  const code = weaselContext.source;
  const inputPath = path.join(weaselContext.projectRoot, 'input.js');
  const distPath = path.join(weaselContext.projectRoot, 'built.js');
  const bookmarkletPath = path.join(weaselContext.projectRoot, 'bookmarklet.txt');

  fs.writeFileSync(inputPath, code);

  try {
    const result = await esbuild.build({
      entryPoints: [inputPath],
      absWorkingDir: weaselContext.projectRoot,
      bundle: true,
      write: false,
      minify: true,
      legalComments: 'none',
      format: 'iife',
      outfile: 'out.js',
      target: ['chrome58', 'firefox57', 'safari11', 'edge16'],
    });

    weaselContext.error = '';
    weaselContext.built = result.outputFiles[0].text;

    fs.writeFileSync(distPath, weaselContext.built);
    fs.writeFileSync(bookmarkletPath, 'javascript:' + encodeURIComponent(weaselContext.built));

  } catch(error) {
    console.error(error);
    weaselContext.error = error.toString();
    weaselContext.built = '';
  }
}
