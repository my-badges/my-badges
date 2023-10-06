import {Commit} from './collect/collect.js'

export function linkCommit(commit: Commit): string {
  return `<a href="https://github.com/${commit.repository.owner.login}/${commit.repository.name}/commit/${commit.sha}">${commit.sha.slice(0, 7)}</a>`
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
