import fs from 'node:fs'
import path from 'node:path'
import { Badge } from './badges.js'
import { $ as _$ } from './utils.js'
import { Context } from './context.js'

export function getRepo({
  gitDir,
  ghToken,
  ghRepoOwner,
  ghRepoName,
  gitName,
  gitEmail,
  badgesDatafile,
}: Context) {
  let ready = false

  const cwd = gitDir
  const dryrun = !ghRepoOwner || !ghRepoName
  const basicAuth = ghToken ? `${ghRepoOwner}:${ghToken}@` : ''
  const gitUrl = `https://${basicAuth}github.com/${ghRepoOwner}/${ghRepoName}.git`
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
      if (fs.existsSync(path.resolve(cwd, '.git'))) {
        $`git pull`
        return
      }

      $`git clone --depth=1 ${gitUrl} .`
      $`git config user.name ${gitName}`
      $`git config user.email ${gitEmail}`
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
      if (!fs.existsSync(badgesDatafile)) return []

      const data = fs.readFileSync(badgesDatafile, 'utf8')
      return JSON.parse(data)
    },
  }
}
