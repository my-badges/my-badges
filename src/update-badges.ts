import fs from 'node:fs'
import path from 'node:path'
import { Badge } from './badges.js'
import { quoteAttr } from './utils.js'

export function updateBadges(
  badges: Badge[],
  badgesDir: string,
  badgesDatafile: string,
) {
  fs.mkdirSync(badgesDir, { recursive: true })
  fs.writeFileSync(badgesDatafile, JSON.stringify(badges, null, 2))

  for (const badge of badges) {
    const badgePath = path.resolve(badgesDir, `${badge.id}.md`)
    const desc = quoteAttr(badge.desc)
    const content =
      `<img src="${badge.image}" alt="${desc}" title="${desc}" width="128">\n` +
      `<strong>${desc}</strong>\n` +
      `<br><br>\n\n` +
      badge.body +
      `\n\n\n` +
      `Created by <a href="https://github.com/my-badges/my-badges">My Badges</a>`

    fs.writeFileSync(badgePath, content)
  }
}
