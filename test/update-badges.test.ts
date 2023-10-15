import * as assert from 'node:assert'
import { describe, it } from 'node:test'
import fs from 'node:fs'
import path from 'node:path'
import os from 'node:os'
import { getSnapshot } from '../src/update-badges.js'
import type { TProvider } from '../src/interfaces.js'
import type { Data } from '../src/providers/gh/collect/collect.js'

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
      })

      assert.deepEqual(_data, data)
      // assert.deepEqual(userBadges, [])
      // assert.equal(jsonSha, undefined)
      // assert.equal(oldJson, undefined)
    })

    it('getSnapshot() throws an err if `dataPath` is unreachable', async () => {
      try {
        const dataPath = '/foo/bar/baz'
        await getSnapshot({
          token,
          dataPath,
          user,
          owner,
          repo,
          provider: voidProvider,
        })
      } catch (e) {
        assert.equal((e as Error).message, 'Data file not found')
      }
    })

    it('getBadges() throws an err if `username` is empty', async () => {
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
        })
      } catch (e) {
        assert.equal((e as Error).message, 'Specify username')
      }
    })
  })
})
