// bank.js

var jsonStream = require('duplex-json-stream')
var net = require('net')
const {appendToTransactionLog, log} = require('hash')


function getBalance() {
  return log.reduce(function (amount, item, index) {
    amount += (item.cmd == 'deposit' ? item.amount : 0)
    amount -= (item.cmd == 'withdraw' ? item.amount : 0)
    return amount
  }, 0)
}

function respondWithBalance (balance, msg, socket) {
  msg.balance = balance
  socket.write(msg)
}

function respondErr (errMsg, socket) {
  socket.write({err: errMsg})
}

function isNumeric (n) {
    return isFinite(n) && parseFloat(n) == n;
};


var server = net.createServer(function (socket) {
  socket = jsonStream(socket)
  socket.on('data', function (msg) {
    console.log('Bank received:', msg)

    switch (msg.cmd) {
    case 'balance':
      var balance = getBalance()
      respondWithBalance(balance, msg, socket)
      break
    case 'deposit':
      if (!isNumeric(msg.amount)) {
        respondErr('not valid amount for deposit', socket)
        break
      }
      var amount = +msg.amount
      if (amount <= 0) {
        respondErr('you can only deposit positive amount', socket)
        break
      }
      log.push({cmd: 'deposit', amount: amount})
      resp = {cmd: 'balance'}
      var balance = getBalance()
      respondWithBalance(balance, resp, socket)
      break
    case 'withdraw':
      if (!isNumeric(msg.amount)) {
        respondErr('not valid amount for deposit', socket)
        break
      }
      var amount = +msg.amount
      if (amount <= 0) {
        respondErr('you can only withdraw positive amount', socket)
        break
      }
      var balance = getBalance()
      if (amount > balance) {
        respondErr('not suffient balance', socket)
        break
      }
      log.push({cmd: 'withdraw', amount: amount})
      balance = getBalance()
      resp = {cmd: 'balance'}
      respondWithBalance(balance, resp, socket)
      break
    default:
      respondErr('not valid command', socket)
      break
    }
  })
})

server.listen(3876);
