/* Serves this folder on http://localhost:8765 for Chrome automation (the extension
   refuses file://).  /shim.html is index.html with a Web-Worker requestAnimationFrame
   shim injected first, because automation tabs act as background tabs and get no rAF.
     node tools/serve.js */
const http = require('http'), fs = require('fs'), path = require('path');
const root = require('path').join(__dirname, '..');
const shim = `<script>(function(){var cbs=[];var src='setInterval(function(){postMessage(0)},16)';var w=new Worker(URL.createObjectURL(new Blob([src])));w.onmessage=function(){var c=cbs;cbs=[];var t=performance.now();c.forEach(function(f){f(t)})};window.requestAnimationFrame=function(f){cbs.push(f);return cbs.length};})();</script>`;
http.createServer((req, res) => {
  let u = decodeURIComponent(req.url.split('?')[0]);
  if (u === '/shim.html') {
    let h = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
    h = h.replace('<script>', shim + '<script>');
    res.writeHead(200, { 'content-type': 'text/html' }); return res.end(h);
  }
  if (u === '/') u = '/index.html';
  const f = path.join(root, u);
  if (!fs.existsSync(f)) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'content-type': u.endsWith('.html') ? 'text/html' : 'application/octet-stream' });
  res.end(fs.readFileSync(f));
}).listen(8765, () => console.log('serving on 8765'));
