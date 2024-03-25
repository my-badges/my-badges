import { BadgePresenter, Present } from '../../badges.js'
import { Commit } from '../../collect/types.js'

export default new (class implements BadgePresenter {
  url = new URL(import.meta.url)
  badges = ['cosmetic-commit'] as const
  present: Present = (data, grant) => {
    const commits: Commit[] = []

    for (const repo of data.repos) {
      for (const commit of repo.commits) {
        if (
          /cosmetic/i.test(commit.message) ||
          /^(style|lint)\b/.test(commit.message)
        ) {
          commits.push(commit)
        }
      }
    }

    if (commits.length > 0) {
      grant('cosmetic-commit', 'I made cosmetic commit.').evidenceCommits(
        ...commits.sort(latest).slice(0, 6),
      )
    }
  }
})()

function latest(a: Commit, b: Commit) {
  return (
    new Date(b.committedDate).getTime() - new Date(a.committedDate).getTime()
  )
}
