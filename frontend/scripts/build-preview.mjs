import {readFile,writeFile,mkdir,cp,readdir} from 'node:fs/promises';
import {spawnSync} from 'node:child_process';
import path from 'node:path';
const root=process.cwd(), out=path.join(root,'dist/portable');
await mkdir(out,{recursive:true});
const config={extends:'./tsconfig.app.json',compilerOptions:{outDir:'./dist/portable',rootDir:'./src',module:'ES2022'},angularCompilerOptions:{compilationMode:'full'}};
await writeFile('tsconfig.preview.json',JSON.stringify(config,null,2));
const r=spawnSync(process.execPath,['node_modules/@angular/compiler-cli/bundles/src/bin/ngc.js','-p','tsconfig.preview.json'],{stdio:'inherit'});
if(r.status!==0)process.exit(r.status||1);
const imports={};
for(const name of ['core','common','compiler','platform-browser','router','service-worker']){
await cp('node_modules/@angular/'+name+'/fesm2022',out+'/vendor/'+name,{recursive:true,filter:s=>!s.endsWith('.map')});
imports['@angular/'+name]='/vendor/'+name+'/'+name+'.mjs';
}
Object.assign(imports,{'@angular/common/http':'/vendor/common/http.mjs','@angular/core/rxjs-interop':'/vendor/core/rxjs-interop.mjs','@angular/core/primitives/signals':'/vendor/core/primitives-signals.mjs','@angular/core/primitives/di':'/vendor/core/primitives-di.mjs','@angular/core/primitives/event-dispatch':'/vendor/core/primitives-event-dispatch.mjs',rxjs:'/vendor/rxjs/index.js','rxjs/operators':'/vendor/rxjs/operators/index.js',tslib:'/vendor/tslib.js'});
await cp('node_modules/rxjs/dist/esm',out+'/vendor/rxjs',{recursive:true,filter:s=>!s.endsWith('.map')});
await cp('node_modules/tslib/tslib.es6.mjs',out+'/vendor/tslib.js');
async function fix(dir){for(const item of await readdir(dir,{withFileTypes:true})){const p=path.join(dir,item.name);if(item.isDirectory())await fix(p);else if(p.endsWith('.js')){const s=await readFile(p,'utf8');await writeFile(p,s.replace(/(from\s+['"])(\.[^'"]+)(['"])/g,(m,a,b,c)=>a+b+(path.extname(b)?'':'.js')+c));}}}
await fix(out+'/vendor/rxjs');
await cp('public',out,{recursive:true});
await cp('src/styles.css',out+'/styles.css');
let html=await readFile('src/index.html','utf8');
html=html.replace('</head>','<link rel="stylesheet" href="/styles.css"><script type="importmap">'+JSON.stringify({imports})+'</script></head>').replace('</body>','<script type="module">import "@angular/compiler";import "/main.js";</script></body>');
await writeFile(out+'/index.html',html);
console.log('Angular AOT preview compiled to dist/portable (PWA service worker disabled in this development preview).');

