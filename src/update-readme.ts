import fs from 'node:fs'
import path from 'node:path'
import { Badge } from './badges.js'
import { quoteAttr } from './utils.js'

const START_MARK = '<!-- my-badges start -->'
const END_MARK = '<!-- my-badges end -->'
const BADGE_SIZE = 64

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
  content: string,
  badges: Badge[],
  size: number | string = BADGE_SIZE,
) {
  const start = content.indexOf(START_MARK)
  const end = content.indexOf(END_MARK)
  console.log('start', start, 'end', end)
  if ((start === -1 && end !== -1) || (start !== -1 && end === -1))
    throw new Error(
      'Invalid README.md: both or none of the marks should be present',
    )

  if (start > end)
    throw new Error('Invalid README.md: start mark should be before end mark')

  const badgesHtml = badges
    .map((badge) => {
      const desc = quoteAttr(badge.desc)
      // prettier-ignore
      return `<a href="my-badges/${badge.id}.md"><img src="${badge.image}" alt="${desc}" title="${desc}" width="${parseInt(size + '')}"></a>`
    })
    .join('\n')

  if (end === -1 && start === -1)
    return `${START_MARK}
${badgesHtml}
${END_MARK}

${content}`

  return `${content.slice(0, start)}${START_MARK}
${badgesHtml}
${END_MARK}${content.slice(end + END_MARK.length)}`
}
