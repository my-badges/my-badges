import { allBadges } from './all-badges/index.js'
import { Data, Commit, Pull } from './collect/collect.js'
import { expectType, linkCommit, linkPull } from './utils.js'
import { fileURLToPath } from 'url'
import * as path from 'path'

for (const {
  default: { badges },
} of allBadges) {
  expectType<readonly [string, ...string[]]>(badges)
}

export type ID = (typeof allBadges)[number]['default']['badges'][number]

export abstract class BadgePresenter {
  abstract url: URL
  tiers = false
  abstract badges: unknown
  abstract present: Present
}

export type Grant = ReturnType<typeof badgeCollection>

export type Present = (data: Data, grant: Grant) => void

export type Badge = {
  id: ID
  tier: number
  desc: string
  body: string
  image: string
}

export function badgeCollection(
  userBadges: Badge[],
  presenter: (typeof allBadges)[number]['default'],
  compact: boolean,
) {
  const indexes = new Map(userBadges.map((x, i) => [x.id, i]))
  const baseDir = path.basename(path.dirname(fileURLToPath(presenter.url)))

  return function grant(id: ID, desc: string) {
    const badge: Badge = {
      id,
      tier: 0,
      desc,
      body: '',
      image: `https://github.com/my-badges/my-badges/blob/master/src/all-badges/${baseDir}/${id}.png?raw=true`,
    }

    if (compact) {
      let found = false
      for (const badgeId of presenter.badges) {
        if (indexes.has(badgeId)) {
          const index = indexes.get(badgeId)!
          const alreadyExistingBadge = userBadges[index]
          if (alreadyExistingBadge.tier < badge.tier) {
            userBadges[index] = badge
          }
        }
      }
      if (!found) {
        userBadges.push(badge)
        indexes.set(id, userBadges.length - 1)
      }
    } else {
      if (indexes.has(id)) {
        userBadges[indexes.get(id)!] = badge
      } else {
        userBadges.push(badge)
        indexes.set(id, userBadges.length - 1)
      }
    }

    return new Evidence(badge)
  }
}

class Evidence {
  constructor(private badge: Badge) {}

  tier(tier: number) {
    this.badge.tier = tier
    return this
  }

  evidence(text: string) {
    this.badge.body = text
    return this
  }

  evidenceCommits(...commits: Commit[]) {
    this.evidence(
      'Commits:\n\n' + commits.map((x) => `- ${linkCommit(x)}`).join('\n'),
    )
    return this
  }

  evidenceCommitsWithMessage(...commits: Commit[]) {
    this.evidence(
      'Commits:\n\n' +
        commits.map((x) => `- ${linkCommit(x)}: ${x.message}`).join('\n'),
    )
    return this
  }

  evidencePRs(...pulls: Pull[]) {
    this.evidence(
      'Pull requests:\n\n' +
        pulls
          .map(linkPull)
          .map((x) => '- ' + x)
          .join('\n'),
    )
    return this
  }
}
