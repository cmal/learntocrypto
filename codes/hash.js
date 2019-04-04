var sodium = require('sodium-native')
var {read , write} = require('./log')

// write log into a file,
// and detect hash every time the bank.js starts.

var genesisHash = Buffer.alloc(32).toString('hex')

var log = [];

function init () {
  return Promise.all(read(), readHash()).spread((json, hash) => {
    log = json
    var prevHash = getPrevHash(log)
    return hash == prevHash
  })
}

function appendToTransactionLog (entry) {
  var prevHash = getPrevHash(log)
  log.push({
    value: entry,
    hash: hashToHex(prevHash + JSON.stringify(entry))
  })
  write(JSON.stringify(log))
}

function getPrevHash(log) {
  return log.length ? log[log.length - 1].hash : genesisHash
}

function hashToHex(hash) {
  var outBuf = Buffer.alloc(sodium.crypto_generichash_BYTES)
  var inBuf = Buffer.from(hash)
  sodium.crypto_generichash(outBuf, inBuf)
  return outBuf.toString('hex')

}

function getBalance() {
  return log.reduce(function (value, item, index) {
    amount = value.amount;
    amount += (item.cmd == 'deposit' ? item.amount : 0)
    amount -= (item.cmd == 'withdraw' ? item.amount : 0)
    return amount
  }, 0)
}

module.exports = {
  appendToTransactionLog,
  getBalance,
  init
}
