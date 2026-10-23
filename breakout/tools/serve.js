/* Serves this folder on http://localhost:8791 for browser automation checks.
     node tools/serve.js [port]
   /            the game as-is
   /shim.html   the game with a Web-Worker requestAnimationFrame shim injected,
                because automation tabs act as background tabs and get no rAF.
   (Page setInterval/setTimeout are also throttled to 1 Hz in such tabs: drive
   any test bot from a Worker too.) */
const http = require('http'), fs = require('fs'), path = require('path');
const root = path.join(__dirname, '..');
const port = parseInt(process.argv[2] || '8791', 10);
const SHIM = '<script>(function(){var w=new Worker(URL.createObjectURL(new Blob([\'setInterval(function(){postMessage(0)},16)\'])));' +
  'var q=[];w.onmessage=function(){var c=q;q=[];var t=performance.now();for(var i=0;i<c.length;i++)c[i](t);};' +
  'window.requestAnimationFrame=function(f){q.push(f);return q.length;};})();</script>';
http.createServer((req, res) => {
  const u = decodeURIComponent(req.url.split('?')[0]);
  if (u === '/shim.html') {
    const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8').replace('<head>', '<head>' + SHIM);
    res.writeHead(200, { 'Content-Type': 'text/html' }); return res.end(html);
  }
  const f = path.normalize(path.join(root, u === '/' ? 'index.html' : u));
  if (!f.startsWith(root)) { res.writeHead(403); return res.end(); }
  fs.readFile(f, (e, d) => {
    if (e) { res.writeHead(404); return res.end('not found'); }
    res.writeHead(200, { 'Content-Type': f.endsWith('.html') ? 'text/html' : f.endsWith('.png') ? 'image/png' : 'text/plain' });
    res.end(d);
  });
}).listen(port, () => console.log('http://localhost:' + port + '/  and  /shim.html'));
