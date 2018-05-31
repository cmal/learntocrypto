var sodium = require('sodium-native')

var outBuf = Buffer.alloc(sodium.crypto_generichash_BYTES)
var inBuf = Buffer.from('Hello, World!')

sodium.crypto_generichash(outBuf, inBuf)

console.log(outBuf.toString('hex'))
