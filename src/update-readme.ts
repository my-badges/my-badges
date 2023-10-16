import fs from 'node:fs'
import { chdir } from 'node:process'
import { Badge } from './badges.js'
import { quoteAttr } from './utils.js'

export function updateReadme(badges: Badge[], size: number | string) {
  chdir('repo')

  const readmeFilename = detectReadmeFilename()
  const readmeContent = fs.readFileSync(readmeFilename, 'utf8')

  const content = generateReadme(readmeContent, badges, size)
  fs.writeFileSync(readmeFilename, content)

  chdir('..')
}

function detectReadmeFilename(): string {
  if (fs.existsSync('README.md')) return 'README.md'
  if (fs.existsSync('readme.md')) return 'readme.md'
  throw new Error('Cannot find README.md')
}

export function generateReadme(
  readmeContent: string,
  badges: Badge[],
  size: number | string = 64,
) {
  const startString = '<!-- my-badges start -->'
  const endString = '<!-- my-badges end -->'

  let content = readmeContent

  const start = content.indexOf(startString)
  const end = content.indexOf(endString)
  const needToAddNewLine = content[end + endString.length + 1] !== '\n'

  if (start !== -1 && end !== -1) {
    content = content.slice(0, start) + content.slice(end + endString.length)

    const badgesHtml = badges
      .map((badge) => {
        const desc = quoteAttr(badge.desc)
        // prettier-ignore
        return `<a href="my-badges/${badge.id}.md"><img src="${badge.image}" alt="${desc}" title="${desc}" width="${parseInt(size + '')}"></a>`
      })
      .join('\n')

    content =
      content.slice(0, start) +
      `${startString}\n` +
      '<h4><a href="https://github.com/my-badges/my-badges">My Badges</a></h4>\n\n' +
      badgesHtml +
      `\n${endString}` +
      (needToAddNewLine ? '\n' : '') +
      content.slice(start)
  }

  return content
}
