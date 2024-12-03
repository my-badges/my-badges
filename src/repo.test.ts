import path from 'node:path'
import fs from 'node:fs'
import os from 'node:os'
import { describe, it, expect, afterAll } from 'vitest'
import { getRepo } from './repo.js'
import { createCtx } from './context.js'

const temp = `${os.tmpdir()}/${Math.random().toString(36).slice(2)}`

describe('repo API', () => {
  const ctx = createCtx(['--repo', 'webpod/zurk', '--cwd', temp])
  const repo = getRepo(ctx)

  describe('syncRepo()', () => {
    it('should sync the repo', () => {
      repo.pull()
      const pkgJson = JSON.parse(
        fs.readFileSync(path.resolve(temp, 'repo/package.json'), 'utf-8'),
      )
      expect(pkgJson.name).toEqual('zurk')
    })
  })
})

afterAll(() => fs.rmdirSync(temp, { recursive: true }))
