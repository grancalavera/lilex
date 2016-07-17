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
  const sections = findMainSections(lines)
  return {
    introduction: sections[0]
  , terms: findTerms(sections[1])
  , bibliography: sections[2]
  }
}

function findTerms(lines) {
  return findContentSections(lines).map(parseTerm)
}

function parseTerm(lines) {
  return lines.reduce((term, line) => {
    addTerm(term, line)
    addPeriod(term, line)
    addDescription(term, line)
    addLinks(term, line)
    addPatternLine(term, line)
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
  term.description = (term.description || '') + cleanDescriptionLine(line) + ' '
}

function cleanDescriptionLine(line) {
  return line
    .replace(/\{/g, '')
    .replace(/\}/g, '')
    .replace(periodRe, '')
    .replace(termRe, '')
    .replace(/  +/g, ' ')
    .replace(/^ /, '')
    .replace(/ $/, '')
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
  term.width = term.pattern[0].length
  term.height = term.pattern.length
  term.isPattern = true
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
