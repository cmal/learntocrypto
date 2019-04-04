// bank.js

var jsonStream = require('duplex-json-stream')
var net = require('net')
const {appendToTransactionLog, getBalance, init} = require('hash')

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
  init().then((hashCorrect) => {
    if (!hashCorrect) {
      console.error('Hash is not correct!')
      socket.end()
    }

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
        appendToTransactionLog({cmd: 'deposit', amount: amount})
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
        appendToTransactionLog({cmd: 'withdraw', amount: amount})
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
})

server.listen(3876);
