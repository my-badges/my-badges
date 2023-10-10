#!/usr/bin/env node

import fs from 'node:fs'
import minimist from 'minimist'
import { Octokit, RequestError } from 'octokit'
import { retry } from '@octokit/plugin-retry'
import { throttling } from '@octokit/plugin-throttling'
import { collect, Data } from './collect/collect.js'
import { allBadges } from './all-badges/index.js'
import { Badge, badgeCollection } from './badges.js'
import { updateReadme } from './update-readme.js'
import { updateBadges } from './update-badges.js'

void (async function main() {
  const { env } = process
  const argv = minimist(process.argv.slice(2), {
    string: ['data', 'repo', 'token', 'size', 'user'],
    boolean: ['dryrun'],
  })
  const {
    token = env.GITHUB_TOKEN,
    repo: repository = env.GITHUB_REPO,
    user: username = argv._[0] || env.GITHUB_USER,
    data: dataPath = '',
    size,
    dryrun,
  } = argv
  const [owner, repo] = repository?.split('/', 2) || [username, username]

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

  let badges: Badge[] = []
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
      badges = JSON.parse(oldJson)
    } catch (err) {
      if (err instanceof RequestError && err.response?.status != 404) {
        throw err
      }
    }
  }

  for (const { default: presenter } of allBadges) {
    const grant = badgeCollection(badges, presenter.url)
    presenter.present(data, grant)
  }
  console.log('Badges', badges)

  if (owner && repo) {
    await updateBadges(octokit, owner, repo, badges, oldJson, jsonSha, dryrun)
    await updateReadme(octokit, owner, repo, badges, size, dryrun)
  }
})()
