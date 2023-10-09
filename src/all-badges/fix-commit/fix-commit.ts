import { BadgePresenter, Grant, Present } from '../../badges.js'
import { Commit } from '../../collect/collect.js'

export default new (class implements BadgePresenter {
  url = new URL(import.meta.url)
  badges = [
    'fix-2',
    'fix-3',
    'fix-4',
    'fix-5',
    'fix-6',
    'fix-6+', // For more than 6
  ] as const
  present: Present = (data, grant) => {
    for (const repo of data.repos) {
      let sequentialFixes = 0
      let previousCommitDate = null
      let evidence: Commit[] = []

      for (const commit of repo.commits) {
        const currentCommitDate = new Date(commit.committedDate)

        // If the commit message contains "fix" and is within a 15-minute span of the previous commit
        if (
          commit.message.includes('fix') &&
          (previousCommitDate === null ||
            currentCommitDate.getTime() - previousCommitDate.getTime() <=
              15 * 60 * 1000)
        ) {
          sequentialFixes++
          evidence.push(commit)
        } else {
          this.grantBadge(sequentialFixes, grant, evidence)
          evidence = commit.message.includes('fix') ? [commit] : []
          sequentialFixes = evidence.length
        }

        previousCommitDate = currentCommitDate
      }

      // Check for any remaining sequences after exiting the loop
      if (sequentialFixes > 0) {
        this.grantBadge(sequentialFixes, grant, evidence)
      }
    }
  }

  grantBadge(count: number, grant: Grant, evidence: Commit[]) {
    let description = `Granted for making ${count} sequential fixes.`

    if (count === 2) grant('fix-2', description).evidenceCommits(...evidence)
    else if (count === 3)
      grant('fix-3', description).evidenceCommits(...evidence)
    else if (count === 4)
      grant('fix-4', description).evidenceCommits(...evidence)
    else if (count === 5)
      grant('fix-5', description).evidenceCommits(...evidence)
    else if (count === 6)
      grant('fix-6', description).evidenceCommits(...evidence)
    else if (count > 6)
      grant('fix-6+', description).evidenceCommits(...evidence)
  }
})()
