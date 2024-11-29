import fs from 'node:fs'
import { chdir } from 'node:process'
import { Badge } from './badges.js'
import { exec, execWithOutput } from './utils.js'

export function syncRepo(owner: string, repo: string, token: string) {
  if (fs.existsSync('repo')) {
    chdir('repo')
    exec('git', ['pull'])
    chdir('..')
    return
  }

  exec('git', [
    'clone',
    '--depth=1',
    `https://${owner}:${token}@github.com/${owner}/${repo}.git`,
    'repo',
  ])

  chdir('repo')

  exec('git', ['config', 'user.name', 'My Badges'])
  exec('git', ['config', 'user.email', 'my-badges@users.noreply.github.com'])

  chdir('..')
}

export function thereAreChanges(): boolean {
  chdir('repo')

  const changes = execWithOutput('git', ['status', '--porcelain']).trim()

  chdir('..')

  return changes !== ''
}

export function gitPush() {
  chdir('repo')

  exec('git', ['add', '.'])
  exec('git', ['status'])
  exec('git', ['commit', '-m', 'Update badges'])
  exec('git', ['push'])

  chdir('..')
}

export function getUserBadges(): Badge[] {
  if (!fs.existsSync('repo/my-badges/my-badges.json')) {
    return []
  }
  const data = fs.readFileSync('repo/my-badges/my-badges.json', 'utf8')
  return JSON.parse(data)
}
