import { describe, it, expect } from 'vitest'
import favoriteWord from './favorite-word.js'
import { Data } from '../../src/data.js'
import { Badge } from '../../src/badges.js'
import { Commit } from '../../src/task/commits/commits.graphql.js'
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

describe('favorite-word', () => {
  // prettier-ignore
  describe('ignore conventional commit prefixes', () => {
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
    for (const prefix of prefixes) {
      it(`ignores "${prefix}"`, () => {
        const data: Data = DataFactory([
          CommitFactory(`${prefix}(world): hello`, ''),
          CommitFactory(`${prefix}: hello world`, ''),
          CommitFactory(`${prefix}:world hello`, ''),
          CommitFactory(`${prefix}!: world hello`, ''),
          CommitFactory('hello', `${prefix}: `),
        ])
        let badge: Badge = { id: 'favorite-word', desc: '', body: '', image: '', tier: 0 }
        favoriteWord.present(data, (id: "favorite-word", desc: string) => {
          expect(desc).toBe(`My favorite word is "hello".`)
          return new Evidence(badge)
        })
        const prefixExpectation = (prefix + ':').toLowerCase().split(' ').map((word, i) => `${i + 3}. ${word} (used once)`).join('\n')
        expect(badge.body).toBe(`My favorite commit message words are:\n\n1. hello (used 5 times)\n2. world (used 3 times)\n${prefixExpectation}`)
      })
    }
  })
})
