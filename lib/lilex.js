const fs = require('fs')
    , path = require('path')

module.exports = lexicon_txt => parseLexiconLines(lexicon_txt.split('\n'))

function parseLexiconLines(lines) {
  const [ introLines, termLines, biblioLines ] = findMainSections(lines)
  return {
    introduction: findSimpleSections(introLines).reduce(flatten)
  , terms: findTerms(termLines)
  , bibliography: findSimpleSections(biblioLines).reduce(flatten)
  }
}

const linkRe = /(?:\{([^\{]+)\})/g
    , termRe = /^:(.+):/
    , patternLineRe = /^\t([\.\*]+)$/
    , mainSectionDividerRe = /^(\-)+$/
    , periodRe = /\(p(\d+)\)/
    , emptyLineRe = /^\s*$/

const findSections = (dividerRe, keepDividerLine) => lines => {
  return lines
    .reduce((sections, line) => {
      if (dividerRe.test(line)) return sections.concat(newSection(line))
      last(sections).push(line)
      return sections
    }, [[ ]])
    .filter(nonEmptySection)

    function newSection(line) {
      return keepDividerLine ? [[ line ]] : [[ ]]
    }
}

const findMainSections = findSections(mainSectionDividerRe)
    , findContentSections = findSections(termRe, true)
    , findSimpleSections = findSections(emptyLineRe)

function findTerms(lines) {
  return findContentSections(lines)
    .map(parseTerm)
    .filter(({ term }) => !!term )
}

function parseTerm(lines) {
  return lines.reduce((term, line) => {
    addTerm(term, line)
    addPeriod(term, line)
    addDescription(term, line)
    addLinks(term, line)
    addPatternRow(term, line)
    return term
  }, {})
}

function addPatternRow(term, line) {
  const matches = patternLineRe.exec(line)
  if (!matches) return

  const patternRow = matchesToPatternRow(matches)
  term.pattern = (term.pattern || []).concat(patternRow)
  term.patternWidth = term.pattern[0].length
  term.patternHeight = term.pattern.length

  const patternCoords = patternRowToCoords(patternRow, term.patternHeight)
  term.patternByCoords = (term.patternByCoords || []).concat(patternCoords)
}

function matchesToPatternRow(matches) {
  return [ matches[1].split('').map( toBinary ) ]
}

function patternRowToCoords(patternRow, y) {
  return patternRow.reduce((coords, isAlive, x) => {
    if (!isAlive) return coords
    return coords.concat({x, y})
  }, [])
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
      , description = term.description || ''

  if (isEmptyLine || isPatternLine) return
  term.description = description + ' ' + cleanDescriptionLine(line)
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

function toBinary(char) {
  return { '.': 0, '*': 1 }[char]
}

function last(array) {
  return array[array.length - 1]
}

function nonEmptySection(sectionLines) {
  return !!sectionLines.length
}

function isPattern(term) {
  return !!term.pattern
}

function flatten(flat, lines) {
  return flat.concat(lines)
}
