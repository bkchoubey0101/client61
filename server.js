const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const root = __dirname;
const port = Number(process.env.PORT) || 3000;
const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon'
};

http.createServer((req, res) => {
  const pathname = decodeURIComponent(new URL(req.url, `http://${req.headers.host || 'localhost'}`).pathname);
  let requested = path.normalize(path.join(root, pathname));
  if (!requested.startsWith(root)) {
    res.writeHead(403);
    return res.end('Forbidden');
  }
  if (pathname === '/' || pathname.endsWith('/')) requested = path.join(root, 'index.html');
  fs.stat(requested, (err, stat) => {
    if (err || !stat.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      return res.end('Not found');
    }
    res.writeHead(200, { 'Content-Type': mimeTypes[path.extname(requested).toLowerCase()] || 'application/octet-stream' });
    fs.createReadStream(requested).pipe(res);
  });
}).listen(port, '0.0.0.0', () => {
  console.log(`Soundrya website running on port ${port}`);
});
