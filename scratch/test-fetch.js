const https = require('https');

https.get('https://tmpfiles.org/w0wB3hudMGjR/engineeringdrawinglecture2.pdf', (res) => {
  let body = '';
  res.on('data', (chunk) => body += chunk);
  res.on('end', () => {
    // Print first 500 characters of the body to see the title/text
    console.log(body.substring(0, 800));
    process.exit(0);
  });
}).on('error', (e) => {
  console.error(e);
  process.exit(1);
});
