#!/usr/bin/env node

import minimist from 'minimist'
import { Octokit } from 'octokit'
import { retry } from '@octokit/plugin-retry'
import { throttling } from '@octokit/plugin-throttling'
import { presentBadges } from './present-badges.js'
import { getData } from './get-data.js'
import { allBadges } from './all-badges/index.js'
import { getUserBadges, gitClone, gitPush } from './repo.js'
import { updateBadges } from './update-badges.js'
import { updateReadme } from './update-readme.js'

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
    const [owner, repo]: [string | undefined, string | undefined] =
      repository?.split('/', 2) || [username, username]
    const pickBadges = pick ? pick.split(',') : []
    const omitBadges = omit ? omit.split(',') : []

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
        onSecondaryRateLimit: (retryAfter, options: any, octokit) => {
          octokit.log.warn(
            `SecondaryRateLimit detected for request ${options.method} ${options.url}`,
          )
        },
      },
      retry: { doNotRetry: ['429'] },
    })

    if (owner && repo) gitClone(owner, repo)
    const data = await getData(octokit, dataPath, username)

    let userBadges = getUserBadges()
    userBadges = presentBadges(
      allBadges.map((m) => m.default),
      data,
      userBadges,
      pickBadges,
      omitBadges,
      compact,
    )

    console.log(JSON.stringify(userBadges, null, 2))

    if (owner && repo) {
      updateBadges(userBadges)
      updateReadme(userBadges, size)
      if (!dryrun) {
        gitPush()
      }
    }
  } catch (e) {
    console.error(e)
    process.exit(1)
  }
})()
