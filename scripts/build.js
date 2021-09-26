//
// Builds the project. To spin up a dev server, pass the --serve flag.
//
import browserSync from 'browser-sync';
import chalk from 'chalk';
import commandLineArgs from 'command-line-args';
import copy from 'recursive-copy';
import del from 'del';
import esbuild from 'esbuild';
import fs from 'fs';
import getPort from 'get-port';
import glob from 'globby';
import path from 'path';
import { execSync } from 'child_process';
import babel from 'esbuild-plugin-babel';
const build = esbuild.build;
const bs = browserSync.create();
const { dev } = commandLineArgs({ name: 'dev', type: Boolean });
del.sync('./dist');
try {
  if (!dev) execSync('npx tsc', { stdio: 'inherit' }); // for type declarations
  if (dev) {
    execSync('npx tsc', { declaration: true });
  }
  execSync('node scripts/make-metadata.js', { stdio: 'inherit' });
  execSync('node scripts/make-search.js', { stdio: 'inherit' });
  execSync('node scripts/make-vscode-data.js', { stdio: 'inherit' });
  execSync('node scripts/make-css.js', { stdio: 'inherit' });
  execSync('node scripts/make-icons.js', { stdio: 'inherit' });
} catch (err) {
  console.error(chalk.red(err));
  process.exit(1);
}

(async () => {
  const entryPoints = [
    // The whole shebang dist
    './src/shoelace.ts',
    // Components
    ...(await glob('./src/components/**/!(*.(style|test)).ts')),
    // Public utilities
    ...(await glob('./src/utilities/**/!(*.(style|test)).ts')),
    // Theme stylesheets
    ...(await glob('./src/themes/**/!(*.test).ts'))
  ];
  const resouces = [...(await glob('./src/resources/!(*.(style|test)).ts'))];
  const resouceResult = await esbuild.build({
    format: 'esm',
    target: 'es2017',
    entryPoints: resouces,
    outdir: './dist/resources',
    chunkNames: '[name]',
    incremental: dev,
    define: {
      // Popper.js expects this to be set
      'process.env.NODE_ENV': '"production"'
    },
    bundle: true,
    splitting: false,
    plugins: []
  });
  const buildResult = await esbuild
    .build({
      format: 'esm',
      target: 'es2017',
      entryPoints,
      outdir: './dist',
      chunkNames: 'chunks/[name].[hash]',
      incremental: dev,
      loader: {
        '.png': 'dataurl',
        '.svg': 'text',
        '.css': 'text'
      },
      define: {
        // Popper.js expects this to be set
        'process.env.NODE_ENV': '"production"'
      },
      bundle: true,
      splitting: true,
      plugins: []
    })
    .catch(err => {
      console.error(chalk.red(err));
      process.exit(1);
    });

  // Create the docs distribution by copying dist into the docs folder. This is what powers the website. It doesn't need
  // to exist in dev because Browser Sync routes it virtually.
  await del('./docs/dist');
  if (!dev) {
    await Promise.all([copy('./dist', './docs/dist')]);
  }

  console.log(chalk.green('The build has finished! 📦\n'));

  if (dev) {
    const port = await getPort({
      port: getPort.makeRange(4000, 4999)
    });

    console.log(chalk.cyan(`Launching the Shoelace dev server at http://localhost:${port}! 🥾\n`));

    // Launch browser sync
    bs.init({
      startPath: '/',
      port,
      logLevel: 'silent',
      logPrefix: '[shoelace]',
      logFileChanges: true,
      notify: false,
      single: true,
      ghostMode: false,
      server: {
        baseDir: 'docs',
        routes: {
          '/dist': './dist'
        }
      }
    });

    // Rebuild and reload when source files change
    bs.watch(['src/**/!(*.test).*']).on('change', async filename => {
      console.log(`Source file changed - ${filename}`);
      buildResult
        // Rebuild and reload
        .rebuild()
        .then(async () => {
          // Rebuild stylesheets when a theme file changes
          if (/^src\/themes/.test(filename)) {
            execSync('node scripts/make-css.js', { stdio: 'inherit' });
          }
        })
        .then(() => {
          // Skip metadata when styles are changed
          if (/(\.css|\.styles\.ts)$/.test(filename)) {
            return;
          }
          console.log(`make-css change - ${filename}`);
          execSync('node scripts/make-css.js', { stdio: 'inherit' });
          execSync('node scripts/make-metadata.js', { stdio: 'inherit' });
        })
        .then(() => bs.reload())
        .catch(err => console.error(chalk.red(err)));
    });
    bs.watch(['src/resources/!(*.test).*']).on('change', async filename => {
      console.log(`resource file changed - ${filename}`);
      resouceResult
        // Rebuild and reload
        .rebuild()
        .then(() => bs.reload())
        .catch(err => console.error(chalk.red(err)));
    });

    // Reload without rebuilding when the docs change
    bs.watch(['docs/**/*.md']).on('change', filename => {
      console.log(`Docs file changed - ${filename}`);
      execSync('node scripts/make-search.js', { stdio: 'inherit' });
      bs.reload();
    });

    // Cleanup on exit
    process.on('SIGTERM', () => buildResult.rebuild.dispose());
  }
})();
