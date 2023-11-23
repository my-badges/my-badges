import { spawnSync } from 'node:child_process'
import { Commit, Issue, Pull } from './collect/collect.js'

export function linkCommit(commit: Commit): string {
  return `<a href="https://github.com/${commit.repository.owner.login}/${commit.repository.name}/commit/${commit.sha}">${commit.sha.slice(0, 7)}</a>`
}

export function linkPull(pull: Pull): string {
  return `<a href="https://github.com/${pull.repository.owner.login}/${pull.repository.name}/pull/${pull.number}">#${pull.number}</a>`
}

export function linkIssue(issue: Issue): string {
  return `<a href="https://github.com/${issue.repository.owner.login}/${issue.repository.name}/issues/${issue.number}">#${issue.number}</a>`
}

export function quoteAttr(s: string) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/'/g, '&apos;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\r\n/g, '&#13;')
    .replace(/[\r\n]/g, '&#13;')
}

export const expectType = <T>(expression: T) => void 0

export function parseMask(value: string): RegExp {
  return new RegExp(`^${value}$`.replace('*', '.+'))
}

export function exec(command: string, args: string[]): void {
  const p = spawnSync(command, args, { stdio: 'inherit' })
  if (p.status !== 0) {
    throw new Error(`Command failed: ${command} ${args.join(' ')}`)
  }
}

export function execWithOutput(command: string, args: string[]): string {
  const p = spawnSync(command, args, { stdio: 'pipe' })
  if (p.status !== 0) {
    throw new Error(`Command failed: ${command} ${args.join(' ')}`)
  }
  return p.stdout.toString()
}
