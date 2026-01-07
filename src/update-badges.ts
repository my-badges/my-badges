import fs from 'node:fs'
import path from 'node:path'
import { Badge } from './badges.js'
import { quoteAttr } from './utils.js'
import { log } from './log.js'

export function updateBadges(
  badges: Badge[],
  badgesDir: string,
  badgesDatafile: string,
) {
  log.info('Generating badges...')
  fs.mkdirSync(badgesDir, { recursive: true })
  fs.writeFileSync(badgesDatafile, JSON.stringify(badges, null, 2))

  for (const badge of badges) {
    const badgePath = path.resolve(badgesDir, `${badge.id}.md`)
    const desc = quoteAttr(badge.desc)
    const content =
      `<h2><img src="${badge.image}" alt="${desc}" title="${desc}" align="left" width="128">\n` +
      `${desc}</h2>\n` +
      `<br clear="left"><br/>\n\n` +
      badge.body +
      `\n\n` +
      `<h5>Created by <a href="https://github.com/my-badges/my-badges">My Badges</a></h5>`

    log.info('badge', badgePath)
    fs.writeFileSync(badgePath, content)
  }
}
