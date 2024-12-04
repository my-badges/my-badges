import { describe, it } from 'vitest'
import { main } from './main.js'
import os from 'node:os'
import { log } from './log.js'

const temp = `${os.tmpdir()}/${Math.random().toString(36).slice(2)}`

describe.skip('main', () => {
  log.info('temp', temp)
  it(
    'generates badges by repo name',
    async () => {
      await main(['--user', 'semrel-extra-bot', '--cwd', temp])
    },
    15 * 60 * 1000,
  )
})
