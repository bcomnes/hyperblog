var RPC = require('multiplex-rpc')
var websocket = require('websocket-stream')
var pump = require('pump')
var url = require('url')

var wsHost = url.parse(window.location.href).host

var ws = websocket('ws://' + wsHost)

var rpc = RPC()

pump(rpc, ws, rpc, function (err) {
  if (err) console.error(err)
  else console.log('ws closed')
})

var client = rpc.wrap([ 'hello:s', 'foo' ])

module.exports = client

