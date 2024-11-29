import { spawnSync } from 'node:child_process'
import { Octokit } from 'octokit'
import { Query, Variables } from 'megaera'
import { Commit } from './task/commits/commits.graphql.js'
import { PullRequest } from './task/pulls/pulls.graphql.js'
import { Issue } from './task/issues/issues.graphql.js'

export { $, type TShellSync } from 'zurk'

export function query<T extends Query>(
  octokit: Octokit,
  query: T,
  variables: Variables<T>,
) {
  return octokit.graphql<ReturnType<T>>(query, variables)
}

export function paginate<T extends Query>(
  octokit: Octokit,
  query: T,
  variables: Variables<T>,
) {
  return octokit.graphql.paginate.iterator<ReturnType<T>>(query, variables)
}

export function linkCommit(commit: Commit): string {
  return `<a href="https://github.com/${commit.repository.owner.login}/${
    commit.repository.name
  }/commit/${commit.sha}">${commit.sha.slice(0, 7)}</a>`
}

export function linkPull(pull: PullRequest): string {
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

export function latest(a: Commit, b: Commit) {
  return (
    new Date(b.committedDate).getTime() - new Date(a.committedDate).getTime()
  )
}

export function plural(count: number, singular: string, plural: string) {
  return (count === 1 ? singular : plural).replace('%d', count.toString())
}
