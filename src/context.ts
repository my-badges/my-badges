import minimist from 'minimist'
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

  dryrun: boolean
  badgesCompact: boolean
  badgesDatafile: string
  badgesDir: string // badges output directory (relative to gitDir)
  badgesSize: string | number
  badgesPick: string[]
  badgesOmit: string[]
  taskName?: string
  taskSkip: string
  taskParams?: string
}

export function createCtx(
  args: string[] = process.argv.slice(2),
  env: Record<string, string | undefined> = process.env,
): Context {
  const argv = minimist(args, {
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
    task: taskName,
    params: taskParams,
    'skip-task': taskSkip = '',
  } = argv
  const cwd = path.resolve(_cwd)
  const dataDir = path.resolve(cwd, DATA_DIR)
  const dataFile = path.resolve(dataDir, data || `${ghUser}.json`)
  const dataTasks = path.resolve(dataDir, `${ghUser}.tasks.json`)
  const gitDir = path.resolve(cwd, GIT_DIR)
  const badgesDir = path.resolve(gitDir, BADGES_DIR)
  const badgesDatafile = path.resolve(badgesDir, data || BADGES_DATAFILE)
  const [ghRepoOwner = '', ghRepoName = ''] = repo?.split('/', 2) || [
    ghUser,
    ghUser,
  ]
  const badgesPick = pick ? pick.split(',') : []
  const badgesOmit = omit ? omit.split(',') : []

  !fs.existsSync(dataDir) && fs.mkdirSync(dataDir, { recursive: true })
  !fs.existsSync(gitDir) && fs.mkdirSync(gitDir, { recursive: true })

  return {
    cwd,
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
    dataTasks,
    taskName,
    taskParams,
    taskSkip,
  }
}
