import { Commit, define, latest } from '#src'

export default define({
  url: import.meta.url,
  badges: ['may-the-4th'] as const,
  present(data, grant) {
    const commits: Commit[] = []

    for (const repo of data.repos) {
      for (const commit of repo.commits) {
        const data = new Date(commit.committedDate)
        if (data.getMonth() === 4 && data.getDate() === 4) {
          commits.push(commit)
        }
      }
    }

    if (commits.length > 0) {
      grant(
        'may-the-4th',
        'May the 4th be with you! Commits of force:',
      ).evidenceCommits(...commits.sort(latest).slice(0, 6))
    }
  },
})
