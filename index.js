var JSONStream = require('JSONStream')
var path = require('path')
var Hyperserv = require('hyperserv')
var minimist = require('minimist')
var makeKV = require('./lib/kv')
var argv = minimist(process.argv.slice(2), {
  alias: { p: 'port' },
  default: { port: 8000 }
})
var hyperstream = require('hyperstream')
var browserify = require('browserify')
var bankai = require('bankai')()
var pump = require('pump')
var client = require('./client')
// var makeRoute = Hyperserv.makeRoute
var js = bankai.js(browserify, require.resolve('./client'), {debug: true})
var html = bankai.html({ favicon: false, css: false })

var kv = makeKV(path.join(__dirname, 'logs'))

var app = new Hyperserv()

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
