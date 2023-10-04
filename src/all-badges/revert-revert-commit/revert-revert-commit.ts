import {Commit, Repo} from '../../collect/collect.js'
import {BadgePresenter, Present} from '../../badges.js'

export default new class implements BadgePresenter {
  url = new URL(import.meta.url)
  badges = [
    'revert-revert-commit',
  ] as const
  present: Present = (data, grant) => {
    const commits: { repo: Repo, commit: Commit }[] = []

    for (const repo of data.repos) {
      for (const commit of repo.commits) {
        if (/Revert.+Revert/.test(commit.message)) {
          commits.push({repo, commit})
        }
      }
    }

    if (commits.length > 0) {
      grant('revert-revert-commit', 'I reverted a revert commit.')
        .evidenceCommits(commits)
    }
  }
}
