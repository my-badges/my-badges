import { TProvider, TUpdateMyBadgesNormalizedOpts } from './interfaces.js'
import { githubProvider } from './providers/gh/index.js'
import fs from 'node:fs'
import { Data } from './providers/gh/collect/collect.js'
import path from 'node:path'
import { writeFile } from './utils.js'
import { presentBadges } from './present-badges.js'
import { allBadges } from './all-badges/index.js'

export type TUpdateMyBadgesOpts = Partial<{
  token: string
  user: string
  repo: string
  owner: string
  data: string
  size: number | string
  dryrun: boolean
  compact: boolean
  shuffle: boolean
  provider: TProvider
  cwd: string
  'committer-name': string
  'committer-email': string
}>

export const update = async (
  opts: TUpdateMyBadgesOpts,
  env = process.env,
): Promise<void> => {
  const _opts = normalizeOpts(opts, env)
  const { pickBadges, omitBadges, compact, provider, shuffle } = _opts

  let { data, userBadges } = await getSnapshot(_opts)

  userBadges = presentBadges(
    allBadges.map((m) => m.default),
    data,
    userBadges,
    pickBadges,
    omitBadges,
    compact,
    shuffle,
  )

  console.log(JSON.stringify(userBadges, null, 2))

  await provider.updateBadges({
    ..._opts,
    badges: userBadges,
  })
}

export const normalizeOpts = (
  argv: Record<string, any>,
  env: Record<string, string | undefined> = {},
): TUpdateMyBadgesNormalizedOpts => {
  const {
    token = env.GITHUB_TOKEN,
    repo: repository = env.GITHUB_REPO,
    user: user = argv._[0] || env.GITHUB_USER,
    data: dataPath = '',
    size = 64,
    dryrun = argv['dry-run'] || false,
    compact = false,
    shuffle = false,
    pick,
    omit,
    provider = githubProvider,
    cwd = process.cwd(),
    committerName = argv['committer-name'] ||
      env.GIT_COMMITTER_NAME ||
      'My Badges',
    committerEmail = argv['committer-email'] ||
      env.GIT_COMMITTER_EMAIL ||
      'my-badges@github.com',
  } = argv
  const [owner, repo] = repository?.split('/', 2) || [user, user]
  const pickBadges = pick ? pick.split(',') : []
  const omitBadges = omit ? omit.split(',') : []

  return {
    token,
    repo,
    owner,
    user,
    size,
    dryrun,
    compact,
    shuffle,
    pickBadges,
    omitBadges,
    dataPath,
    provider,
    cwd,
    committerName,
    committerEmail,
  }
}

export const getData = async ({
  dataPath,
  token,
  user,
  provider,
  cwd = process.cwd(),
}: Pick<
  TUpdateMyBadgesNormalizedOpts,
  'token' | 'dataPath' | 'user' | 'provider' | 'cwd'
>) => {
  if (dataPath !== '') {
    if (!fs.existsSync(dataPath)) {
      throw new Error('Data file not found')
    }
    return JSON.parse(
      fs.readFileSync(path.resolve(cwd, dataPath), 'utf8'),
    ) as Data
  }

  if (!user) {
    throw new Error('Specify username')
  }

  const data = await provider.getData({ user, token }) // await collect(octokit, username)
  const filepath = path.join(cwd, `data/${user}.json`)

  await writeFile(filepath, JSON.stringify(data, null, 2))

  return data
}

export const getSnapshot = async ({
  dataPath,
  owner,
  repo,
  token,
  user,
  provider,
  cwd,
  dryrun,
}: Pick<
  TUpdateMyBadgesNormalizedOpts,
  | 'token'
  | 'dataPath'
  | 'repo'
  | 'owner'
  | 'user'
  | 'provider'
  | 'cwd'
  | 'dryrun'
>) => {
  const data = await getData({ dataPath, token, user, provider, cwd })
  const userBadges =
    owner && repo
      ? await provider.getBadges({ token, user, repo, owner, cwd, dryrun })
      : []

  return {
    data,
    userBadges,
  }
}
