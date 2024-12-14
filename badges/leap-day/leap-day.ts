import { Commit, define, latest } from '#src'

export default define({
  url: import.meta.url,
  badges: ['leap-day'] as const,
  present(data, grant) {
    const commits: Commit[] = []

    for (const repo of data.repos) {
      for (const commit of repo.commits) {
        const data = new Date(commit.committedDate)
        if (data.getMonth() === 1 && data.getDate() === 29) {
          commits.push(commit)
        }
      }
    }

    if (commits.length > 0) {
      grant(
        'leap-day',
        'Happy February 29th! I committed on a Leap Day!',
      ).evidenceCommits(...commits.sort(latest).slice(0, 6))
    }
  },
})
