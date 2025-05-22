import fs from 'fs';
import esbuild from 'esbuild';
import path from 'path';

export async function buildBookmarklet(weaselContext) {
  const code = weaselContext.source;
  const srcDir = path.join(weaselContext.projectRoot, 'src');
  const distDir = path.join(weaselContext.projectRoot, 'dist');
  const distPath = path.join(distDir, 'dist.js');
  const inputPath = path.join(srcDir, 'input.js');

  fs.mkdirSync(srcDir, { recursive: true });
  fs.mkdirSync(distDir, { recursive: true });
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
    weaselContext.built = 'javascript:' + encodeURIComponent(result.outputFiles[0].text);

    fs.writeFileSync(distPath, weaselContext.built);

  } catch(error) {
    console.error(error);
    weaselContext.error = error.toString();
    weaselContext.built = '';
  }
}
