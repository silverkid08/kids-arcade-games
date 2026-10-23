/* Local server for Chrome checks (the extension refuses file://).  /shim.html is index.html with a
   Web-Worker requestAnimationFrame shim, because automation tabs act as background tabs.
     node tools/serve.js   ->  http://localhost:8737/shim.html */
const http=require('http'),fs=require('fs'),path=require('path');
const ROOT=require('path').join(__dirname,'..');
const SHIM=`<script>(function(){var cbs=[];var w=new Worker(URL.createObjectURL(new Blob(["setInterval(function(){postMessage(0)},16)"],{type:"text/javascript"})));w.onmessage=function(){var l=cbs;cbs=[];var t=performance.now();for(var i=0;i<l.length;i++)l[i](t)};window.requestAnimationFrame=function(f){cbs.push(f);return cbs.length};})();</script>`;
http.createServer((req,res)=>{let u=decodeURIComponent(req.url.split('?')[0]);
 if(u==='/'||u==='/shim.html'){let h=fs.readFileSync(ROOT+'/index.html','utf8');if(u==='/shim.html')h=h.replace('<script>',SHIM+'<script>');res.writeHead(200,{'Content-Type':'text/html'});return res.end(h);}
 const f=path.join(ROOT,u);if(fs.existsSync(f)&&fs.statSync(f).isFile()){res.writeHead(200);return res.end(fs.readFileSync(f));}res.writeHead(404);res.end('nf');}).listen(8737,()=>console.log('listening 8737'));
