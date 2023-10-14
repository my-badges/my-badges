#!/usr/bin/env node

import minimist from 'minimist'
import { Octokit } from 'octokit'
import { retry } from '@octokit/plugin-retry'
import { throttling } from '@octokit/plugin-throttling'
import { updateReadme } from './update-readme.js'
import { updateBadges } from './update-badges.js'
import { presentBadges } from './present-badges.js'
import { getBadges } from './get-badges.js'

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
    const [owner, repo] = repository?.split('/', 2) || [username, username]
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

    let { userBadges, data, oldJson, jsonSha } = await getBadges(
      octokit,
      dataPath,
      username,
      owner,
      repo,
    )

    userBadges = presentBadges(
      data,
      userBadges,
      pickBadges,
      omitBadges,
      compact,
    )

    console.log(JSON.stringify(userBadges, null, 2))

    if (owner && repo) {
      await updateBadges(
        octokit,
        owner,
        repo,
        userBadges,
        oldJson,
        jsonSha,
        dryrun,
      )
      await updateReadme(octokit, owner, repo, userBadges, size, dryrun)
    }
  } catch (e) {
    console.error(e)
    process.exit(1)
  }
})()
