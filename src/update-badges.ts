import { Octokit, RequestError } from 'octokit'
import { Badge } from './badges.js'
import { quoteAttr, upload } from './utils.js'
import { MY_BADGES_JSON_PATH } from './constants.js'

export async function updateBadges(
  octokit: Octokit,
  owner: string,
  repo: string,
  badges: Badge[],
  oldJson: string | undefined,
  jsonSha: string | undefined,
  dryrun: boolean,
) {
  const newJson = JSON.stringify(badges, null, 2)
  if (newJson == oldJson) {
    console.log('No change in my-badges.json')
  } else {
    await upload(
      octokit,
      'PUT /repos/{owner}/{repo}/contents/{path}',
      {
        owner,
        repo,
        path: MY_BADGES_JSON_PATH,
        message: 'Update my-badges',
        committer: {
          name: 'My Badges',
          email: 'my-badges@github.com',
        },
        content: newJson,
        sha: jsonSha,
      },
      dryrun,
    )
  }

  for (const badge of badges) {
    const badgePath = `my-badges/${badge.id}.md`

    let sha: string | undefined
    let oldContent: string | undefined

    try {
      console.log(`Loading ${badgePath}`)
      const resp = await octokit.request<'readme'>(
        'GET /repos/{owner}/{repo}/contents/{path}',
        { owner, repo, path: badgePath },
      )
      sha = resp.data.sha
      oldContent = Buffer.from(resp.data.content, 'base64').toString('utf8')
    } catch (err) {
      if (err instanceof RequestError && err.response?.status != 404) {
        throw err
      }
    }

    const desc = quoteAttr(badge.desc)
    const content =
      `<img src="${badge.image}" alt="${desc}" title="${desc}" width="128">\n` +
      `<strong>${desc}</strong>\n` +
      `<br><br>\n\n` +
      badge.body +
      `\n\n\n` +
      `Created by <a href="https://github.com/my-badges/my-badges">My Badges</a>`

    if (content === oldContent) {
      console.log(`No change in ${badgePath}`)
      continue
    }

    await upload(
      octokit,
      'PUT /repos/{owner}/{repo}/contents/{path}',
      {
        owner,
        repo,
        path: badgePath,
        message: sha ? `Update ${badge.id}.md` : `Add ${badge.id}.md`,
        committer: {
          name: 'My Badges',
          email: 'my-badges@github.com',
        },
        content,
        sha: sha,
      },
      dryrun,
    )
  }
}
