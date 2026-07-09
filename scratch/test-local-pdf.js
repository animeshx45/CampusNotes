const http = require('http');

http.get('http://localhost:9002/dummy.pdf', (res) => {
  console.log('Local PDF Status Code:', res.statusCode);
  console.log('Local PDF Content-Type:', res.headers['content-type']);
  console.log('Local PDF Length:', res.headers['content-length']);
  process.exit(0);
}).on('error', (e) => {
  console.error(e);
  process.exit(1);
});
