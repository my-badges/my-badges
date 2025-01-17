import { describe, it, expect } from 'vitest'
import conventionalCommit from './conventional-commit.js'
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
      const run = (data: Data, count: number) => {
        // Prepare
        const re = /^\D*(\d+)\D*$/
        let badge: Badge = { id: 'conventional-commit', desc: '', body: '', image: '', tier: 0 }
        // Act
        conventionalCommit.present(data, (id: "conventional-commit", desc: string) => {
          return new Evidence(badge)
        })
        // Assert
        const matches = re.exec(badge.body)
        expect(matches).not.toBeNull()
        if (matches === null) return // TypeScript doesn't know that expect() will throw an error if matches is null
        expect(parseInt(matches[1])).toBe(count)
      }
      it(`should have a count of 1`, () => {run(DataFactory([
        CommitFactory('Hello World', ''),
        CommitFactory(`${prefix}: Hello World`, ''),
      ]), 1)})
      it(`should have a count of 2`, () => {run(DataFactory([
        CommitFactory('Hello World', ''),
        CommitFactory(`${prefix}: Hello World`, ''),
        CommitFactory('Hello World', ''),
        CommitFactory(`${prefix}: Hello World`, ''),
      ]), 2)})
    })
  })

  describe("check that the text looks nice", () => {
    const run = (prefix: string, expected: string) => {
      it(`"${prefix}" should become "${expected}"`, () => {
        // Prepare
        let badge: Badge = { id: 'conventional-commit', desc: '', body: '', image: '', tier: 0 }
        // Act
        conventionalCommit.present(DataFactory([
          CommitFactory(`${prefix}: Hello World`, ''),
        ]), (id: "conventional-commit", desc: string) => {
          return new Evidence(badge)
        })
        // Assert
        expect(badge.body).toBe(`I've done 1 ${expected} commit`)
      })
    }
    run('BREAKING CHANGE', 'breaking change')
    run('build', 'build')
    run('chore', 'chore')
    run('ci', 'continuous integration')
    run('docs', 'documentation')
    run('feat', 'feature')
    run('fix', 'fix')
    run('perf', 'performance')
    run('refactor', 'refactoring')
    run('revert', 'revertion')
    run('style', 'esthetics')
    run('test', 'test')
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
})

