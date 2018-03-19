var http = require('http');
const { URL } = require('url');

// do_ping
// ping <hosts >output

// load_hosts
// <hosts
const hosts = ['fake1', 'fake2'];

// parse_output
// <output
const output = {fake1:11.1, fake2:null};
//const output = {fake1:null};
//const output = {};

// full
// load_hosts()
// parse_output()
const time = require('moment')().format('YYYYMMDDHHmmss');
const url = new URL(process.env['STORE_URL']);

for( var host in output )
  (function request_per_host( host ) {
    const payload = JSON.stringify({
      origin: "A8-test",
      target: host,
      success: output[host] !== null,
      rtt: output[host],
      time: time
    });
    const options = {
      protocol: url.protocol,
      hostname: url.hostname,
      port: url.port,
      path: url.pathname,
      method:'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength( payload )
      }
    };
    var request = http.request( options, http_response );
    request.on( 'error', (err) => { console.log('[' + host + '] error: ' + err); });
    request.write( payload );
    request.end();

    function http_response( res ) {
      res.setEncoding( 'utf8' );
      res.on( 'data', (chunk) => console.log('[' + host + '] response: ' + chunk ));
    }
  })( host );
