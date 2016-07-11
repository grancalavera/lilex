const fs = require('fs')
    , path = require('path')

const nameRe = /^:(.*):/
    , patternLineRe = /^\t([\.\*]+)$/

const data = fs
  .readFileSync(path.resolve(__dirname, 'data/lexicon.txt'), 'utf8')
  .split('\n')

function parsePatterns(lines) {
  return lines.reduce((patterns, line, index) => {
    const matches = nameRe.exec(line)
    if (!matches) return patterns
    const name = matches[1]
        , pattern = findPattern(lines.slice(index + 1))
        , width = pattern[0] ? pattern[0].length : undefined
        , height = pattern.length ? pattern.length : undefined
    return patterns.concat({ name, pattern, width, height })
  }, [])
}

function findPattern(lines, pattern = []) {
  if (!lines.length) return pattern

  const [line, ...remainingLines] = lines
  const matches = patternLineRe.exec(line)

  if (!matches && pattern.length) return pattern
  if (!matches && !pattern.length) return findPattern(remainingLines, pattern)

  return findPattern(remainingLines, pattern.concat(matches[1]))
}

fs.writeFileSync(
  path.resolve(__dirname, 'lexicon.json')
, JSON.stringify(parsePatterns(data), null, 2)
, 'utf8'
)

