const fs = require('fs')
    , path = require('path')
    , nameRe = /^:(.*):/
    , patternLineRe = /^\t([\.\*]+)$/

module.exports.parse = parse

function parse(lines) {
  return lines.reduce((parsed, line, index) => {
    const matches = nameRe.exec(line)
    if (!matches) return parsed
    const name = matches[1]
        , pattern = findPattern(lines.slice(index + 1))
        , width = pattern[0] ? pattern[0].length : undefined
        , height = pattern.length ? pattern.length : undefined
    return parsed.concat({ name, pattern, width, height })
  }, [])
}

function findPattern(lines, pattern = []) {
  if (!lines.length) return pattern

  const [line, ...remainingLines] = lines
  const matches = patternLineRe.exec(line)

  if (!matches && pattern.length) return pattern
  if (!matches && !pattern.length) return findPattern(remainingLines, pattern)

  return findPattern(remainingLines, pattern.concat( toPatternLine(matches) ))
}

function toPatternLine(matches) {
  return [ matches[1].split('').map( toBinary ) ]
}

function toBinary(char) {
  return { '.': 0, '*': 1 }[char]
}
