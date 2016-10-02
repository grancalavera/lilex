const fs = require('fs')
    , path = require('path')
    , babel = require('babel-core')

module.exports.resolveDataFile = resolveDataFile
module.exports.loadData = loadData
module.exports.resolveRenderer = resolveRenderer
module.exports.usage = usage

function loadData(apath) {
  try {
    return fs.readFileSync(apath, 'utf8')
  } catch (e) {
    throw new Error(`Unable to load data from ${ apath }\n ${ e.message }`)
  }
}

function resolveRenderer(format) {
  switch (format) {
    case 'js': return renderJS
    case 'json': return renderJSON
    default: throw new Error(`Unknown format ${ format }`)
  }
}

function renderJS(lexicon) {
  const esmodule =
`
// Generated on ${ new Date() }
export const lexicon = ${ renderJSON(lexicon) }
export default lexicon
`
  return babel
    .transform(
      esmodule
    , { compact: true
      , sourceMaps: 'inline'
      , plugins: [ 'transform-es2015-modules-umd' ]
      }
    )
    .code
}

function renderJSON(json) {
  return JSON.stringify(json, null, 2)
}

function resolveDataFile(apath) {
  if (!apath) throw new Error('Missing required <path> to data file')
  return path.resolve(apath)
}

function usage() {
  return `
Usage

lilex <path>                      Parses the Life Lexicon and renders it
                                  as JSON to stdout

lilex <path> --format [json|js]   Changes the output format

lilex <path> -json                Parses the Life Lexicon and renders it
                                  as JSON to stdout

lilex <path> -js                  Parses the Life Lexicon and renders it
                                  as an ES2015 JavaScript module to stdout

lilex --help                      Displays this message

Download and expand the plain text ASCII version of the Life Lexicon.
Once expanded, you will end-up with a directory with the following files:

lex_asc
├── README
├── emacs.txt
├── lexicon-clean.txt
├── lexicon-small.txt
├── lexicon.txt
└── lifelex.el

The file that you need to use is lexicon.txt.

Then run the following command:

lilex <path to lexicon.txt> > lilex.json

* Make sure to replace <path to lexicon.txt> with the actual path to lexicon.txt

For more see:
https://github.com/elgrancalavera/lilex
https://github.com/elgrancalavera/lex_asc
http://www.argentum.freeserve.co.uk/lex_home.htm
`
}
