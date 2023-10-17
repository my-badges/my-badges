import { BadgePresenter, Present } from '../../badges.js'

export default new (class implements BadgePresenter {
  url = new URL(import.meta.url)
  badges = ['favorite-word'] as const
  present: Present = (data, grant) => {
    const counts: Record<string, number> = {}
    for (const repo of data.repos) {
      for (const commit of repo.commits) {
        const msg = commit.message + '\n' + commit.messageBody
        const words = msg
          .split(/\s+/)
          .map((w) => w.trim())
          .filter((w) => w.length > 0)
          .map((w) => w.toLowerCase())
        for (const word of words) {
          counts[word] = (counts[word] || 0) + 1
        }
      }
    }
    const pairs = Object.entries(counts)
    pairs.sort((a, b) => b[1] - a[1])
    if (pairs.length === 0) return
    const topWords = pairs.slice(0, 5)
    grant('favorite-word', `My favorite word is "${topWords[0][0]}".`).evidence(
      `My favorite commit message words are:\n\n` +
        topWords
          .map((p, i) => `${i + 1}. ${p[0]} (used ${p[1]} times)`)
          .join('\n'),
    )
  }
})()
