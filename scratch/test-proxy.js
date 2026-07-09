const http = require('http');

http.get('http://localhost:9002/api/pdf-proxy?url=https%3A%2F%2Ftmpfiles.org%2Fdl%2Fw0wB3hudMGjR%2Fengineeringdrawinglecture2.pdf', (res) => {
  console.log('Proxy Response Status:', res.statusCode);
  console.log('Proxy Response Headers:', res.headers);
  let body = '';
  res.on('data', (chunk) => body += chunk.toString('utf8'));
  res.on('end', () => {
    console.log('Proxy Response Sample Body:', body.substring(0, 500));
    process.exit(0);
  });
}).on('error', (e) => {
  console.error(e);
  process.exit(1);
});
