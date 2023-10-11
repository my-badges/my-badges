import { BadgePresenter, Present } from '../../badges.js'

export default new (class implements BadgePresenter {
  url = new URL(import.meta.url)
  tiers = true
  badges = ['mass-delete-commit-10k', 'mass-delete-commit'] as const
  present: Present = (data, grant) => {
    for (const repo of data.repos) {
      for (const commit of repo.commits) {
        if (
          (commit.deletions ?? 0) > 1000 &&
          (commit.deletions ?? 0) / (commit.additions ?? 0) > 100
        ) {
          grant('mass-delete-commit', 'When I delete code, I delete a lot.')
            .evidenceCommits(commit)
            .tier(1)
        }

        if (
          (commit.deletions ?? 0) > 10_000 &&
          (commit.deletions ?? 0) / (commit.additions ?? 0) > 100
        ) {
          grant('mass-delete-commit-10k', 'When I delete code, I delete a lot.')
            .evidenceCommits(commit)
            .tier(2)
        }
      }
    }
  }
})()
