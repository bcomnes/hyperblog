var websocket = require('websocket-stream')
var inject = require('reconnect-core')

var ws = inject(function () {
  // arguments are what you passed to .connect
  // this is the reconnect instance
  var address = arguments[0]
  var protocols = arguments[1]
  var options = arguments[3]
  var ws = websocket(address, protocols, options)
  return ws
})

module.exports = ws

function logger (re) {
  re.on('connect', function (con) {
    console.log('connected')
  })
  .on('reconnect', function (n, delay) {
    console.log('reconnect: n(' + n + ') ' + delay)
  })
  .on('disconnect', function (err) {
    console.log('disconnected')
    if (err instanceof Error) console.error(err)
  })
  .on('error', function (err) {
    if (err instanceof Error) {
      switch (err) {
        default:
          console.error(err)
          break
      }
    }
  })
}

module.exports.logger = logger
