const http = require('http');
const mime = require('mime');
const fs = require('fs');
const path = require('path');

module.exports = function(base){
  return http.createServer((req, res) => {
    const filename = path.join(base, req.url);
    const contentType = mime.lookup(filename);
    const readStream = fs.createReadStream(filename);
    readStream.on('error', () => {
      res.writeHead(404);
      res.end('THERE IS A PROBLEM WITH THE FILE YOU SPECIFIED');
    });


    res.writeHead(200, {'Content-Type': contentType});
    readStream.pipe(res);

  });
};