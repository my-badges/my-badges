import {Commit, Repo} from './collect/collect.js'

export function linkCommit({repo, commit}: { repo: Repo, commit: Commit }): string {
  return `<a href="https://github.com/${repo.owner.login}/${repo.name}/commit/${commit.sha}">${commit.sha.slice(0, 7)}</a>`
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
