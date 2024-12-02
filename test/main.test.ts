import { describe, it, expect } from 'vitest'
import { main } from '../src/main.js'
import os from 'node:os'

const temp = `${os.tmpdir()}/${Math.random().toString(36).slice(2)}`

describe.skip('main', () => {
  console.log('temp', temp)
  it(
    'generates badges by repo name',
    async () => {
      await main(['--user', 'semrel-extra-bot', '--cwd', temp])
    },
    15 * 60 * 1000,
  )
})
