#!/usr/bin/env node

const nopt = require('nopt')
    , knowOpts = {
        'help': Boolean
      , 'version': Boolean
      , 'format': ['json', 'js']
      }
    , shortHands = {
        'h': ['--help']
      , 'v': ['--version']
      , 'json': ['--format', 'json']
      , 'js': ['--format', 'js']
      }
    , cli_options = nopt(knowOpts, shortHands, process.argv)

if (cli_options.help) {
  console.log(usage())
  process.exit()
}

if (cli_options.version) {
  console.log(require('../package.json').version)
  process.exit()
}

const fs = require('fs')
    , path = require('path')
    , dataFile = resolveDataFile()
    , data = loadData(dataFile)
    , parse = require('../lib/lilex')
    , lexicon = parse(data)
    , render = resolveRenderer(cli_options.format)

console.log(render(lexicon))

function loadData(apath) {
  try {
    return fs.readFileSync(apath, 'utf8')
  } catch (e) {
    bail(`Unable to load data from ${ apath }\n ${ e.message }`)
  }
}

function resolveRenderer(format) {
  if (format === 'js') return renderJS
  if (format === 'json' || !format) return renderJSON
  bail(`Unknown format ${ format }`)
}

function renderJS(lexicon) {
  const comment = ls => ls.map( l => `// ${ l }`).join('\n')
  return `
${ comment( lexicon.introduction ) }
${ comment( lexicon.bibliography ) }
export default ${ renderJSON(lexicon.terms) }
`
}

function renderJSON(json) {
  return JSON.stringify(json, null, 2)
}

function resolveDataFile() {
  var apath = process.argv[2]
  if (!apath) bail('missing data file')
  return path.resolve(apath)
}

function bail(message) {
  console.error('Fatal Error: ' + message)
  console.error(usage())
  process.exit(1)
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

lilex [path to lexicon.txt] > lexicon.json

* Make sure to replace [path to lexicon.txt] with the actual path to lexicon.txt

For more see:
https://github.com/elgrancalavera/lilex
https://github.com/elgrancalavera/lex_asc
http://www.argentum.freeserve.co.uk/lex_home.htm
`
}
