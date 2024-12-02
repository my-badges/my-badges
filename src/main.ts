#!/usr/bin/env node

import fs from 'node:fs'
import allBadges from '#badges'
import { presentBadges } from './present-badges.js'
import { getRepo } from './repo.js'
import { updateBadges } from './update-badges.js'
import { updateReadme } from './update-readme.js'
import { processTasks } from './process-tasks.js'
import { Data } from './data.js'
import { createCtx } from './context.js'
import url from 'node:url'

isMain() &&
  main()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error(err)
      process.exit(1)
    })

export async function main(
  argv: string[] = process.argv.slice(2),
  env: Record<string, string | undefined> = process.env,
) {
  const ctx = createCtx(argv, env)
  const repo = getRepo(ctx)

  repo.pull()

  let data: Data
  if (fs.existsSync(ctx.dataFile)) {
    data = JSON.parse(fs.readFileSync(ctx.dataFile, 'utf8')) as Data
  } else {
    let ok: boolean
    ;[ok, data] = await processTasks(ctx)

    if (!ok) {
      return
    }
  }

  let userBadges = repo.getUserBadges()
  userBadges = presentBadges(
    allBadges.map((m) => m.default),
    data,
    userBadges,
    ctx.badgesPick,
    ctx.badgesOmit,
    ctx.badgesCompact,
  )

  console.log(JSON.stringify(userBadges, null, 2))

  if (repo.ready) {
    updateBadges(userBadges, ctx.badgesDir, ctx.badgesDatafile)
    updateReadme(userBadges, ctx.badgesSize, ctx.gitDir)
    if (!ctx.dryrun && repo.hasChanges()) {
      repo.push()
    }
  }
}

function isMain(metaurl = import.meta.url, scriptpath = process.argv[1]) {
  if (metaurl.startsWith('file:')) {
    const modulePath = url.fileURLToPath(metaurl).replace(/\.\w+$/, '')
    const mainPath = fs.realpathSync(scriptpath).replace(/\.\w+$/, '')
    return mainPath === modulePath
  }

  return false
}
