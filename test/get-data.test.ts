import * as assert from 'node:assert'
import { describe, it } from 'node:test'
import fs from 'node:fs'
import path from 'node:path'
import os from 'node:os'
import { Octokit } from 'octokit'
import { getData } from '../src/get-data.js'

const tempy = () => fs.mkdtempSync(path.join(os.tmpdir(), 'tempy-'))

describe('get-badges', () => {
  const octokit = new Octokit({})
  const username = 'antongolub'
  const owner = username
  const repo = username

  it('getData() reads snapshot data if dataPath specified', async () => {
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

    const data = await getData(octokit, dataPath, username)

    assert.deepEqual(_data, data)
  })

  it('getData() throws an err if `dataPath` is unreachable', async () => {
    try {
      const dataPath = '/foo/bar/baz'
      await getData(octokit, dataPath, username)
    } catch (e) {
      assert.equal((e as Error).message, 'Data file not found')
    }
  })

  it('getData() throws an err if `username` is empty', async () => {
    try {
      const dataPath = ''
      const username = ''
      await getData(octokit, dataPath, username)
    } catch (e) {
      assert.equal((e as Error).message, 'Specify username')
    }
  })
})
