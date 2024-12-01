import fs from 'node:fs'
import path from 'node:path'
import { Badge } from './badges.js'
import { quoteAttr } from './utils.js'

export function updateReadme(
  badges: Badge[],
  size: number | string,
  repoDir: string,
) {
  const readmeFilename = detectReadmeFilename(repoDir)
  const readmeContent = fs.readFileSync(readmeFilename, 'utf8')

  const content = generateReadme(readmeContent, badges, size)
  fs.writeFileSync(readmeFilename, content)
}

function detectReadmeFilename(cwd: string): string {
  const file = ['README.md', 'readme.md']
    .map((f) => path.resolve(cwd, f))
    .find((f) => fs.existsSync(f))
  if (!file) throw new Error('Cannot find README.md')

  return file
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
      badgesHtml +
      `\n${endString}` +
      (needToAddNewLine ? '\n' : '') +
      content.slice(start)
  }

  return content
}
