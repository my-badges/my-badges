import { Octokit } from 'octokit'
import { Badge } from './badges.js'
import { quoteAttr, upload } from './utils.js'
import { allBadges } from './all-badges/index.js'

export function generateReadme(
  readme: string,
  badges: Badge[],
  size: number | string = 64,
  tiers: boolean,
) {
  const startString = '<!-- my-badges start -->'
  const endString = '<!-- my-badges end -->'

  let content = readme

  const start = content.indexOf(startString)
  const end = content.indexOf(endString)
  const needToAddNewLine = content[end + endString.length + 1] !== '\n'
  const highestBadges = allBadges.flatMap(({ default: { badges: _badges , tiers: _tiers} }) =>
    _tiers
      ? _badges.find((badge) => badges.some(({ id }) => id === badge))
      : _badges,
  )
  const filter = tiers
    ? ({ id }: Badge) => highestBadges.includes(id)
    : () => true

  if (start !== -1 && end !== -1) {
    content = content.slice(0, start) + content.slice(end + endString.length)

    const badgesHtml = badges
      .filter(filter)
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

export async function updateReadme(
  octokit: Octokit,
  owner: string,
  repo: string,
  badges: Badge[],
  size: number | string,
  dryrun: boolean,
  tiers: boolean,
) {
  const readme = await octokit.request<'readme'>(
    'GET /repos/{owner}/{repo}/readme',
    {
      owner,
      repo,
    },
  )
  const content = await generateReadme(
    Buffer.from(readme.data.content, 'base64').toString('utf8'),
    badges,
    size,
    tiers,
  )

  await upload(
    octokit,
    'PUT /repos/{owner}/{repo}/contents/{path}',
    {
      owner,
      repo,
      path: readme.data.path,
      message: 'Update my-badges',
      committer: {
        name: 'My Badges',
        email: 'my-badges@github.com',
      },
      content,
      sha: readme.data.sha,
    },
    dryrun,
  )
}
