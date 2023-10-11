import { BadgePresenter, Present } from '../../badges.js'

export default new (class implements BadgePresenter {
  url = new URL(import.meta.url)
  badges = ['chore-commit'] as const
  tiers = false
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
