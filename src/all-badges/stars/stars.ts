import {BadgePresenter, Present} from '../../badges.js'

export default new class implements BadgePresenter {
  url = new URL(import.meta.url)
  badges = [
    'stars-100',
  ] as const
  present: Present = (data, grant) => {
    let totalStars = 0
    for (const repo of data.repos) {
      totalStars += repo.stargazers_count || 0
    }
    if (totalStars >= 100) {
      grant('stars-100', `I collected 100 stars.`)
    }
  }
}
