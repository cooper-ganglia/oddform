import {cp,mkdir,rm,readFile} from 'node:fs/promises';
const root=new URL('../',import.meta.url),dist=new URL('../dist/',import.meta.url);
await rm(dist,{recursive:true,force:true});await mkdir(dist,{recursive:true});
for(const file of ['index.html','styles.css','app.js','src','assets','robots.txt','sitemap.xml'])await cp(new URL(file,root),new URL(file,dist),{recursive:true});
const html=await readFile(new URL('index.html',dist),'utf8');
for(const id of ['work','practice','about','contact'])if(!html.includes(`id="${id}"`))throw new Error(`Missing section: ${id}`);
console.log('Built static website in dist/');
