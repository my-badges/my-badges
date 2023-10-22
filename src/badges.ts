import { allBadges } from './all-badges/index.js'
import { expectType, linkCommit, linkIssue, linkPull } from './utils.js'
import { Commit, Data, Issue, Pull } from './collect/types.js'

for (const {
  default: { badges },
} of allBadges) {
  expectType<readonly [string, ...string[]]>(badges)
}

export type ID = (typeof allBadges)[number]['default']['badges'][number]

export interface BadgePresenter {
  url: URL
  tiers?: boolean
  badges: unknown
  present: Present
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

export function badgeCollection(newBadges: Badge[]) {
  return function grant(id: ID, desc: string) {
    const badge: Badge = {
      id,
      tier: 0,
      desc,
      body: '',
      image: '',
    }
    if (!newBadges.some((x) => x.id === id)) {
      newBadges.push(badge)
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

  evidencePRsWithTitle(...pulls: Pull[]) {
    this.evidence(
      'Pull requests:\n\n' +
        pulls.map((x) => `- ${linkPull(x)}: ${x.title}`).join('\n'),
    )
    return this
  }

  evidenceIssuesWithTitles(...issues: Issue[]) {
    this.evidence(
      'Issues:\n\n' +
        issues.map((x) => `- ${linkIssue(x)}: ${x.title}`).join('\n'),
    )
    return this
  }
}
