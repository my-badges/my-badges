import { BadgePresenter, Present } from '../../badges.js'
import { Commit, Repo } from '../../collect/types.js'

export default new (class implements BadgePresenter {
  url = new URL(import.meta.url)
  badges = ['cafe-commit'] as const
  present: Present = (data, grant) => {
    const commits: { repo: Repo; commit: Commit }[] = []

    for (const repo of data.repos) {
      for (const commit of repo.commits) {
        if (commit.sha.includes('cafe')) {
          commits.push({ repo, commit })
        }
      }
    }

    const text = commits
      .map(({ repo, commit }) => {
        const sha = commit.sha.replace(/cafe/, '<strong>cafe</strong>')
        return `- <a href="https://github.com/${repo.owner.login}/${repo.name}/commit/${commit.sha}">${sha}</a>`
      })
      .join('\n')

    if (commits.length >= 1) {
      grant(
        'cafe-commit',
        `I pushed a commit with "cafe" ${commits.length} times.`,
      ).evidence(text)
    }
  }
})()
