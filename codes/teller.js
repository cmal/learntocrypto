// teller.js

var jsonStream = require('duplex-json-stream');
var net = require('net')

var client = jsonStream(net.connect(3876))

var cmd = process.argv[2]

switch (cmd) {
case 'balance':
  client.write({cmd: cmd})
  break
case 'deposit':
  client.write({cmd: cmd, amount: +process.argv[3]})
  break
case 'withdraw':
  client.write({cmd: cmd, amount: +process.argv[3]})
  break
default:
  break
}

client.on('data', function (msg) {
  console.log('Teller received:', msg)
  client.end()
})
