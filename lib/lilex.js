const fs = require('fs')
    , path = require('path')
    , linkRe = /(?:\{([^\{]+)\})/g
    , termRe = /^:(.+):/
    , patternLineRe = /^\t([\.\*]+)$/
    , mainSectionDividerRe = /^(\-)+$/
    , periodRe = /\(p(\d+)\)/
    , emptyLineRe = /^\s*$/

const findSections = dividerRe => lines => {
  return lines.reduce((sections, line) => {
    if (dividerRe.test(line)) return sections.concat([[ line ]])
    last(sections).push(line)
    return sections
  }, [[]])
}

const findMainSections = findSections(mainSectionDividerRe)
    , findContentSections = findSections(termRe)

module.exports.parse = lines => {
  const terms = findTerms(lines)
  // return 'ok'
  return terms
}

function findTerms(lines) {
  const contentLines = findMainSections(lines)[1]
  return findContentSections(contentLines).map(parseTerm)
}

function parseTerm(lines) {
  return lines.reduce((term, line) => {
    addTerm(term, line)
    addPeriod(term, line)
    addDescription(term, line)
    addLinks(term, line)
    addPatternLine(term, line)
    addPatternDimensions(term)
    return term
  }, {})
}

function addTerm(term, line) {
  const matches = termRe.exec(line)
  if (!matches) return
  term.term = matches[1]
}

function addPeriod(term, line) {
  const matches = periodRe.exec(line)
  if (!matches) return
  term.period = parseInt(matches[1])
}

function addDescription(term, line) {
  const isEmptyLine = emptyLineRe.test(line)
      , isPatternLine = patternLineRe.test(line)

  if (isEmptyLine || isPatternLine) return
  term.description = (term.description || '') + line
}

function addLinks(term, line) {
  const links = findLinks(line)
  if (!links.length) return
  term.links = (term.links || []).concat(links)
}

function findLinks(line) {
  let matches
  const links = []
  while ((matches = linkRe.exec(line)) != null) links.push(matches[1])
  return links
}

function addPatternLine(term, line) {
  const matches = patternLineRe.exec(line)
  if (!matches) return
  term.pattern = (term.pattern || []).concat(toPatternLine(matches))
}

function addPatternDimensions(term) {
  if (!term.pattern) return
  term.width = term.pattern[0].length
  term.height = term.pattern.length
}

function toPatternLine(matches) {
  return [ matches[1].split('').map( toBinary ) ]
}

function toBinary(char) {
  return { '.': 0, '*': 1 }[char]
}

function last(array) {
  return array[array.length - 1]
}
