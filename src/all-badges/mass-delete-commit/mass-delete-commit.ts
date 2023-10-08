import { BadgePresenter, Present } from '../../badges.js'

export default new (class implements BadgePresenter {
  url = new URL(import.meta.url)
  badges = ['mass-delete-commit', 'mass-delete-commit-10k'] as const
  present: Present = (data, grant) => {
    for (const repo of data.repos) {
      for (const commit of repo.commits) {
        if (
          (commit.deletions ?? 0) > 1000 &&
          (commit.deletions ?? 0) / (commit.additions ?? 0) > 100
        ) {
          grant(
            'mass-delete-commit',
            'When I delete code, I delete a lot.',
          ).evidenceCommits(commit)
        }

        if (
          (commit.deletions ?? 0) > 10_000 &&
          (commit.deletions ?? 0) / (commit.additions ?? 0) > 100
        ) {
          grant(
            'mass-delete-commit-10k',
            'When I delete code, I delete a lot.',
          ).evidenceCommits(commit)
        }
      }
    }
  }
})()
