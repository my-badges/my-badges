import { Commit, define, latest } from '#src'

export default define({
  url: import.meta.url,
  badges: ['pi-day'] as const,
  present(data, grant) {
    const commits: Commit[] = []

    for (const repo of data.repos) {
      for (const commit of repo.commits) {
        const data = new Date(commit.committedDate)
        if (data.getMonth() === 2 && data.getDate() === 14) {
          commits.push(commit)
        }
      }
    }

    if (commits.length > 0) {
      grant(
        'pi-day',
        'Happy March 14th! I committed on a Pi Day!',
      ).evidenceCommits(...commits.sort(latest).slice(0, 6))
    }
  },
})
