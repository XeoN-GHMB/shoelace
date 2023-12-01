//
// This script bakes and copies themes, then generates a corresponding Lit stylesheet in dist/themes
//
import chalk from 'chalk';
import commandLineArgs from 'command-line-args';
import fs from 'fs';
import { mkdirSync } from 'fs';
import { globbySync } from 'globby';
import path from 'path';
import prettier from 'prettier';
import stripComments from 'strip-css-comments';
import {execSync} from "child_process";

// build viur theme
async function build_viur_theme(name='viur'){
  let ccode =""
  if (name === "viur_dark"){
    return ""
    ccode = execSync(`postcss src/ignite/themes/dark.css -u postcss-import`);
  }else{
     ccode = execSync(`postcss src/ignite/themes/light.css -u postcss-import`);
  }
  ccode+= execSync(`postcss src/ignite/shoelace.css -u postcss-import`);
  ccode+= "\n/* ViUR Defaults */";
  ccode+= `\n${fs.readFileSync('./src/themes/_viur.css',{encoding:"utf-8"})}`;

  ccode+= "\n/* _utility.css */\n/* _tables.css */";
  let filespaths = globbySync('./node_modules/tinymce/skins/content/default/**/*.min.css');
  for (const path of filespaths)
  {
    ccode+= `\n${fs.readFileSync(path,{encoding:"utf-8"})}`;
  }
  filespaths = globbySync('./node_modules/tinymce/skins/ui/oxide/**/*.min.css');
  for (const path of filespaths)
  {
    ccode+= `\n${fs.readFileSync(path,{encoding:"utf-8"})}`;
  }


  await fs.writeFileSync(`./src/themes/${name}.css`, ccode,'utf8' );
}
build_viur_theme()
build_viur_theme("viur_dark")



const { outdir } = commandLineArgs({ name: 'outdir', type: String });
const files = globbySync('./src/themes/**/[!_]*.css');
const filesToEmbed = globbySync('./src/themes/**/_*.css');
const themesDir = path.join(outdir, 'themes');
const embeds = {};

mkdirSync(themesDir, { recursive: true });

// Gather an object containing the source of all files named "_filename.css" so we can embed them later
filesToEmbed.forEach(file => {
  embeds[path.basename(file)] = fs.readFileSync(file, 'utf8');
});

// Loop through each theme file, copying the .css and generating a .js version for Lit users
files.forEach(async file => {
  let source = fs.readFileSync(file, 'utf8');

  // If the source has "/* _filename.css */" in it, replace it with the embedded styles
  Object.keys(embeds).forEach(key => {
    source = source.replace(`/* ${key} */`, embeds[key]);
  });

  const css = await prettier.format(stripComments(source), {
    parser: 'css'
  });

  let js = await prettier.format(
    `
    import { css } from 'lit';

    export default css\`
      ${css}
    \`;
  `,
    { parser: 'babel-ts' }
  );

  const cssFile = path.join(themesDir, path.basename(file));
  const jsFile = path.join(themesDir, path.basename(file).replace('.css', '.styles.js'));

  fs.writeFileSync(cssFile, css, 'utf8');
  fs.writeFileSync(jsFile, js, 'utf8');
});
