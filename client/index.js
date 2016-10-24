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
  insertCSS(getCss(globalCss))
  app.start('#app-root')
}
