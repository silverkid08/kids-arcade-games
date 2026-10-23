/* Serves the game on http://localhost:8737/ for Chrome automation (the extension refuses file://).
   /shim.html is index.html with a Web-Worker requestAnimationFrame shim, because automation tabs act
   as background tabs and get no rAF.   node tools/serve.js */
const http=require('http'),fs=require('fs'),path=require('path');
const root=path.join(__dirname,'..');
const SHIM=`<script>(function(){var cbs=[];var w=new Worker(URL.createObjectURL(new Blob(["setInterval(function(){postMessage(0)},16)"],{type:"text/javascript"})));
w.onmessage=function(){var c=cbs;cbs=[];var t=performance.now();c.forEach(function(f){f(t)});};
window.requestAnimationFrame=function(f){cbs.push(f);return cbs.length;};})();</script>`;
http.createServer((q,r)=>{let u=q.url.split('?')[0];if(u==='/')u='/index.html';
 if(u==='/shim.html'){let h=fs.readFileSync(root+'/index.html','utf8');h=h.replace('<script>',SHIM+'<script>');r.writeHead(200,{'content-type':'text/html'});return r.end(h);}
 const f=path.join(root,u);if(!fs.existsSync(f)){r.writeHead(404);return r.end();}r.writeHead(200,{'content-type':f.endsWith('.html')?'text/html':'application/octet-stream'});r.end(fs.readFileSync(f));}).listen(8737,()=>console.log('up'));
