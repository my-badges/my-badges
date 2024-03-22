import { BadgePresenter, Present } from '../../badges.js'
import { Commit } from '../../collect/types.js'

export default new (class implements BadgePresenter {
  url = new URL(import.meta.url)
  badges = ['spooky-commit'] as const
  present: Present = (data, grant) => {
    const commits: Commit[] = []

    for (const repo of data.repos) {
      for (const commit of repo.commits) {
        const data = new Date(commit.committedDate)
        if (data.getMonth() === 10 && data.getDate() === 31) {
          commits.push(commit)
        }
      }
    }

    if (commits.length > 0) {
      grant(
        'spooky-commit',
        'I committed on the Halloween! Boo!',
      ).evidenceCommits(...commits.sort(latest).slice(0, 6))
    }
  }
})()

function latest(a: Commit, b: Commit) {
  return (
    new Date(b.committedDate).getTime() - new Date(a.committedDate).getTime()
  )
}
