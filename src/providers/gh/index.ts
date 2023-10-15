import fs from 'node:fs/promises'
import path from 'node:path'
import type { TProvider } from '../../interfaces.js'
import { getOctokit } from './octokit.js'
import { collect } from './collect/collect.js'
import { MY_BADGES_JSON_PATH } from '../../constants.js'
import {
  decodeBase64,
  encodeBase64,
  quoteAttr,
  writeFile,
} from '../../utils.js'
import { RequestError } from 'octokit'
import { Badge } from '../../badges.js'

export const githubProvider: TProvider = {
  async getData({ user, token }) {
    const octokit = getOctokit(token)

    return collect(octokit, user)
  },
  async getBadges({ user, token, owner = user, repo = user }) {
    try {
      const content = await read(token, MY_BADGES_JSON_PATH, owner, repo)
      const userBadges = JSON.parse(content + '')
      userBadges.sha = content.sha

      // Add missing tier property in old my-badges.json.
      for (const b of userBadges) {
        if (b.tier === undefined) b.tier = 0
      }

      return userBadges
    } catch (err) {
      console.warn(err)
      if (err instanceof RequestError && err.response?.status != 404) {
        throw err
      }
    }

    return []
  },
  async updateBadges({
    user,
    badges,
    token,
    owner = user,
    repo = user,
    size,
    dryrun,
    cwd,
  }) {
    const oldReadme = await read(token, 'readme.md', owner, repo, dryrun, cwd)
    const readme = generateReadme(oldReadme + '', badges, size)
    const uploads: Record<string, any> = {
      [MY_BADGES_JSON_PATH]: JSON.stringify(badges, null, 2),
      ['readme.md']: readme,
    }

    for (const badge of badges) {
      const badgePath = `my-badges/${badge.id}.md`
      const desc = quoteAttr(badge.desc)
      uploads[badgePath] =
        `<img src="${badge.image}" alt="${desc}" title="${desc}" width="128">\n` +
        `<strong>${desc}</strong>\n` +
        `<br><br>\n\n` +
        badge.body +
        `\n\n\n` +
        `Created by <a href="https://github.com/my-badges/my-badges">My Badges</a>`
    }

    await Promise.all(
      Object.entries(uploads).map(([contentPath, content]) =>
        upsert(token, content, owner, repo, contentPath, dryrun, cwd),
      ),
    )
  },
}

export const upsert = async (
  token: string,
  content: string & { sha?: string },
  owner: string,
  repo: string,
  contentPath: string,
  dryrun?: boolean,
  cwd = process.cwd(),
) => {
  const _content = await read(token, contentPath, owner, repo, dryrun, cwd)

  if (content == _content) {
    return
  }

  Object.assign(content, { sha: _content.sha })
  await upload(token, content, owner, repo, contentPath, dryrun, cwd)
}

export const read = async (
  token: string,
  contentPath: string,
  owner: string,
  repo: string,
  dryrun?: boolean,
  cwd = process.cwd(),
) => {
  try {
    if (dryrun) {
      return (await fs.readFile(
        path.resolve(cwd, contentPath),
        'utf8',
      )) as string & { sha: string }
    }

    const octokit = getOctokit(token)
    const {
      data: { content, sha },
    } = await octokit.request<'content-file'>(
      'GET /repos/{owner}/{repo}/contents/{path}',
      {
        path: contentPath,
        owner,
        repo,
      },
    )

    return Object.assign(new String(decodeBase64(content)), { sha })
  } catch (e) {
    console.warn(contentPath, e)

    return '' as string & { sha: string }
  }
}

export const upload = async (
  token: string,
  content: string & { sha?: string },
  owner: string,
  repo: string,
  contentPath: string,
  dryrun?: boolean,
  cwd = process.cwd(),
) => {
  if (dryrun) {
    console.log(`Skipped pushing ${contentPath} (dryrun)`)
    const filepath = path.join(cwd, contentPath)

    await writeFile(filepath, content)
    return
  }

  const { sha } = content
  console.log(`Uploading ${contentPath} ${sha}`)

  const octokit = getOctokit(token)
  return octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', {
    owner,
    repo,
    path: contentPath,
    message: `chore: ${contentPath} ${sha ? 'updated' : 'added'}`,
    committer: {
      name: 'My Badges',
      email: 'my-badges@github.com',
    },
    content: encodeBase64(content as string),
    sha: content.sha,
  })
}

export function generateReadme(
  readme: string,
  badges: Badge[],
  size: number | string = 64,
) {
  const startString = '<!-- my-badges start -->'
  const endString = '<!-- my-badges end -->'

  let content = readme

  const start = content.indexOf(startString)
  const end = content.indexOf(endString)
  const needToAddNewLine = content[end + endString.length + 1] !== '\n'

  if (start !== -1 && end !== -1) {
    content = content.slice(0, start) + content.slice(end + endString.length)

    const badgesHtml = badges
      .map((badge) => {
        const desc = quoteAttr(badge.desc)
        // prettier-ignore
        return `<a href="my-badges/${badge.id}.md"><img src="${badge.image}" alt="${desc}" title="${desc}" width="${parseInt(size + '')}"></a>`
      })
      .join('\n')

    content =
      content.slice(0, start) +
      `${startString}\n` +
      '<h4><a href="https://github.com/my-badges/my-badges">My Badges</a></h4>\n\n' +
      badgesHtml +
      `\n${endString}` +
      (needToAddNewLine ? '\n' : '') +
      content.slice(start)
  }

  return content
}
