/* Serves the game on http://localhost:<port>/ for browser automation.
   /       -> index.html with a Web-Worker requestAnimationFrame shim injected
              (automation tabs run like background tabs and get no rAF)
   /plain  -> index.html unchanged
     node tools/serve.js [port] */
const http = require('http'), fs = require('fs'), path = require('path');
const port = +(process.argv[2] || 8737);
const SHIM = '<script>(function(){var q=[];var w=new Worker(URL.createObjectURL(new Blob(["setInterval(function(){postMessage(0)},16)"])));' +
  'w.onmessage=function(){var t=performance.now(),l=q;q=[];l.forEach(function(f){f(t)})};window.requestAnimationFrame=function(f){q.push(f);return q.length}})();</script>';
http.createServer((req, res) => {
  const file = path.join(__dirname, '..', 'index.html');
  let html = fs.readFileSync(file, 'utf8');
  if (!req.url.startsWith('/plain')) html = html.replace('<head>', '<head>' + SHIM);
  if (req.url === '/favicon.ico') { res.writeHead(404); res.end(); return; }
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' });
  res.end(html);
}).listen(port, () => console.log('serving on http://localhost:' + port + '/'));
