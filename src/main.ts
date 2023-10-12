#!/usr/bin/env node

import fs from 'node:fs'
import minimist from 'minimist'
import { Octokit, RequestError } from 'octokit'
import { retry } from '@octokit/plugin-retry'
import { throttling } from '@octokit/plugin-throttling'
import { collect, Data } from './collect/collect.js'
import { allBadges } from './all-badges/index.js'
import { Badge, badgeCollection, BadgePresenter, ID } from './badges.js'
import { updateReadme } from './update-readme.js'
import { updateBadges } from './update-badges.js'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

void (async function main() {
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

  let data: Data
  if (dataPath !== '') {
    if (!fs.existsSync(dataPath)) {
      console.error('Data file not found')
      process.exit(1)
    }
    data = JSON.parse(fs.readFileSync(dataPath, 'utf8'))
  } else {
    if (!username) {
      console.error('Specify username')
      process.exit(1)
    }
    data = await collect(username, octokit)
    if (!fs.existsSync('data')) {
      fs.mkdirSync('data')
    }
    fs.writeFileSync(`data/${username}.json`, JSON.stringify(data, null, 2))
  }

  let userBadges: Badge[] = []
  let oldJson: string | undefined
  let jsonSha: string | undefined
  if (owner && repo) {
    console.log('Loading my-badges.json')
    try {
      const myBadgesResp = await octokit.request<'content-file'>(
        'GET /repos/{owner}/{repo}/contents/{path}',
        {
          owner,
          repo,
          path: 'my-badges/my-badges.json',
        },
      )
      oldJson = Buffer.from(myBadgesResp.data.content, 'base64').toString(
        'utf8',
      )
      jsonSha = myBadgesResp.data.sha
      userBadges = JSON.parse(oldJson)

      // Add missing tier property in old my-badges.json.
      for (const b of userBadges) {
        if (b.tier === undefined) b.tier = 0
      }
    } catch (err) {
      if (err instanceof RequestError && err.response?.status != 404) {
        throw err
      }
    }
  }

  for (const { default: it } of allBadges) {
    const presenter: BadgePresenter = it
    const newBadges: Badge[] = []
    const grant = badgeCollection(newBadges)
    presenter.present(data, grant)

    if (newBadges.length === 0) {
      continue
    }

    // Enhance badges with image URLs.
    for (const b of newBadges) {
      const baseDir = path.basename(path.dirname(fileURLToPath(presenter.url)))
      b.image = `https://github.com/my-badges/my-badges/blob/master/src/all-badges/${baseDir}/${b.id}.png?raw=true`
    }

    const badgeFromPresenter = (x: Badge) =>
      (presenter.badges as ID[]).includes(x.id)

    // Merge existing userBadges with newBadges.
    if (compact && presenter.tiers) {
      const newHighestTierBadge = newBadges.reduce((prev, curr) => {
        return prev.tier > curr.tier ? prev : curr
      })

      const existingBadgeIndex = userBadges.findIndex(badgeFromPresenter)
      if (existingBadgeIndex === -1) {
        userBadges.push(newHighestTierBadge)
      } else if (
        newHighestTierBadge.tier >= userBadges[existingBadgeIndex].tier
      ) {
        userBadges[existingBadgeIndex] = newHighestTierBadge

        // Drop all other badges from the same presenter.
        userBadges = userBadges.filter(
          (x, i) => i === existingBadgeIndex || !badgeFromPresenter(x),
        )
      }
    } else {
      for (const badge of newBadges) {
        const index = userBadges.findIndex((x) => x.id === badge.id)
        if (index === -1) {
          userBadges.push(badge)
        } else {
          userBadges[index] = badge
        }
      }
    }
  }

  if (pickBadges.length > 0) {
    userBadges = userBadges.filter((x) => pickBadges.includes(x.id))
  }
  if (omitBadges.length > 0) {
    userBadges = userBadges.filter((x) => !omitBadges.includes(x.id))
  }

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
})()
