import {allBadges} from './all-badges/index.js'
import {Data, Repo, Commit} from './collect/collect.js'
import {linkCommit} from './utils.js'
import {fileURLToPath} from 'url'
import * as path from 'path'

export type ID = (typeof allBadges)[number]['default']['badges'][number]

export interface BadgePresenter {
  url: URL
  badges: unknown
  present: Present
}

export type Present = (data: Data, grant: ReturnType<typeof badgeCollection>) => void

export type Badge = {
  id: ID
  desc: string
  body: string
  image: string
}

export function badgeCollection(badges: Badge[], baseUrl: URL) {
  const indexes = new Map(badges.map((x, i) => [x.id, i]))
  const baseDir = path.basename(path.dirname(fileURLToPath(baseUrl)))

  return function grant(id: ID, desc: string) {
    const badge: Badge = {
      id,
      desc,
      body: '',
      image: `https://github.com/my-badges/my-badges/blob/master/src/all-badges/${baseDir}/${id}.png?raw=true`,
    }

    if (!indexes.has(id)) {
      badges.push(badge)
      indexes.set(id, badges.length - 1)
    } else {
      badges[indexes.get(id)!] = badge
    }

    return {
      evidence(text: string) {
        badge.body = text
      },
      evidenceCommits(...commits: Commit[]) {
        this.evidence('Commits:\n\n' + commits.map(linkCommit).map(x => '- ' + x).join('\n'))
      },
    }
  }
}
