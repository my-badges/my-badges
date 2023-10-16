import fs from 'node:fs'
import { chdir } from 'node:process'
import { Badge } from './badges.js'
import { quoteAttr } from './utils.js'

export function updateBadges(badges: Badge[]) {
  chdir('repo')

  fs.mkdirSync('my-badges', { recursive: true })
  fs.writeFileSync('my-badges/my-badges.json', JSON.stringify(badges, null, 2))

  for (const badge of badges) {
    const badgePath = `my-badges/${badge.id}.md`

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

  chdir('..')
}
