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

module.exports = app
