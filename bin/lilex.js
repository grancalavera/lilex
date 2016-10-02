#!/usr/bin/env node

const nopt = require('nopt')
    , cli = require('./lilex-cli')
    , parse = require('./parse')
    , knowOpts =
      { 'help': Boolean
      , 'version': Boolean
      , 'format': ['json', 'js']
      }
    , shortHands =
      { 'h': ['--help']
      , 'v': ['--version']
      , 'json': ['--format', 'json']
      , 'js': ['--format', 'js']
      }
    , cli_options = nopt(knowOpts, shortHands, process.argv)

if (cli_options.help) {
  console.log(cli.usage())
  process.exit()
}

if (cli_options.version) {
  console.log(require('../package.json').version)
  process.exit()
}

const dataFile = cli.resolveDataFile(process.argv[2])
    , data = cli.loadData(dataFile)
    , lexicon = parse(data)
    , render = cli.resolveRenderer(cli_options.format)

try {
  console.log(render(lexicon))
} catch (e) {
  console.error(e.message)
  console.error(cli.usage())
  process.exit(1)
}
