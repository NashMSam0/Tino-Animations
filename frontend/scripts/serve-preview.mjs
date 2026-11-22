import http from 'node:http';import {readFile,stat} from 'node:fs/promises';import path from 'node:path';
const root=path.resolve('dist/portable');
const types={'.html':'text/html','.js':'text/javascript','.mjs':'text/javascript','.css':'text/css','.svg':'image/svg+xml','.jpeg':'image/jpeg','.jpg':'image/jpeg','.vtt':'text/vtt','.md':'text/markdown','.webmanifest':'application/manifest+json'};
http.createServer(async(req,res)=>{
if(req.url.startsWith('/api/')){const upstream=http.request('http://localhost:5199'+req.url,{method:req.method,headers:{accept:'application/json'}},r=>{res.writeHead(r.statusCode||502,{'content-type':r.headers['content-type']||'application/json'});r.pipe(res);});upstream.on('error',()=>{res.writeHead(502,{'content-type':'application/json'});res.end('{"error":"Backend unavailable"}');});req.pipe(upstream);return;}
try{const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);let file=path.resolve(root,'.'+pathname);if(!file.startsWith(root+path.sep)&&file!==root){res.writeHead(403);res.end();return;}try{if(!(await stat(file)).isFile())file=root+'/index.html';}catch{if(path.extname(pathname)){res.writeHead(404);res.end();return;}file=root+'/index.html';}const data=await readFile(file);res.writeHead(200,{'content-type':types[path.extname(file)]||'application/octet-stream','cache-control':'no-store'});res.end(data);}catch{res.writeHead(500);res.end();}
}).listen(4200,'127.0.0.1',()=>console.log('Tino frontend: http://127.0.0.1:4200'));


