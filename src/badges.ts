import allBadges from '#badges'
import { linkCommit, linkIssue, linkPull } from './utils.js'
import { Data } from './collect/index.js'
import { Commit } from './collect/commits.graphql.js'
import { PullRequest } from './collect/pulls.graphql.js'
import { Issue } from './collect/issues.graphql.js'

export type Presenters = (typeof allBadges)[number]['default']

export type ID = Presenters['badges'][number]

export type List = readonly [string, ...string[]]

export type Presenter<B extends List> = {
  url: string
  badges: B
  tiers?: boolean
  present: (
    data: Data,
    grant: (id: B[number], desc: string) => Evidence,
  ) => void
}

export function define<B extends List>(presenter: Presenter<B>): Presenter<B> {
  return presenter
}

export type Badge = {
  id: ID
  tier: number
  desc: string
  body: string
  image: string
}

export class Evidence {
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

  evidencePRs(...pulls: PullRequest[]) {
    this.evidence(
      'Pull requests:\n\n' +
        pulls
          .map(linkPull)
          .map((x) => '- ' + x)
          .join('\n'),
    )
    return this
  }

  evidencePRsWithTitle(...pulls: PullRequest[]) {
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
