var Promise = require('bluebird')
var fs = Promise.promisifyAll(require('fs'))
var _ = require('lodash')

const filename = 'log.json'

var log = [];

Promise.config({cancellation: true});

var pread = Promise.resolve(filename)
    .timeout(2000)
    .catch(console.error.bind(console, 'Failed to load log!'))
    .then(fs.readFileAsync)
    .then(JSON.parse)
    .then(function(data) {
      log = data
      return data
    })

// Listen for exception event to trigger promise cancellation
process.on('unhandledException', function(event) {
  // cancel config loading
  p.cancel();
});

var append = function(entry) {
  return new Promise.resolve(filename).timeout(2000)
    .catch(console.error.bind(console, 'Failed to load log!'))
    .then(ld.partialRight(fs.writeFileAsync, entry))
}
