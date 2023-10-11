import { BadgePresenter, Present } from '../../badges.js'

export default new (class extends BadgePresenter {
  url = new URL(import.meta.url)
  tiers = true
  badges = [
    'stars-100',
    'stars-500',
    'stars-1000',
    'stars-2000',
    'stars-5000',
    'stars-10000',
    'stars-20000',
  ] as const
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
    if (totalStars >= 100) {
      grant('stars-100', `I collected 100 stars.`).evidence(text).tier(1)
    }
    if (totalStars >= 500) {
      grant('stars-500', 'I collected 500 stars.').evidence(text).tier(2)
    }
    if (totalStars >= 1000) {
      grant('stars-1000', 'I collected 1000 stars.').evidence(text).tier(3)
    }
    if (totalStars >= 2000) {
      grant('stars-2000', 'I collected 2000 stars.').evidence(text).tier(4)
    }
    if (totalStars >= 5000) {
      grant('stars-5000', 'I collected 5000 stars.').evidence(text).tier(5)
    }
    if (totalStars >= 10000) {
      grant('stars-10000', 'I collected 10000 stars.').evidence(text).tier(6)
    }
    if (totalStars >= 20000) {
      grant('stars-20000', 'I collected 20000 stars.').evidence(text).tier(7)
    }
  }
})()
