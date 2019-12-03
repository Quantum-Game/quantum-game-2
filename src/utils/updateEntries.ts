// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require('fs')
// eslint-disable-next-line @typescript-eslint/no-var-requires
const MarkDownIt = require('markdown-it')

const entriesDir = 'src/assets/encyclopedia/elements/'
const entriesTarget = 'src/assets/data/entries/entries.json'
const relatedConceptsDir = 'src/assets/encyclopedia/related-concepts/'
const relatedConceptsTarget = 'src/assets/data/entries/related-concepts.json'

const mdOptions = {
  html: true
}
const md = new MarkDownIt(mdOptions)

function dashedToCamelCase(str: string): string {
  const alteredString = str.replace(/-(.)/g, (m, group1) => {
    return group1.toUpperCase()
  })
  return alteredString.charAt(0).toUpperCase() + alteredString.slice(1)
}

function scrubTheTags(stringToClean: string): string {
  const tagLength = stringToClean.indexOf('>') + 1
  const closingTagLength = tagLength + 1
  return stringToClean.slice(tagLength, stringToClean.length - closingTagLength)
}

function convertMarkdown(dir: string, target: string): {} {
  let returnedObject = {}
  const dirEntries = fs.readdirSync(dir)
  dirEntries.forEach((fileName: string) => {
    // within each file:
    if (fileName.endsWith('md')) {
      const filePath = dir + fileName
      const entryName = fileName.substring(0, fileName.length - 3)
      const thisEntry = {
        title: '',
        elementName: dashedToCamelCase(entryName),
        short: '',
        grids: [
          {
            cols: 0,
            rows: 0,
            cells: []
          }
        ],
        sections: [
          {
            title: '',
            content: ''
          }
        ]
      }

      returnedObject = {
        ...returnedObject,
        [entryName]: thisEntry
      }

      // read the file in UTF8
      const readFile = fs.readFileSync(filePath, 'utf8')
      // transform it into markup
      const markedUpEntry = md.render(readFile)
      // split it on newlines
      const entryLines = markedUpEntry.split('\n')
      // set up variables used for progress evaluation:
      let isFistParagraph = true
      let currentSectionNumber = 0
      let gridParsingMode = false
      let currentGridString = ''
      let numberOfCompleteGrids = 0

      // parse, line by line
      for (let i = 0; i < entryLines.length; i += 1) {
        const line = entryLines[i]
        if (dir.endsWith('concepts/')) {
          // console.log(line);
        }
        const nextLine = entryLines[i + 1]
        // if we're in a mini-grid parsing mode - check below:
        if (gridParsingMode) {
          currentGridString += line
          // handle end of grid parsing mode:
          if (nextLine.startsWith('</code>')) {
            // replace HTML &quote; entitiy with actual quote character:
            const quotRegExp = /&quot;/g
            const quotedGridString = currentGridString.replace(quotRegExp, '"')
            // add to the thisEntry
            thisEntry.grids[numberOfCompleteGrids] = JSON.parse(quotedGridString)
            // in case there's another grid, let's have it added under a different index:
            numberOfCompleteGrids += 1
            gridParsingMode = false
          }
        } else if (line.startsWith('<h')) {
          // handle titles:
          const scrubbedTitle = scrubTheTags(line)
          if (line.startsWith('<h1')) {
            // handle main title:
            thisEntry.title = scrubbedTitle
          } else {
            isFistParagraph = false
            // handle secondary title:
            thisEntry.sections[currentSectionNumber] = {
              title: scrubbedTitle,
              content: ''
            }
          }
          // mark the beginning of the mini-grid parsing mode:
        } else if (line.startsWith('<pre>')) {
          gridParsingMode = true
          currentGridString = '{'
        }
        // handle block elements:
        else if (
          line.startsWith('<p>') ||
          line.startsWith('<ul>') ||
          line.startsWith('</ul>') ||
          line.startsWith('<li>')
        ) {
          // handle paragraph, depending whether short or sections content
          if (line.startsWith('<p>') && isFistParagraph) {
            thisEntry.short = scrubTheTags(line)
            isFistParagraph = false
          }
          if (thisEntry.sections[currentSectionNumber].content) {
            // if there are already contents for section, let's concatenate:
            thisEntry.sections[currentSectionNumber].content += line
          } else {
            // if there is no content already, populate the 'contents' property:
            thisEntry.sections[currentSectionNumber].content = line
          }
          // in case the upcoming line marks a beginning of a new section,
          // make sure the section counter goes up:
          if (nextLine && nextLine.startsWith('<h2')) {
            currentSectionNumber += 1
          }
        }
      }
    }
  })
  const entriesFile = JSON.stringify(returnedObject, null, 2)
  console.debug(`extracting JSON from ${dir}`)
  fs.writeFile(target, entriesFile, (err: string) => {
    if (err) throw err
  })
  console.debug(`${target.toString()} created!`)
  return returnedObject
}

convertMarkdown(entriesDir, entriesTarget)
convertMarkdown(relatedConceptsDir, relatedConceptsTarget)
