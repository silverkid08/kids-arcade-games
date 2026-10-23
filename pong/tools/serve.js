const http=require('http'),fs=require('fs'),path=require('path');
// Serves the game on http://localhost:8737/ (plain) and /shim.html (with a Web Worker
// requestAnimationFrame shim, so an automation tab that Chrome treats as background still runs).
//   node tools/serve.js
const root=path.join(__dirname,'..');
const SHIM=`<script>(function(){var src='var t=null;onmessage=function(e){if(e.data==="go"&&!t)t=setInterval(function(){postMessage(0)},16)}';
var w=new Worker(URL.createObjectURL(new Blob([src],{type:'text/javascript'})));var q=[];
w.onmessage=function(){var c=q;q=[];var now=performance.now();c.forEach(function(f){try{f(now)}catch(e){console.error(e)}})};
window.requestAnimationFrame=function(f){q.push(f);return q.length};w.postMessage('go');})();</script>`;
http.createServer((req,res)=>{
  let u=decodeURIComponent(req.url.split('?')[0]);
  if(u==='/'||u==='/shim.html'){let h=fs.readFileSync(path.join(root,'index.html'),'utf8');if(u==='/shim.html')h=h.replace('<script>',SHIM+'<script>');res.writeHead(200,{'content-type':'text/html'});return res.end(h);}
  const f=path.join(root,u);if(!f.startsWith(root)||!fs.existsSync(f)){res.writeHead(404);return res.end();}
  res.writeHead(200);res.end(fs.readFileSync(f));
}).listen(8737,()=>console.log('listening 8737'));
