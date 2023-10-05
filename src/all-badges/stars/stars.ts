import {BadgePresenter, Present} from '../../badges.js'

export default new class implements BadgePresenter {
  url = new URL(import.meta.url)
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
    for (const repo of data.repos) {
      totalStars += repo.stargazers_count || 0
    }
    if (totalStars >= 100) {
      grant('stars-100', `I collected 100 stars.`)
    }
    if (totalStars >= 500) {
      grant('stars-500', 'I collected 500 stars.')
    }
    if (totalStars >= 1000) {
      grant('stars-1000', 'I collected 1000 stars.')
    }
    if (totalStars >= 2000) {
      grant('stars-2000', 'I collected 2000 stars.')
    }
    if (totalStars >= 5000) {
      grant('stars-5000', 'I collected 5000 stars.')
    }
    if (totalStars >= 10000) {
      grant('stars-10000', 'I collected 10000 stars.')
    }
    if (totalStars >= 20000) {
      grant('stars-20000', 'I collected 20000 stars.')
    }
  }
}
