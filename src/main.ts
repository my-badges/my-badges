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

void (async function main() {
    const ctx = createCtx()
    const repo = getRepo(ctx)

    repo.pull()

    let data: Data
    if (fs.existsSync(ctx.dataFile)) {
      data = JSON.parse(fs.readFileSync(ctx.dataFile, 'utf8')) as Data
    } else {
      let ok: boolean
      ;[ok, data] = await processTasks(ctx)

//       ;[ok, data] = await processTasks(octokit, username, {
//         task,
//         params,
//         skipTask,
//       })
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
      updateBadges(userBadges)
      updateReadme(userBadges, ctx.badgesSize)
      if (!ctx.dryrun && repo.hasChanges()) {
        repo.push()
      }
    }
  } catch (e) {
    console.error(e)
    process.exit(1)
  }
})()
