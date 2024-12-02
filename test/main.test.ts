import { describe, it, expect } from 'vitest'
import { main } from '../src/main.js'
import os from 'node:os'

const temp = `${os.tmpdir()}/${Math.random().toString(36).slice(2)}`

describe('main', () => {
  console.log('temp', temp)
  it(
    'generates badges by repo name',
    async () => {
      await main(['--user', 'antongolub', '--cwd', temp])
    },
    15 * 60 * 1000,
  )
})
