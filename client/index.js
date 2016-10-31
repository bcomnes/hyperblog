var choo = require('choo')
var mainView = require('./views/main')
var app = choo()
// var getCss = require('csjs/get-css')
var insertCSS = require('insert-css')
var RPC = require('multiplex-rpc')
var pump = require('pump')
var url = require('url')

app.model({
  namespace: 'message',
  state: {
    server: 'rehydration has kicked in, server data was tossed',
    client: 'hello client!'
  }
})

app.router((route) => [
  route('/', mainView)
])

if (module.parent) {
  module.exports = app
} else {
  var globalCss = require('./styles/global')
  var address = 'ws://' + url.parse(window.location.href).host
  // insertCSS(getCss(globalCss))
  insertCSS(globalCss)
  app.start('#app-root')
  var BrowserStdout = require('browser-stdout')

  var ws = require('./lib/ws-client')
  var activeRPC
  var re = ws(function (stream) {
    var rpc = activeRPC = RPC()
    pump(rpc, stream, rpc, function (err) {
      if (err) {
        switch (err.message) {
          default:
            console.log(err)
        }
      }
    })
    var client = rpc.wrap([ 'hello:s', 'foo' ])

    client.foo('bah', function (err, data) {
      if (err) console.error(err)
      if (data) console.log(data)
    })

    pump(client.hello(), BrowserStdout(), function (err) {
      if (err) console.error(err)
    })
  }).connect(address)

  ws.logger(re)

  window.addEventListener('beforeunload', function (event) {
    try {
      ws.reconnect = false
      activeRPC.end()
    } catch (e) {
      console.error(e)
    }
  })
}

