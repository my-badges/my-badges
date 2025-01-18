import { describe, it, expect } from 'vitest'
import conventionalCommit from './conventional-commit.js'
import { makeBadgeBody } from './conventional-commit.js'
import { countBadgeType } from './conventional-commit.js'
import { Data } from '../../src/data.js'
import { Commit } from '../../src/task/commits/commits.graphql.js'
import { Badge } from '../../src/badges.js'
import { Evidence } from '../../src/badges.js'

function CommitFactory(message: string, messageBody: string) {
  return {
    message,
    messageBody,
    id: '',
    sha: '',
    committedDate: '',
    additions: 0,
    deletions: 0,
    author: null,
    committer: null,
    repository: {
      owner: {
        login: '',
      },
      name: '',
    },
  } as Commit
}

function DataFactory(commits: Commit[]) {
  return {
    repos: [
      {
        commits,
        id: '',
        name: '',
        owner: {
          login: '',
        },
        url: '',
        description: null,
        createdAt: '',
        updatedAt: '',
        languages: null,
        forks: {
          totalCount: 0,
        },
        stargazers: {
          totalCount: 0,
        },
        defaultBranchRef: null,
        isEmpty: false,
      },
    ],
    starredRepositories: [],
    pulls: [],
    issues: [],
    issueComments: [],
    discussionComments: [],
    user: {
      id: '',
      login: '',
      name: '',
      avatarUrl: '',
      bio: '',
      company: '',
      location: '',
      email: '',
      twitterUsername: null,
      websiteUrl: null,
      status: null,
      createdAt: '',
      followers: {
        totalCount: 0,
      },
      following: {
        totalCount: 0,
      },
      anyPinnableItems: false,
      pinnedItems: {
        totalCount: 0,
        nodes: null,
      },
      sponsoring: {
        totalCount: 0,
      },
      sponsors: {
        totalCount: 0,
      },
      starredRepositories: {
        totalCount: 0,
      },
      publicKeys: {
        totalCount: 0,
        nodes: null,
      },
    },
  } as Data
}

describe('conventional-commit', () => {
  // prettier-ignore
  const prefixes = [
    'BREAKING CHANGE',
    'build',
    'chore',
    'ci',
    'docs',
    'feat',
    'fix',
    'perf',
    'refactor',
    'revert',
    'style',
    'test',
  ]

  describe(`detect if conventional commit messages are used`, () => {
    const run = (data: Data, shouldHaveBadge: boolean) => {
      // Prepare
      let hasBadge = false
      // Act
      conventionalCommit.present(data, (id: "conventional-commit", desc: string) => {
        hasBadge = true
        expect(desc).toBe("I use conventional commit messages")
        return new Evidence({ id: 'conventional-commit', desc: '', body: '', image: '', tier: 0 })
      })
      // Assert
      expect(hasBadge).toBe(shouldHaveBadge)
    }
    it('should not have a badge', () => {run(DataFactory([
      CommitFactory('Hello World', ''),
    ]), false)})
    prefixes.forEach((prefix) => {
      it(`should have a badge (${prefix})`, () => {run(DataFactory([
        CommitFactory('Hello World', ''),
        CommitFactory(`${prefix}: Hello World`, ''),
      ]), true)})
      it(`should have a badge (${prefix} with score)`, () => {run(DataFactory([
        CommitFactory('Hello World', ''),
        CommitFactory(`${prefix}(Hello): World`, ''),
      ]), true)})
    })
  })

  prefixes.forEach((prefix) => {
    describe(`count the number of "${prefix}" prefixes`, () => {
      it(`should have a count of 1`, () => {
        expect(countBadgeType([
          'Hello World',
          `${prefix}: Hello World`,
        ])).toStrictEqual([[prefix, 1]])
      })
      it(`should have a count of 1`, () => {
        expect(countBadgeType([
          'Hello World',
          `${prefix}: Hello World`,
          'Hello World',
          `${prefix}: Hello World`,
          `${prefix}: Hello World`,
        ])).toStrictEqual([[prefix, 3]])
      })
    })
  })

  it('Should work with multiple types of commits', () => {
    // Prepare
    let badge: Badge = { id: 'conventional-commit', desc: '', body: '', image: '', tier: 0 }
    // Act
    conventionalCommit.present(DataFactory([
      CommitFactory('Hello World', ''),
      CommitFactory('feat: Hello World', ''),
      CommitFactory('fix: Hello World', ''),
      CommitFactory('BREAKING CHANGE: Hello World', ''),
      CommitFactory('fix: Hello World', ''),
    ]), (id: "conventional-commit", desc: string) => {
      return new Evidence(badge)
    })
    // Assert
    expect(badge.body).toBe([
      'I\'ve done 2 fix commit',
      'I\'ve done 1 feature commit',
      'I\'ve done 1 breaking change commit',
    ].join('\n'))
  })

  it('Should count "!" as a breaking change', () => {
    // Prepare
    let badge: Badge = { id: 'conventional-commit', desc: '', body: '', image: '', tier: 0 }
    // Act
    conventionalCommit.present(DataFactory([
      CommitFactory('feat!: Hello World', ''),
      CommitFactory('feat: Hello World', ''),
      CommitFactory('fix: Hello World', ''),
      CommitFactory('BREAKING CHANGE!: Hello World', ''),
      CommitFactory('BREAKING CHANGE: Hello World', ''),
    ]), (id: "conventional-commit", desc: string) => {
      return new Evidence(badge)
    })
    // Assert
    expect(badge.body).toBe([
      'I\'ve done 3 breaking change commit',
      'I\'ve done 2 feature commit',
      'I\'ve done 1 fix commit',
    ].join('\n'))
  })

  describe("check that the badge's message looks nice", () => {
    it('"BREAKING CHANGE" should become "breaking change"', () => {
      expect(makeBadgeBody([['BREAKING CHANGE', 1]])).toBe("I've done 1 breaking change commit")
    })
    it('"build" should stay "build"', () => {
      expect(makeBadgeBody([['build', 1]])).toBe("I've done 1 build commit")
    })
    it('"chore" should stay "chore"', () => {
      expect(makeBadgeBody([['chore', 1]])).toBe("I've done 1 chore commit")
    })
    it('"ci" should become "continuous integration"', () => {
      expect(makeBadgeBody([['ci', 1]])).toBe("I've done 1 continuous integration commit")
    })
    it('"docs" should become "documentation"', () => {
      expect(makeBadgeBody([['docs', 1]])).toBe("I've done 1 documentation commit")
    })
    it('"feat" should become "feature"', () => {
      expect(makeBadgeBody([['feat', 1]])).toBe("I've done 1 feature commit")
    })
    it('"fix" should stay "fix"', () => {
      expect(makeBadgeBody([['fix', 1]])).toBe("I've done 1 fix commit")
    })
    it('"perf" should become "performance"', () => {
      expect(makeBadgeBody([['perf', 1]])).toBe("I've done 1 performance commit")
    })
    it('"refactor" should become "refactoring"', () => {
      expect(makeBadgeBody([['refactor', 1]])).toBe("I've done 1 refactoring commit")
    })
    it('"revert" should become "revertion"', () => {
      expect(makeBadgeBody([['revert', 1]])).toBe("I've done 1 revertion commit")
    })
    it('"style" should become "esthetics"', () => {
      expect(makeBadgeBody([['style', 1]])).toBe("I've done 1 esthetics commit")
    })
    it('"test" should stay "test"', () => {
      expect(makeBadgeBody([['test', 1]])).toBe("I've done 1 test commit")
    })
  })

  it('Should only show the 6 most common types of commits', () => {
    expect(makeBadgeBody([
      ['ci', 2],
      ['feat', 4],
      ['fix', 3],
      ['BREAKING CHANGE', 1],
      ['style', 1],
      ['chore', 1],
      ['test', 2],
      ['docs', 2],
      ['refactor', 2],
    ])).toBe([
      "I've done 4 feature commit",
      "I've done 3 fix commit",
      "I've done 2 continuous integration commit",
      "I've done 2 test commit",
      "I've done 2 documentation commit",
      "I've done 2 refactoring commit",
    ].join('\n'))
  })
})

