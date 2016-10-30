var choo = require('choo')
var mainView = require('./views/main')
var app = choo()
var getCss = require('csjs/get-css')
var insertCSS = require('insert-css')

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
  // insertCSS(getCss(globalCss))
  insertCSS(globalCss)
  app.start('#app-root')
  var BrowserStdout = require('browser-stdout')
  var pump = require('pump')
  var ws = require('./lib/ws-client')

  ws.foo('bah', function (err, data) {
    if (err) console.error(err)
    if (data) console.log(data)
  })

  pump(ws.hello(), BrowserStdout(), function (err) {
    if (err) console.error(err)
  })
}
