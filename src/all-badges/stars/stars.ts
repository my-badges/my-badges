import { BadgePresenter, Present } from '../../badges.js'

export default new (class implements BadgePresenter {
  url = new URL(import.meta.url)
  badges = [
    'stars-20000',
    'stars-10000',
    'stars-5000',
    'stars-2000',
    'stars-1000',
    'stars-500',
    'stars-100',
  ] as const
  tiers = true
  present: Present = (data, grant) => {
    let totalStars = 0

    const sorted = data.repos.sort(
      ({ stargazers_count: a = 0 }, { stargazers_count: b = 0 }) => b - a,
    )
    const reasonable = sorted
      .map((repo) => {
        if (!repo.stargazers_count) {
          return
        }
        totalStars += repo.stargazers_count

        return `* <a href="https://github.com/${repo.owner.login}/${repo.name}     <i>${repo.stargazers_count}</i></a>`
      })
      .filter(Boolean)

    const text = `Repos:
${reasonable.join('\n')}

<sup>I have push, maintainer or admin permissions, so I'm definitely an author.<sup>
`

    this.badges.forEach((badge) => {
      const limit = +badge.slice(6)
      if (totalStars >= limit) {
        grant(badge, `I collected ${limit} stars.`).evidence(text)
      }
    })
  }
})()
