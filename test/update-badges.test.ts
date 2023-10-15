import * as assert from 'node:assert'
import { describe, it } from 'node:test'
import fs from 'node:fs'
import path from 'node:path'
import os from 'node:os'
import { getSnapshot, update } from '../src/update-badges.js'
import type { TBadges, TProvider } from '../src/interfaces.js'
import type { Data } from '../src/providers/gh/collect/collect.js'
import { githubProvider } from '../src/providers/gh/index.js'

const tempy = () => fs.mkdtempSync(path.join(os.tmpdir(), 'tempy-'))
const voidProvider: TProvider = {
  async getData(): Promise<Data> {
    return {} as Data
  },
  async getBadges() {
    return []
  },
  async updateBadges() {},
}

describe('my-badges', () => {
  const token = 'token'
  const user = 'antongolub'
  const owner = user
  const repo = user
  const cwd = tempy()

  describe('getSnapshot()', () => {
    it('reads data snapshot if `dataPath` specified', async () => {
      const dataPath = path.join(tempy(), 'data.json')
      const _data = {
        user: {
          id: 'MDQ6VXNlcjUyODgwNDY=',
          login: 'antongolub',
          name: 'Anton Golub',
          createdAt: '2013-08-22T15:51:42Z',
          starredRepositories: {
            totalCount: 161,
          },
        },
        repos: [],
      }
      fs.writeFileSync(dataPath, JSON.stringify(_data), 'utf-8')

      const { data, userBadges } = await getSnapshot({
        token,
        dataPath,
        user,
        owner,
        repo,
        provider: voidProvider,
        cwd,
      })

      assert.deepEqual(_data, data)
      // assert.deepEqual(userBadges, [])
      // assert.equal(jsonSha, undefined)
      // assert.equal(oldJson, undefined)
    })

    it('throws an err if `dataPath` is unreachable', async () => {
      try {
        const dataPath = '/foo/bar/baz'
        await getSnapshot({
          token,
          dataPath,
          user,
          owner,
          repo,
          provider: voidProvider,
          cwd,
        })
      } catch (e) {
        assert.equal((e as Error).message, 'Data file not found')
      }
    })

    it('throws an err if `username` is empty', async () => {
      try {
        const dataPath = ''
        const user = ''
        await getSnapshot({
          token,
          dataPath,
          user,
          owner,
          repo,
          provider: voidProvider,
          cwd,
        })
      } catch (e) {
        assert.equal((e as Error).message, 'Specify username')
      }
    })
  })

  describe('update', () => {
    it('reads, analyses, presents and pushes badges back to repo', async () => {
      const token = 'token'
      const user = 'antongolub'
      const dryrun = true
      const cwd = tempy()
      const data: Data = {
        user: {} as Data['user'],
        pulls: [] as Data['pulls'],
        issues: [] as Data['issues'],
        repos: [
          {
            stargazers_count: 1000,
            name: 'bar',
            owner: {
              login: 'foo',
            },
            commits: [],
          },
          {
            stargazers_count: 2000,
            name: 'qux',
            owner: {
              login: 'foo',
            },
            commits: [] as any[],
          },
        ] as Data['repos'],
      }
      const provider: TProvider = {
        async getData(): Promise<Data> {
          return data
        },
        async getBadges() {
          return []
        },
        updateBadges: githubProvider.updateBadges,
      }

      await update({ token, provider, user, dryrun, cwd })

      assert.equal(
        fs.readFileSync(`${cwd}/my-badges/stars-100.md`, 'utf8'),
        `<img src="https://github.com/my-badges/my-badges/blob/master/src/all-badges/stars/stars-100.png?raw=true" alt="I collected 100 stars." title="I collected 100 stars." width="128">
<strong>I collected 100 stars.</strong>
<br><br>

Repos:

* <a href="https://github.com/foo/bar">foo/bar: ★1000</a>

<sup>I have push, maintainer or admin permissions, so I'm definitely an author.<sup>



Created by <a href="https://github.com/my-badges/my-badges">My Badges</a>`,
      )
    })
  })
})
