import { BadgePresenter, Present } from '../../badges.js'

export default new (class implements BadgePresenter {
  url = new URL(import.meta.url)
  badges = ['delorean'] as const
  present: Present = (data, grant) => {
    for (const repo of data.repos) {
      for (const commit of repo.commits) {
        const data = new Date(commit.committedDate)
        if (data.getMonth() === 10 && data.getDate() === 5) {
          grant(
            'delorean',
            'I committed on the day Doctor Emmett Brown invented the flux capacitor!',
          ).evidenceCommits(commit)
          return
        }
      }
    }
  }
})()
