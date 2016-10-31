var JSONStream = require('JSONStream')
var path = require('path')
var Hyperserv = require('hyperserv')
var minimist = require('minimist')
var makeKV = require('./lib/kv')
var websocket = require('websocket-stream')
var RPC = require('multiplex-rpc')
var fs = require('fs')
var pump = require('pump')
var argv = minimist(process.argv.slice(2), {
  alias: { p: 'port' },
  default: { port: 8000 }
})
var hyperstream = require('hyperstream')
var browserify = require('browserify')
var bankai = require('bankai')()
var client = require('./client')
// var makeRoute = Hyperserv.makeRoute
var js = bankai.js(browserify, require.resolve('./client'), {debug: true})
var html = bankai.html({ favicon: false, css: false })

// var spy = require('through2-spy')
// var streamSpy = spy.ctor({wantStrings: true}, chunk => console.log(chunk))

var kv = makeKV(path.join(__dirname, 'logs'))

var app = new Hyperserv()
// var wss
websocket.createServer({server: app.httpServer}, handle)

// Set up routes
app.router.set('/', function (req, res, opts, cb) {
  res.setHeader('Content-Type', 'text/html; charset=utf-8')
  const state = { message: { server: 'hello server!' } }
  const inner = client.toString(req.url, state)
  const hs = hyperstream({ 'body': { _appendHtml: inner } })
  pump(html(req, res), hs, res, cb)
})

app.router.set('/bundle.js', function (req, res, opts, cb) {
  pump(js(req, res), res, cb)
})

app.router.set('/all', function (req, res, opts, cb) {
  kv.createReadStream().pipe(JSONStream.stringify()).pipe(res)
})

app.httpServer.listen(argv.port)

function handle (stream) {
  var rpc = RPC({
    foo: function (bar, cb) {
      var data = { foo: bar }
      return cb(null, data)
    },
    hello: function () {
      return fs.createReadStream(path.join(__dirname, '/hello.txt'))
    }
  })

  pump(stream, rpc, stream, function (err) {
    if (err) {
      switch (err.message) {
        case 'premature close':
          console.log('premature close')
          break
        default:
          console.log(err)
      }
    }
  })
}
