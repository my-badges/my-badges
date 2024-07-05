import { Commit, define, latest } from '#src'

export default define({
  url: import.meta.url,
  badges: ['spooky-commit'] as const,
  present(data, grant) {
    const commits: Commit[] = []

    for (const repo of data.repos) {
      for (const commit of repo.commits) {
        const data = new Date(commit.committedDate)
        if (data.getMonth() === 10 && data.getDate() === 31) {
          commits.push(commit)
        }
      }
    }

    if (commits.length > 0) {
      grant(
        'spooky-commit',
        'I committed on the Halloween! Boo!',
      ).evidenceCommits(...commits.sort(latest).slice(0, 6))
    }
  },
})
