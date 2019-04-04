var Promise = require('bluebird')
var fs = Promise.promisifyAll(require('fs'))
var _ = require('lodash')

const jsonFilename = './log.json'
const hashFilename = './hash.txt'

var log = [];

Promise.config({cancellation: true});

var read = Promise.resolve(jsonFilename)
    .timeout(2000)
    .catch(console.error.bind(console, 'Failed to load log.json!'))
    .then(fs.readFileAsync)
    .then(JSON.parse)

var readHash = Promise.resolve(hashFilename)
    .timeout(2000)
    .catch(console.error.bind(console, 'Failed to load hash.txt'))
    .then(fs.readFileAsync)

var write = function(json) {
  return new Promise.resolve(jsonFilename).timeout(2000)
    .catch(console.error.bind(console, 'Failed to load log.json!'))
    .then(ld.partialRight(fs.writeFileAsync, json))
}

var writeHash = function(hash) {
  return new Promise.resolve(hashFilename).timeout(2000)
    .catch(console.error.bind(console, "Failed to load hash.txt"))
    .then(ld.partialRight(fs.writeFileAsync, hash))
}


// Listen for exception event to trigger promise cancellation
process.on('unhandledException', function(event) {
  // cancel config loading
  p.cancel();
});

module.exports = {read, write}
