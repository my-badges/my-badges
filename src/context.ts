import minimist from 'minimist'
import { Octokit } from 'octokit'
import { retry } from '@octokit/plugin-retry'
import { throttling } from '@octokit/plugin-throttling'
import path from 'node:path'
import fs from 'node:fs'

const CWD = process.cwd()
const GIT_NAME = 'My Badges'
const GIT_EMAIL = 'my-badges@users.noreply.github.com'
const GIT_DIR = 'repo'
const DATA_DIR = 'data'
const BADGES_DIR = 'my-badges'
const BADGES_DATAFILE = 'my-badges.json'

export type Context = {
  cwd: string
  dataDir: string // used for data gathering
  dataFile: string
  dataTasks: string
  gitDir: string // used for git operations
  gitName: string
  gitEmail: string
  ghRepoOwner: string
  ghRepoName: string
  ghUser: string
  ghToken: string
  octokit: Octokit

  dryrun: boolean
  badgesCompact: boolean
  badgesDatafile: string
  badgesDir: string  // badges output directory (relative to gitDir)
  badgesSize: string | number
  badgesPick: string[]
  badgesOmit: string[]
}

export function createCtx(args: string[] = process.argv, env: Record<string, string | undefined> = process.env): Context {
  const argv = minimist(args.slice(2), {
    string: ['data', 'repo', 'token', 'size', 'user', 'pick', 'omit'],
    boolean: ['dryrun', 'compact'],
  })
  const {
    cwd: _cwd = CWD,
    token: ghToken = env.GITHUB_TOKEN,
    repo = env.GITHUB_REPO,
    user: ghUser = argv._[0] || env.GITHUB_USER,
    data,
    size: badgesSize,
    dryrun,
    pick,
    omit,
    compact: badgesCompact,
  } = argv
  const octokit = getOctokit(ghToken)
  const cwd = path.resolve(_cwd)
  const dataDir = path.resolve(cwd, DATA_DIR)
  const dataFile = path.resolve(dataDir, data || `${ghUser}.json`)
  const dataTasks = path.resolve(dataDir, `${ghUser}.tasks.json`)
  const gitDir = path.resolve(cwd, GIT_DIR)
  const badgesDir = path.resolve(gitDir, BADGES_DIR)
  const badgesDatafile = path.resolve(badgesDir, data || BADGES_DATAFILE)
  const [ghRepoOwner = '', ghRepoName = ''] = repo?.split('/', 2) || [ghUser, ghUser]
  const badgesPick = pick ? pick.split(',') : []
  const badgesOmit = omit ? omit.split(',') : []

  !fs.existsSync(dataDir) && fs.mkdirSync(dataDir, { recursive: true })
  !fs.existsSync(gitDir) && fs.mkdirSync(gitDir, { recursive: true })

  return {
    cwd,
    octokit,
    gitName: GIT_NAME,
    gitEmail: GIT_EMAIL,
    gitDir,
    ghUser,
    ghToken,
    ghRepoOwner,
    ghRepoName,
    dryrun,
    badgesDir,
    badgesDatafile,
    badgesCompact,
    badgesSize,
    badgesOmit,
    badgesPick,
    dataDir,
    dataFile,
    dataTasks
  }
}

const MyOctokit = Octokit.plugin(retry, throttling)

function getOctokit(token: string) {
  return new MyOctokit({
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
}
