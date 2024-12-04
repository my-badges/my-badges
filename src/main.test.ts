import { describe, it, expect, afterAll } from 'vitest'
import fs from 'node:fs/promises'
import { main } from './main.js'
import os from 'node:os'
import { log } from './log.js'
import { Badge } from './badges.js'
import { Data } from './data.js'

const temp = `${os.tmpdir()}/${Math.random().toString(36).slice(2)}`

describe.skip('main', () => {
  log.info('temp', temp)
  afterAll(async () => fs.rm(temp, { recursive: true }))

  // prettier-ignore
  it(
    'generates badges by repo name',
    async () => {
      await main(['--user', 'semrel-extra-bot', '--cwd', temp, '--dryrun'])
      const myBadgesJson = JSON.parse(await fs.readFile(`${temp}/repo/my-badges/my-badges.json`, 'utf8'))
      const dataJson: Data = JSON.parse(await fs.readFile(`${temp}/data/semrel-extra-bot.json`, 'utf8'))

      expect(myBadgesJson.some(({id}: Badge) => id === 'chore-commit')).toBeTruthy()
      expect(myBadgesJson.some(({id}: Badge) => id === 'favorite-word')).toBeTruthy()
      expect(dataJson.repos.some(({name}) => name === 'semrel-extra-bot')).toBeTruthy()
      expect(dataJson.user.pinnedItems.nodes?.some((node) => node?.name === 'zx-semrel')).toBeTruthy()
    },
    10 * 60 * 1000,
  )
})
