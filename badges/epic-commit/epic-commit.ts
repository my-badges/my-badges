import { Commit, define } from '#src'

export default define({
  url: import.meta.url,
  badges: ['epic-commit'] as const,
  present(data, grant) {
    const commits: Commit[] = []

    for (const repo of data.repos) {
      for (const commit of repo.commits) {
        if (commit.message.length >= 500) {
          commits.push(commit)
        }
      }
    }

    if (commits.length > 0) {
      grant(
        'epic-commit',
        'I made an epic commit with a message over 500 chars.',
      ).evidenceCommits(...commits)
    }
  },
})
