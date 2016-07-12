const fs = require('fs')
    , path = require('path')
    , lilex = require('../lib/lilex')
    , dataFile = resolveDataFile()
    , data = loadData(dataFile)
    , json = lilex.parse(data)

console.log(JSON.stringify(json, null, 2))

function loadData(apath) {
  try {
    return fs.readFileSync(apath, 'utf8').split('\n')
  } catch (e) {
    bail('unable to load data \n' + e.message)
  }
}

function resolveDataFile() {
  var apath = process.argv[2]
  if (!apath) bail('missing data file')
  return path.resolve(apath)
}

function bail(message) {
  console.error(message)
  process.exit(1)
}
