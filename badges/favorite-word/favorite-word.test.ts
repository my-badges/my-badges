import { describe, it, expect, afterAll } from 'vitest'
import fs from 'node:fs/promises'
import favoriteWord from './favorite-word.js'
import os from 'node:os'
import { log } from '../../src/log.js'
import { Badge } from '../../src/badges.js'
import { Data } from '../../src/data.js'
import { Commit } from '../../src/task/commits/commits.graphql.js'

function CommitFactory(message: string, messageBody: string) {
  const commit: Commit = {
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
  }
  return commit
}

function DataFactory(commits: Commit[]) {
  const data: Data = {
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
        nodes: null
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
        nodes: null
      },
    }
  }
  return data
}

describe.skip('favorite-word', () => {
  // prettier-ignore
  describe('ignore conventional commit prefixes', () => {})
})

