import { Present, BadgePresenter } from '../../badges.js'
import { linkCommit } from '../../utils.js'
import { Commit, Repo } from '../../collect/types.js'

export default new (class implements BadgePresenter {
  url = new URL(import.meta.url)
  badges = ['bad-words'] as const
  present: Present = (data, grant) => {
    const commits: Commit[] = []

    for (const repo of data.repos) {
      for (const commit of repo.commits) {
        if (/fuck/i.test(commit.message + commit.messageBody)) {
          commits.push(commit)
        }
      }
    }

    if (commits.length > 0) {
      grant(
        'bad-words',
        'I used a word "fuck" in my commit message.',
      ).evidenceCommitsWithMessage(...commits)
    }
  }
})()
