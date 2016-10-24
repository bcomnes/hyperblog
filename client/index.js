var choo = require('choo')
var mainView = require('./views/main')
var app = choo()

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
  require('insert-css')(require('csjs').getCss(require('./styles/global')))
  app.start('#app-root')
}
