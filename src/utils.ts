import fs from 'node:fs/promises'
import path from 'node:path'
import { Octokit } from 'octokit'
import { Commit, Pull } from './collect/collect.js'

export function linkCommit(commit: Commit): string {
  return `<a href="https://github.com/${commit.repository.owner.login}/${
    commit.repository.name
  }/commit/${commit.sha}">${commit.sha.slice(0, 7)}</a>`
}

export function linkPull(pull: Pull): string {
  return `<a href="https://github.com/${pull.repository.owner.login}/${pull.repository.name}/pull/${pull.number}">#${pull.number}</a>`
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

export const upload = async (
  octokit: Octokit,
  route: Parameters<Octokit['request']>[0],
  data: Parameters<Octokit['request']>[1],
  dryrun?: boolean,
) => {
  if (dryrun) {
    console.log(`Skipped pushing ${data?.path} (dryrun)`)
    const filepath = path.join(process.cwd(), data?.path as string)

    await fs.mkdir(path.dirname(filepath), { recursive: true })
    await fs.writeFile(filepath, data?.content as string)

    return
  }

  console.log(`Uploading ${data?.path}`)
  return octokit.request(route, {
    ...data,
    content: Buffer.from(data?.content as string, 'utf8').toString('base64'),
  })
}
