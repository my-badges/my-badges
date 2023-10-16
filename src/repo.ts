import fs from 'node:fs'
import { spawnSync } from 'node:child_process'
import { chdir } from 'node:process'
import { Badge } from './badges.js'

export function gitClone(owner: string, repo: string) {
  spawnSync(
    'git',
    ['clone', '--depth=1', `https://github.com/${owner}/${repo}.git`, 'repo'],
    {
      stdio: 'inherit',
    },
  )

  chdir('repo')

  spawnSync('git', ['config', 'user.name', 'My Badges'], { stdio: 'inherit' })
  spawnSync(
    'git',
    ['config', 'user.email', 'my-badges@users.noreply.github.com'],
    { stdio: 'inherit' },
  )

  chdir('..')
}

export function gitPush() {
  chdir('repo')

  spawnSync('git', ['add', '.'], { stdio: 'inherit' })
  spawnSync('git', ['commit', '-m', 'Update badges'], { stdio: 'inherit' })
  spawnSync('git', ['push'], { stdio: 'inherit' })

  chdir('..')
}

export function getUserBadges(): Badge[] {
  if (!fs.existsSync('my-badges/my-badges.json')) {
    return []
  }
  const data = fs.readFileSync('my-badges/my-badges.json', 'utf8')
  return JSON.parse(data)
}
