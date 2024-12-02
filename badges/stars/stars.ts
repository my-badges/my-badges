import { define, Repository } from '#src'

export default define({
  url: import.meta.url,
  tiers: true,
  badges: [
    'stars-100',
    'stars-500',
    'stars-1000',
    'stars-2000',
    'stars-5000',
    'stars-10000',
    'stars-20000',
  ] as const,
  present(data, grant) {
    const repos = data.repos.sort(asc).filter(withStars)
    let totalStars = 0

    for (const repo of repos) {
      totalStars += repo.stargazers.totalCount
    }

    if (totalStars >= 100) {
      grant('stars-100', `I collected 100 stars.`)
        .evidence(text(repos, 100))
        .tier(1)
    }
    if (totalStars >= 500) {
      grant('stars-500', 'I collected 500 stars.')
        .evidence(text(repos, 500))
        .tier(2)
    }
    if (totalStars >= 1000) {
      grant('stars-1000', 'I collected 1000 stars.')
        .evidence(text(repos, 1000))
        .tier(3)
    }
    if (totalStars >= 2000) {
      grant('stars-2000', 'I collected 2000 stars.')
        .evidence(text(repos, 2000))
        .tier(4)
    }
    if (totalStars >= 5000) {
      grant('stars-5000', 'I collected 5000 stars.')
        .evidence(text(repos, 5000))
        .tier(5)
    }
    if (totalStars >= 10_000) {
      grant('stars-10000', 'I collected 10000 stars.')
        .evidence(text(repos, 10_000))
        .tier(6)
    }
    if (totalStars >= 20_000) {
      grant('stars-20000', 'I collected 20000 stars.')
        .evidence(text(repos, 20_000))
        .tier(7)
    }
  },
})

function asc(a: Repository, b: Repository) {
  return (a.stargazers.totalCount || 0) - (b.stargazers.totalCount || 0)
}

function withStars(repo: Repository) {
  return repo.stargazers.totalCount > 0
}

function text(repos: Repository[], max: number): string {
  const lines: string[] = []
  let totalStars = 0
  for (const repo of repos) {
    totalStars += repo.stargazers.totalCount
    lines.push(
      `* <a href="https://github.com/${repo.owner.login}/${repo.name}">${repo.owner.login}/${repo.name}: ★${repo.stargazers.totalCount}</a>`,
    )
    if (totalStars >= max) break
  }
  return `Repos:

${lines.reverse().join('\n')}

<sup>I have push, maintainer or admin permissions, so I'm definitely an author.<sup>
`
}
