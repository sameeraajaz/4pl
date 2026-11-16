import {readFileSync,existsSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
const root=fileURLToPath(new URL('..',import.meta.url));
const pages=JSON.parse(readFileSync(path.join(root,'data/pages.json'),'utf8'));
const references=new Set(['/assets/site.js','/assets/ship.svg','/assets/social-cover.png','/assets/logo.png','/assets/favicon.svg']);
for(const page of Object.values(pages))for(const match of page.body.matchAll(/(?:src|href)="(\/assets\/[^"?#]+)(?:[?#][^"]*)?"/g))references.add(match[1]);
const css=readFileSync(path.join(root,'app/globals.css'),'utf8');
for(const match of css.matchAll(/url\(['"]?(\/assets\/[^)'"\s]+)['"]?\)/g))references.add(match[1]);
const missing=[...references].filter(p=>!existsSync(path.join(root,'public',p)));
if(missing.length){console.error('Cannot build: required public assets are missing:\n'+missing.join('\n'));process.exit(1);}
if(!css.includes('.hero')||!css.includes('.service-grid'))throw new Error('Global site styles are incomplete');
console.log(`Verified ${references.size} public assets and the imported global stylesheet before build.`);
