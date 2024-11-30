#!/usr/bin/env node

import allBadges from '#badges'
import minimist from 'minimist'
import { Octokit } from 'octokit'
import { retry } from '@octokit/plugin-retry'
import { throttling } from '@octokit/plugin-throttling'
import { presentBadges } from './present-badges.js'
import { getRepo } from './repo.js'
import { updateBadges } from './update-badges.js'
import { updateReadme } from './update-readme.js'
import { processTasks } from './process-tasks.js'
import fs from 'node:fs'
import { Data } from './data.js'

void (async function main() {
  try {
    const { env } = process
    const argv = minimist(process.argv.slice(2), {
      string: ['data', 'repo', 'token', 'size', 'user', 'pick', 'omit'],
      boolean: ['dryrun', 'compact'],
    })
    const {
      token = env.GITHUB_TOKEN,
      repo: repository = env.GITHUB_REPO,
      user: username = argv._[0] || env.GITHUB_USER,
      data: dataPath = '',
      size,
      dryrun,
      pick,
      omit,
      compact,
    } = argv
    const [owner, name]: [string | undefined, string | undefined] =
      repository?.split('/', 2) || [username, username]
    const pickBadges = pick ? pick.split(',') : []
    const omitBadges = omit ? omit.split(',') : []

    const repo = getRepo({ owner, name, token })
    const MyOctokit = Octokit.plugin(retry, throttling)
    const octokit = new MyOctokit({
      auth: token,
      log: console,
      throttle: {
        onRateLimit: (retryAfter, options: any, octokit, retryCount) => {
          octokit.log.warn(
            `Request quota exhausted for request ${options.method} ${options.url}`,
          )
          if (retryCount <= 3) {
            octokit.log.info(`Retrying after ${retryAfter} seconds!`)
            return true
          }
        },
        onSecondaryRateLimit: (
          retryAfter,
          options: any,
          octokit,
          retryCount,
        ) => {
          octokit.log.warn(
            `SecondaryRateLimit detected for request ${options.method} ${options.url}`,
          )
          if (retryCount <= 3) {
            octokit.log.info(`Retrying after ${retryAfter} seconds!`)
            return true
          }
        },
      },
      retry: { doNotRetry: ['429'] },
    })

    repo.pull()

    let data: Data
    if (dataPath !== '') {
      data = JSON.parse(fs.readFileSync(dataPath, 'utf8')) as Data
    } else {
      let ok: boolean
      ;[ok, data] = await processTasks(octokit, username)
      if (!ok) {
        return
      }
    }

    let userBadges = repo.getUserBadges()
    userBadges = presentBadges(
      allBadges.map((m) => m.default),
      data,
      userBadges,
      pickBadges,
      omitBadges,
      compact,
    )

    console.log(JSON.stringify(userBadges, null, 2))

    if (repo.ready) {
      updateBadges(userBadges)
      updateReadme(userBadges, size)
      if (!dryrun && repo.hasChanges()) {
        repo.push()
      }
    }
  } catch (e) {
    console.error(e)
    process.exit(1)
  }
})()
