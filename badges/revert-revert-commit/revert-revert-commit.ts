import { Commit, define } from '#src'

export default define({
  url: import.meta.url,
  badges: ['revert-revert-commit'] as const,
  present(data, grant) {
    const commits: Commit[] = []

    for (const repo of data.repos) {
      for (const commit of repo.commits) {
        if (/Revert.+Revert/.test(commit.message)) {
          commits.push(commit)
        }
      }
    }

    if (commits.length > 0) {
      grant(
        'revert-revert-commit',
        'I reverted a revert commit.',
      ).evidenceCommits(...commits)
    }
  },
})
