import * as assert from 'node:assert'
import path from 'node:path'
import fs from 'node:fs'
import os from 'node:os'
import { before, after, describe, it } from 'node:test'
import { __internal__, syncRepo } from '../src/repo.js'

const temp = `${os.tmpdir()}/${Math.random().toString(36).slice(2)}`
fs.mkdirSync(temp)

describe('repo API', () => {
  before(() => (__internal__.cwd = path.resolve(temp)))
  after(() => (__internal__.cwd = process.cwd()))

  describe('syncRepo()', () => {
    it('should sync the repo', () => {
      const owner = 'webpod'
      const repo = 'zurk'

      syncRepo(owner, repo)
      const pkgJson = JSON.parse(
        fs.readFileSync(path.resolve(temp, 'repo/package.json'), 'utf-8'),
      )
      assert.equal(pkgJson.name, repo)
    })
  })
})

after(() => fs.rmdirSync(temp, { recursive: true }))
