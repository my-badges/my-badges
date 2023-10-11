import { BadgePresenter, Present } from '../../badges.js'

export default new (class implements BadgePresenter {
  url = new URL(import.meta.url)
  badges = [
    'github-anniversary-5',
    'github-anniversary-10',
    'github-anniversary-15',
    'github-anniversary-20',
  ] as const
  present: Present = (data, grant) => {
    const date = new Date(data.user.createdAt)
    const now = new Date()
    const years = now.getFullYear() - date.getFullYear()
    const months = now.getMonth() - date.getMonth()
    const days = now.getDate() - date.getDate()
    const totalDays = years * 365 + months * 30 + days
    if (totalDays >= 5 * 365) {
      grant('github-anniversary-5', `I joined GitHub 5 years ago.`)
    }
    if (totalDays >= 10 * 365) {
      grant('github-anniversary-10', `I joined GitHub 10 years ago.`)
    }
    if (totalDays >= 15 * 365) {
      grant('github-anniversary-15', `I joined GitHub 15 years ago.`)
    }
    if (totalDays >= 20 * 365) {
      grant('github-anniversary-20', `I joined GitHub 20 years ago.`)
    }
  }
})()
