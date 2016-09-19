# lilex

> Parses Life Lexicon to JSON and JavaScript

## The Life lexicon

The Life Lexicon

> ... is a lexicon of terms relating to John Horton Conway's Game of Life.

The latest versions of this lexicon (both HTML and ASCII) should be available from the [Life Lexicon Home Page][life-lexicon].

You can also find a backup version of the Life lexicon [here][life-lexicon-backup]

## Requirements

Download and expand the [plain text ASCII version][life-lexicon-ascii] of the Life Lexicon. Once expanded, you will end-up with a directory with the following files:

```
lex_asc
├── README
├── emacs.txt
├── lexicon-clean.txt
├── lexicon-small.txt
├── lexicon.txt
└── lifelex.el
```

The file that you need to use is `lexicon.txt`.

## Installation

```
npm install -g @grancalavera/lilex
```

## Usage

```
lilex <path>                      Parses the Life Lexicon and renders it
                                  as JSON to stdout

lilex <path> --format [json|js]   Changes the output format

lilex <path> -json                Parses the Life Lexicon and renders it
                                  as JSON to stdout

lilex <path> -js                  Parses the Life Lexicon and renders it
                                  as an ES2015 JavaScript module to stdout

lilex --help                      Displays this message
```

## Why?

I was looking for sources of patterns for a Game of Life side project, and I ended up finding the [Life Lexicon Home Page][life-lexicon], which is an amazing on-line resource of all-things Game of Life. I started copy pasting pattens and writing small scripts to convert them into consumable JSON data, and at some point I decided I wanted them all.

There are several download formats for the Life Lexicon. The [plain text ASCII version][life-lexicon-ascii] is very regular and easy to parse and that's the reason why I chose to work with it.

## What will you get?

The Life Lexicon is divided in to three main sections:

1. An introductory section. This section includes a brief introduction to the Life Lexicon, along with credits, project description, format description and project scope.

1. A list of terms related to the Game of Life. Some of this terms are patters and some of them are not.

1. Bibliography.

By default, running lilex with a valid path to `lexicon.txt` will produce a JSON stream to stdout. This stream is string representation of a single JSON object with three fields:

```
{
  "introduction": ...,
  "terms": ...,
  "bibliography": ...
}
```

[life-lexicon]:http://www.argentum.freeserve.co.uk/lex_home.htm
[life-lexicon-ascii]:http://www.argentum.freeserve.co.uk/lex_asc.zip
[life-lexicon-backup]:https://github.com/elgrancalavera/lex_asc
