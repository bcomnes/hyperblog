var level = require('level')
var hyperlog = require('hyperlog')
var hyperkv = require('hyperkv')
var sub = require('subleveldown')
var path = require('path')
var mkdirp = require('mkdirp')

function createKV (logPath) {
  if (!logPath) throw new Error('Missing logPath')
  mkdirp.sync(logPath)
  var hdb = level(path.join(logPath, 'hyperlog'))
  var idb = level(path.join(logPath, 'index'))

  var log = hyperlog(hdb, { valueEncoding: 'json' })
  var db = sub(idb, 'kv')

  var kv = hyperkv({
    log: log,
    db: db
  })

  return kv
}

module.exports = createKV
