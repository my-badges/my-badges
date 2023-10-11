import { BadgePresenter, Present } from '../../badges.js'

export default new (class extends BadgePresenter {
  url = new URL(import.meta.url)
  badges = ['chore-commit'] as const
  present: Present = (data, grant) => {
    for (const repo of data.repos) {
      for (const commit of repo.commits) {
        if (/^chore\b/.test(commit.message)) {
          grant(
            'chore-commit',
            'I did a little housekeeping! 🧹',
          ).evidenceCommitsWithMessage(commit)
          return
        }
      }
    }
  }
})()
