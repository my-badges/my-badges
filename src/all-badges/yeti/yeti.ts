import {BadgePresenter, Present} from '../../badges.js'

export default new class implements BadgePresenter {
  url = new URL(import.meta.url)
  badges = [
    'yeti',
  ] as const
  present: Present = (data, grant) => {
    for (const repo of data.repos) {
      for (const commit of repo.commits) {
        if (/yeti/i.test(commit.message)) {
          grant('yeti', 'I found the yeti!')
            .evidenceCommits(commit)
          return
        }
      }
    }
  }
}
