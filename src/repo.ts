import fs from 'node:fs'
import path from 'node:path'
import { Badge } from './badges.js'
import { $ as _$ } from './utils.js'

const MY_BADGES_NAME = 'My Badges'
const MY_BADGES_EMAIL = 'my-badges@users.noreply.github.com'
const MY_BADGES_FILE = 'my-badges/my-badges.json'
const CWD = process.cwd()
const DIR = 'repo'

type RepoOpts = {
  name?: string
  owner?: string
  token?: string
  cwd?: string
  gitname?: string
  gitemail?: string
  badgesfile?: string
  dryrun?: boolean
}

export function getRepo(opts: RepoOpts) {
  let ready = false

  const cwd = path.resolve(opts.cwd || CWD, DIR)
  const name = opts.name
  const owner = opts.owner
  const dryrun = opts.dryrun || !name || !owner
  const auth = opts.token ? `${owner}:${opts.token}@` : ''
  const giturl = `https://${auth}github.com/${owner}/${name}.git`
  const gitname = opts.gitname || MY_BADGES_NAME
  const gitemail = opts.gitemail || MY_BADGES_EMAIL
  const badgesfile = path.resolve(cwd, opts.badgesfile || MY_BADGES_FILE)
  const $ = _$({
    cwd,
    sync: true,
  })
  return {
    get ready() {
      return ready
    },
    pull() {
      if (dryrun) return
      if (fs.existsSync(cwd)) {
        $`git pull`
        return
      }
      fs.mkdirSync(cwd, { recursive: true })

      $`git clone --depth=1 ${giturl} .`
      $`git config user.name ${gitname}`
      $`git config user.email ${gitemail}`
      ready = true
    },
    push() {
      if (!ready) return
      $`git add .`
      $`git status`
      $`git commit -m Update badges`
      $`git push`
    },
    hasChanges(): boolean {
      if (!ready) return false
      return $`git status --porcelain`.stdout.trim() !== ''
    },
    getUserBadges(): Badge[] {
      if (!fs.existsSync(badgesfile)) return []

      const data = fs.readFileSync(badgesfile, 'utf8')
      return JSON.parse(data)
    },
  }
}
