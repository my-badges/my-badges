import * as assert from 'node:assert'
import path from 'node:path'
import fs from 'node:fs'
import os from 'node:os'
import { after, describe, it } from 'node:test'
import { getRepo } from '../src/repo.js'

const temp = `${os.tmpdir()}/${Math.random().toString(36).slice(2)}`

describe('repo API', () => {
  const repo = getRepo({
    cwd: temp,
    owner: 'webpod',
    name: 'zurk',
  })

  describe('syncRepo()', () => {
    it('should sync the repo', () => {
      repo.pull()
      const pkgJson = JSON.parse(
        fs.readFileSync(path.resolve(temp, 'repo/package.json'), 'utf-8'),
      )
      assert.equal(pkgJson.name, 'zurk')
    })
  })
})

after(() => fs.rmdirSync(temp, { recursive: true }))
