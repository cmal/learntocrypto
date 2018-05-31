var sodium = require('sodium-native')


// write log into a file,
// and detect hash every time the bank.js starts.
var log = [
  // {cmd: 'deposit', amount: 130},
  // {cmd: 'deposit', amount: 0},
  // {cmd: 'deposit', amount: 120}
]

var genesisHash = Buffer.alloc(32).toString('hex')

function appendToTransactionLog (entry) {
  var prevHash = log.length ? log[log.length - 1].hash : genesisHash
  log.push({
    value: entry,
    hash: hashToHex(prevHash + JSON.stringify(entry))
  })
}

function hashToHex(hash) {
  var outBuf = Buffer.alloc(sodium.crypto_generichash_BYTES)
  var inBuf = Buffer.from(hash)

  sodium.crypto_generichash(outBuf, inBuf)

  return outBuf.toString('hex')

}

module.exports = {appendToTransactionLog, log}
