const http = require('http');

http.get('http://localhost:9002/api/pdf-proxy?url=https%3A%2F%2Fwww.w3.org%2FWAI%2FER%2Ftests%2Fxhtml%2Ftestfiles%2Fresources%2Fpdf%2Fdummy.pdf', (res) => {
  console.log('Proxy Response Status:', res.statusCode);
  console.log('Proxy Response Headers:', res.headers);
  process.exit(0);
}).on('error', (e) => {
  console.error(e);
  process.exit(1);
});
