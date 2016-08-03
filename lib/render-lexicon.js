const toCommentLine = line => `// ${ line }`
module.exports = function render(lexicon) {
return `${ lexicon.introduction.map( toCommentLine ).join('\n') }

${ lexicon.bibliography.map( toCommentLine ).join('\n') }

module.exports = ${ JSON.stringify(lexicon.terms, null, 2) }
`
}
