//
// This script downloads and generates icons and icon metadata.
//
import chalk from 'chalk';
import commandLineArgs from 'command-line-args';
import copy from 'recursive-copy';
import { deleteAsync } from 'del';
import download from 'download';
import fm from 'front-matter';
import fs from 'fs/promises';
import { globby } from 'globby';
import path from 'path';
import jsdom from 'jsdom';
const { JSDOM } = jsdom;
import {optimize} from 'svgo'

const { outdir } = commandLineArgs({ name: 'outdir', type: String });
const iconDir = path.join(outdir, '/assets/bootstrap-icons');

const iconPackageData = JSON.parse(await fs.readFile('./node_modules/bootstrap-icons/package.json', 'utf8'));

const version = iconPackageData.version;
const srcPath = `./.cache/icons/icons-${version}`;
const url = `https://github.com/twbs/icons/archive/v${version}.zip`;

try {
  await fs.stat(`${srcPath}/LICENSE.md`);
} catch {
  // Download the source from GitHub (since not everything is published to npm)
  await download(url, './.cache/icons', { extract: true });
}

// Copy icons
await fs.mkdir(iconDir, { recursive: true });
await Promise.all([
  copy(`${srcPath}/icons`, iconDir),
  copy(`${srcPath}/LICENSE.md`, path.join(iconDir, 'LICENSE.md')),
  copy(`${srcPath}/bootstrap-icons.svg`, './docs/assets/bootstrap-icons/sprite.svg', { overwrite: true })
]);

const spritedata = fm(await fs.readFile(`${srcPath}/bootstrap-icons.svg`, 'utf8'));
let spritemap = spritedata['body'].replace((/<symbol/g), `<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor"`)
spritemap = spritemap.replace((/<\/symbol/g), `</svg`)

await fs.writeFile(
  path.join(iconDir, '_sprite.svg'),
  spritemap,
  'utf8'
);


// Generate metadata
const files = await globby(`${srcPath}/docs/content/icons/**/*.md`);
const metadata = await Promise.all(
  files.map(async file => {
    const name = path.basename(file, path.extname(file));
    const data = fm(await fs.readFile(file, 'utf8')).attributes;
    return {
      name,
      title: data.title,
      categories: data.categories,
      tags: data.tags
    };
  })
);

// fetch viur Icons
let numIcons2 = 0;
const iconDir2 = path.join(outdir, '/assets/icons');
await fs.writeFile(path.join(iconDir, 'icons.json'), JSON.stringify(metadata, null, 2), 'utf8');

(async () => {
  try {
    const version = 'develop';
    const srcPath = `./.cache/icons/viur-icons-${version}`;
    const url = `https://github.com/viur-framework/viur-icons/archive/refs/heads/${version}.zip`;

    try {
      await stat(`${srcPath}/LICENSE`);
      console.log('Generating icons from cache');
    } catch {
      // Download the source from GitHub (since not everything is published to NPM)
      console.log(`Downloading and extracting ViUR Icons ${version} 📦`);
      await download(url, './.cache/icons', { extract: true });
    }

    // Copy icons
    console.log(`Copying icons and license`);
    await deleteAsync([iconDir2]);
    await fs.mkdir(iconDir2, { recursive: true });
    await Promise.all([
      copy(`${srcPath}`, iconDir2)
      //copy(`${srcPath}/LICENSE`, path.join(iconDir2, 'LICENSE')),
      //copy(`${srcPath}/bootstrap-icons.svg`, './docs/assets/icons/sprite.svg', { overwrite: true })
    ]);

    // Generate metadata
    console.log(`Generating icon metadata`);
    const files = await globby(`${srcPath}/*.svg`);

    const metadata = await Promise.all(
      files.map(async file => {
        const name = path.basename(file, path.extname(file));
        numIcons2++;

        return {
          name,
          title: name,
          categories: [name],
          tags: [name]
        };
      })
    );

    const dom = new JSDOM();
    const sprite = await Promise.all(
      files.map(async file => {
        const name = path.basename(file, path.extname(file));
        const data = fm(await fs.readFile(file, 'utf8'));

        let opti_svg = optimize(data['body'],{multipass:true})
        await fs.writeFile(path.join(iconDir2, path.basename(file)), opti_svg.data, 'utf8');

        let svgcode = opti_svg.data
        svgcode = svgcode.toString().replace(/<title>.*?<\/title>/g, '');
        svgcode = svgcode.toString().replace(/<style>.*?<\/style>/g, '');
        svgcode = svgcode.toString().replace(/#fff/g, 'currentcolor');
        svgcode = svgcode.toString().replace(/#FFFFFF/g, 'currentcolor');
        svgcode = svgcode.replace((/<svg/g), `<svg id="${name}"`)

        return svgcode

      })
    );

    await fs.writeFile(
      './docs/assets/icons/sprite.svg',
      `<?xml version="1.0" encoding="utf-8"?><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">${sprite.join("")}</svg>`,
      'utf8'
    );
    await fs.writeFile(
      path.join(iconDir2, '_sprite.svg'),
      `<?xml version="1.0" encoding="utf-8"?><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">${sprite.join("")}</svg>`,
      'utf8'
    );

    await fs.writeFile(path.join(iconDir2, 'icons.json'), JSON.stringify(metadata, null, 2), 'utf8');

    console.log(chalk.cyan(`Successfully processed ${numIcons2} icons ✨\n`));
  } catch (err) {
    console.error(err);
  }
})();

