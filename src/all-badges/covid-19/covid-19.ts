import { BadgePresenter, Present } from '../../badges.js'

export default new (class implements BadgePresenter {
  url = new URL(import.meta.url)
  badges = ['covid-19'] as const
  present: Present = (data, grant) => {
    const date = new Date(data.user.createdAt)
    if (date.getFullYear() < 2020) {
      grant(
        'covid-19',
        'I rolled before Covid-19: Survivor of the Great TP Shortage',
      )
    }
  }
})()
