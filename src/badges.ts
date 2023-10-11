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

export interface BadgePresenter {
  url: URL
  badges: unknown
  present: Present
}

export type Grant = ReturnType<typeof badgeCollection>

export type Present = (data: Data, grant: Grant) => void

export type Badge = {
  id: ID
  desc: string
  body: string
  image: string
}

const voidGrant = {
  evidence() {},
  evidenceCommits() {},
  evidenceCommitsWithMessage() {},
  evidencePRs() {},
}

export function badgeCollection(
  badges: Badge[],
  baseUrl: URL,
  pickBadges: string[],
  omitBadges: string[],
) {
  const indexes = new Map(badges.map((x, i) => [x.id, i]))
  const baseDir = path.basename(path.dirname(fileURLToPath(baseUrl)))

  return function grant(id: ID, desc: string) {
    if (!pickBadges.includes(id) || omitBadges.includes(id)) {
      if (indexes.has(id)) {
        badges.splice(indexes.get(id)!, 1)
      }
      return voidGrant
    }

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
        this.evidence(
          'Commits:\n\n' + commits.map((x) => `- ${linkCommit(x)}`).join('\n'),
        )
      },
      evidenceCommitsWithMessage(...commits: Commit[]) {
        this.evidence(
          'Commits:\n\n' +
            commits.map((x) => `- ${linkCommit(x)}: ${x.message}`).join('\n'),
        )
      },
      evidencePRs(...pulls: Pull[]) {
        this.evidence(
          'Pull requests:\n\n' +
            pulls
              .map(linkPull)
              .map((x) => '- ' + x)
              .join('\n'),
        )
      },
    }
  }
}
