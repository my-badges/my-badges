import fs from 'node:fs'
import path from 'node:path'
import { Badge } from './badges.js'
import { $ as _, type TShellSync } from './utils.js'

const MY_BADGES_NAME = 'My Badges'
const MY_BADGES_EMAIL = 'my-badges@users.noreply.github.com'
const MY_BADGES_FILE = 'my-badges/my-badges.json'
const CWD = process.cwd()
const DIR = 'repo'

export const __internal__ = { cwd: CWD }
const $ = ((...args: any) =>
  _({
    cwd: path.resolve(__internal__.cwd, DIR),
    sync: true,
  })(...args)) as TShellSync

export function syncRepo(owner: string, repo: string, token?: string) {
  const { cwd } = __internal__
  if (fs.existsSync(path.resolve(cwd, DIR))) {
    $`git pull`
    return
  }
  const auth = token ? `${owner}:${token}@` : ''

  $({
    cwd,
  })`git clone --depth=1 https://${auth}github.com/${owner}/${repo}.git ${DIR}`
  $`git config user.name ${MY_BADGES_NAME}`
  $`git config user.email ${MY_BADGES_EMAIL}`
}

export function thereAreChanges(): boolean {
  return $`git status --porcelain`.stdout.trim() !== ''
}

export function gitPush() {
  $`git add .`
  $`git status`
  $`git commit -m Update badges`
  $`git push`
}

export function getUserBadges(): Badge[] {
  const file = path.resolve(__internal__.cwd, DIR, MY_BADGES_FILE)
  if (!fs.existsSync(file)) {
    return []
  }
  const data = fs.readFileSync(file, 'utf8')
  return JSON.parse(data)
}
